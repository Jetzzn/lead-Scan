import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faDownload } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Container = styled.div`
  padding: clamp(20px, 5vw, 100px);
  max-width: 1010px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: clamp(24px, 5vw, 32px);
  color: #2c3e50;
  margin-bottom: 3vh;
  text-align: center;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  font-size: clamp(12px, 2vw, 18px);
  color: #2c3e50;
  margin-bottom: 5vh;
  text-align: center;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(20px, 4vw, 40px);
  margin: 0 auto;
  flex-wrap: wrap;
`;

const Button = styled.button`
  width: clamp(100px, 20vw, 150px);
  height: clamp(100px, 20vw, 150px);
  font-size: clamp(24px, 5vw, 48px);
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: clamp(10px, 2vw, 20px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #2980b9;
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>OCSC International Education Expo 2024</Title>
      <Subtitle>Event Check-In System</Subtitle>
      <ButtonContainer>
        <Button 
          onClick={() => navigate('/scanner')}
          aria-label="Scan QR Code"
        >
          <FontAwesomeIcon icon={faQrcode} />
        </Button>
        <Button 
          onClick={() => navigate('/download')}
          aria-label="Download List"
        >
          <FontAwesomeIcon icon={faDownload} />
        </Button>
      </ButtonContainer>
    </Container>
  );
}

export default Dashboard;