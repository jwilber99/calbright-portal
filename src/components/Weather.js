// Weather.js

import React, { useState } from 'react';
import './Weather.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('McKinney'); // Default location
  const [error, setError] = useState('');

  const API_KEY = "136cc7710134ba394eb4992765d8f666"; // OpenWeather API key

  const fetchWeather = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`; // Fetch data in Fahrenheit
    try {
      setError('');
      const res = await axios.get(url);
      setWeatherData(res.data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to fetch weather data. Please try again.');
      setWeatherData(null);
    }
  };

  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="weather-page">
      <section className="weather">
        <div className="container">
          <h2>Weather Updates</h2>

          {/* Weather Search Form */}
          <form onSubmit={handleSubmit} className="weather-form">
            <input
              type="text"
              placeholder="Enter location (e.g., New York)"
              value={location}
              onChange={handleChange}
              required
            />
            <button type="submit">Get Weather</button>
          </form>

          {/* Weather Display Section */}
          {error && <p className="error-message">{error}</p>}

          {weatherData && (
            <div className="weather-info">
              <h3>{weatherData.name}, {weatherData.sys.country}</h3>
              <p>Temperature: {weatherData.main.temp} °F</p>
              <p>Condition: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind Speed: {weatherData.wind.speed} mph</p>
            </div>
          )}

          {!weatherData && !error && <p>Enter a location and click "Get Weather" to view the weather data.</p>}

          {/* Back to Dashboard Button */}
          <Link to="/" className="back-link">
            <button className="back-button">Back to Home</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Weather;
