"use client"

import { useState, useEffect } from "react"
import QRScanner from "./QRScanner"
import toast from "react-hot-toast"

const EBikeDropOffForm = () => {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dropOffPhotos, setDropOffPhotos] = useState([])
  const [licenseImageUrl, setLicenseImageUrl] = useState(null)
  const [entryMethod, setEntryMethod] = useState(null) // 'qr' or 'manual'
  const [bookingId, setBookingId] = useState("") // Added state for bookingId
  const [formData, setFormData] = useState({
    bikeId: "",
    userDetails: {
      name: "",
      email: "",
      phoneNumber: "",
      drivingLicense: "",
      address: "",
    },
    damageAssessment: {
      hasDamage: false,
      damages: {
        // Battery & Electrical (Column 1)
        batteryCell: { checked: false, cost: 15000, label: "Battery Cells Damage" },
        bms: { checked: false, cost: 8000, label: "Battery Management System" },
        motorController: { checked: false, cost: 6000, label: "Motor Controller" },
        motorWinding: { checked: false, cost: 5000, label: "Motor Winding" },
        throttle: { checked: false, cost: 800, label: "Throttle System" },
        display: { checked: false, cost: 2500, label: "LCD Display" },
        wiring: { checked: false, cost: 1500, label: "Electrical Wiring" },
        chargerPort: { checked: false, cost: 1000, label: "Charging Port" },

        // Mechanical Components (Column 2)
        frame: { checked: false, cost: 12000, label: "Frame Damage" },
        fork: { checked: false, cost: 4000, label: "Front Fork" },
        rim: { checked: false, cost: 2500, label: "Wheel Rim" },
        tire: { checked: false, cost: 1800, label: "Tire Damage" },
        disc: { checked: false, cost: 1200, label: "Brake Disc" },
        brake: { checked: false, cost: 900, label: "Brake Caliper" },
        chain: { checked: false, cost: 1000, label: "Chain/Belt Drive" },
        suspension: { checked: false, cost: 3000, label: "Suspension System" },

        // Accessories & Body (Column 3)
        headlight: { checked: false, cost: 1200, label: "Headlight Assembly" },
        taillight: { checked: false, cost: 800, label: "Taillight Assembly" },
        indicator: { checked: false, cost: 600, label: "Turn Indicators" },
        mirror: { checked: false, cost: 500, label: "Side Mirrors" },
        mudguard: { checked: false, cost: 700, label: "Mudguards" },
        seat: { checked: false, cost: 1500, label: "Seat Assembly" },
        stand: { checked: false, cost: 600, label: "Side Stand" },
        speedometer: { checked: false, cost: 2000, label: "Speedometer Unit" }
      },
      damageNotes: "",
    }
  })
  const [pickupImages, setPickupImages] = useState([]);
  const [totalDamageCost, setTotalDamageCost] = useState(0);
  const [overtimeCharges, setOvertimeCharges] = useState(0);

  // // Fetch license image when driving license number changes
  // useEffect(() => {
  //   const fetchLicenseImage = async () => {
  //     if (formData.userDetails.drivingLicense) {
  //       try {
  //         const response = await fetch(`/api/licenses/${formData.userDetails.drivingLicense}`)
  //         const data = await response.json()
  //         if (data.imageUrl) {
  //           setLicenseImageUrl(data.imageUrl)
  //         }
  //       } catch (error) {
  //         console.error("Error fetching license image:", error)
  //       }
  //     } else {
  //       setLicenseImageUrl(null)
  //     }
  //   }

  //   fetchLicenseImage()
  // }, [formData.userDetails.drivingLicense])

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: checked,
        },
      }))

      // If any damage checkbox is checked, automatically set hasDamage to true
      if (parent === "damageAssessment" && child !== "hasDamage" && checked) {
        setFormData((prevState) => ({
          ...prevState,
          damageAssessment: {
            ...prevState.damageAssessment,
            hasDamage: true,
          },
        }))
      }
      
      // If hasDamage is unchecked, reset all damage checkboxes
      if (parent === "damageAssessment" && child === "hasDamage" && !checked) {
        setFormData((prevState) => ({
          ...prevState,
          damageAssessment: {
            ...prevState.damageAssessment,
            damages: {
              batteryCell: { checked: false, cost: 15000, label: "Battery Cells Damage" },
              bms: { checked: false, cost: 8000, label: "Battery Management System" },
              motorController: { checked: false, cost: 6000, label: "Motor Controller" },
              motorWinding: { checked: false, cost: 5000, label: "Motor Winding" },
              throttle: { checked: false, cost: 800, label: "Throttle System" },
              display: { checked: false, cost: 2500, label: "LCD Display" },
              wiring: { checked: false, cost: 1500, label: "Electrical Wiring" },
              chargerPort: { checked: false, cost: 1000, label: "Charging Port" },
              frame: { checked: false, cost: 12000, label: "Frame Damage" },
              fork: { checked: false, cost: 4000, label: "Front Fork" },
              rim: { checked: false, cost: 2500, label: "Wheel Rim" },
              tire: { checked: false, cost: 1800, label: "Tire Damage" },
              disc: { checked: false, cost: 1200, label: "Brake Disc" },
              brake: { checked: false, cost: 900, label: "Brake Caliper" },
              chain: { checked: false, cost: 1000, label: "Chain/Belt Drive" },
              suspension: { checked: false, cost: 3000, label: "Suspension System" },
              headlight: { checked: false, cost: 1200, label: "Headlight Assembly" },
              taillight: { checked: false, cost: 800, label: "Taillight Assembly" },
              indicator: { checked: false, cost: 600, label: "Turn Indicators" },
              mirror: { checked: false, cost: 500, label: "Side Mirrors" },
              mudguard: { checked: false, cost: 700, label: "Mudguards" },
              seat: { checked: false, cost: 1500, label: "Seat Assembly" },
              stand: { checked: false, cost: 600, label: "Side Stand" },
              speedometer: { checked: false, cost: 2000, label: "Speedometer Unit" }
            },
          },
        }))
      }
    }
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setDropOffPhotos((prev) => [...prev, ...files])
  }

  const removePhoto = (index) => {
    setDropOffPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEntryMethodSelect = (method) => {
    setEntryMethod(method)
    if (method === "qr") {
      setShowQRScanner(true)
    }
  }

  const handleQRResult = async (result) => {
    try {
      console.log("Raw QR Data:", result)
      setIsSubmitting(true)
      
      // Call the API with the QR code data
      const response = await fetch("http://localhost:5000/api/admin-pickup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickupString: result }),
      })

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }
      
      const data = await response.json()

      // Store pickup images--
      if (data.data.vehicleImages && data.data.vehicleImages.length > 0) {
        setPickupImages(data.data.vehicleImages)
      }

      const [vehicleResponse, userResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/vehicle/${data.data.vehicle}`),
        fetch(`http://localhost:5000/api/users/${data.data.user}`)
      ])
      
      if (!vehicleResponse.ok || !userResponse.ok) {
        throw new Error('Failed to fetch vehicle or user details')
      }
      
      const vehicleData = await vehicleResponse.json()
      const userData = await userResponse.json()
      
      console.log("Vehicle Data:", vehicleData)
      console.log("User Data:", userData)
      
      // Store the booking ID from the API response
      setBookingId(data.data._id) // Correctly set the extracted value

      // Update form with the data from API
      if (userData.data) {
        const userDetails = {
          name: userData.data?.name || "",
          email: userData.data?.email || "",
          phoneNumber: userData.data?.phone || "",
          drivingLicense: userData.data?.drivingLicense?.number || "",
        };
        
        setFormData(prevState => ({
          ...prevState,
          userDetails,
          damageAssessment: prevState.damageAssessment
        }));
      }

      // Calculate overtime charges
      const pickupTime = new Date(data.data.pickupTime);
      const contractedDuration = data.data.duration; // duration in hours
      const currentTime = new Date();
      const actualDuration = (currentTime - pickupTime) / (1000 * 60 * 60); // Convert to hours
      
      if (actualDuration > contractedDuration) {
        const extraHours = Math.ceil(actualDuration - contractedDuration);
        const hourlyRate = data.data.vehicle?.pricePerHour || 0;
        const overtimeFee = extraHours * hourlyRate;
        console.log("Overtime fee:**************************************************************************************************************", overtimeFee);
        setOvertimeCharges(overtimeFee);
      }

      setLicenseImageUrl(userData.data?.drivingLicense?.image)
      setShowQRScanner(false)
      toast.success("QR Code successfully scanned and details retrieved!")
    } catch (error) {
      console.error("Error processing QR code:", error)
      toast.error("Error retrieving details from QR code. Please try again or enter details manually.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // New function to handle manual verification checkbox
  const handleVerificationChange = (e) => {
    setIsVerified(e.target.checked)
    if (e.target.checked) {
      toast.success("Identity manually verified!")
    } else {
      toast.error("Identity verification removed")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.userDetails.drivingLicense) {
      toast.error("Driving license number is required");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify user's identity against driving license photo");
      return;
    }
    
    if (!bookingId) {
      toast.error("Booking ID is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('bookingId', bookingId);
      formDataToSend.append('damageAssessment', JSON.stringify({
        ...formData.damageAssessment,
        totalCost: totalDamageCost
      }));
      formDataToSend.append('overtimeCharges', overtimeCharges);

      // Append photos with correct field name 'abc'
      dropOffPhotos.forEach((photo) => {
        formDataToSend.append('abc', photo);
      });

      // Send confirmation to the admin-dropoff-confirm endpoint
      const confirmResponse = await fetch("http://localhost:5000/api/admin-dropoff-confirm", {
        method: "POST",
        body: formDataToSend, // Send FormData instead of JSON
      });

      if (!confirmResponse.ok) {
        const errorText = await confirmResponse.text();
        console.error("Error confirming drop off:", errorText);
        toast.error("Failed to confirm e-bike drop off. Please try again.");
        return;
      }

      const responseData = await confirmResponse.json();
      console.log("Drop-off response:", responseData);

      toast.success("E-Bike drop off successfully confirmed!");
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`An error occurred: ${error.message || "Failed to process drop off"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // New function to handle manual booking ID input
  const handleBookingIdChange = (e) => {
    setBookingId(e.target.value)
  }

  const resetForm = () => {
    setFormData({
      bikeId: "",
      userDetails: {
        name: "",
        email: "",
        phoneNumber: "",
        drivingLicense: "",
        address: "",
      },
      damageAssessment: {
        hasDamage: false,
        damages: {
          batteryCell: { checked: false, cost: 15000, label: "Battery Cells Damage" },
          bms: { checked: false, cost: 8000, label: "Battery Management System" },
          motorController: { checked: false, cost: 6000, label: "Motor Controller" },
          motorWinding: { checked: false, cost: 5000, label: "Motor Winding" },
          throttle: { checked: false, cost: 800, label: "Throttle System" },
          display: { checked: false, cost: 2500, label: "LCD Display" },
          wiring: { checked: false, cost: 1500, label: "Electrical Wiring" },
          chargerPort: { checked: false, cost: 1000, label: "Charging Port" },
          frame: { checked: false, cost: 12000, label: "Frame Damage" },
          fork: { checked: false, cost: 4000, label: "Front Fork" },
          rim: { checked: false, cost: 2500, label: "Wheel Rim" },
          tire: { checked: false, cost: 1800, label: "Tire Damage" },
          disc: { checked: false, cost: 1200, label: "Brake Disc" },
          brake: { checked: false, cost: 900, label: "Brake Caliper" },
          chain: { checked: false, cost: 1000, label: "Chain/Belt Drive" },
          suspension: { checked: false, cost: 3000, label: "Suspension System" },
          headlight: { checked: false, cost: 1200, label: "Headlight Assembly" },
          taillight: { checked: false, cost: 800, label: "Taillight Assembly" },
          indicator: { checked: false, cost: 600, label: "Turn Indicators" },
          mirror: { checked: false, cost: 500, label: "Side Mirrors" },
          mudguard: { checked: false, cost: 700, label: "Mudguards" },
          seat: { checked: false, cost: 1500, label: "Seat Assembly" },
          stand: { checked: false, cost: 600, label: "Side Stand" },
          speedometer: { checked: false, cost: 2000, label: "Speedometer Unit" }
        },
        damageNotes: "",
      }
    });
    setDropOffPhotos([]);
    setIsVerified(false);
    setLicenseImageUrl(null);
    setEntryMethod(null);
    setBookingId("");
    setPickupImages([]);
  };

  const handleDamageChange = (e) => {
    const { name, checked } = e.target;
    const damageKey = name.split('.')[2]; // Get the specific damage key

    setFormData(prevState => {
      const newState = {
        ...prevState,
        damageAssessment: {
          ...prevState.damageAssessment,
          damages: {
            ...prevState.damageAssessment.damages,
            [damageKey]: {
              ...prevState.damageAssessment.damages[damageKey],
              checked
            }
          }
        }
      };

      // Calculate total cost
      const totalCost = Object.values(newState.damageAssessment.damages)
        .reduce((sum, damage) => {
          return sum + (damage.checked ? damage.cost : 0);
        }, 0);

      setTotalDamageCost(totalCost);
      return newState;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">E-Bike Drop Off Process</h2>

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
                  <p className="mt-1 text-gray-900">{formData.userDetails.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email Address</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.email || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Driving License</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.drivingLicense || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.address || "Not provided"}</p>
                </div>
                {formData.bikeId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Bike ID</label>
                    <p className="mt-1 text-gray-900">{formData.bikeId}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Booking ID</label>
                  <p className="mt-1 text-gray-900">{bookingId || "Not available"}</p>
                </div>
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
                
                <div>
                  <label className="block mb-1 font-medium">
                    Bike ID <span className="text-red-500">*</span>
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
                
                {/* Manual Booking ID input field */}
                <div>
                  <label className="block mb-1 font-medium">
                    Booking ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bookingId"
                    value={bookingId}
                    onChange={handleBookingIdChange}
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

          {/* Pickup Images Display */}
          {pickupImages.length > 0 && (
            <div className="border-t pt-6 border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Vehicle Condition at Pickup</h3>
              <p className="text-sm text-gray-600 mb-3">Compare these images taken during pickup to assess any new damage:</p>
              <div className="grid grid-cols-2 gap-4">
                {pickupImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Vehicle condition at pickup ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      Photo {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Damage Assessment Section */}
          <div className="border-t pt-6 border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Vehicle Damage Assessment</h3>
            
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasDamage"
                  name="damageAssessment.hasDamage"
                  checked={formData.damageAssessment.hasDamage}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasDamage" className="ml-2 font-semibold text-gray-700">
                  Vehicle has damage
                </label>
              </div>
              {formData.damageAssessment.hasDamage && (
                <div className="text-xl font-bold text-red-600">
                  Total Damage Cost: ₹{totalDamageCost.toLocaleString()}
                </div>
              )}
            </div>
            
            {formData.damageAssessment.hasDamage && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-6">
                  {/* Battery & Electrical */}
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Battery & Electrical</h4>
                    {Object.entries(formData.damageAssessment.damages)
                      .filter(([key]) => ['batteryCell', 'bms', 'motorController', 'motorWinding', 'throttle', 'display', 'wiring', 'chargerPort'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={key}
                            name={`damageAssessment.damages.${key}`}
                            checked={value.checked}
                            onChange={handleDamageChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={key} className="ml-2 text-sm text-gray-700 flex-1">
                            {value.label}
                            <span className="text-red-600 ml-1">₹{value.cost}</span>
                          </label>
                        </div>
                      ))}
                  </div>

                  {/* Mechanical Components */}
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Mechanical Components</h4>
                    {Object.entries(formData.damageAssessment.damages)
                      .filter(([key]) => ['frame', 'fork', 'rim', 'tire', 'disc', 'brake', 'chain', 'suspension'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={key}
                            name={`damageAssessment.damages.${key}`}
                            checked={value.checked}
                            onChange={handleDamageChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={key} className="ml-2 text-sm text-gray-700 flex-1">
                            {value.label}
                            <span className="text-red-600 ml-1">₹{value.cost}</span>
                          </label>
                        </div>
                      ))}
                  </div>

                  {/* Accessories & Body */}
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-600">Accessories & Body</h4>
                    {Object.entries(formData.damageAssessment.damages)
                      .filter(([key]) => ['headlight', 'taillight', 'indicator', 'mirror', 'mudguard', 'seat', 'stand', 'speedometer'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={key}
                            name={`damageAssessment.damages.${key}`}
                            checked={value.checked}
                            onChange={handleDamageChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={key} className="ml-2 text-sm text-gray-700 flex-1">
                            {value.label}
                            <span className="text-red-600 ml-1">₹{value.cost}</span>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {formData.damageAssessment.hasDamage && (
              <div className="mt-6">
                <label htmlFor="damageNotes" className="block mb-2 font-medium text-gray-700">
                  Damage Notes (Optional)
                </label>
                <textarea
                  id="damageNotes"
                  name="damageAssessment.damageNotes"
                  value={formData.damageAssessment.damageNotes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes about the damage..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            )}
          </div>

          {/* Overtime Charges Display */}
          {overtimeCharges > 0 && (
            <div className="border-t pt-6 border-gray-200">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-yellow-800">Overtime Charges</h3>
                <p className="text-yellow-700">
                  The vehicle was returned after the contracted duration.
                </p>
                <div className="mt-2 text-xl font-bold text-red-600">
                  Overtime Fee: ₹{overtimeCharges.toLocaleString()}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  This amount will be deducted from the user's wallet along with any damage charges.
                </p>
              </div>
            </div>
          )}

          {/* Total Charges Display */}
          {(overtimeCharges > 0 || totalDamageCost > 0) && (
            <div className="border-t pt-6 border-gray-200">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Charges Summary</h3>
                <div className="space-y-2">
                  {totalDamageCost > 0 && (
                    <div className="flex justify-between">
                      <span>Damage Charges:</span>
                      <span className="font-semibold">₹{totalDamageCost.toLocaleString()}</span>
                    </div>
                  )}
                  {overtimeCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Overtime Charges:</span>
                      <span className="font-semibold">₹{overtimeCharges.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total Deduction:</span>
                    <span className="text-red-600">₹{(totalDamageCost + overtimeCharges).toLocaleString()}</span>
                  </div>
                </div>
              </div>
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
              <label className="block mb-1 font-medium">Drop Off Photos (Optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {dropOffPhotos.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {dropOffPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Drop off photo ${index + 1}`}
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

          {/* Manual Verification Checkbox */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="text-lg font-semibold mb-2">Identity Verification <span className="text-red-500">*</span></h3>
            <p className="mb-4 text-gray-600">Please manually verify the user's face against their driving license photo before confirming the drop off.</p>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verificationCheckbox"
                checked={isVerified}
                onChange={handleVerificationChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!formData.userDetails.drivingLicense}
              />
              <label htmlFor="verificationCheckbox" className="ml-2 block text-sm font-medium text-gray-700">
                I confirm that I have verified the user's face matches their driving license photo
              </label>
            </div>
            
            {!formData.userDetails.drivingLicense && (
              <div className="mt-2 text-yellow-700 text-sm">
                <p>Please enter driving license details to enable verification</p>
              </div>
            )}
            
            {formData.userDetails.drivingLicense && !isVerified && (
              <div className="mt-2 bg-blue-50 border-l-4 border-blue-500 p-3">
                <p className="text-blue-700 text-sm">
                  <strong>Required:</strong> You must check this box to enable the Confirm Drop Off button
                </p>
              </div>
            )}
          </div>

          {/* Validation for Booking ID */}
          {entryMethod === "manual" && !bookingId && (
            <div className="mt-2 text-red-600 text-sm">
              <p>Please enter a booking ID to complete the Drop Off</p>
            </div>
          )}

          {/* Submit Button - Add prominent visual cue when verification is missing */}
          {formData.userDetails.drivingLicense && !isVerified && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-3 animate-pulse">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-amber-700">Please complete the identity verification above to enable this button</p>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={
              !isVerified || 
              isSubmitting || 
              (!bookingId && entryMethod === "manual")
            }
            className={`w-full py-3 rounded-lg transition duration-200 ${
              isVerified && !isSubmitting && (bookingId || entryMethod !== "manual")
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Confirm Drop Off"}
          </button>
        </form>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <button 
                onClick={() => setShowQRScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <QRScanner onResult={handleQRResult} onClose={() => setShowQRScanner(false)} />
            {isSubmitting && (
              <div className="text-center mt-2">
                <p>Retrieving user details...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EBikeDropOffForm