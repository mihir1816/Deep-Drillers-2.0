import React from 'react';
import { Link } from 'react-router-dom';
import { Car, UserCircle, MapPin } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">EV Rentals</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/locations" className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <MapPin className="h-5 w-5" />
              <span>Locations</span>
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
            <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <UserCircle className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;