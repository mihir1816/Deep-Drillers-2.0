"use client"

import { useState, useEffect } from "react"
import { Wallet, Gift, Car, User, MapPin } from "lucide-react"
import { Calendar, Clock, CreditCard, Battery, Info, Check } from "lucide-react"

import { Link } from "react-router-dom"
import ChatbotButton from "../components/ChatbotButton"
import ChatbotWindow from "../components/ChatbotWindow"
import QRCode from "qrcode.react"

// Define a default guest user state structure
const guestUserData = {
  _id: null,
  name: "Guest User",
  email: "",
  phone: "",
  memberSince: "New Member",
  rewardPoints: 0,
  activeBookings: [],
  bookingHistory: [],
  wallet: { balance: "0.00", transactions: [] },
  drivingLicense: {},
  isPhoneVerified: false,
  kycStatus: "PENDING",
  qrCode: "",
  role: "GUEST",
};

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("vehicles")
  const [showChat, setShowChat] = useState(false)
  const [userData, setUserData] = useState(guestUserData)
  const [isLoading, setIsLoading] = useState(true)

  // Booking sates
  const [allBookings, setAllBookings] = useState([])
  const [activeBookings, setActiveBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  
  const [showAll, setShowAll] = useState(false);
  const [showAllforRecent, setShowAllforRecent] = useState(false);
  
  const sortedBookings = [...activeBookings].sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
  const sortedRecentBookings = [...recentBookings].sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
  
  const visibleBookings = showAll ? sortedBookings : sortedBookings.slice(0, 5);
  const visibleRecentBookings = showAllforRecent ? sortedRecentBookings : sortedRecentBookings.slice(0, 5);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingForRecent, setselectedBookingForRecentBooking] = useState(null);
  

  // Fetch user data
  const fetchUserDataFromServer = async () => {
    setIsLoading(true)
    let userId = null
    let authToken = null

    try {
      const storedUserString = localStorage.getItem("user")
      const token = localStorage.getItem("token")
      if (storedUserString) {
        const userFromStorage = JSON.parse(storedUserString)
        userId = userFromStorage?._id
      }
      if (token) authToken = token

      if (!authToken && !userId) {
        setUserData(guestUserData)
        setIsLoading(false)
        return
      }

      const headers = {}
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`

      const response = await fetch(`https://evrental.vercel.app/api/users/${userId}`, { headers })
      if (!response.ok) {
        if ([401,403,404].includes(response.status)) {
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          setUserData(guestUserData)
        } else {
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }
        setIsLoading(false)
        return
      }

      const data = await response.json()
      const serverUser = data.data
      if (serverUser) {
        setUserData({
          _id: serverUser._id || null,
          name: serverUser.name || "N/A",
          email: serverUser.email || "",
          phone: serverUser.phone || "",
          memberSince: serverUser.createdAt
            ? new Date(serverUser.createdAt).toLocaleDateString()
            : "N/A",
          rewardPoints: serverUser.rewardPoints || 0,
          wallet: {
            balance: serverUser.wallet?.balance?.toString() || "0.00",
            transactions: serverUser.wallet?.transactions || []
          },
          drivingLicense: serverUser.drivingLicense || {},
          isPhoneVerified: serverUser.isPhoneVerified || false,
          kycStatus: serverUser.kycStatus || "PENDING",
          qrCode: serverUser.qrCode || "",
          role: serverUser.role || "USER",
        })
      } else {
        setUserData(guestUserData)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setUserData(guestUserData)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch bookings for a given user
  const fetchUserBookings = async (userId) => {
    if (!userId) {
      setAllBookings([])
      setActiveBookings([])
      setRecentBookings([])
      return
    }
    try {
      const token = localStorage.getItem("token")
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`https://evrental.vercel.app/api/user-bookings/${userId}`, { headers })
      if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`)

      const result = await res.json()
      const bookings = result.data || []
      console.log(bookings);
      setAllBookings(bookings)

      const active = bookings.filter(
        b => b.status === 'active' || b.status === 'pending'
      )
      const recent = bookings.filter(
        b => b.status !== 'active' && b.status !== 'pending'
      )
      setActiveBookings(active)
      setRecentBookings(recent)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setAllBookings([])
      setActiveBookings([])
      setRecentBookings([])
    }
  }

  // On mount: fetch user, then bookings when userData._id changes
  useEffect(() => {
    fetchUserDataFromServer()
    window.addEventListener("authChange", fetchUserDataFromServer)
    return () => window.removeEventListener("authChange", fetchUserDataFromServer)
  }, [])

  useEffect(() => {
    if (userData._id) fetchUserBookings(userData._id)
    else {
      setAllBookings([])
      setActiveBookings([])
      setRecentBookings([])
    }
  }, [userData._id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Loading user data...</p>
      </div>
    )
  }

  const tabs = [
    { id: "vehicles", name: "Find Vehicles", icon: Car },
    { id: "account", name: "Account Info", icon: User },
    { id: "rewards", name: "Rewards & Offers", icon: Gift },
    { id: "wallet", name: "Wallet", icon: Wallet },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row gap-8">


        {/* Sidebar */}
        <div className="md:w-64 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-green-600 text-white" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">

      {activeTab === "vehicles" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Find Available Vehicles</h2>
            <p className="text-gray-600 mb-6">
              Find and book electric vehicles from our stations around the city.
            </p>
            <Link
              to="/locations"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" /> Browse Nearby Stations
            </Link>
          </div>

          {userData._id && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Active Bookings</h3>
              {visibleBookings.length > 0 ? (
                <>
                  <ul className="space-y-4">
                    {visibleBookings.map((b) => (
                      <li
                        key={b._id}
                        className="border border-gray-200 rounded-lg p-4 shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                          <div className="flex flex-wrap gap-4 items-center">
                            <span className="text-gray-700">
                              📅 {new Date(b.pickupDate).toLocaleDateString()}
                            </span>
                            <span className="text-green-600 font-bold text-lg">₹{b.totalAmount}</span>
                          </div>
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="text-sm text-blue-600 hover:underline font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {sortedBookings.length > 5 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {showAll ? "Show Less" : "Show All Entries"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>No active bookings at the moment.</p>
              )}
            </div>
          )}

          {selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                  ×
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Booking Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p><strong>Date:</strong> {new Date(selectedBooking.pickupDate).toLocaleDateString()}</p>
                  <p><strong>Pickup Time:</strong> {new Date(selectedBooking.pickupTime).toLocaleTimeString()}</p>
                  <p><strong>Return Time:</strong> {new Date(selectedBooking.returnDate).toLocaleTimeString()}</p>
                  <p><strong>Duration:</strong> {selectedBooking.duration} hour(s)</p>
                  <p><strong>Overtime Charges:</strong> ₹{selectedBooking.overtimeCharges}</p>
                  <p><strong>Number Plate:</strong> {selectedBooking.vehicle?.numberPlate || "N/A"}</p>
                  <p><strong>Total renting charge :</strong> ₹{selectedBooking.totalAmount}</p>
                  <p><strong>Total Charges (damages) :</strong> ₹{selectedBooking.totalCharges}</p>
                  <p className="md:col-span-2 text-lg font-semibold text-green-700 pt-2 border-t">
                    Total Payable Amount: ₹
                    {selectedBooking.totalAmount + selectedBooking.totalCharges + selectedBooking.overtimeCharges}
                  </p>
                </div>

                

                <div className="bg-white rounded-xl shadow-md p-8 text-center space-y-6 max-w-md mx-auto">
                  <p className="text-gray-600">Booking ID: {selectedBooking._id}</p>
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <QRCode value={`${selectedBooking._id}`} size={200} level="H" />
                  </div>
                </div>

                {selectedBooking.vehicleImages?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-md font-semibold text-gray-800 mb-2">pickUp Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedBooking.vehicleImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Vehicle"
                          className="h-36 w-full rounded-lg object-contain border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedBooking.returnImages?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-md font-semibold text-gray-800 mb-2">Return Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedBooking.returnImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Return"
                          className="h-36 w-full rounded-lg object-contain border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {userData._id && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Recent Bookings</h3>
              {visibleRecentBookings.length > 0 ? (
                <>
                  <ul className="space-y-4">
                    {visibleRecentBookings.map((b) => (
                      <li
                        key={b._id}
                        className="border border-gray-200 rounded-lg p-4 shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                          <div className="flex flex-wrap gap-4 items-center">
                            <span className="text-gray-700">
                              📅 {new Date(b.pickupDate).toLocaleDateString()}
                            </span>
                            <span className="text-green-600 font-bold text-lg">₹{b.totalAmount}</span>
                            <span className="text-red-500 font-medium">
                              Damage: ₹{b.damageReport?.hasDamages ? b.totalCharges : 0}
                            </span>
                            <span className="text-red-500 font-medium">
                              Overtime: ₹{b.overtimeCharge ? b.totalCharges : 0}
                            </span>
                          </div>
                          <button
                            onClick={() => setselectedBookingForRecentBooking(b)}
                            className="text-sm text-blue-600 hover:underline font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {sortedRecentBookings.length > 5 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setShowAllforRecent(!showAllforRecent)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {showAllforRecent ? "Show Less" : "Show All Entries"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>No recent bookings at the moment.</p>
              )}
            </div>
          )}

          {selectedBookingForRecent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setselectedBookingForRecentBooking(null)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                  ×
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Booking Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p><strong>Date:</strong> {new Date(selectedBookingForRecent.pickupDate).toLocaleDateString()}</p>
                  <p><strong>Pickup Time:</strong> {new Date(selectedBookingForRecent.pickupTime).toLocaleTimeString()}</p>
                  <p><strong>Return Time:</strong> {new Date(selectedBookingForRecent.returnDate).toLocaleTimeString()}</p>
                  <p><strong>Duration:</strong> {selectedBookingForRecent.duration} hour(s)</p>
                  <p><strong>Overtime Charges:</strong> ₹{selectedBookingForRecent.overtimeCharges}</p>
                  <p><strong>Number Plate:</strong> {selectedBookingForRecent.vehicle?.numberPlate || "N/A"}</p>
                  <p><strong>Total Amount Paid:</strong> ₹{selectedBookingForRecent.totalAmount}</p>
                  <p><strong>Total Charges (damages):</strong> ₹{selectedBookingForRecent.totalCharges}</p>
                  <p className="md:col-span-2 text-lg font-semibold text-green-700 pt-2 border-t">
                    Total Payable Amount: ₹
                    {selectedBookingForRecent.totalAmount + selectedBookingForRecent.totalCharges + selectedBookingForRecent.overtimeCharges}
                  </p>
                </div>

                {selectedBookingForRecent.vehicleImages?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-md font-semibold text-gray-800 mb-2">pickUp Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedBookingForRecent.vehicleImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Vehicle"
                          className="h-36 w-full rounded-lg object-contain border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedBookingForRecent.returnImages?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-md font-semibold text-gray-800 mb-2">Return Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedBookingForRecent.returnImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Return"
                          className="h-36 w-full rounded-lg object-contain border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      )}


            {activeTab === "account" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
                {userData._id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><p className="text-sm text-gray-500">Full Name</p><p className="text-lg">{userData.name}</p></div>
                      <div><p className="text-sm text-gray-500">Email</p><p className="text-lg">{userData.email}</p></div>
                      <div><p className="text-sm text-gray-500">Phone</p><p className="text-lg">{userData.phone || "Not provided"}</p></div>
                      <div><p className="text-sm text-gray-500">Member Since</p><p className="text-lg">{userData.memberSince}</p></div>
                      <div><p className="text-sm text-gray-500">KYC Status</p><p className="text-lg">{userData.kycStatus}</p></div>
                      <div><p className="text-sm text-gray-500">Role</p><p className="text-lg">{userData.role}</p></div>
                      {userData.drivingLicense?.number && 
                        <div><p className="text-sm text-gray-500">Driving License</p><p className="text-lg">{userData.drivingLicense.number}</p></div>
                      }
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <p>Please log in to view your account information.</p>
                )}
              </div>
            )}

            {activeTab === "rewards" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Rewards & Offers</h2>
                {userData._id ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-green-700 font-medium">Your Reward Points</p>
                        <p className="text-3xl font-bold text-green-600">{userData.rewardPoints || 0}</p>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Redeem Points
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Current Offers</h3>
                    <div className="space-y-4">
                      {/* Static offers for now, these could also come from an API */}
                      <div className="border border-gray-200 rounded-lg p-4">
                          <p className="font-medium">Weekend Special: 20% Off</p>
                          <p className="text-gray-600 text-sm mt-1">Get 20% off on all weekend bookings. Valid until the end of the month.</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                          <p className="font-medium">Refer a Friend</p>
                          <p className="text-gray-600 text-sm mt-1">Earn 100 points for each friend who signs up and completes their first booking.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Please log in to view your rewards and offers.</p>
                )}
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Wallet</h2>
                {userData._id ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-blue-700 font-medium">Your Balance</p>
                        <p className="text-3xl font-bold text-blue-600">${parseFloat(userData.wallet?.balance || 0).toFixed(2)}</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Add Money
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {userData.wallet?.transactions && userData.wallet.transactions.length > 0 ? (
                            userData.wallet.transactions.map((transaction, index) => (
                              <tr key={transaction._id || index}>
                                <td className="px-4 py-2 whitespace-nowrap">{transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : (transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A')}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{transaction.description}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{transaction.type}</td>
                                <td className={`px-4 py-2 whitespace-nowrap ${transaction.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                                  {transaction.type === 'DEBIT' ? '-' : '+'}${parseFloat(transaction.amount || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-4 py-2 text-center text-gray-500">No transactions found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p>Please log in to view your wallet.</p>
                )}
              </div>
            )}


        </div>
      </div>

      <ChatbotButton showChat={showChat} setShowChat={setShowChat} />
      {showChat && <ChatbotWindow setShowChat={setShowChat} />}
    </div>
  )
}

export default UserDashboard;
