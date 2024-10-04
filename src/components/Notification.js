import React from 'react';

function Notification({ message }) {
  return (
    <div style={{ background: 'lightblue', padding: '10px', margin: '10px 0' }}>
      {message}
    </div>
    
  );
}

export default Notification;
