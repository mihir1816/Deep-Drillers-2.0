import React, { useState } from "react";
import QRScanner from "./QRScanner";
import { adminAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { Camera, Loader2, XCircle } from "lucide-react";

const EBikeDropOffForm = () => {
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(null);
    const [pickupImages, setPickupImages] = useState([]);
    const [returnImages, setReturnImages] = useState([]);
    const [damageReport, setDamageReport] = useState({
        hasDamages: false,
        notes: "",
        estimatedRepairCost: 0,
    });
    const [notes, setNotes] = useState("");
    const [manualEntry, setManualEntry] = useState({
        name: "",
        phoneNumber: "",
    });
    const [showManualEntry, setShowManualEntry] = useState(false);

    const handleQRResult = async (result) => {
        try {
            setLoading(true);
            const response = await adminAPI.verifyQRCode(result);
            setBooking(response.booking);
            setPickupImages(response.pickupImages);
            toast.success("QR code verified successfully");
            setShowQRScanner(false);
        } catch (error) {
            console.error("Error processing QR code:", error);
            toast.error("Failed to verify QR code");
            setShowManualEntry(true);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSearch = async (e) => {
        e.preventDefault();
        if (!manualEntry.name || !manualEntry.phoneNumber) {
            toast.error("Please enter both name and phone number");
            return;
        }

        try {
            setLoading(true);
            const response = await adminAPI.findBookingByUserDetails(
                manualEntry
            );
            setBooking(response.booking);
            setPickupImages(response.pickupImages);
            toast.success("Booking found successfully");
        } catch (error) {
            console.error("Error finding booking:", error);
            toast.error("Failed to find booking");
        } finally {
            setLoading(false);
        }
    };

    const handleImageCapture = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setReturnImages((prev) => [...prev, ...newImages]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!booking) {
            toast.error("Please verify booking first");
            return;
        }

        setLoading(true);
        try {
            await adminAPI.handleVehicleReturn({
                bookingId: booking._id,
                returnImages,
                damageReport,
                notes,
            });

            toast.success("Vehicle return processed successfully");
            // Reset form
            setBooking(null);
            setPickupImages([]);
            setReturnImages([]);
            setDamageReport({
                hasDamages: false,
                notes: "",
                estimatedRepairCost: 0,
            });
            setNotes("");
            setManualEntry({ name: "", phoneNumber: "" });
            setShowManualEntry(false);
        } catch (error) {
            console.error("Error processing vehicle return:", error);
            toast.error("Failed to process vehicle return");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">E-Bike Drop-off Process</h2>

            {/* Initial QR Scanner Section */}
            {!booking && !showManualEntry && (
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
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowQRScanner(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Start Scanning
                    </button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setShowManualEntry(true)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            QR scanning not working? Enter details manually
                        </button>
                    </div>
                </div>
            )}

            {/* Manual Entry Section */}
            {!booking && showManualEntry && (
                <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Manual Entry
                            </h3>
                            <p className="text-sm text-gray-600">
                                Enter customer details to find the booking
                            </p>
                        </div>
                        <button
                            onClick={() => setShowManualEntry(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleManualSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                value={manualEntry.name}
                                onChange={(e) =>
                                    setManualEntry((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={manualEntry.phoneNumber}
                                onChange={(e) =>
                                    setManualEntry((prev) => ({
                                        ...prev,
                                        phoneNumber: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Searching...
                                </span>
                            ) : (
                                "Find Booking"
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* Booking Details and Return Form */}
            {booking && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Details */}
                    <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-4">
                            Customer Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={booking.user.name}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={booking.user.email}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={booking.user.phone}
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
                                    value={booking.user.drivingLicense}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-4">
                            Vehicle Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 font-medium">
                                    Make & Model
                                </label>
                                <input
                                    type="text"
                                    value={`${booking.vehicle.make} ${booking.vehicle.model}`}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Number Plate
                                </label>
                                <input
                                    type="text"
                                    value={booking.vehicle.numberPlate}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Pickup Date
                                </label>
                                <input
                                    type="text"
                                    value={new Date(
                                        booking.pickupDate
                                    ).toLocaleString()}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    value={`${booking.duration} hours`}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Comparison */}
                    <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-lg font-semibold mb-4">
                            Vehicle Condition
                        </h3>

                        {/* Pickup Images */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium mb-2">
                                Pickup Images
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {pickupImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Pickup ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Return Images */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium mb-2">
                                Return Images
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {returnImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Return ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() =>
                                                setReturnImages((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-green-500">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageCapture}
                                        className="hidden"
                                    />
                                    <Camera className="w-8 h-8 text-gray-400" />
                                </label>
                            </div>
                        </div>

                        {/* Damage Report */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium mb-2">
                                Damage Report
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="hasDamages"
                                        checked={damageReport.hasDamages}
                                        onChange={(e) =>
                                            setDamageReport((prev) => ({
                                                ...prev,
                                                hasDamages: e.target.checked,
                                            }))
                                        }
                                        className="mr-2"
                                    />
                                    <label htmlFor="hasDamages">
                                        Vehicle has damages
                                    </label>
                                </div>
                                {damageReport.hasDamages && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Damage Description
                                            </label>
                                            <textarea
                                                value={damageReport.notes}
                                                onChange={(e) =>
                                                    setDamageReport((prev) => ({
                                                        ...prev,
                                                        notes: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                rows="3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Estimated Repair Cost
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    damageReport.estimatedRepairCost
                                                }
                                                onChange={(e) =>
                                                    setDamageReport((prev) => ({
                                                        ...prev,
                                                        estimatedRepairCost:
                                                            parseFloat(
                                                                e.target.value
                                                            ),
                                                    }))
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <h4 className="text-md font-medium mb-2">
                                Additional Notes
                            </h4>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                rows="3"
                                placeholder="Add any additional notes about the vehicle's condition..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || returnImages.length === 0}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                "Complete Return"
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* QR Scanner Modal */}
            {showQRScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Scan QR Code
                            </h3>
                            <button
                                onClick={() => setShowQRScanner(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <QRScanner onResult={handleQRResult} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EBikeDropOffForm;
