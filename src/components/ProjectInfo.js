import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./ProjectInfo.css";

function ProjectInfo() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="project-info">
      <h1>Project Information</h1>
      <h3>
        This is a React project that interacts with data from a backend, built
        with Node.js and JavaScript. It uses Redux for state management and
        integrates with MongoDB for data persistence.
      </h3>
      <div><br /></div>
      <h2>Technologies Used:</h2>
      <div className="technology-list">
        <div className="technology-item">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React"
          />
          <p>React</p>
        </div>
        <div className="technology-item">
          <img src="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" alt="Node.js" />
          <p>Node.js</p>
        </div>
        <div className="technology-item">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" />
          <p>JavaScript</p>
        </div>
        <div className="technology-item">
          <img src="https://redux.js.org/img/redux.svg" alt="Redux" />
          <p>Redux</p>
        </div>
        <div className="technology-item">
          <img
            src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"
            alt="MongoDB"
          />
          <p>MongoDB</p>
        </div>
      </div>

      <h2>Features Implemented:</h2>
      <ul>
        <h3>Role-Based Access Control (RBAC)</h3>
        <h3>Weather Lookup - External API Integration</h3>
        <h3>Device Management - Internal API Integration</h3>
        <h3>Student Data Information - Internal API Integration</h3>
        <h3>Responsive Design</h3>
        <h3>Searching and Sorting</h3>
        <h3>CRUD Functionality For Devices, Students, and Users/Admins</h3>
      </ul>
      <br />
      <h2>Note: This app is not deployed on the internet.</h2>
      
      {/* Back to Dashboard Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ProjectInfo;
