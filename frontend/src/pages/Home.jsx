import React from 'react';
import { Link } from 'react-router-dom';
import { Battery, Clock, Shield, MapPin } from 'lucide-react';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rent Electric Vehicles with Ease
        </h1>
        <p className="text-xl text-gray-600">
          Sustainable, convenient, and affordable transportation solutions
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <Battery className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
          <p className="text-gray-600">Zero emissions and sustainable transportation options</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <Clock className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flexible Rentals</h3>
          <p className="text-gray-600">Rent by the hour or day, whatever suits your needs</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <Shield className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
          <p className="text-gray-600">Verified users and maintained vehicles</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <MapPin className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Many Locations</h3>
          <p className="text-gray-600">Multiple convenient pickup stations in your city</p>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Link
          to="/locations"
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Find Nearby Stations
        </Link>
        <p className="text-gray-600">or</p>
        <Link
          to="/register"
          className="text-blue-600 hover:underline"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default Home;