import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";

function KYC() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        aadharNumber: "",
        otp: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const goBack = () => {
        setStep((prev) => prev - 1);
    };

    const generateOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/kyc/generate-otp",
                { aadharNumber: formData.aadharNumber },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            toast.success("OTP sent successfully!");
            setStep(2);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to generate OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/kyc/verify-otp",
                { otp: formData.otp },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            toast.success("Aadhaar verified successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to verify OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Complete KYC Verification
                </h2>

                {/* Step 1: Aadhaar Number */}
                {step === 1 && (
                    <form onSubmit={generateOTP} className="space-y-6">
                        <div>
                            <label
                                htmlFor="aadharNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Aadhaar Number
                            </label>
                            <input
                                type="text"
                                id="aadharNumber"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{12}"
                                maxLength="12"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter 12-digit Aadhaar number"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Generating OTP...
                                </>
                            ) : (
                                "Generate OTP"
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <form onSubmit={verifyOTP} className="space-y-6">
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                maxLength="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                        Verifying OTP...
                                    </>
                                ) : (
                                    "Complete Verification"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Progress Steps */}
                <div className="mt-8 flex justify-between">
                    <div
                        className={`w-1/2 text-center ${
                            step >= 1 ? "text-green-600" : "text-gray-400"
                        }`}
                    >
                        Aadhaar Number
                    </div>
                    <div
                        className={`w-1/2 text-center ${
                            step >= 2 ? "text-green-600" : "text-gray-400"
                        }`}
                    >
                        OTP Verification
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KYC;