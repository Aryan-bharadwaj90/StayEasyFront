import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Map from "../components/Map";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import Modal from "react-modal";
Modal.setAppElement("#root");


function StarRating({ value }) {
  return (
    <div className="flex gap-1 text-yellow-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill={i <= value ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29h6.603c.969 0 1.371 1.24.588 1.81l-5.347 3.882 2.036 6.29c.3.921-.755 1.688-1.538 1.118L12 17.77l-5.329 3.547c-.783.57-1.838-.197-1.538-1.118l2.036-6.29-5.347-3.882c-.783-.57-.38-1.81.588-1.81h6.603l2.036-6.29z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
const [selectedImg, setSelectedImg] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  


  const nights =
    checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), "day") || 1 : 0;
  const totalPrice = nights * (listing?.pricePerNight || 0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((w) => w.listing._id === id);
        setWishlisted(!!found);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews/${id}/reviews?page=${page}`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchListing();
    fetchReviews();
    if (user) {
      fetchWishlist();
    }
  }, [id, user, token, page]);

  const toggleWishlist = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/wishlist/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlisted((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      alert("Unable to update wishlist.");
    }
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      setBookingMsg("Please select check-in and check-out dates.");
      return;
    }
    setBookingLoading(true);
    setBookingMsg("");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/bookings`,
        { listingId: id, checkIn, checkOut, totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingMsg(`✅ Booking successful! Booking ID: ${res.data._id}`);
    } catch (err) {
      console.error(err);
      setBookingMsg("❌ Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      if (editingReviewId) {
        await axios.put(
          `http://localhost:5000/api/reviews/${editingReviewId}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviewMsg("✅ Review updated!");
      } else {
        const res = await axios.post(
          `http://localhost:5000/api/reviews/${id}/reviews`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews((prev) => [res.data, ...prev]);
        setReviewMsg("✅ Review submitted!");
      }
      setComment("");
      setRating(5);
      setEditingReviewId(null);
    } catch (err) {
      console.error(err);
      setReviewMsg("❌ Failed to submit review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading…</p>;
  if (!listing) return <p className="text-center mt-20">Listing not found</p>;
  const openModal = (img) => {
  setSelectedImg(img);
  setIsOpen(true);
};

const closeModal = () => setIsOpen(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="text-gray-600 mb-4 flex justify-between flex-wrap">
        <span>📍 {listing.location}</span>
        {user && (
          <button
            onClick={toggleWishlist}
            className="text-xl hover:scale-105 transition"
          >
            {wishlisted ? "💖 Saved" : "🤍 Save"}
          </button>
        )}
      </div>
      {listing.images?.length > 0 && (
  <>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 rounded overflow-hidden mb-8">
      {listing.images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Listing Image ${idx + 1}`}
          className="w-full h-56 object-cover rounded cursor-zoom-in"
          onClick={() => openModal(img)}
        />
      ))}
    </div>

    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Image Zoom Modal"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg max-w-4xl w-full z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-40"
    >
      <button onClick={closeModal} className="text-red-600 text-sm mb-2">
        Close
      </button>
      <img src={selectedImg} alt="Zoomed" className="w-full h-auto rounded" />
    </Modal>
  </>
)}


      {listing.description && (
        <div className="mb-6 text-gray-800 whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">📝 Description</h2>
          <p>
            {showFullDescription
              ? listing.description
              : listing.description.slice(0, 300) + (listing.description.length > 300 ? "..." : "")}
          </p>
          {listing.description.length > 300 && (
            <button
              className="mt-2 text-blue-600 underline text-sm"
              onClick={() => setShowFullDescription((prev) => !prev)}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="text-xl font-semibold">💰 ₹{listing.pricePerNight}/night</div>
          {listing.host && (
            <p className="text-gray-600">
              Hosted by <strong>{listing.host.name}</strong> ({listing.host.email})
            </p>
          )}
          {user && listing.host && user._id !== listing.host._id && (
            <Link to={`/chat/${listing._id}/${listing.host._id}`} className="text-blue-600 underline mt-4 inline-block">
              Message Host
            </Link>
          )}
          {listing.lat && listing.lng && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">📍 Location on Map</h2>
              <Map center={{ lat: listing.lat, lng: listing.lng }} />
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">⭐ Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800">{review.user?.name || "Guest"}</p>
                      <StarRating value={review.rating} />
                    </div>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                    {user && user._id === review.user?._id && (
                      <div className="flex gap-4 mt-2 text-sm">
                        <button onClick={() => {
                          setComment(review.comment);
                          setRating(review.rating);
                          setEditingReviewId(review._id);
                        }} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => deleteReview(review._id)} className="text-red-600 hover:underline">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="text-blue-600 hover:underline">Previous</button>
                <button onClick={() => setPage((p) => p + 1)} className="text-blue-600 hover:underline">Next</button>
              </div>
            </div>
          )}

          {user && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">{editingReviewId ? "Edit Your Review" : "Leave a Review"}</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Rating</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full"
                />
                <StarRating value={rating} />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your experience..."
                  className="border p-2 rounded w-full"
                ></textarea>
                <button
                  onClick={submitReview}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingReviewId ? "Update Review" : "Submit Review"}
                </button>
                {reviewMsg && <p className="text-sm mt-2">{reviewMsg}</p>}
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="border rounded-xl p-5 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Book this place</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              {nights > 0 && (
                <div className="text-gray-800">
                  {nights} nights × ₹{listing.pricePerNight} = <span className="font-bold">₹{totalPrice}</span>
                </div>
              )}
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                {bookingLoading ? "Booking…" : "Book Now"}
              </button>
              {bookingMsg && (
                <p className="text-sm text-center mt-2">{bookingMsg}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
