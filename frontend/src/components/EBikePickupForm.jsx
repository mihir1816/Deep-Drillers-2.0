import React, { useState } from "react";
import QRScanner from "./QRScanner";
import FaceVerification from "./FaceVerification";
import toast from "react-hot-toast";

const EBikePickupForm = () => {
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [formData, setFormData] = useState({
        bikeId: "",
        userDetails: {
            name: "",
            email: "",
            phoneNumber: "",
            drivingLicense: "",
            address: "",
            emergencyContact: "",
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prevState) => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleQRResult = (result) => {
        try {
            console.log("Raw QR Data:", result);

            // Attempt to parse if it's JSON
            let data;
            try {
                data = JSON.parse(result);
            } catch {
                // If not JSON, treat as plain text
                data = {
                    bikeId: result,
                    userDetails: {
                        name: "",
                        email: "",
                        phoneNumber: "",
                        drivingLicense: "",
                        address: "",
                        emergencyContact: "",
                    },
                };
            }

            // Update form with the scanned data
            setFormData((prevState) => ({
                ...prevState,
                bikeId: data.bikeId || result,
                userDetails: {
                    name: data.userDetails?.name || data.name || "",
                    email: data.userDetails?.email || data.email || "",
                    phoneNumber:
                        data.userDetails?.phoneNumber || data.phoneNumber || "",
                    drivingLicense:
                        data.userDetails?.drivingLicense ||
                        data.drivingLicense ||
                        "",
                    address: data.userDetails?.address || data.address || "",
                    emergencyContact:
                        data.userDetails?.emergencyContact ||
                        data.emergencyContact ||
                        "",
                },
            }));

            setShowQRScanner(false);
            toast.success("QR Code successfully scanned!");
        } catch (error) {
            console.error("Error processing QR code:", error);
            toast.error("Error processing QR code. Please try again.");
        }
    };

    const handleFaceCapture = (image) => {
        // Here you would typically send this image to your backend for verification
        setIsVerified(true);
        setShowVerification(false);
        toast.success("Face verification successful!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isVerified) {
            toast.error("Please complete face verification first");
            return;
        }
        console.log("Form submitted:", formData);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">E-Bike Pickup Process</h2>

            {/* QR Scanner Section */}
            <div className="border rounded-lg p-6 bg-gray-50 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Quick Fill with QR Code
                        </h3>
                        <p className="text-sm text-gray-600">
                            Scan QR code to auto-fill details
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowQRScanner(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Scan QR Code
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bike and User Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 font-medium">
                            Bike ID
                        </label>
                        <input
                            type="text"
                            name="bikeId"
                            value={formData.bikeId}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="userDetails.name"
                            value={formData.userDetails.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="userDetails.email"
                            value={formData.userDetails.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Driving License Number *
                        </label>
                        <input
                            type="text"
                            name="drivingLicense"
                            value={formData.drivingLicense}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">
                            Emergency Contact
                        </label>
                        <input
                            type="tel"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Verification Section */}
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Identity Verification
                            </h3>
                            <p className="text-sm text-gray-600">
                                Required before confirming assignment
                            </p>
                        </div>
                        <div className="flex items-center">
                            {isVerified && (
                                <span className="text-green-600 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>
                    </div>

                    {!isVerified && (
                        <button
                            type="button"
                            onClick={() => setShowVerification(true)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Start Verification Process
                        </button>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isVerified}
                    className={`w-full py-3 rounded-lg transition duration-200 ${
                        isVerified
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Confirm Assignment
                </button>
            </form>

            {/* Face Verification Modal */}
            {showVerification && (
                <FaceVerification
                    onCapture={handleFaceCapture}
                    onClose={() => setShowVerification(false)}
                />
            )}
        </div>
    );
};

export default EBikePickupForm;
