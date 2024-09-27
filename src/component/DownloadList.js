import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserScanData, clearUserData, deleteUserScanEntry } from '../utils/airtableUtils';

function DownloadList({ username }) {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    const data = await getUserScanData(username);
    console.log('Loaded data:', data); // For debugging
    setUserData(data);
  };

  const handleDownload = () => {
    if (userData.length === 0) return;

    const headers = ['ID', 'First name', 'Last name', 'Email', 'Phone Number', 'Scan Time'];
    const csvContent = [
      headers.join(','),
      ...userData.map(user => [
        user.id,
        user['First name'],
        user['Last name'],
        user['Email'],
        user['Phone Number'],
        new Date(user.scanTimestamp).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${username}_scanned_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAllData = () => {
    clearUserData(username);
    setUserData([]);
    alert('All your scanned data has been cleared.');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredData = userData.filter(user =>
    Object.values(user).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Scanned QR Code Data</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}
      />

      {filteredData.length > 0 ? (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>First Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Last Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Phone Number</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Scan Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['First name']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['Last name']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['Email']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['Phone Number']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(user.scanTimestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Download CSV
            </button>
            <button
              onClick={clearAllData}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear All Data
            </button>
          </div>
        </div>
      ) : (
        <p>No scanned data available or no matches found for your search.</p>
      )}
      <button
        onClick={() => navigate('/scanner')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Scanner
      </button>
    </div>
  );
}

export default DownloadList;
