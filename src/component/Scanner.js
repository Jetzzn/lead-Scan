import React, { useState, useEffect, useCallback } from "react";
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
  const [key, setKey] = useState(0);
  const navigate = useNavigate();
  const [facingMode, setFacingMode] = useState("environment"); // Default to back camera

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

  const resetScanner = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);
    setKey((prevKey) => prevKey + 1);
  }, []);

  const handleScan = useCallback(
    async (data) => {
      if (data && isScanning) {
        setIsScanning(false);
        const scannedId = data.text;
        setScanResult(scannedId);

        try {
          if (scannedIds.has(scannedId)) {
            setError("This QR code has already been scanned.");
            setTimeout(resetScanner, 3000);
          } else {
            const user = await getUserById(scannedId);
            await storeUserScanData(username, user);
            setUserData((prevData) => [...prevData, user]);
            setScannedIds((prevIds) => new Set(prevIds).add(scannedId));
            setError(null);
            setModalUser(user);
            setIsModalOpen(true);
            // Automatic reset after successful scan
            setTimeout(resetScanner, 3000);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data. Please try again.");
          setTimeout(resetScanner, 3000);
        }
      }
    },
    [isScanning, scannedIds, username, resetScanner]
  );

  const handleError = useCallback(
    (err) => {
      console.error(err);
      setError("Error scanning QR code. Please try again.");
      setTimeout(resetScanner, 3000);
    },
    [resetScanner]
  );
  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === "environment" ? "user" : "environment");
    setKey(prevKey => prevKey + 1); // Force re-render of QrScanner
  };
  const goToDownloadList = () => {
    navigate("/download");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalUser(null);
    resetScanner();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>QR Code Scanner</h2>
      {username ? (
        <>
          <div style={styles.scannerContainer}>
            <QrScanner
              key={key}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={styles.scanner}
              constraints={{
                video: { facingMode: facingMode },
              }}
            />
          </div>
          {error && <p style={styles.errorMessage}>{error}</p>}
          {scanResult && (
            <p style={styles.scanResult}>Last Scanned QR Code: {scanResult}</p>
          )}

          <div style={styles.buttonContainer}>
            <button onClick={goToDownloadList} style={styles.button}>
              Go to Download List
            </button>
            <button onClick={toggleCamera} style={styles.button}>
              Switch Camera
            </button>
          </div>

          {userData.length > 0 && (
            <div>
              <h3>Scanned User Data:</h3>
              <ul>
                {userData.map((user, index) => (
                  <li key={index}>
                    {user["First name"]} {user["Last name"]} - Email:{" "}
                    {user["Email"]}
                    <br />
                    Scanned at: {new Date(user.scanTimestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p style={styles.loginMessage}>Please log in to use the scanner.</p>
      )}

      {isModalOpen && modalUser && (
        <Modal user={modalUser} onClose={closeModal} />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "100px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "clamp(24px, 5vw, 32px)",
    color: "#2c3e50",
    marginBottom: "3vh",
    textAlign: "center",
    fontWeight: "600",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "4%",
    "@media (max-width: 1024px)": {
      flexDirection: "column",
    },
  },
  scannerSection: {
    flex: "1 1 50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  scannerContainer: {
    width: "100%",
    maxWidth: "500px",
    aspectRatio: "1 / 1",
    margin: "0 auto 3vh",
    "@media (max-width: 768px)": {
      maxWidth: "100%",
    },
  },
  scanner: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dataSection: {
    flex: "1 1 50%",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: "2vh",
    fontSize: "clamp(14px, 2.5vw, 16px)",
  },
  scanResult: {
    textAlign: "center",
    marginBottom: "2vh",
    fontSize: "clamp(14px, 2.5vw, 16px)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3vh",
    gap: "2vh",
  },
  button: {
    flex: "1 1 auto",
    padding: "12px 25px",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    backgroundColor: "#3498db",
    color: "#ffffff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
  },
};

export default Scanner;
