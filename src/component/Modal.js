// Modal.js
import React from 'react';

const Modal = ({ user, onClose }) => {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3>Scanned User Data</h3>
        <p><strong>First Name:</strong> {user['First name']}</p>
        <p><strong>Last Name:</strong> {user['Last name']}</p>
        <p><strong>Email:</strong> {user['Email']}</p>
        <p><strong>Phone Number:</strong> {user['Phone Number']}</p>
        <p><strong>Scanned At:</strong> {new Date(user.scanTimestamp).toLocaleString()}</p>
        <button onClick={onClose} style={closeButtonStyle}>Close</button>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

const closeButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '15px',
};

export default Modal;
