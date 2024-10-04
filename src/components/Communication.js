import React, { useState } from "react";
import { Link } from "react-router-dom";

function Communication() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent: ${message}`);
    setMessage("");
  };

  return (
    <>
      <div>
        <h2>
          Send a Message
          <Link to="/">
            <button>Back to Dashboard</button>
          </Link>
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default Communication;
