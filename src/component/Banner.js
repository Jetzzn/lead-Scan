import React from 'react';
import bannerImage from "../assets/OCSCEXPO2024_Banner.jpg";

const Banner = () => {
  return (
    <div style={styles.bannerContainer}>
      <img
        src={bannerImage}
        alt="OCSC EXPO 2024 Banner"
        style={styles.bannerImage}
      />
    </div>
  );
};

const styles = {
    bannerContainer: {
      width: '100%',
    //   backgroundColor: '#FFD300',
      padding: '5px 0',
      textAlign: 'center',
      boxSizing: 'border-box',
    },
    bannerImage: {
      width: '100%',
      maxWidth: '1200px',
      height: 'auto',
      objectFit: 'contain',
    },
  };
  

export default Banner;