import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings`);
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/search`, {
        params,
      });
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching filtered listings", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Explore Stays</h1>

      <div className="bg-white p-4 rounded-2xl shadow-md mb-8 max-w-6xl mx-auto">
  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

   
    <div className="flex w-full flex-col md:flex-row items-stretch border border-gray-300 rounded-full overflow-hidden divide-y md:divide-y-0 md:divide-x">
      
      
      <div className="flex-1 px-4 py-2">
        <label className="text-xs text-gray-500">Min Price</label>
        <input
          type="number"
          placeholder="₹1000"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
          className="w-full bg-transparent focus:outline-none text-sm"
        />
      </div>

      
      <div className="flex-1 px-4 py-2">
        <label className="text-xs text-gray-500">Max Price</label>
        <input
          type="number"
          placeholder="₹5000"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
          className="w-full bg-transparent focus:outline-none text-sm"
        />
      </div>

     
      <div className="flex-1 px-4 py-2">
        <label className="text-xs text-gray-500">Rating</label>
        <select
          value={filters.minRating}
          onChange={(e) =>
            setFilters({ ...filters, minRating: e.target.value })
          }
          className="w-full bg-transparent focus:outline-none text-sm"
        >
          <option value="">Any</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
        </select>
      </div>

      
      <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-4 py-2 gap-2 md:gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Check-in</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="w-full bg-transparent focus:outline-none text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Check-out</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="w-full bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>
    </div>

    
    <button
      onClick={fetchFilteredListings}
      className="mt-4 md:mt-0 bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition"
    >
      🔍 Search
    </button>
  </div>
</div>



     
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <Link
              to={`/listing/${listing._id}`}
              key={listing._id}
              className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 bg-white"
            >
              
              <div className="relative w-full h-60">
                <img
                  src={listing.images?.[0] || "https://via.placeholder.com/400x300"}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

             
              <div className="p-4 space-y-1">
                <div className="text-sm text-gray-600 truncate">{listing.location}</div>
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {listing.title}
                </h2>
                <div className="text-sm text-gray-500">
                  <span className="font-bold text-black">₹{listing.pricePerNight}</span> / night
                </div>
                <div className="text-sm text-yellow-600">
                  ⭐ {listing.averageRating?.toFixed(1) || "N/A"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
