import React, { useState, useEffect } from 'react';

function DownloadList() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('scannedUserData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleDownload = () => {
    if (!userData) return;

    const csvContent = Object.entries(userData)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `user_data_${userData.id}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Download List</h2>
      {userData ? (
        <div>
          <h3>Scanned User Data:</h3>
          <p><strong>Name:</strong> {userData.Username}</p>
  
          {/* Add more fields as needed */}
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
              marginTop: '20px'
            }}
          >
            Download CSV
          </button>
        </div>
      ) : (
        <p>No user data available. Please scan a QR code first.</p>
      )}
    </div>
  );
}

export default DownloadList;