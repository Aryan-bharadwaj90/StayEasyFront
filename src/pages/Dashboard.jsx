import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostListings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/listings/host/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch host listings", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHostListings();
  }, [user, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l._id !== id));
      alert("Listing deleted successfully.");
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>
        <button
          onClick={() => navigate("/inbox")}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          📩 Inbox
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Your Listings ({listings.length})</h2>
        <button
          onClick={() => navigate("/create-listing")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <p>No listings yet. Create one above!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={listing.images[0] || "https://via.placeholder.com/400x300"}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{listing.title}</h2>
                  <p className="text-gray-600">{listing.location}</p>
                  <p className="text-blue-600 font-bold">
                    ₹ {listing.pricePerNight}/night
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(listing._id)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
