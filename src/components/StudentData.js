// src/components/StudentData.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentData.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

function StudentData() {
  const role = useSelector((state) => state.user.role);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [eyeColorFilter, setEyeColorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5; // Adjust as needed

  // Fetch students from the backend API
  useEffect(() => {
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

  // Apply search, filtering, and sorting
  useEffect(() => {
    let filteredData = [...students];

    // Search functionality
    if (searchTerm) {
      filteredData = filteredData.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.address.state.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtering by city
    if (cityFilter) {
      filteredData = filteredData.filter((student) => student.address.city === cityFilter);
    }

    // Filtering by state
    if (stateFilter) {
      filteredData = filteredData.filter((student) => student.address.state === stateFilter);
    }

    // Filtering by eye color
    if (eyeColorFilter) {
      filteredData = filteredData.filter((student) => student.eyeColor === eyeColorFilter);
    }

    // Sorting
    if (sortConfig.key !== null) {
      filteredData.sort((a, b) => {
        let aValue = a;
        let bValue = b;

        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj[key], a);
          bValue = keys.reduce((obj, key) => obj[key], b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredStudents(filteredData);
    // Do not reset currentPage here to maintain pagination state
  }, [students, searchTerm, cityFilter, stateFilter, eyeColorFilter, sortConfig]);

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const SortableTableHeader = ({ name, label }) => {
    return (
      <th onClick={() => requestSort(name)} className={getClassNamesFor(name)}>
        {label}
      </th>
    );
  };

  return (
    <div className="student-data-page">
      <section className="student-data">
        <div className="container">
          <h2>Student Data</h2>

          {/* Add Student Button (Visible to Admins Only) */}
          {role === 'admin' && (
            <div className="add-student-button">
              <Link to="/create-student">
                <button className="add-button">Add Student</button>
              </Link>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name, email, or state"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Cities</option>
              {[...new Set(students.map((student) => student.address.city))].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All States</option>
              {[...new Set(students.map((student) => student.address.state))].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={eyeColorFilter}
              onChange={(e) => setEyeColorFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Eye Colors</option>
              {[...new Set(students.map((student) => student.eyeColor))].map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                setCityFilter('');
                setStateFilter('');
                setEyeColorFilter('');
              }}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>

          {/* Student Data Table */}
          <table className="student-table">
            <thead>
              <tr>
                <SortableTableHeader name="firstName" label="First Name" />
                <SortableTableHeader name="lastName" label="Last Name" />
                <SortableTableHeader name="email" label="Email" />
                <SortableTableHeader name="address.city" label="City" />
                <SortableTableHeader name="address.state" label="State" />
                <SortableTableHeader name="eyeColor" label="Eye Color" />
                {/* Edit Column (Visible to Admins Only) */}
                {role === 'admin' && <th>Edit</th>}
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.address.city}</td>
                  <td>{student.address.state}</td>
                  <td>{student.eyeColor}</td>
                  {/* Edit Button (Visible to Admins Only) */}
                  {role === 'admin' && (
                    <td>
                      <Link to={`/edit-student/${student._id}`}>
                        <button className="edit-button">Edit</button>
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              « First
            </button>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              ‹ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>
            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
              Last »
            </button>
          </div>

          {/* Back to Dashboard Button */}
          <Link to="/" className="back-link">
            <button className="back-button">Back to Dashboard</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default StudentData;
