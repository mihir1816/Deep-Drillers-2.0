"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

const KYCVerification = ({ onVerified, onClose }) => {
  const [step, setStep] = useState(1)
  const [licenseNumber, setLicenseNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)

  // Handle license number submission
  const handleSubmitLicense = async (e) => {
    e.preventDefault()
    
    if (!licenseNumber.trim()) {
      setError("Please enter a valid driving license number")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Call backend API to verify the license
      const response = await axios.get(
        `/api/kyc/verify-license/${licenseNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      
      const data = response.data
      
      if (data.success && data.user) {
        // User found in database
        setUserData(data.user)
        toast.success("Driving license verified successfully!")
        setStep(2) // Move to step 2
      } else {
        // User not found
        setError("No user found with this driving license number")
      }
    } catch (error) {
      console.error("License verification error:", error)
      setError(error.response?.data?.message || "Failed to verify license")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle final verification (step 2)
  const handleConfirmVerification = () => {
    // Pass the verified user data back to parent component
    onVerified(userData)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      <div className="mb-4 border-b pb-4">
        <h2 className="text-xl font-bold">KYC Verification</h2>
        <p className="text-gray-600 text-sm">Step {step} of 2</p>
      </div>

      {step === 1 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Verify Driving License</h3>
          
          <form onSubmit={handleSubmitLicense}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driving License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your driving license number"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify License"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4">Confirm Details</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">User Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{userData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium">{userData?.licenseNumber || licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userData?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{userData?.phone || "N/A"}</p>
              </div>
              {userData?.address && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{userData.address}</p>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Please verify that the information above is correct before proceeding.
          </p>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirmVerification}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Confirm & Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default KYCVerification 