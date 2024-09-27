import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import { getUserById, storeUserScanData, getUserScanData, storeScannedIds, getScannedIds, clearUserData } from '../utils/airtableUtils';
import Modal from './Modal'; // Import the modal component

function Scanner({ username }) {
  const [scanResult, setScanResult] = useState(null);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [scannedIds, setScannedIds] = useState(new Set());
  const [modalUser, setModalUser] = useState(null); // State for modal user data
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(getUserScanData(username));
    setScannedIds(getScannedIds(username));
  }, [username]);

  const handleScan = async (data) => {
    if (data) {
      const scannedId = data.text;
      setScanResult(scannedId);

      if (scannedIds.has(scannedId)) {
        setError('This QR code has already been scanned.');
        return;
      }

      try {
        const user = await getUserById(scannedId);
        console.log('Fetched user data:', user);
        
        storeUserScanData(username, user);
        setUserData(prevData => [...prevData, user]);

        const newScannedIds = new Set(scannedIds).add(scannedId);
        setScannedIds(newScannedIds);
        storeScannedIds(username, newScannedIds);

        setError(null);
        setModalUser(user); // Set the user data to show in the modal
        setIsModalOpen(true); // Open the modal
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

  const goToDownloadList = () => {
    navigate('/download');
  };

  const clearAllData = () => {
    clearUserData(username);
    setUserData([]);
    setScannedIds(new Set());
    setError(null);
    setScanResult(null);
    alert('All data has been cleared.');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalUser(null); // Clear modal user data on close
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
      {scanResult && <p>Last Scanned QR Code: {scanResult}</p>}
      
      {userData.length > 0 && (
        <div>
          <h3>Scanned User Data:</h3>
          <ul>
            {userData.map((user, index) => (
              <li key={index}>
                {user['First name']} {user['Last name']} - Email: {user['Email']} - Phone Number: {user['Phone Number']}
                <br />
                Scanned at: {new Date(user.scanTimestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        onClick={goToDownloadList}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
          marginRight: '10px'
        }}
      >
        Go to Download List
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
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Clear All Data
      </button>

      {/* Modal for displaying user data */}
      {isModalOpen && modalUser && (
        <Modal user={modalUser} onClose={closeModal} />
      )}
    </div>
  );
}

export default Scanner;