import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faDownload } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    display: 'flex',
    alignItems: 'center',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center the buttons horizontally
    flexDirection: 'column', // Arrange buttons vertically
    alignItems: 'center', // Center items vertically
    marginTop: '20px', // Add some space above the buttons
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to the Dashboard</h1>
      <p>Please select an option:</p>
      <div style={buttonContainerStyle}>
        <button 
          style={buttonStyle}
          onClick={() => navigate('/scanner')}
        >
          <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '8px' }} />
          Scanner
        </button>
        <button 
          style={buttonStyle}
          onClick={() => navigate('/download')}
        >
          <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
          Download List
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
