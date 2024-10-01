import React from 'react';

const Modal = ({ user, onClose }) => {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.heading}>Scanned User Data</h3>
        <div style={styles.content}>
          <div style={styles.field}>
            <span style={styles.label}>First Name:</span>
            <span style={styles.value}>{user['First name']}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Last Name:</span>
            <span style={styles.value}>{user['Last name']}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Scanned At:</span>
            <span style={styles.value}>{new Date(user.scanTimestamp).toLocaleString()}</span>
          </div>
        </div>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '400px',
    padding: '30px',
    textAlign: 'left',
    animation: 'slideIn 0.3s ease-out',
  },
  heading: {
    color: '#2c3e50',
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 600,
  },
  content: {
    marginBottom: '25px',
  },
  field: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#7f8c8d',
    fontSize: '16px',
    fontWeight: 600,
  },
  value: {
    color: '#34495e',
    fontSize: '16px',
  },
  closeButton: {
    width: '100%',
    padding: '12px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes slideIn': {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
};

export default Modal;