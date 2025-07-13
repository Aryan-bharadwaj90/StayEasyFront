// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Map from "../components/Map";

// export default function CreateListing() {
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     title: "",
//     description: "",
//     location: "",
//     pricePerNight: "",
//   });
//   const [images, setImages] = useState([]);
//   const [markerPos, setMarkerPos] = useState({ lat: 28.6139, lng: 77.209 }); // default: Delhi

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     setImages(Array.from(e.target.files));
//   };

//   const handleGeocode = () => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ address: data.location }, (results, status) => {
//       if (status === "OK") {
//         const pos = results[0].geometry.location;
//         setMarkerPos({ lat: pos.lat(), lng: pos.lng() });
//       } else {
//         alert("Could not find location: " + status);
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.entries(data).forEach(([key, val]) => formData.append(key, val));
//     formData.append("lat", markerPos.lat);
//     formData.append("lng", markerPos.lng);
//     images.forEach((img) => formData.append("images", img));

//     try {
//       await axios.post(`${import.meta.env.VITE_API_URL}/api/listings/create`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create listing");
//     }
//   };

//   useEffect(() => {
//     if (!window.google) {
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDagf2RJvP1DszxtvEPLAKBVjWNPqsPNxY`;
//       script.async = true;
//       document.head.appendChild(script);
//     }
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow space-y-4">
//       <h2 className="text-2xl">Create New Listing</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="title"
//           placeholder="Title"
//           value={data.title}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border"
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={data.description}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border"
//         />
//         <div className="flex gap-2">
//           <input
//             name="location"
//             placeholder="Location"
//             value={data.location}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border"
//           />
//           <button
//             type="button"
//             onClick={handleGeocode}
//             className="bg-blue-600 text-white px-2 rounded"
//           >
//             Locate
//           </button>
//         </div>

//         <Map
//           center={markerPos}
//           draggable={true}
//           onDragEnd={(pos) => setMarkerPos(pos)}
//         />

//         <input
//           name="pricePerNight"
//           type="number"
//           placeholder="Price per night"
//           value={data.pricePerNight}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border"
//         />
//         <input
//           type="file"
//           multiple
//           onChange={handleImageChange}
//           className="w-full"
//         />
//         <button className="bg-green-600 text-white w-full py-2 rounded">
//           Create
//         </button>
//       </form>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";

export default function CreateListing() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
  });
  const [images, setImages] = useState([]);
  const [markerPos, setMarkerPos] = useState({ lat: 28.6139, lng: 77.209 }); // Delhi default

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const handleGeocode = () => {
    if (!window.google || !data.location) return alert("Google Maps not loaded or empty location");

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: data.location }, (results, status) => {
      if (status === "OK" && results[0]) {
        const pos = results[0].geometry.location;
        setMarkerPos({ lat: pos.lat(), lng: pos.lng() });
      } else {
        alert("Could not find location: " + status);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Login required to create a listing.");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    formData.append("lat", markerPos.lat);
    formData.append("lng", markerPos.lng);
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/listings/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating listing:", err.response || err);
      alert("Failed to create listing. Please try again.");
    }
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Create New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={data.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={data.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            name="location"
            placeholder="Location"
            value={data.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleGeocode}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Locate
          </button>
        </div>

        <Map
          center={markerPos}
          draggable={true}
          onDragEnd={(pos) => setMarkerPos(pos)}
        />

        <input
          name="pricePerNight"
          type="number"
          placeholder="Price per night"
          value={data.pricePerNight}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}
