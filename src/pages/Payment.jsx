import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

export default function Payment() {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();
  const { token } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, token]);


const handleMockPayment = async () => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/bookings/${id}/mark-paid`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/confirmation", { state: { booking: { ...booking, paymentStatus: "paid" } } });
  } catch (err) {
    console.error(err);
    alert("Failed to mark payment as paid");
  }
};

  if (loading) {
    return <div className="text-center mt-20">Loading payment details…</div>;
  }

  if (!booking) {
    return (
      <div className="text-center mt-20 text-red-600">
        Booking not found. <br />
        <button onClick={() => navigate("/")} className="text-blue-500 underline">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">💳 Complete Your Payment</h1>

      <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
        <p>
          <span className="font-semibold">Listing:</span> {booking.listing.title}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {booking.listing.location}
        </p>
        <p>
          <span className="font-semibold">Dates:</span>{" "}
          {dayjs(booking.checkIn).format("DD MMM YYYY")} →{" "}
          {dayjs(booking.checkOut).format("DD MMM YYYY")}
        </p>
        <p>
          <span className="font-semibold">Total Price:</span> ₹{booking.totalPrice}
        </p>
      </div>

      <p className="text-xs text-gray-500 text-center">
        This is a mock payment page. In a real app, integrate Stripe or Razorpay here.
      </p>

      <button
        onClick={handleMockPayment}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Pay Now
      </button>
    </div>
  );
}
