import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookingPage from "./pages/BookingPage";
import LocationsPage from "./pages/LocationsPage";
import StationVehiclesPage from "./pages/StationVehiclesPage";
import EBikePickupForm from "./components/EBikePickupForm";
import EBikeDropOffForm from "./components/EBikeDropOffForm";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route
                        path="/station/:stationId"
                        element={<StationVehiclesPage />}
                    />
                    <Route path="/book/:vehicleId" element={<BookingPage />} />
                    <Route path="/admin/pickup" element={<EBikePickupForm />} />
                    <Route
                        path="/admin/dropoff"
                        element={<EBikeDropOffForm />}
                    />
                </Routes>
                <Toaster position="top-right" />
            </div>
        </Router>
    );
}

export default App;
