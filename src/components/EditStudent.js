// EditStudent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './EditStudent.css';

function EditStudent({ role }) {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get student ID from URL

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/students/${id}`, {
          withCredentials: true,
        });
        setStudentData(res.data);
      } catch (err) {
        console.error('Error fetching student data:', err);
        alert('Error fetching student data. Please try again.');
        navigate('/student-data');
      }
    };
    fetchStudentData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setStudentData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [addressField]: value },
      }));
    } else {
      setStudentData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/students/${id}`,
        studentData,
        {
          withCredentials: true,
        }
      );
      alert('Student updated successfully');
      navigate('/student-data');
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Error updating student. Please try again.');
    }
  };

  if (!studentData) {
    return (
      <div className="edit-student-page">
        <section className="edit-student">
          <div className="container">
            <h2>Edit Student</h2>
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="edit-student-page">
      <section className="edit-student">
        <div className="container">
          <h2>Edit Student</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={studentData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={studentData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={studentData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                name="address.city"
                id="city"
                placeholder="City"
                value={studentData.address.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State:</label>
              <input
                type="text"
                name="address.state"
                id="state"
                placeholder="State"
                value={studentData.address.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="eyeColor">Eye Color:</label>
              <input
                type="text"
                name="eyeColor"
                id="eyeColor"
                placeholder="Eye Color"
                value={studentData.eyeColor}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button">Update Student</button>
          </form>
          <Link to="/student-data" className="back-link">
            <button className="back-button">Back to Students</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default EditStudent;
