import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar({ userData, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Close dropdown if clicked outside
      }
    };

    // Add event listener when dropdown is shown
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener on component unmount or when dropdown is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img
          src={require("../assets/OCSC-EXPO-LOGO.png")}
          alt="Logo"
          style={styles.logo}
          onClick={() => handleNavigation("/")}
          role="button"
          tabIndex={0}
        />
      </div>
      <div style={styles.tabContainer}>
        <button
          onClick={() => handleNavigation("/scanner")}
          style={{
            ...styles.navButton,
            ...(location.pathname === "/scanner" ? styles.activeButton : {}),
          }}
        >
          Scanner
        </button>
        <button
          onClick={() => handleNavigation("/download")}
          style={{
            ...styles.navButton,
            ...(location.pathname === "/download" ? styles.activeButton : {}),
          }}
        >
          Download List
        </button>
      </div>
      <div style={styles.profileContainer}>
        <button onClick={toggleDropdown} style={styles.profileButton}>
          <FontAwesomeIcon icon={faUser} />
        </button>
        {showDropdown && userData && (
          <div ref={dropdownRef} style={styles.dropdown}>
            <h3 style={styles.dropdownTitle}>User Profile</h3>
            <p style={styles.dropdownText}>
              <strong>Username:</strong> {userData.Username}
            </p>
            <p style={styles.dropdownText}>
              <strong>Institution:</strong> {userData.Institution}
            </p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "#FFFFFF",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#333",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  logoContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    cursor: "pointer",
  },
  logo: {
    height: "45px",
    width: "auto",
  },
  tabContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    gap: "40px",
  },
  navButton: {
    background: "transparent",
    border: "none",
    color: "#333",
    fontSize: "18px",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "20px",
    transition: "all 0.3s ease",
    letterSpacing: "1px",
  },
  activeButton: {
    background: "rgba(0, 0, 0, 0.1)",
  },
  profileContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  profileButton: {
    background: "#3498db",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
    padding: "10px 20px",
    borderRadius: "25px",
    transition: "background-color 0.3s ease",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "250px",
  },
  dropdownTitle: {
    margin: "0 0 10px",
    fontSize: "18px",
    color: "#333",
  },
  dropdownText: {
    margin: "5px 0",
    fontSize: "16px",
    color: "#555",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default Navbar;
