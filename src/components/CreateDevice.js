// src/components/CreateDevice.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Access Redux state
import './CreateDevice.css';

function CreateDevice() {
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState({
    name: '',
    type: '',
    assignedTo: '',
    status: 'active',
  });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const role = useSelector((state) => state.user.role); // Access user role from Redux

  useEffect(() => {
    // Fetch students to assign devices
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/students', {
          withCredentials: true,
        });
        setStudents(res.data);
      } catch (err) {
        console.error('Error fetching students:', err);
        alert('Error fetching student data. Please try again later.');
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // If assignedTo is an empty string
    // set it to null to prevent mongoDB error
    const devicePayload = {
      ...deviceData,
      assignedTo: deviceData.assignedTo || null,  // Handle unassigned case
    };
  
    try {
      const res = await axios.post('http://localhost:5000/devices', devicePayload, {
        withCredentials: true,
      });
      if (res.status === 201) {
        alert('Device created successfully!');
        navigate('/device-management');
      } else {
        alert('Failed to create device. Please try again.');
      }
    } catch (err) {
      console.error('Error creating device:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="create-device-page">
      <h2>Create New Device</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="create-device-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={deviceData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={deviceData.type}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Assign To:
          <select name="assignedTo" value={deviceData.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status:
          <select name="status" value={deviceData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        {/* Add other fields as necessary */}
        <button type="submit" className="submit-button">Create Device</button>
      </form>
      <button onClick={() => navigate('/device-management')} className="back-button">Back to Device Management</button>
    </div>
  );
}

export default CreateDevice;
