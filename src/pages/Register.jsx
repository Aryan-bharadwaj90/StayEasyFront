import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            >
              <option value="guest">Guest</option>
              <option value="host">Host</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-md transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-rose-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
