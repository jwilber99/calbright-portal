// App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RequestForm from './components/RequestForm';
import Communication from './components/Communication';
import Dashboard from './components/Dashboard';
import StudentData from './components/StudentData';
import CreateStudent from './components/CreateStudent';
import EditStudent from './components/EditStudent';
import DeviceManagement from './components/DeviceManagement';
import CreateDevice from './components/CreateDevice'; // Import CreateDevice
import EditDevice from './components/EditDevice'; // Import EditDevice
import Weather from './components/Weather';
import AdminComponent from './components/AdminComponent';
import ProjectInfo from './components/ProjectInfo'; // Import the new component
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, logout } from './redux/slices/userSlice';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user);

  useEffect(() => {
    // Check session status on app load
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth-status', {
          withCredentials: true,
        });
        if (res.data.authenticated) {
          dispatch(setAuth({ isAuthenticated: true, role: res.data.role }));
        } else {
          dispatch(setAuth({ isAuthenticated: false, role: '' }));
        }
      } catch (err) {
        dispatch(setAuth({ isAuthenticated: false, role: '' }));
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<PrivateRoute component={Dashboard} />}
        />
        <Route
          path="/student-data"
          element={<PrivateRoute component={StudentData} />}
        />
        <Route
          path="/device-management"
          element={<PrivateRoute component={DeviceManagement} />}
        />
        <Route
          path="/weather"
          element={<PrivateRoute component={Weather} />}
        />
        <Route
          path="/admin"
          element={<PrivateRoute component={AdminComponent} adminOnly />}
        />
        <Route
          path="/request"
          element={<PrivateRoute component={RequestForm} />}
        />
        <Route
          path="/communication"
          element={<PrivateRoute component={Communication} />}
        />
        <Route path="/project-info" element={<ProjectInfo />} />
        <Route
          path="/create-student"
          element={<PrivateRoute component={CreateStudent} adminOnly />}
        />
        <Route
          path="/edit-student/:id"
          element={<PrivateRoute component={EditStudent} adminOnly />}
        />
        <Route
          path="/create-device"
          element={<PrivateRoute component={CreateDevice} adminOnly />}
        />
        <Route
          path="/edit-device/:id"
          element={<PrivateRoute component={EditDevice} adminOnly />}
        />
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Updated PrivateRoute Component to Access Redux Store Directly
function PrivateRoute({ component: Component, adminOnly }) {
  const auth = useSelector((state) => state.user);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && auth.role !== 'admin') {
    return <div>You do not have access to this page.</div>;
  }

  return <Component />;
}

export default App;
