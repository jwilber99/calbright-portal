// src/components/CreateStudent.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CreateStudent.css';

function CreateStudent() {
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: {
      city: '',
      state: '',
    },
    eyeColor: '',
    // Add other necessary fields
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setStudentData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setStudentData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/students', studentData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        alert('Student created successfully!');
        navigate('/student-data');
      } else {
        alert('Failed to create student. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        console.error('Create student error:', err.response.data);
        alert(`Error: ${err.response.data.message || 'Unknown error.'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        alert('No response from server. Please check your connection.');
      } else {
        console.error('Error:', err.message);
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="create-student-page">
      <h2>Create New Student</h2>
      <form onSubmit={handleSubmit} className="create-student-form">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={studentData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={studentData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="address.city"
            value={studentData.address.city}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="address.state"
            value={studentData.address.state}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Eye Color:
          <input
            type="text"
            name="eyeColor"
            value={studentData.eyeColor}
            onChange={handleChange}
            required
          />
        </label>
        {/* Add other fields as necessary */}
        <button type="submit">Create Student</button>
      </form>
      <button onClick={() => navigate('/student-data')} className="back-button">Back to Student Data</button>
    </div>
  );
}

export default CreateStudent;
