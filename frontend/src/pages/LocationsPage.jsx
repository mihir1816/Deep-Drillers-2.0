import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Car, XCircle } from 'lucide-react';

function LocationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's location and fetch nearby stations
    const fetchNearbyStations = async (position) => {
      try {
        const params = new URLSearchParams({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 50
        });

        console.log('Fetching stations with params:', params.toString());
        
        const response = await fetch(`http://localhost:5000/api/locations/nearby?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Server response:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          });
          throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received stations:', data);
        setStations(data.data);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => fetchNearbyStations(position),
      (err) => {
        setError('Please enable location services to find nearby stations');
        setLoading(false);
      }
    );
  }, []);

  const StationCard = ({ station }) => {
    const hasVehicles = station.availableVehicles?.length > 0;

    return (
      <Link 
        to={hasVehicles ? `/station/${station._id}` : '#'} 
        key={station._id} 
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow relative
          ${hasVehicles ? 'hover:shadow-lg cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}
        onClick={e => !hasVehicles && e.preventDefault()}
      >
        <div className="relative">
          <img
            src={station.image || 'https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800'}
            alt={station.name}
            className={`w-full h-48 object-cover ${!hasVehicles && 'grayscale'}`}
          />
          {!hasVehicles && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <XCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">No Vehicles Available</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{station.name}</h3>
            <span className={`text-sm px-2 py-1 rounded ${
              hasVehicles 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {hasVehicles 
                ? `${station.availableVehicles.length} available`
                : 'No vehicles'
              }
            </span>
          </div>
          <div className="space-y-2 text-gray-600">
            <p className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {station.address}
            </p>
          </div>
          {station.distance && (
            <div className="mt-4 text-sm text-gray-500">
              {station.distance.toFixed(1)} km away
            </div>
          )}
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading stations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

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

      {stations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard key={station._id} station={station} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No Stations Found</div>
          <p className="text-gray-400">
            There are no EV rental stations available in your area at the moment.
          </p>
        </div>
      )}
    </div>
  );
}

export default LocationsPage; 