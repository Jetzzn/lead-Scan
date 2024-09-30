import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar({ userData, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (location.pathname === "/dashboard") {
      // If already on dashboard, do nothing
      return;
    }
    navigate(-1); // Navigate to the previous page
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img
          src={require("../assets/OCSC-EXPO-LOGO.png")}
          alt="Logo"
          style={styles.logo}
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
        />
      </div>
      <div style={{ position: "relative" }}>
        <button onClick={toggleDropdown} style={styles.profileButton}>
          <FontAwesomeIcon icon={faUser} />
        </button>
        {showDropdown && userData && (
          <div style={styles.dropdown}>
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
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    flex: 1,
    cursor: "pointer",
  },
  logo: {
    height: "40px",
    width: "auto",
    transition: "opacity 0.3s ease",
  },
  profileButton: {
    background: "#EFA91D",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
    padding: "10px 20px",
    borderRadius: "25px",
    transition: "background-color 0.3s ease",
  },
  profileButtonHover: {
    backgroundColor: "#D69017",
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
    animation: "fadeIn 0.3s ease-in-out",
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
    transition: "background-color 0.3s ease",
  },
  logoutButtonHover: {
    backgroundColor: "#d32f2f",
  },
};

export default Navbar;
