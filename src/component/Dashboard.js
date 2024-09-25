import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to the Dashboard</h1>
      <p>Please select an option:</p>
      <div>
        <button 
          style={buttonStyle}
          onClick={() => navigate('/scanner')}
        >
          Go to Scanner
        </button>
        <button 
          style={buttonStyle}
          onClick={() => navigate('/download')}
        >
          Download List
        </button>
      </div>
    </div>
  );
}

export default Dashboard;