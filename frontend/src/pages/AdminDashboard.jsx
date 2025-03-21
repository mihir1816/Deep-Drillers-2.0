import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChatbotButton from "../components/ChatbotButton";
import ChatbotWindow from "../components/ChatbotWindow";

const AdminDashboard = () => {
    const [showChat, setShowChat] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* E-Bike Pickup Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        E-Bike Pickup
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Process new e-bike pickups and verify user information
                    </p>
                    <Link
                        to="/admin/pickup"
                        className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Start Pickup Process
                    </Link>
                </div>

                {/* E-Bike Drop-off Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        E-Bike Drop-off
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Process e-bike returns and check vehicle condition
                    </p>
                    <Link
                        to="/admin/dropoff"
                        className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Start Drop-off Process
                    </Link>
                </div>
            </div>

            {/* Chatbot */}
            <ChatbotButton onClick={() => setShowChat(true)} />
            {showChat && (
                <ChatbotWindow
                    isAdmin={true}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
