import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Car, MapPin, Battery, Info, Check } from 'lucide-react';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';

function BookingPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: new Date().toTimeString().slice(0, 5),
    dropoffDate: new Date().toISOString().split('T')[0],
    dropoffTime: '',
    duration: '1',
    paymentMethod: 'card'
  });
  const [showQR, setShowQR] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Fetch vehicle details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        // In a real app, you would have an API endpoint to get vehicle details
        const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch vehicle: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received vehicle data:', data);
        
        if (data.success) {
          setVehicle(data.data);
          
          // Fetch station details if stationId is available
          if (data.data.stationId) {
            const stationResponse = await fetch(`http://localhost:5000/api/locations/${data.data.stationId}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (stationResponse.ok) {
              const stationData = await stationResponse.json();
              if (stationData.success) {
                setStation(stationData.data);
              }
            }
          }
        } else {
          throw new Error(data.message || 'Failed to fetch vehicle details');
        }
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
        setError(err.message);
        
        // Fallback to mock data for demo purposes
        setVehicle({
          _id: vehicleId,
          name: 'Tesla Model 3',
          numberPlate: 'EV-1234',
          range: 400,
          chargingStatus: { level: 85 },
          pricePerHour: 50,
          image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800'
        });
        
        setStation({
          name: 'Downtown Station',
          address: '123 Main St, City'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  const calculateDuration = () => {
    if (!bookingDetails.pickupDate || !bookingDetails.pickupTime || 
        !bookingDetails.dropoffDate || !bookingDetails.dropoffTime) {
      return 1;
    }

    const pickup = new Date(`${bookingDetails.pickupDate}T${bookingDetails.pickupTime}`);
    const dropoff = new Date(`${bookingDetails.dropoffDate}T${bookingDetails.dropoffTime}`);
    
    // Calculate difference in hours
    const diffInHours = Math.max(1, Math.ceil((dropoff - pickup) / (1000 * 60 * 60)));
    return diffInHours;
  };

  const calculatePrice = () => {
    const hours = calculateDuration();
    let discount = 0;
    
    if (hours >= 24) {
      discount = 0.2; // 20% discount
    } else if (hours >= 12) {
      discount = 0.1; // 10% discount
    } else if (hours >= 6) {
      discount = 0.05; // 5% discount
    }
    
    const basePrice = hours * (vehicle?.pricePerHour || 0);
    const discountedPrice = basePrice * (1 - discount);
    
    return discountedPrice.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const duration = calculateDuration();
    
    if (duration < 1) {
      toast.error('Invalid booking duration. Please check your dates and times.');
      return;
    }
    
    try {
      // In a real app, you would submit the booking to your backend
      const bookingData = {
        vehicleId,
        pickupDateTime: `${bookingDetails.pickupDate}T${bookingDetails.pickupTime}`,
        dropoffDateTime: `${bookingDetails.dropoffDate}T${bookingDetails.dropoffTime}`,
        paymentMethod: bookingDetails.paymentMethod,
        totalPrice: calculatePrice()
      };
      
      console.log('Submitting booking:', bookingData);
      
      // Simulate API call
      // const response = await fetch('http://localhost:5000/api/bookings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(bookingData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create booking');
      // }
      
      // const data = await response.json();
      // setBookingId(data.data._id);
      
      // For demo, generate a random booking ID
      setBookingId(`BK-${Math.floor(Math.random() * 10000)}`);
      
      toast.success('Booking confirmed successfully!');
      setShowQR(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      toast.error(err.message || 'Failed to create booking');
    }
  };

  // Calculate actual range based on battery level
  const actualRange = vehicle ? Math.round(vehicle.range * vehicle.chargingStatus.level * 0.01) : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Error loading vehicle</h2>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => navigate('/locations')}
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Locations
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Vehicle not found</h2>
          <button 
            onClick={() => navigate('/locations')}
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Locations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Book Your Vehicle</h1>

        {!showQR ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Details Card - Left Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={vehicle.image || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800'}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                    {vehicle.numberPlate}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-800">{vehicle.name}</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Battery className="h-5 w-5 mr-3" />
                      <div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${vehicle.chargingStatus.level}%` }}
                          ></div>
                        </div>
                        <span className="text-sm mt-1 block">
                          Battery: {vehicle.chargingStatus.level}% ({actualRange}km range)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3" />
                      <span>{station?.name || 'Loading station...'}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>${vehicle.pricePerHour}/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form - Right Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickup Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-green-600" />
                      Pickup Details
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDetails.pickupDate}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, pickupDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={bookingDetails.pickupTime}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, pickupTime: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Drop-off Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-red-600" />
                      Drop-off Details
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDetails.dropoffDate}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, dropoffDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        min={bookingDetails.pickupDate}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={bookingDetails.dropoffTime}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, dropoffTime: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Method
                  </h3>
                  <select
                    value={bookingDetails.paymentMethod}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="wallet">Wallet Balance</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-600" />
                    Booking Summary
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Duration:</div>
                    <div className="font-medium">{calculateDuration()} hours</div>
                    
                    <div>Base Rate:</div>
                    <div className="font-medium">${vehicle.pricePerHour}/hour</div>
                    
                    {calculateDuration() >= 6 && (
                      <>
                        <div className="text-green-600">Discount:</div>
                        <div className="font-medium text-green-600">
                          {calculateDuration() >= 24 ? '20%' : calculateDuration() >= 12 ? '10%' : '5%'}
                        </div>
                      </>
                    )}
                    
                    <div className="text-lg font-bold">Total:</div>
                    <div className="text-lg font-bold">${calculatePrice()}</div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Booking Confirmed!</h2>
            <p className="text-gray-600">Booking ID: {bookingId}</p>
            <div className="bg-gray-50 p-4 rounded-lg inline-block">
              <QRCode
                value={`ev-rental-booking-${vehicleId}-${bookingId}`}
                size={200}
                level="H"
              />
            </div>
            <p className="text-gray-600">
              Please show this QR code at {station?.name || 'the station'} within the next 15 minutes to collect your vehicle.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;