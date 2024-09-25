import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import { getUserById } from '../utils/airtableUtils';

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data.text);
      try {
        const user = await getUserById(data.text);
        console.log('Fetched user data:', user);
        // Store the user data in localStorage
        localStorage.setItem('scannedUserData', JSON.stringify(user));
        // Navigate to the Download List page
        navigate('/download');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again.');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error scanning QR code. Please try again.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>QR Code Scanner</h2>
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {scanResult && <p>Scanned QR Code: {scanResult}</p>}
    </div>
  );
}

export default Scanner;