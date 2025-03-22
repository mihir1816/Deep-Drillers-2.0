import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    drivingLicenseNumber: '',
  });
  const [drivingLicense, setDrivingLicense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDrivingLicense(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add the driving license file
      if (drivingLicense) {
        formDataToSend.append('drivingLicense', drivingLicense);
      } else {
        throw new Error('Driving license image is required');
      }

      console.log('Sending registration data:', formDataToSend);
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
            setUploadProgress(percentCompleted);
          },
        }
      );

      console.log('Full API response:', response);

      // Handle successful registration
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Show success message before redirecting
      alert('Registration successful! Redirecting to dashboard...');
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      setError(
        error.response?.data?.message || 
        error.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="drivingLicenseNumber">Driving License Number</label>
          <input
            type="text"
            id="drivingLicenseNumber"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="drivingLicense">Driving License Image</label>
          <input
            type="file"
            id="drivingLicense"
            name="drivingLicense"
            onChange={handleFileChange}
            accept="image/*"
            required
            disabled={loading}
          />
          <small>Upload a clear image of your driving license (max 5MB)</small>
        </div>
        
        <button 
          type="submit" 
          className="register-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      {/* Loader Component with upload progress */}
      {loading && (
        <Loader 
          message={
            uploadProgress > 0 
              ? `Uploading: ${uploadProgress}% complete` 
              : "Processing your registration..."
          } 
        />
      )}
      
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register; 