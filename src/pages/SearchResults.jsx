
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get("location")?.trim() || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationQuery) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/properties?location=${encodeURIComponent(locationQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch listings.");
        return res.json();
      })
      .then((data) => setResults(data))
      .catch((err) => {
        console.error("Fetch failed:", err);
        setError("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [locationQuery]);

  if (!locationQuery) {
    return <p className="p-4 text-gray-500">Please enter a location to search.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Search Results for "{locationQuery}"
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-500">No properties found.</p>
      )}

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {results.map((p) => (
          <Link to={`/listing/${p._id}`} key={p._id}>
            <div className="w-full border p-4 rounded shadow hover:shadow-lg hover:-translate-y-1 transform transition-all duration-200 cursor-pointer">

              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-gray-600">{p.location}</p>
              <p className="text-rose-500 font-semibold">₹{p.price}</p>
              <img
                src={p.image || "https://via.placeholder.com/250"}
                alt={p.name}
                className="mt-2 w-full h-40 object-cover rounded"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
