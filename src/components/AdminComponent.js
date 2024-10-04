// AdminComponent.js

import React from 'react';
import { Link } from 'react-router-dom';

function AdminComponent() {
  return (
    <div>
      <h1>Admin Component

      <Link to="/">
            <button>Back to Dashboard</button>
          </Link>
      </h1>
      <p>-- Under Construction --</p>
      <p>This is a protected route accessible only to admin users.</p>
    </div>
  );
}

export default AdminComponent;
