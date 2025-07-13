
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`http://localhost:5000/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    };
    fetch();
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">My Wishlist</h1>
      {items.map(w => (
        <Link
          to={`/listing/${w.listing._id}`}
          key={w._id}
          className="block p-4 border rounded hover:bg-gray-50"
        >
          <h2>{w.listing.title}</h2>
          <p>{w.listing.location}</p>
        </Link>
      ))}
      {items.length === 0 && <p>No items yet.</p>}
    </div>
  );
}
