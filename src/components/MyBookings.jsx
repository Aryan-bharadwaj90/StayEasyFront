
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function Bookings() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user, token]);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  if (!user) return <p>Please log in to view your bookings.</p>;
  if (loading) return <p>Loading your bookings…</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You haven’t booked any listings yet.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b._id}
            className="border rounded p-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {b.listing?.title || "Listing"}
              </h2>
              <p className="text-gray-600">{b.listing?.location}</p>
              <p className="text-sm">
                Check-in: <strong>{dayjs(b.checkIn).format("DD MMM YYYY")}</strong>
              </p>
              <p className="text-sm">
                Check-out: <strong>{dayjs(b.checkOut).format("DD MMM YYYY")}</strong>
              </p>
              <p className="text-sm">
                Total Price: <strong>₹{b.totalPrice}</strong>
              </p>

              {/* ✅ Cancel Button if future booking */}
              {new Date(b.checkIn) > new Date() && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <p
                className={`px-2 py-1 rounded text-center ${
                  b.paymentStatus === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : b.paymentStatus === "completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {b.paymentStatus.toUpperCase()}
              </p>

              {b.paymentStatus === "pending" && (
                <Link
                  to={`/payment/${b._id}`}
                  className="mt-2 bg-blue-600 text-white text-center py-1 rounded hover:bg-blue-700"
                >
                  Pay Now
                </Link>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
