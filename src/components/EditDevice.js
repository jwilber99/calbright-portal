// src/components/EditDevice.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Access Redux state
// import './EditDevice.css';

function EditDevice() {
  const { id } = useParams();
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
    // Fetch device details
    const fetchDevice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/devices/${id}`, {
          withCredentials: true,
        });
        setDeviceData({
          name: res.data.name,
          type: res.data.type,
          assignedTo: res.data.assignedTo ? res.data.assignedTo._id : '',
          status: res.data.status,
        });
      } catch (err) {
        console.error('Error fetching device:', err);
        setError('Failed to fetch device details.');
      }
    };
    fetchDevice();

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/devices/${id}`, deviceData, {
        withCredentials: true,
      });
      if (res.status === 200) {
        alert('Device updated successfully!');
        navigate('/device-management');
      } else {
        alert('Failed to update device. Please try again.');
      }
    } catch (err) {
      console.error('Error updating device:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="edit-device-page">
      <h2>Edit Device</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-device-form">
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
        <button type="submit" className="submit-button">Update Device</button>
      </form>
      <button onClick={() => navigate('/device-management')} className="back-button">Back to Device Management</button>
    </div>
  );
}

export default EditDevice;
