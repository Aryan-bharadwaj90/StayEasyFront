
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-rose-500 hover:text-rose-600"
        >
          StayEasy
        </Link>

        {/* Center Search Bar (only on md+) */}
        <div className="hidden md:flex flex-grow justify-center">
          <SearchBar /> {/* ✅ Replaced plain input with functional component */}
        </div>

        {/* Right Menu */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <Link to="/" className="text-gray-700 hover:text-rose-500 transition">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/wishlist" className="hover:text-pink-600 transition">
                ❤️ Wishlist
              </Link>

              <Link to="/my-bookings" className="hover:text-green-600 transition">
                📒 My Bookings
              </Link>

              <Link
                to="/dashboard"
                className="bg-rose-500 text-white px-3 py-1 rounded-full hover:bg-rose-600 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="text-white bg-red-500 px-3 py-1 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm">
          <Link to="/" className="block text-gray-700 hover:text-rose-500">Home</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="block hover:text-pink-600">❤️ Wishlist</Link>
              <Link to="/my-bookings" className="block hover:text-green-600">📒 My Bookings</Link>
              <Link to="/dashboard" className="block bg-rose-500 text-white px-3 py-1 rounded-full hover:bg-rose-600 w-fit">Dashboard</Link>
              <button
                onClick={logout}
                className="block text-white bg-red-500 px-3 py-1 rounded-full hover:bg-red-600 w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-blue-600">Login</Link>
              <Link to="/register" className="block hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
