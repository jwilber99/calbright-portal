// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logo from '../assets/calbright_logo.svg'; // Ensure the path is correct
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/userSlice';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post(
        'http://localhost:5000/login',
        { username, password },
        { withCredentials: true }
      );

      // Assuming a successful login returns status 200
      if (loginResponse.status === 200) {
        // Fetch user role
        const res = await axios.get('http://localhost:5000/auth-status', {
          withCredentials: true,
        });
        dispatch(setAuth({ isAuthenticated: true, role: res.data.role }));
        navigate('/'); // Redirect to Dashboard after successful login
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('An unexpected error occurred during login.');
      }
    }
  };

  return (
    <div className="login-page">
      {/* Left Tech Image */}
      <div className="tech-image left"></div>

      {/* Login Form Section */}
      <div className="login-form-section">
        {/* Logo */}
        <div className="logo">
          <img 
            src={logo} // Ensure this points to your actual Calbright logo SVG URL
            style={{ height: '150px', width: 'auto', marginBottom: '100px' }}
            alt="Calbright Logo" 
          />
        </div>

        <h2 className="login-header">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
            <button type="submit" className="login-button">Login</button>
          </div>
        </form>

        {/* Links */}
        <div className="links">
          <p>
            Don't have an account? <Link to="/register" className="links-a">Register here</Link>.
          </p>
        </div>
      </div>

      {/* Right Tech Image */}
      <div className="tech-image right"></div>
    </div>
  );
}

export default Login;
