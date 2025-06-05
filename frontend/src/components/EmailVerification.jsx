// EmailVerification.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, CheckCircle, Loader } from "lucide-react";

const EmailVerification = ({ email, onVerified, onCancel }) => {
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Send verification code
    const sendVerificationCode = async () => {
        setIsSending(true);
        try {
            await axios.post("http://localhost:5000/api/auth/send-email-verification", {
                email: email
            });
            
            setCodeSent(true);
            setCountdown(60); // 60 second countdown
            toast.success("Verification code sent to your email!");
            
            // Start countdown
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send verification code");
        } finally {
            setIsSending(false);
        }
    };

    // Verify the code
    const verifyCode = async () => {
        if (!verificationCode.trim()) {
            toast.error("Please enter the verification code");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-email", {
                email: email,
                code: verificationCode
            });

            if (response.data.success) {
                toast.success("Email verified successfully!");
                onVerified(email);
            } else {
                toast.error("Invalid verification code");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Verify Your Email
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        We'll send a verification code to:
                    </p>
                    <p className="text-sm font-medium text-gray-900">{email}</p>
                </div>

                {!codeSent ? (
                    <div className="space-y-4">
                        <button
                            onClick={sendVerificationCode}
                            disabled={isSending}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSending ? (
                                <>
                                    <Loader className="animate-spin h-4 w-4 mr-2" />
                                    Sending...
                                </>
                            ) : (
                                "Send Verification Code"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength="6"
                            />
                        </div>

                        <button
                            onClick={verifyCode}
                            disabled={isLoading || !verificationCode.trim()}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="animate-spin h-4 w-4 mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Verify Email
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                onClick={sendVerificationCode}
                                disabled={countdown > 0 || isSending}
                                className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {countdown > 0 
                                    ? `Resend code in ${countdown}s` 
                                    : "Resend verification code"
                                }
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;