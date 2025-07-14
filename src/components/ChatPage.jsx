
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

function getConversationId(listingId, userId1, userId2) {
  return `${listingId}-${[userId1, userId2].sort().join("-")}`;
}

export default function ChatPage() {
  const { listingId, hostId } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const connectedRef = useRef(false); // 👈 track socket connect once

  const conversationId =
    user && hostId && listingId
      ? getConversationId(listingId, user._id, hostId)
      : null;

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Connect & join socket
  useEffect(() => {
    if (!user || !conversationId || connectedRef.current) return;

    socket.connect();
    connectedRef.current = true;

    socket.emit("join", conversationId);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
      scrollToBottom();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.emit("leave", conversationId);
      socket.off("receiveMessage", handleReceiveMessage);
      connectedRef.current = false;
    };
  }, [conversationId, user]);

  // Fetch chat history once
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const unique = Array.from(new Map(res.data.map((m) => [m._id, m])).values());
        setMessages(unique);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    if (conversationId) fetchMessages();
  }, [conversationId, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMessage = {
      conversationId,
      text,
      sender: user._id,
      receiver: hostId,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        newMessage,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const savedMsg = res.data;

      // Only emit; message will be appended via socket
      socket.emit("sendMessage", savedMsg);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 flex flex-col h-[80vh] border rounded shadow p-4">
      <h2 className="text-2xl font-semibold mb-2 text-blue-800">💬 Chat</h2>

      <div className="flex-1 overflow-y-auto border p-3 bg-gray-50 rounded">
        {messages.length > 0 ? (
          messages.map((msg, idx) => {
            const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
            const isMine = String(senderId) === String(user._id);

            return (
              <div
                key={msg._id || idx}
                className={`mb-2 p-2 rounded-md w-fit max-w-[75%] ${
                  isMine ? "ml-auto bg-green-200" : "mr-auto bg-blue-200"
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex mt-3 gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
