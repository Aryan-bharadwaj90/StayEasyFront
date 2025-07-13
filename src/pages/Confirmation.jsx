
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import dayjs from "dayjs";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking; 
  const [visible, setVisible] = useState(false);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    setVisible(true);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  }, []);

 
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          navigate("/my-bookings");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  if (!booking) {
    return (
      <div className="text-center mt-20 text-xl text-red-600">
        Oops! No booking data.{" "}
        <Link to="/" className="text-blue-500 underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`max-w-md mx-auto mt-20 p-6 border rounded shadow text-center bg-white transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl font-extrabold text-green-600 mb-4">
        🎉 Booking Confirmed!
      </h1>
      <p className="text-gray-700 mb-2">
        Thank you for booking with <span className="font-bold">StayEasy</span>.
      </p>

      <p className="text-sm text-gray-600 mb-4">
        Your Booking ID: <span className="font-mono">{booking._id}</span>
      </p>

      {/* 📋 Booking Summary */}
      <div className="bg-gray-50 p-3 rounded mb-4 text-left text-sm">
        <p>
          <span className="font-semibold">Listing:</span>{" "}
          {booking.listing.title}
        </p>
        <p>
          <span className="font-semibold">Location:</span>{" "}
          {booking.listing.location}
        </p>
        <p>
          <span className="font-semibold">Dates:</span>{" "}
          {dayjs(booking.checkIn).format("DD MMM YYYY")} →{" "}
          {dayjs(booking.checkOut).format("DD MMM YYYY")}
        </p>
        <p>
          <span className="font-semibold">Total Price:</span> ₹
          {booking.totalPrice}
        </p>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        📧 A confirmation email has been sent to your registered email.
      </p>

      <Link
        to="/my-bookings"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        View My Bookings
      </Link>

      <div className="mt-4 text-xs text-gray-500">
        Redirecting to My Bookings in {seconds} second{seconds !== 1 && "s"}…
      </div>
    </div>
  );
}
