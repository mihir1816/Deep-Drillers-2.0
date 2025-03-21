import React, { useState } from 'react';
import { QrCode, Camera, Car, AlertCircle, ArrowUpCircle, ArrowDownCircle, Image, CheckSquare, UploadCloud } from 'lucide-react';
import QRCode from 'qrcode.react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pickup');
  const [scanMode, setScanMode] = useState(false);
  const [dropoffScanMode, setDropoffScanMode] = useState(false);
  const [vehicleCondition, setVehicleCondition] = useState({
    images: [],
    notes: '',
  });
  const [dropoffData, setDropoffData] = useState({
    damages: {
      frame: { checked: false, severity: 'minor' },
      handlebar: { checked: false, severity: 'minor' },
      brakes: { checked: false, severity: 'minor' },
      wheels: { checked: false, severity: 'minor' },
      tires: { checked: false, severity: 'minor' },
      LEDscreen: { checked: false, severity: 'minor' },
      pedals: { checked: false, severity: 'minor' },
      motor: { checked: false, severity: 'minor' },
      seat: { checked: false, severity: 'minor' },
      lights: { checked: false, severity: 'minor' },
      battery: { checked: false, severity: 'minor' },
      other: { checked: false, severity: 'minor' },
    },
    images: [],
    notes: '',
  });

  const handleScanQR = () => {
    setScanMode(true);
    // QR scanning logic will be implemented
  };

  const handleDropoffScanQR = () => {
    setDropoffScanMode(true);
    // QR scanning logic will be implemented
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setVehicleCondition(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleDropoffImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setDropoffData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleDamageChange = (damageType, checked) => {
    setDropoffData(prev => ({
      ...prev,
      damages: {
        ...prev.damages,
        [damageType]: {
          ...prev.damages[damageType],
          checked
        }
      }
    }));
  };

  const handleSeverityChange = (damageType, severity) => {
    setDropoffData(prev => ({
      ...prev,
      damages: {
        ...prev.damages,
        [damageType]: {
          ...prev.damages[damageType],
          severity
        }
      }
    }));
  };

  const handleEndRental = (e) => {
    e.preventDefault();
    // End rental contract logic will be implemented
    alert('Rental contract ended successfully. E-Bike returned to inventory.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Station Master Dashboard</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium focus:outline-none ${
              activeTab === 'pickup'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pickup')}
          >
            <div className="flex items-center">
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              E-Bike Pickup
            </div>
          </button>
          <button
            className={`py-2 px-4 font-medium focus:outline-none ${
              activeTab === 'dropoff'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('dropoff')}
          >
            <div className="flex items-center">
              <ArrowDownCircle className="mr-2 h-5 w-5" />
              E-Bike Drop-off
            </div>
          </button>
        </div>

        {activeTab === 'pickup' && (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Scanner Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <QrCode className="h-6 w-6 text-green-600" />
                  QR Code Scanner
                </h2>
                <button
                  onClick={handleScanQR}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  {scanMode ? 'Scanning...' : 'Start Scanning'}
                </button>
                {scanMode && (
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Camera feed will appear here</p>
                  </div>
                )}
              </div>

              {/* Vehicle Condition Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Car className="h-6 w-6 text-green-600" />
                  E-Bike Condition
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload E-Bike Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition Notes
                    </label>
                    <textarea
                      value={vehicleCondition.notes}
                      onChange={(e) => setVehicleCondition(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg p-2 h-32"
                      placeholder="Enter any damage or condition notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Assignment Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-green-600" />
                E-Bike Assignment
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Docking Station
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Enter docking station number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Bike Lock Code
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Enter lock code"
                  />
                </div>
              </div>
              <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                Confirm Assignment
              </button>
            </div>
          </>
        )}

        {activeTab === 'dropoff' && (
          <div className="space-y-6">
            {/* QR Scanner Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <QrCode className="h-6 w-6 text-green-600" />
                Scan Return QR Code
              </h2>
              <button
                onClick={handleDropoffScanQR}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="h-5 w-5" />
                {dropoffScanMode ? 'Scanning...' : 'Start Scanning'}
              </button>
              {dropoffScanMode && (
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Camera feed will appear here</p>
                </div>
              )}
            </div>

            {/* Damage Assessment Form */}
            <form onSubmit={handleEndRental}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckSquare className="h-6 w-6 text-green-600" />
                E-Bike Damage Assessment
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.keys(dropoffData.damages).map(damageType => (
                  <div key={damageType} className="border rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={damageType}
                        checked={dropoffData.damages[damageType].checked}
                        onChange={(e) => handleDamageChange(damageType, e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={damageType} className="ml-2 block text-sm text-gray-700">
                        {damageType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                    
                    {dropoffData.damages[damageType].checked && (
                      <div className="ml-6">
                        <label className="block text-xs text-gray-500 mb-1">Severity</label>
                        <select
                          value={dropoffData.damages[damageType].severity}
                          onChange={(e) => handleSeverityChange(damageType, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        >
                          <option value="minor">Minor</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Image Upload Section */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Image className="h-5 w-5 text-green-600" />
                  Upload Damage Photos
                </h3>
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop photos here, or click to select files</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDropoffImageUpload}
                    className="w-full"
                  />
                </div>
                {dropoffData.images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">{dropoffData.images.length} photos selected</p>
                )}
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={dropoffData.notes}
                  onChange={(e) => setDropoffData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 h-32"
                  placeholder="Enter any additional notes about the e-bike condition..."
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                End Rental Contract
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;