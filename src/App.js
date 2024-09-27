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
import { getUserProfile } from "./utils/airtableUtils";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUserData = localStorage.getItem("userData");

    if (storedLoginStatus === "true" && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        {isLoggedIn && <Navbar userData={userData} onLogout={handleLogout} />}
        <div className="container">
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

export default App;