import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, CreditCard } from 'lucide-react';
import QRCode from 'qrcode.react';

function BookingPage() {
  const { vehicleId } = useParams();
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    duration: '1',
    paymentMethod: 'wallet'
  });
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Booking logic will be implemented
    setShowQR(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Book Your EV</h1>

        {!showQR ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline-block h-5 w-5 mr-2" />
                Pickup Date
              </label>
              <input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline-block h-5 w-5 mr-2" />
                Duration (hours)
              </label>
              <select
                value={bookingDetails.duration}
                onChange={(e) => setBookingDetails({ ...bookingDetails, duration: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                  <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline-block h-5 w-5 mr-2" />
                Payment Method
              </label>
              <select
                value={bookingDetails.paymentMethod}
                onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="wallet">Wallet Balance</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Vehicle: Tesla Model 3 (ID: {vehicleId})</p>
                <p>Rate: $50/hour</p>
                <p>Total: ${50 * parseInt(bookingDetails.duration)}</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-xl font-semibold">Booking Confirmed!</h2>
            <div className="flex justify-center">
              <QRCode
                value={`ev-rental-booking-${vehicleId}-${Date.now()}`}
                size={200}
                level="H"
              />
            </div>
            <p className="text-gray-600">
              Please show this QR code at the station within the next 15 minutes to collect your vehicle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;