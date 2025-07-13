import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListing() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
      setData({
        title: res.data.title,
        description: res.data.description,
        location: res.data.location,
        pricePerNight: res.data.pricePerNight,
      });
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/listings/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update listing");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl mb-4">Edit Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border"
          name="title"
          placeholder="Title"
          value={data.title}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-2 border"
          name="description"
          placeholder="Description"
          value={data.description}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border"
          name="location"
          placeholder="Location"
          value={data.location}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border"
          name="pricePerNight"
          placeholder="Price per night"
          type="number"
          value={data.pricePerNight}
          onChange={handleChange}
        />
        <button className="bg-yellow-600 text-white w-full py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
