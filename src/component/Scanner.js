import React, { useState, useEffect,useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import {
  getUserById,
  storeUserScanData,
  getUserScanData,
  clearUserData,
} from "../utils/airtableUtils";
import Modal from "./Modal"; // Import the modal component

function Scanner({ username }) {
  const [scanResult, setScanResult] = useState(null);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedIds, setScannedIds] = useState(new Set());
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (username) {
  //     loadUserData();
  //   }
  // }, [username]);

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }
    loadUserData();
  }, [username, navigate]);
  const loadUserData = async () => {
    try {
      const data = await getUserScanData(username);
      setUserData(data);
      setScannedIds(new Set(data.map((user) => user.id)));
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data. Please try again.");
    }
  };

  const handleScan = useCallback(async (data) => {
    if (data && isScanning) {
      setIsScanning(false);  // Disable scanning immediately
      const scannedId = data.text;
      setScanResult(scannedId);

      if (scannedIds.has(scannedId)) {
        setError("This QR code has already been scanned.");
        setTimeout(() => setIsScanning(true), 3000);  // Re-enable scanning after 3 seconds
        return;
      }

      try {
        const user = await getUserById(scannedId);
        await storeUserScanData(username, user);
        setUserData(prevData => [...prevData, user]);
        setScannedIds(prevIds => new Set(prevIds).add(scannedId));
        setError(null);
        setModalUser(user);
        setIsModalOpen(true);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setTimeout(() => setIsScanning(true), 3000);  // Re-enable scanning after 3 seconds
      }
    }
  }, [isScanning, scannedIds, username]);
  const handleError = useCallback((err) => {
    console.error(err);
    setError("Error scanning QR code. Please try again.");
  }, []);

  const goToDownloadList = () => {
    navigate("/download");
  };

  const clearAllData = async () => {
    try {
      await clearUserData(username);
      setUserData([]);
      setScannedIds(new Set());
      setError(null);
      setScanResult(null);
      alert("All data has been cleared.");
    } catch (error) {
      console.error("Error clearing data:", error);
      setError("Failed to clear data. Please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalUser(null);
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>QR Code Scanner</h2>
      {username ? (
        <>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
        </>
      ) : (
        <p>Please log in to use the scanner.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {scanResult && <p>Last Scanned QR Code: {scanResult}</p>}

      {userData.length > 0 && (
        <div>
          <h3>Scanned User Data:</h3>
          <ul>
            {userData.map((user, index) => (
              <li key={index}>
                {user["First name"]} {user["Last name"]} - Email:{" "}
                {user["Email"]} - Phone Number: {user["Phone Number"]}
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
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
          marginRight: "10px",
        }}
      >
        Go to Download List
      </button>
      <button
        onClick={clearAllData}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Clear All Data
      </button>

      {isModalOpen && modalUser && (
        <Modal user={modalUser} onClose={closeModal} />
      )}
    </div>
  );
}

export default Scanner;
