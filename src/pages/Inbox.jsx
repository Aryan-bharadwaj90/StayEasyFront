import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function InboxPage() {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/host/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch inbox", err);
        alert("Error loading inbox");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchInbox();
  }, [user, token]);

  if (loading) return <p className="text-center mt-10">Loading inbox...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">📥 Guest Messages</h1>

      {conversations.length === 0 ? (
        <p>No guest conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv, idx) => (
            <li key={idx} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                <p>
                  <strong>Guest:</strong> {conv.guest.name} ({conv.guest.email})
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Last message: {conv.lastMessage}
                </p>
              </div>
              <Link
                to={`/chat/${conv.conversationId.split("-")[0]}/${conv.guest._id}`}
                className="text-blue-600 underline"
              >
                View Chat
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
