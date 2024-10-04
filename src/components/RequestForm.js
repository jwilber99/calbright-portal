import React, { useState } from "react";
import { Link } from "react-router-dom";

function RequestForm() {
  const [request, setRequest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Request Submitted: ${request}`); // Simulate submitting the request
    setRequest("");
  };

  return (
    <>
      <div>
        <h2>
          Submit a Request
          <Link to="/">
            <button>Back to Dashboard</button>
          </Link>
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Enter your request here"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default RequestForm;
