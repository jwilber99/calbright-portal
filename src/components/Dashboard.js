// src/components/Dashboard.js



import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logo from '../assets/calbright_logo.svg'; // Ensure this path is correct
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        dispatch(logout());
        navigate('/login'); // Redirect to login after logout
      } else {
        alert('Failed to logout. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error('Logout error:', err.response.data);
        alert(`Logout failed: ${err.response.data.message || 'Unknown error.'}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Something else caused the error
        console.error('Logout error:', err.message);
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="logo">
            <img src={logo} alt="Calbright Logo" />
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/student-data">Student Information</Link></li>
              <li><Link to="/device-management">Device Management</Link></li>
              <li><Link to="/weather">Weather Info</Link></li>
              <li><Link to="/project-info">Project Info</Link></li> {/* New link for Project Info */}
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Calbright College's Portal</h1>
          <p>Learn about the app by clicking the button below!</p>
          {/* Link to '/student-data' for all users */}
          <Link to="/project-info" className="cta-button">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Our Features</h2>
          <div className="feature-cards">
            {/* "Student Data Management" is accessible to all users */}
            <div className="card">
              <h3>Student Information</h3>
              <p>View Calbright College students with search, filtering, and sorting capabilities.</p>
              <Link to="/student-data" className="feature-button">Manage Students</Link>
            </div>
            <div className="card">
              <h3>Device Management</h3>
              <p>Keep track of devices assigned to students and monitor statuses with search, filtering, and sorting capabilities.</p>
              <Link to="/device-management" className="feature-button">Manage Devices</Link>
            </div>
            <div className="card">
              <h3>Weather Information</h3>
              <p>Stay informed with the latest weather information, dont be caught off guard!</p>
              <Link to="/weather" className="feature-button">Check Weather</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Images Section */}
      <section className="images-section">
        <img src="https://www.calbright.edu/wp-content/uploads/2022/04/designed-for-you.jpg.webp" alt="Designed for You" />
        <img src="https://www.calbright.edu/wp-content/uploads/2022/04/start-your-next-chapter.jpg.webp" alt="Start Your Next Chapter" />
        <img src="https://www.calbright.edu/wp-content/uploads/2022/04/study-on-your-schedule.jpg.webp" alt="Study On Your Schedule" />
      </section>
      
      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <h2>This is an unofficial Calbright website, made only for an example of Justin Wilber's coding ability.</h2>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
