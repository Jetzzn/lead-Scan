import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserScanData, clearUserData } from "../utils/airtableUtils";

function DownloadList({ username }) {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!username) {
      navigate("/login"); // Redirect to login page if no username
      return;
    }
    loadData();
  }, [username, navigate]);

  const loadData = async () => {
    if (username) {
      try {
        setLoading(true);
        const data = await getUserScanData(username);
        console.log("Loaded data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load scanned data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
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

  const clearAllData = async () => {
    try {
      await clearUserData(username);
      setUserData([]);
      alert("All your scanned data has been cleared.");
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Failed to clear data. Please try again.");
    }
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
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Scanned QR Code Data</h2>
      {username ? (
        <>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.buttonContainer}>
            <button onClick={() => navigate("/scanner")} style={styles.scannerButton}>
              Back to Scanner
            </button>
            {filteredData.length > 0 && (
              <button onClick={handleDownload} style={styles.downloadButton}>
                Download CSV
              </button>
            )}
          </div>

          {loading ? (
            <p style={styles.loadingMessage}>Loading...</p>
          ) : paginatedData.length > 0 ? (
            <>
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
                    {paginatedData.map((user, index) => (
                      <tr key={user.id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                        <td style={styles.tableCell}>{user.id}</td>
                        <td style={styles.tableCell}>{user["First name"]}</td>
                        <td style={styles.tableCell}>{user["Last name"]}</td>
                        <td style={styles.tableCell}>{user["Email"]}</td>
                        <td style={styles.tableCell}>{user["Phone Number"]}</td>
                        <td style={styles.tableCell}>{new Date(user.scanTimestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.paginationContainer}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === page ? styles.activePaginationButton : {})
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <div style={styles.clearButtonContainer}>
                <button onClick={clearAllData} style={styles.clearButton}>
                  Clear All Data
                </button>
              </div>
            </>
          ) : (
            <p style={styles.noDataMessage}>
              No scanned data available or no matches found for your search.
            </p>
          )}
        </>
      ) : (
        <p style={styles.loginMessage}>Please log in to view your scanned data.</p>
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
    marginBottom: "4vh",
    textAlign: "center",
    fontWeight: "600",
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '4vh',
    width: '100%',
  },
  searchInput: {
    width: '97%',
    padding: '12px 20px',
    borderRadius: '25px',
    border: '1px solid #bdc3c7',
    fontSize: '16px',
    backgroundColor: '#f5f5f5',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4vh",
    gap: "2vh",
    flexWrap: "wrap",
  },
  button: {
    flex: "1 1 200px",
    padding: "12px 25px",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    backgroundColor: "#3498db",
    color: "#ffffff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
    '&:hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
  },
  scannerButton: {
    flex: "1 1 200px",
    padding: "12px 25px",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    backgroundColor: "#3498db",
    color: "#ffffff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
    '&:hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
  },
  downloadButton: {
      flex: "1 1 200px",
      padding: "12px 25px",
      fontSize: "clamp(14px, 2.5vw, 16px)",
      backgroundColor: "#4BD1A0",
      color: "#ffffff",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
      '&:hover': {
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
      },
  },
  clearButton:{
    
    flex: "1 1 200px",
    padding: "12px 25px",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    backgroundColor: "#FF4040",
    color: "#ffffff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
    '&:hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: "4vh",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    textAlign: "left",
    backgroundColor: "#ffffff",
  },
  tableHeader: {
    backgroundColor: "#3498db",
    color: "#ffffff",
    padding: "15px 20px",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    whiteSpace: "nowrap",
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableCell: {
    padding: "15px 20px",
    borderBottom: "1px solid #ecf0f1",
    fontSize: "clamp(12px, 2vw, 14px)",
    color: "#34495e",
    whiteSpace: "nowrap",
  },
  clearButtonContainer: {
    textAlign: "center",
  },
  loadingMessage: {
    textAlign: "center",
    fontSize: "clamp(16px, 3vw, 18px)",
    color: "#7f8c8d",
  },
  noDataMessage: {
    textAlign: "center",
    fontSize: "clamp(16px, 3vw, 18px)",
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  loginMessage: {
    textAlign: "center",
    fontSize: "clamp(16px, 3vw, 18px)",
    color: "#7f8c8d",
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '20px'
  },
  paginationButton: {
    padding: '8px 12px',
    border: '1px solid #3498db',
    backgroundColor: 'white',
    color: '#3498db',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  activePaginationButton: {
    backgroundColor: '#3498db',
    color: 'white',
  },
};
export default DownloadList;
