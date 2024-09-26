import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserScanData, clearUserScanData, clearScannedIds } from '../utils/airtableUtils';
function DownloadList({ username }) {
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = () => {
    setUsersData(getUserScanData(username));
  };


  const handleDownload = () => {
    if (usersData.length === 0) return;

    const headers = ['ID', 'First name', 'Last name', 'Age'];
    const csvContent = [
      headers.join(','),
      ...usersData.map(user => [user.id, user['First name'], user['Last name'], user['Age']].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAllData = () => {
    clearUserScanData(username);
    clearScannedIds(username);
    setUsersData([]);
    alert('All scanned data has been cleared.');
  };
  const goToScanner = () => {
    navigate('/scanner');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Download List</h2>
      {usersData.length > 0 ? (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>First Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Last Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['First name']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['Last name']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['Email']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user['Phone Number']}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handleDownload}
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
        <p>No user data available. Please scan QR codes first.</p>
      )}
      <button 
        onClick={goToScanner}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Go to Scanner
      </button>
    </div>
  );
}

export default DownloadList;