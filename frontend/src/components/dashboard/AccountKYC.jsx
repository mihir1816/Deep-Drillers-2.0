"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const AccountKYC = () => {
  const [step, setStep] = useState(1)
  const [kycStatus, setKYCStatus] = useState("pending") // pending, verified, rejected
  const [licenseNumber, setLicenseNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)

  // Check existing KYC status on component mount
  useEffect(() => {
    // You can fetch the user's KYC status from your API here
    // For now, we'll just simulate it
    const checkKYCStatus = async () => {
      try {
        // Mock API call to get KYC status
        // const response = await fetch('/api/user/kyc-status')
        // const data = await response.json()
        // setKYCStatus(data.status)
        
        // Simulate for now
        setKYCStatus("pending")
      } catch (error) {
        console.error("Error checking KYC status:", error)
      }
    }
    
    checkKYCStatus()
  }, [])

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
      // Call your backend API to verify the license
      const response = await fetch(`/api/kyc/verify-license/${licenseNumber}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify license")
      }
      
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
      setError(error.message || "Failed to verify license")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle final verification (step 2)
  const handleConfirmVerification = async () => {
    setIsLoading(true)
    
    try {
      // Submit the verified details to your API
      // In a real app, you'd call your API endpoint here
      // const response = await fetch('/api/user/complete-kyc', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userData })
      // })
      
      // Simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update KYC status to verified
      setKYCStatus("verified")
      toast.success("KYC verification completed successfully!")
      
      // Reset the form
      setStep(1)
      setLicenseNumber("")
      setUserData(null)
    } catch (error) {
      console.error("Error completing KYC:", error)
      toast.error("Failed to complete KYC verification")
    } finally {
      setIsLoading(false)
    }
  }

  // Render different content based on KYC status
  const renderContent = () => {
    if (kycStatus === "verified") {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="mr-3 bg-green-100 rounded-full p-2">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800">KYC Verification Completed</h3>
          </div>
          <p className="text-green-700 mb-4">Your identity has been verified successfully. You now have full access to all features.</p>
          
          <div className="bg-white p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2 text-gray-700">Verified Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{userData?.name || "John Smith"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium">{userData?.licenseNumber || "DL12345678"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verification Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-green-600">Verified</p>
              </div>
            </div>
          </div>
          
          <button
            type="button" 
            onClick={() => setKYCStatus("pending")} // For testing only - remove in production
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Need to update your details?
          </button>
        </div>
      )
    }
    
    if (kycStatus === "rejected") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="mr-3 bg-red-100 rounded-full p-2">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800">KYC Verification Failed</h3>
          </div>
          <p className="text-red-700 mb-4">Your KYC verification could not be completed. Please check the reason below and try again.</p>
          
          <div className="bg-white p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2 text-gray-700">Rejection Reason</h4>
            <p className="text-gray-800">The provided information could not be verified. Please ensure your license number is correct.</p>
          </div>
          
          <button
            type="button" 
            onClick={() => setKYCStatus("pending")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )
    }
    
    // Default: pending
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="mb-4 border-b pb-4">
          <h2 className="text-xl font-bold">KYC Verification</h2>
          <p className="text-gray-600 text-sm">Step {step} of 2</p>
        </div>

        {step === 1 ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Verify Driving License</h3>
            
            <p className="text-gray-600 mb-4">
              To complete your account verification, please enter your driving license number below.
              This helps us ensure the security of your account and comply with regulations.
            </p>
            
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
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg transition duration-200 text-white ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify License"}
              </button>
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
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? "Processing..." : "Confirm & Complete Verification"}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Account Verification</h2>
        <p className="text-gray-600">Complete your KYC verification to access all features.</p>
      </div>
      
      {renderContent()}
    </div>
  )
}

export default AccountKYC 