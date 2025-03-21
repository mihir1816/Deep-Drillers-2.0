import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BatteryFull, DollarSign } from 'lucide-react';

function StationVehiclesPage() {
  const { stationId } = useParams();
  const [station, setStation] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch with mock data
    setLoading(true);
    
    // Mock station data
    const stationData = {
      1: {
        id: 1,
        name: 'Downtown Station',
        address: '123 Main St, Downtown',
        coordinates: '40.7128° N, 74.0060° W'
      },
      2: {
        id: 2,
        name: 'North Station',
        address: '456 North Ave, Northside',
        coordinates: '40.7331° N, 74.0724° W'
      },
      3: {
        id: 3,
        name: 'East Side Station',
        address: '789 East Blvd, Eastside',
        coordinates: '40.7214° N, 73.9875° W'
      },
      4: {
        id: 4,
        name: 'West End Station',
        address: '321 West St, Westside',
        coordinates: '40.7484° N, 74.0345° W'
      }
    };
    
    // Mock vehicles data per station
    const vehiclesData = {
      1: [
        {
          id: 101,
          name: 'Tesla Model 3',
          image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800',
          price: '50/hour',
          range: '350km',
          batteryLevel: '95%'
        },
        {
          id: 102,
          name: 'Nissan Leaf',
          image: 'https://images.unsplash.com/photo-1564592562750-bea3da767148?auto=format&fit=crop&w=800',
          price: '40/hour',
          range: '270km',
          batteryLevel: '87%'
        },
      ],
      2: [
        {
          id: 201,
          name: 'Chevrolet Bolt',
          image: 'https://images.unsplash.com/photo-1571127236794-81c2bca55aea?auto=format&fit=crop&w=800',
          price: '45/hour',
          range: '320km',
          batteryLevel: '92%'
        },
        {
          id: 202,
          name: 'Hyundai Kona Electric',
          image: 'https://images.unsplash.com/photo-1581182800629-431e9df08ca4?auto=format&fit=crop&w=800',
          price: '42/hour',
          range: '300km',
          batteryLevel: '78%'
        },
      ],
      3: [
        {
          id: 301,
          name: 'Kia EV6',
          image: 'https://images.unsplash.com/photo-1606073182011-78828fee8e8d?auto=format&fit=crop&w=800',
          price: '55/hour',
          range: '380km',
          batteryLevel: '100%'
        },
      ],
      4: [
        {
          id: 401,
          name: 'Ford Mustang Mach-E',
          image: 'https://images.unsplash.com/photo-1549275301-c9bb81f36f9b?auto=format&fit=crop&w=800',
          price: '60/hour',
          range: '400km',
          batteryLevel: '89%'
        },
        {
          id: 402,
          name: 'Audi e-tron',
          image: 'https://images.unsplash.com/photo-1606073537135-65fe27df9ce9?auto=format&fit=crop&w=800',
          price: '65/hour',
          range: '390km',
          batteryLevel: '92%'
        },
      ]
    };
    
    setTimeout(() => {
      setStation(stationData[stationId]);
      setVehicles(vehiclesData[stationId] || []);
      setLoading(false);
    }, 500); // Simulate loading time
  }, [stationId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
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
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${vehicle.price}
                  </p>
                  <p className="flex items-center">
                    <BatteryFull className="h-4 w-4 mr-1" />
                    Range: {vehicle.range} | Battery: {vehicle.batteryLevel}
                  </p>
                </div>
                <Link 
                  to={`/book/${vehicle.id}`}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex justify-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StationVehiclesPage; 