import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Car } from 'lucide-react';

function LocationsPage() {
  // Mock data for charging/rental stations
  const stations = [
    {
      id: 1,
      name: 'Downtown Station',
      address: '123 Main St, Downtown',
      vehiclesAvailable: 5,
      image: 'https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800',
      coordinates: '40.7128° N, 74.0060° W'
    },
    {
      id: 2,
      name: 'North Station',
      address: '456 North Ave, Northside',
      vehiclesAvailable: 3,
      image: 'https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800',
      coordinates: '40.7331° N, 74.0724° W'
    },
    {
      id: 3,
      name: 'East Side Station',
      address: '789 East Blvd, Eastside',
      vehiclesAvailable: 7,
      image: 'https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800',
      coordinates: '40.7214° N, 73.9875° W'
    },
    {
      id: 4,
      name: 'West End Station',
      address: '321 West St, Westside',
      vehiclesAvailable: 2,
      image: 'https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800',
      coordinates: '40.7484° N, 74.0345° W'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nearby EV Rental Stations
        </h1>
        <p className="text-gray-600">
          Select a station to view available vehicles for rent
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <Link 
            to={`/station/${station.id}`} 
            key={station.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={station.image}
              alt={station.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{station.name}</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {station.address}
                </p>
                <p className="flex items-center">
                  <Car className="h-4 w-4 mr-1" />
                  {station.vehiclesAvailable} vehicles available
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {station.coordinates}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LocationsPage; 