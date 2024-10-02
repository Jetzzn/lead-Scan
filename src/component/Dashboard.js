import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faSearch } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const navigate = useNavigate();

  const styles = {
    container: {
      padding: "clamp(20px, 5vw, 100px)",
      maxWidth: "1050px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    },
   
    // content: {
    //   backgroundColor: '#FFFFFF',
    //   padding: '100px 350px',
    //   // borderRadius: '12px',
    //   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    //   textAlign: 'center',
    //   maxWidth: '500px',
    //   width: '100%',
    // },
    title: {
      fontSize: "clamp(24px, 5vw, 32px)",
      color: "#2c3e50",
      marginBottom: "3vh",
      textAlign: "center",
      fontWeight: "600",
    },
    subtitle: {
      fontSize: "clamp(12px, 2vw, 18px)",
      color: "#2c3e50",
      marginBottom: "3vh",
      textAlign: "center",
      fontWeight: "600",
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    },
    button: {
      padding: '15px 20px',
      fontSize: '18px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '300px',
    },
    icon: {
      marginRight: '10px',
    },
  };

  return (
    <div style={styles.container}>
      {/* <img 
        src="/path-to-your-banner-image.jpg" 
        alt="OCSC International Education Expo 2024" 
        style={styles.banner}
      /> */}
      <div style={styles.content}>
        <h1 style={styles.title}>OCSC International Education Expo 2024</h1>
        <h2 style={styles.subtitle}>Event Check-In System</h2>
        <div style={styles.buttonContainer}>
          <button 
            style={styles.button}
            onClick={() => navigate('/scanner')}
          >
            <FontAwesomeIcon icon={faQrcode} style={styles.icon} />
            Scan QR Code
          </button>
          <button 
            style={styles.button}
            onClick={() => navigate('/download')}
          >
            <FontAwesomeIcon icon={faSearch} style={styles.icon} />
            Download list
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;