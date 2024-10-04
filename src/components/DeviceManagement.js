// src/components/DeviceManagement.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DeviceManagement.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice'; // Ensure the path is correct

function DeviceManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role); // Accessing user role from Redux store

  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 5; // Adjust as needed

  // Fetch devices from the backend API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/devices', {
          withCredentials: true,
        });
        setDevices(res.data);
      } catch (err) {
        console.error('Error fetching devices:', err);
        if (err.response && err.response.status === 401) {
          alert('Unauthorized. Please log in again.');
          dispatch(logout());
          navigate('/login');
        } else {
          alert('Error fetching device data. Please try again later.');
        }
      }
    };
    fetchDevices();
  }, [dispatch, navigate]);

  // Apply search, filtering, and sorting
  useEffect(() => {
    let filteredData = [...devices];

    // Search functionality
    if (searchTerm) {
      filteredData = filteredData.filter((device) => {
        const assignedToName = device.assignedTo
          ? `${device.assignedTo.firstName} ${device.assignedTo.lastName}`
          : 'Unassigned';
        return (
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignedToName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtering by status
    if (statusFilter) {
      filteredData = filteredData.filter((device) => device.status === statusFilter);
    }

    // Filtering by type
    if (typeFilter) {
      filteredData = filteredData.filter((device) => device.type === typeFilter);
    }

    // Sorting
    if (sortConfig.key !== null) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties (e.g., assignedTo.firstName)
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => (obj ? obj[key] : null), a);
          bValue = keys.reduce((obj, key) => (obj ? obj[key] : null), b);
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

    setFilteredDevices(filteredData);
    // Do not reset currentPage here to maintain pagination state
  }, [devices, searchTerm, statusFilter, typeFilter, sortConfig]);

  // Pagination logic
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

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
        {/* Add sort indicator */}
        {sortConfig.key === name ? (
          sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'
        ) : null}
      </th>
    );
  };

  // Handle device deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this device?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/devices/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        alert('Device deleted successfully.');
        // Remove the deleted device from the state
        setDevices((prevDevices) => prevDevices.filter((device) => device._id !== id));
      } else {
        alert('Failed to delete device. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting device:', err);
      if (err.response && err.response.status === 401) {
        alert('Unauthorized. Please log in again.');
        dispatch(logout());
        navigate('/login');
      } else {
        alert('Error deleting device. Please try again later.');
      }
    }
  };

  return (
    <div className="device-management-page">
      <section className="device-management">
        <div className="container">
          <h2>Device Management</h2>

          {/* Add Device Button (Visible to Admins Only) */}
          {role === 'admin' && (
            <div className="add-device-button">
              <Link to="/create-device">
                <button className="btn add-button">Add Device</button>
              </Link>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name, type, status, or assigned to"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {[...new Set(devices.map((device) => device.status))].map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              {[...new Set(devices.map((device) => device.type))].map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTypeFilter('');
              }}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>

          {/* Device Data Table */}
          <table className="device-table">
            <thead>
              <tr>
                <SortableTableHeader name="name" label="Name" />
                <SortableTableHeader name="type" label="Type" />
                <SortableTableHeader name="status" label="Status" />
                <SortableTableHeader name="assignedTo.firstName" label="Assigned To" />
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentDevices.length > 0 ? (
                currentDevices.map((device) => (
                  <tr key={device._id}>
                    <td>{device.name}</td>
                    <td>{device.type}</td>
                    <td>{device.status.charAt(0).toUpperCase() + device.status.slice(1)}</td>
                    <td>
                      {device.assignedTo
                        ? `${device.assignedTo.firstName} ${device.assignedTo.lastName}`
                        : 'Unassigned'}
                    </td>
                    {role === 'admin' && (
                      <td>
                        <Link to={`/edit-device/${device._id}`}>
                          <button className="btn edit-button">Edit</button>
                        </Link>
                        <button
                          className="btn delete-button"
                          onClick={() => handleDelete(device._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4}>No devices found.</td>
                </tr>
              )}
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
            <button className="btn back-button">Back to Dashboard</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DeviceManagement;
