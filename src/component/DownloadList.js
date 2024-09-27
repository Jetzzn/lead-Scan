import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserScanData, clearUserData } from "../utils/airtableUtils";

function DownloadList({ username }) {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    const data = await getUserScanData(username);
    console.log("Loaded data:", data); // For debugging
    setUserData(data);
  };

  const handleDownload = () => {
    if (userData.length === 0) return;

    const headers = [
      "ID",
      "First name",
      "Last name",
      "Email",
      "Phone Number",
      "Scan Time",
    ];
    const csvContent = [
      headers.join(","),
      ...userData.map((user) =>
        [
          user.id,
          user["First name"],
          user["Last name"],
          user["Email"],
          user["Phone Number"],
          new Date(user.scanTimestamp).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${username}_scanned_data.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAllData = () => {
    clearUserData(username);
    setUserData([]);
    alert("All your scanned data has been cleared.");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredData = userData.filter((user) =>
    Object.values(user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Scanned QR Code Data</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />

      {filteredData.length > 0 ? (
        <div>
          <button onClick={handleDownload} style={styles.downloadButton}>
            Download CSV
          </button>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>First Name</th>
                  <th style={styles.tableHeader}>Last Name</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Phone Number</th>
                  <th style={styles.tableHeader}>Scan Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, index) => (
                  <tr
                    key={index}
                    style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                  >
                    <td style={styles.tableCell}>{user.id}</td>
                    <td style={styles.tableCell}>{user["First name"]}</td>
                    <td style={styles.tableCell}>{user["Last name"]}</td>
                    <td style={styles.tableCell}>{user["Email"]}</td>
                    <td style={styles.tableCell}>{user["Phone Number"]}</td>
                    <td style={styles.tableCell}>
                      {new Date(user.scanTimestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.clearButtonContainer}>
            <button onClick={clearAllData} style={styles.clearButton}>
              Clear All Data
            </button>
          </div>
        </div>
      ) : (
        <p style={styles.noDataMessage}>
          No scanned data available or no matches found for your search.
        </p>
      )}
      <button onClick={() => navigate("/scanner")} style={styles.scannerButton}>
        Go to Scanner
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  tableContainer: {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    fontSize: "16px",
    borderBottom: "2px solid #0056b3",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableRowOdd: {
    backgroundColor: "#fff",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
  },
  downloadButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  clearButtonContainer: {
    marginTop: "30px",
    marginBottom: "40px", // Added more space between buttons
  },
  clearButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  scannerButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  noDataMessage: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default DownloadList;
