// src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import logo from '../assets/calbright_logo.svg'; // Ensure the path is correct

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Optional role selection
  const [role, setRole] = useState('user'); // Default role
  const [errors, setErrors] = useState([]); // To store multiple error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/register',
        { username, password, role },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setSuccessMessage('You have been registered! Redirecting to login...');
        // Optionally, clear the form
        setUsername('');
        setPassword('');
        setRole('user');

        // Redirect after a short delay to allow users to read the message
        setTimeout(() => {
          navigate('/login');
        }, 3000); // 3 seconds delay
      } else {
        // Handle unexpected status codes
        setErrors(['An unexpected error occurred during registration.']);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const { message, errors } = err.response.data;
        if (errors && Array.isArray(errors)) {
          setErrors(errors);
        } else if (message) {
          setErrors([message]);
        } else {
          setErrors(['An unexpected error occurred during registration.']);
        }
      } else {
        setErrors(['An unexpected error occurred during registration.']);
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Right Tech Image */}
      <div className="tech-image right"></div>

      {/* Register Form Section */}
      <div className="register-form-section">
        {/* Logo */}
        <div className="logo">
          <img 
            src={logo} // Ensure this points to your actual Calbright logo SVG URL
            style={{ height: '150px', width: 'auto', marginBottom: '100px' }}
            alt="Calbright Logo" 
          />
        </div>

        <h2 className="register-header">Register</h2>

        {/* Display Success Message */}
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Display Errors */}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error">
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              name="username"
              id="username"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              name="password"
              id="password"
            />
          </div>

          <div className="form-group">
            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="links">
          <p>
            Already have an account? <Link to="/login" className="links-a">Login here</Link>.
          </p>
        </div>
      </div>

      {/* Left Tech Image */}
      <div className="tech-image left"></div>
    </div>
  );
}

export default Register;
