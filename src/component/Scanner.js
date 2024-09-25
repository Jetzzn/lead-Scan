import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../utils/airtableUtils';

function Scanner() {
  const [id, setId] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await getUserById(id);
      localStorage.setItem('scannedUserData', JSON.stringify(user));
      navigate('/download');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please check the ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Data Retrieval</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="id" style={{ display: 'block', marginBottom: '5px' }}>Enter User ID:</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
            placeholder="Enter the user's unique identifier"
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Fetching...' : 'Fetch User Data'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Scanner;