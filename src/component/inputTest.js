import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByFirstName } from '../utils/airtableUtils';

function inputTest() {
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await getUserByFirstName(firstName);
      // Store the user data in localStorage
      localStorage.setItem('scannedUserData', JSON.stringify(user));
      // Navigate to the Download List page
      navigate('/download');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Data Retrieval</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px' }}>Enter First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Fetch User Data
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default inputTest;