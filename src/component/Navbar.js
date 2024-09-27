import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ userData, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav style={styles.navbar}>
      <div style={{ flex: 1 }}>
        {!isDashboard && (
          <button onClick={handleBack} style={styles.backButton}>
            ← Back
          </button>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={toggleDropdown} style={styles.profileButton}>
          Profile 👤
        </button>
        {showDropdown && userData && (
          <div style={styles.dropdown}>
            <h3 style={styles.dropdownTitle}>User Profile</h3>
            <p style={styles.dropdownText}><strong>Username:</strong> {userData.Username}</p>
            <p style={styles.dropdownText}><strong>Institution:</strong> {userData.Institution}</p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(to right, #4A90E2, #50A1F2)',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '5px 10px',
    transition: 'color 0.3s',
  },
  profileButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '5px 10px',
    transition: 'color 0.3s',
  },
  profileButtonHover: {
    color: '#ccc',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    minWidth: '220px',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  dropdownTitle: {
    margin: '0 0 10px',
    fontSize: '16px',
    color: '#333',
  },
  dropdownText: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#d32f2f',
  },
};

export default Navbar;
