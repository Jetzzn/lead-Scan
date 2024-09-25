import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ userData, onLogout  }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  const handleBack = () => {
    navigate(-1); // This navigates to the previous page
  };
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ flex: 1 }}>
        {!isDashboard && (
        <button 
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back
        </button>  
      )}
      </div>
      <div style={{ position: 'relative' }}>
        <button 
          onClick={toggleDropdown}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            fontSize: '16px'
          }}
        >
          Profile 👤
        </button>
        {showDropdown && userData && (
          <div style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            minWidth: '200px'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>User Profile</h3>
            <p><strong>Username:</strong> {userData.Username}</p>
       <p><strong>Institution:</strong> {userData.Institution}</p>
       
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;