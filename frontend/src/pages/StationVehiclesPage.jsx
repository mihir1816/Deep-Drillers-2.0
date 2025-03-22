import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BatteryFull, DollarSign } from 'lucide-react';

function StationVehiclesPage() {
  const { stationId } = useParams();
  const [station, setStation] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/locations/${stationId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch station: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received station data:', data);
        
        if (data.success) {
          setStation(data.data);
          setVehicles(data.data.availableVehicles || []);
        } else {
          throw new Error(data.message || 'Failed to fetch station details');
        }
      } catch (err) {
        console.error('Error fetching station details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [stationId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Error loading station</h2>
          <p className="mt-2">{error}</p>
          <Link to="/locations" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Locations
          </Link>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Station not found</h2>
          <Link to="/locations" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Locations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/locations" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Locations
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {station.name}
        </h1>
        <p className="text-gray-600 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {station.address}
        </p>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
          No vehicles currently available at this station.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            // Calculate actual range based on battery level
            const RANGE_MULTIPLIER = 3; // 1% multiplier
            const actualRange = Math.round(vehicle.chargingStatus.level * RANGE_MULTIPLIER);
            
            return (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={vehicle.image || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800'}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${vehicle.pricePerHour}/hour
                    </p>
                    <p className="flex items-center">
                      <BatteryFull className="h-4 w-4 mr-1" />
                      Range: {actualRange}km | Battery: {vehicle.chargingStatus.level}%
                    </p>
                    <p className="text-sm font-medium bg-gray-100 inline-block px-2 py-1 rounded">
                      Plate: {vehicle.numberPlate}
                    </p>
                  </div>
                  <Link 
                    to={`/book/${vehicle._id}`}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex justify-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StationVehiclesPage; 