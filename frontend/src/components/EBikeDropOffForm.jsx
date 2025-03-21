import React, { useState } from "react";
import QRScanner from "./QRScanner";

const EBikeDropOffForm = () => {
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [pickupImages, setPickupImages] = useState(null);
    const [formData, setFormData] = useState({
        bikeId: "",
        returnTime: "",
        userDetails: {
            name: "",
            email: "",
            phoneNumber: "",
            drivingLicense: "",
        },
        condition: {
            damages: "",
            batteryLevel: "",
            cleanliness: "clean",
        },
        additionalNotes: "",
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

    const fetchPickupImages = async (bikeId) => {
        try {
            // This is a placeholder. Replace with your actual API call
            const response = await fetch(`/api/pickup-images/${bikeId}`);
            const data = await response.json();
            setPickupImages(data.images);
        } catch (error) {
            console.error("Error fetching pickup images:", error);
            toast.error("Failed to load pickup images");
        }
    };

    const handleQRResult = async (result) => {
        try {
            const data = JSON.parse(result);
            setFormData((prevState) => ({
                ...prevState,
                bikeId: data.bikeId || "",
                userDetails: {
                    name: data.name || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    drivingLicense: data.drivingLicense || "",
                },
            }));
            setIsVerified(true);
            setShowQRScanner(false);
            await fetchPickupImages(data.bikeId || result);
        } catch (error) {
            console.error("Error processing QR code:", error);
            toast.error("Error processing QR code. Please try again.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert("Please scan QR code first");
            return;
        }
        // Handle form submission
        console.log("Form submitted:", formData);
    };

    const renderPickupImagesSection = () => (
        <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Pickup Images</h3>
                    <p className="text-sm text-gray-600">
                        View images taken during pickup for comparison
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setShowImageViewer(true)}
                disabled={!pickupImages}
                className={`w-full py-3 rounded-lg transition duration-200 ${
                    pickupImages
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                {pickupImages ? "View Pickup Images" : "No Images Available"}
            </button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">E-Bike Drop-off Process</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* QR Verification Section */}
                <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Scan QR Code
                            </h3>
                            <p className="text-sm text-gray-600">
                                Scan the QR code on the e-bike to verify return
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

                    <button
                        type="button"
                        onClick={() => setShowQRScanner(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        {isVerified ? "Scan Again" : "Start Scanning"}
                    </button>
                </div>

                {renderPickupImagesSection()}

                {/* User Details Section */}
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
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Return Time
                        </label>
                        <input
                            type="datetime-local"
                            name="returnTime"
                            value={formData.returnTime}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="userDetails.name"
                            value={formData.userDetails.name}
                            className="w-full p-2 border rounded-lg bg-gray-50"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Driving License
                        </label>
                        <input
                            type="text"
                            name="userDetails.drivingLicense"
                            value={formData.userDetails.drivingLicense}
                            className="w-full p-2 border rounded-lg bg-gray-50"
                            readOnly
                        />
                    </div>
                </div>

                {/* Condition Assessment */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Condition Assessment
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-medium">
                                Battery Level (%)
                            </label>
                            <input
                                type="number"
                                name="condition.batteryLevel"
                                value={formData.condition.batteryLevel}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Cleanliness
                            </label>
                            <select
                                name="condition.cleanliness"
                                value={formData.condition.cleanliness}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="clean">Clean</option>
                                <option value="minor_dirt">Minor Dirt</option>
                                <option value="needs_cleaning">
                                    Needs Cleaning
                                </option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium">
                                Damage Assessment
                            </label>
                            <textarea
                                name="condition.damages"
                                value={formData.condition.damages}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                                placeholder="Describe any damages or issues..."
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Notes */}
                <div>
                    <label className="block mb-1 font-medium">
                        Additional Notes
                    </label>
                    <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                        placeholder="Any additional comments..."
                    />
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
                    Confirm Drop-off
                </button>
            </form>

            {/* QR Scanner Modal */}
            {showQRScanner && (
                <QRScanner
                    onResult={handleQRResult}
                    onClose={() => setShowQRScanner(false)}
                />
            )}

            {/* Image Viewer Modal */}
            {showImageViewer && pickupImages && (
                <ImageViewer
                    images={pickupImages}
                    onClose={() => setShowImageViewer(false)}
                />
            )}
        </div>
    );
};

export default EBikeDropOffForm;
