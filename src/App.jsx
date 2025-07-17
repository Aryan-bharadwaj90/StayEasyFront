import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ChatPage from "./components/ChatPage";
import MyBookings from "./components/MyBookings";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Wishlist from "./pages/Wishlist";
import Inbox from "./pages/Inbox";
import MessagesDashboard from "./pages/MessageDashboard";
import SearchResults from "./pages/SearchResults";


import { useAuth } from "./context/AuthContext";


function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
            <Route path="/chat/:listingId/:hostId" element={<ChatPage />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/dashboard/messages" element={<MessagesDashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/search" element={<SearchResults />} />


            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

