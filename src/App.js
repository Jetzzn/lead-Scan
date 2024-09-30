import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import Scanner from "./component/Scanner";
import DownloadList from "./component/DownloadList";
import Navbar from "./component/Navbar";
import { getUserProfile,checkDeviceLimit,removeDeviceLogin   } from "./utils/airtableUtils";
import "./App.css";
import Banner from "./component/Banner";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUserData = localStorage.getItem("userData");

    if (storedLoginStatus === "true" && storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (checkDeviceLimit(userData.username, userData.deviceId)) {
        setIsLoggedIn(true);
        setUserData(userData);
      } else {
        // Force logout if device limit is exceeded
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn && userData?.username) {
        try {
          const profile = await getUserProfile(userData.username);
          setUserData(prevData => ({ ...prevData, ...profile }));
          localStorage.setItem("userData", JSON.stringify({ ...userData, ...profile }));
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, userData?.username]);

  
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const handleLogout = async () => {
    if (userData && userData.username && userData.deviceId) {
      try {
        await removeDeviceLogin(userData.username, userData.deviceId);
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
        // Navigate to login page or perform any other necessary actions
      } catch (error) {
        console.error('Logout error:', error);
        // Handle logout error (e.g., show an error message to the user)
      }
    } else {
      console.error('Unable to logout: User data is missing');
      // Handle the case where user data is missing
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
    }
  };
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
        <div style={styles.app}>
        {isLoggedIn && (
          <>
            <Navbar userData={userData} onLogout={handleLogout} />
            <Banner /> {/* Add the Banner component here */}
          </>
        )}
        <div style={styles.container}>
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scanner"
              element={
                <ProtectedRoute>
                  <Scanner username={userData?.username} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/download"
              element={
                <ProtectedRoute>
                  <DownloadList username={userData?.username} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0',
    boxSizing: 'border-box',
    minHeight: '100vh',
    backgroundColor: '#FFD300', // Yellow background
  },
  container: {
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      padding: '0 10px',
    },
  },
};
export default App;