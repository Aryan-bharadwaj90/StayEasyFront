// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditListing() {
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     title: "",
//     description: "",
//     location: "",
//     pricePerNight: "",
//   });

//   useEffect(() => {
//     const fetchListing = async () => {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
//       setData({
//         title: res.data.title,
//         description: res.data.description,
//         location: res.data.location,
//         pricePerNight: res.data.pricePerNight,
//       });
//     };
//     fetchListing();
//   }, [id]);

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${import.meta.env.VITE_API_URL}/${id}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update listing");
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-4 border rounded shadow">
//       <h2 className="text-2xl mb-4">Edit Listing</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           className="w-full p-2 border"
//           name="title"
//           placeholder="Title"
//           value={data.title}
//           onChange={handleChange}
//         />
//         <textarea
//           className="w-full p-2 border"
//           name="description"
//           placeholder="Description"
//           value={data.description}
//           onChange={handleChange}
//         />
//         <input
//           className="w-full p-2 border"
//           name="location"
//           placeholder="Location"
//           value={data.location}
//           onChange={handleChange}
//         />
//         <input
//           className="w-full p-2 border"
//           name="pricePerNight"
//           placeholder="Price per night"
//           type="number"
//           value={data.pricePerNight}
//           onChange={handleChange}
//         />
//         <button className="bg-yellow-600 text-white w-full py-2 rounded">
//           Update
//         </button>
//       </form>
//     </div>
//   );
// }
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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
      setData({
        title: res.data.title,
        description: res.data.description,
        location: res.data.location,
        pricePerNight: res.data.pricePerNight,
      });
      setExistingImages(res.data.images || []);
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageDelete = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const reordered = [...existingImages];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setExistingImages(reordered);
  };

  const handleNewImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("pricePerNight", data.pricePerNight);
    formData.append("existingImages", JSON.stringify(existingImages));

    newImages.forEach((file) => formData.append("images", file));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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

        {/* Show Existing Images */}
        <div>
          <label className="font-medium">Reorder/Delete Existing Images:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img src={img} alt="listing" className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleImageDelete(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded"
                >
                  ✕
                </button>
                {/* Move Up */}
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(idx, idx - 1)}
                    className="absolute bottom-0 left-0 text-xs bg-gray-300 px-1 rounded"
                  >
                    ↑
                  </button>
                )}
                {/* Move Down */}
                {idx < existingImages.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(idx, idx + 1)}
                    className="absolute bottom-0 right-0 text-xs bg-gray-300 px-1 rounded"
                  >
                    ↓
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div>
          <label className="block font-medium">Add New Images</label>
          <input
            type="file"
            multiple
            onChange={handleNewImageChange}
            className="w-full border p-2"
          />
        </div>

        <button className="bg-yellow-600 text-white w-full py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
