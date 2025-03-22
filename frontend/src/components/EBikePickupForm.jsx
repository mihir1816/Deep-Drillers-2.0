"use client"

import { useState, useEffect } from "react"
import QRScanner from "./QRScanner"
import FaceVerification from "./FaceVerification"
import toast from "react-hot-toast"

const EBikePickupForm = () => {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [capturedFaceImage, setCapturedFaceImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pickupPhotos, setPickupPhotos] = useState([])
  const [licenseImageUrl, setLicenseImageUrl] = useState(null)
  const [entryMethod, setEntryMethod] = useState(null) // 'qr' or 'manual'
  const [formData, setFormData] = useState({
    bikeId: "",
    userDetails: {
      name: "",
      email: "",
      phoneNumber: "",
      drivingLicense: "",
      address: "",
    },
  })

  // Fetch license image when driving license number changes
  useEffect(() => {
    const fetchLicenseImage = async () => {
      if (formData.userDetails.drivingLicense) {
        try {
          const response = await fetch(`/api/licenses/${formData.userDetails.drivingLicense}`)
          const data = await response.json()
          if (data.imageUrl) {
            setLicenseImageUrl(data.imageUrl)
          }
        } catch (error) {
          console.error("Error fetching license image:", error)
        }
      } else {
        setLicenseImageUrl(null)
      }
    }

    fetchLicenseImage()
  }, [formData.userDetails.drivingLicense])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setPickupPhotos((prev) => [...prev, ...files])
  }

  const removePhoto = (index) => {
    setPickupPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEntryMethodSelect = (method) => {
    setEntryMethod(method)
    if (method === "qr") {
      setShowQRScanner(true)
    }
  }

  const handleQRResult = (result) => {
    try {
      console.log("Raw QR Data:", result)

      // Attempt to parse if it's JSON
      let data
      try {
        data = JSON.parse(result)
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
          },
        }
      }

      // Update form with the scanned data
      setFormData((prevState) => ({
        ...prevState,
        bikeId: data.bikeId || result,
        userDetails: {
          ...prevState.userDetails,
          name: data.userDetails?.name || data.name || prevState.userDetails.name,
          email: data.userDetails?.email || data.email || prevState.userDetails.email,
          phoneNumber: data.userDetails?.phoneNumber || data.phoneNumber || prevState.userDetails.phoneNumber,
          drivingLicense:
            data.userDetails?.drivingLicense || data.drivingLicense || prevState.userDetails.drivingLicense,
          address: data.userDetails?.address || data.address || prevState.userDetails.address,
        },
      }))

      setShowQRScanner(false)
      toast.success("QR Code successfully scanned!")
    } catch (error) {
      console.error("Error processing QR code:", error)
      toast.error("Error processing QR code. Please try again.")
    }
  }

  const handleFaceCapture = (image, verified) => {
    setCapturedFaceImage(image)
    setIsVerified(verified)
    setShowVerification(false)

    if (verified) {
      toast.success("Face verification successful!")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.userDetails.drivingLicense) {
      toast.error("Driving license number is required")
      return
    }

    if (!isVerified) {
      toast.error("Please complete face verification first")
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData()
      formDataToSend.append("data", JSON.stringify(formData))
      pickupPhotos.forEach((photo, index) => {
        formDataToSend.append(`pickupPhoto${index}`, photo)
      })

      // Create the assignment record in your database
      const response = await fetch("/api/assignments", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("E-Bike successfully assigned!")
        // Reset form
        setFormData({
          bikeId: "",
          userDetails: {
            name: "",
            email: "",
            phoneNumber: "",
            drivingLicense: "",
            address: "",
          },
        })
        setPickupPhotos([])
        setIsVerified(false)
        setCapturedFaceImage(null)
        setLicenseImageUrl(null)
      } else {
        toast.error(`Error: ${data.message || "Failed to create assignment"}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred while submitting the form")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">E-Bike Pickup Process</h2>

      {/* Entry Method Selection */}
      {!entryMethod && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleEntryMethodSelect("qr")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Scan QR Code
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => handleEntryMethodSelect("manual")}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                QR scanning not working? Enter details manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      {entryMethod && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Scanned Data or Manual Entry Fields */}
          {entryMethod === "qr" ? (
            // Display scanned data in a read-only format
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold mb-4">Scanned Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email Address</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Driving License</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.drivingLicense}</p>
                </div>
                {formData.userDetails.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">Address</label>
                    <p className="mt-1 text-gray-900">{formData.userDetails.address}</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEntryMethod(null)}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                ← Change Entry Method
              </button>
            </div>
          ) : (
            // Manual entry fields
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Enter Details Manually</h3>
                <button
                  type="button"
                  onClick={() => setEntryMethod(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Change Entry Method
                </button>
              </div>

              {/* Required Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium">
                    Full Name <span className="text-red-500">*</span>
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
                    Email Address <span className="text-red-500">*</span>
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
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="userDetails.phoneNumber"
                    value={formData.userDetails.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Driving License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="userDetails.drivingLicense"
                    value={formData.userDetails.drivingLicense}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* License Image Display */}
          {licenseImageUrl && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Driving License Image</h3>
              <img src={licenseImageUrl} alt="Driving License" className="w-full max-h-48 object-contain rounded-lg" />
            </div>
          )}

          {/* Optional Fields */}
          <div className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Address (Optional)</label>
              <textarea
                name="userDetails.address"
                value={formData.userDetails.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Pickup Photos (Optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {pickupPhotos.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {pickupPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Pickup photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Face Verification Button */}
          <div className="mt-6">
            {!formData.userDetails.drivingLicense ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please enter the driving license number and other required details before proceeding with
                      verification.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setShowVerification(true)}
              disabled={!formData.userDetails.drivingLicense}
              className={`w-full py-3 rounded-lg transition duration-200 ${
                formData.userDetails.drivingLicense
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {isVerified ? "Face Verified ✓" : "Verify Identity"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isVerified || isSubmitting}
            className={`w-full py-3 rounded-lg transition duration-200 ${
              isVerified && !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <QRScanner onResult={handleQRResult} onClose={() => setShowQRScanner(false)} />
          </div>
        </div>
      )}

      {/* Face Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <FaceVerification
              onCapture={handleFaceCapture}
              onClose={() => setShowVerification(false)}
              drivingLicenseNumber={formData.userDetails.drivingLicense}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default EBikePickupForm

