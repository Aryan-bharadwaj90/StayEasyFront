import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?location=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search destinations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-full px-4 py-2 border shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 transition"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
      >
        Search
      </button>
    </form>
  );
}
