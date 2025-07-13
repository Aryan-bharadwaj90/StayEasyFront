import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MessagesDashboard() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/conversations/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversations(res.data);
      } catch (err) {
        console.error(err);
        alert("Could not load conversations.");
      }
    };

    if (user) fetchConvos();
  }, [user, token]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      {conversations.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => {
            const msg = conv.lastMessage;
            const otherUser =
              msg.sender === user._id ? msg.receiver : msg.sender;
            const [listingId] = msg.conversationId.split("-");

            return (
              <li key={conv._id} className="p-4 border rounded shadow">
                <p className="mb-2">
                  💬 With: <strong>{otherUser}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Last: {msg.text}
                </p>
                <Link
                  to={`/chat/${listingId}/${otherUser}`}
                  className="text-blue-600 underline"
                >
                  Reply
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
