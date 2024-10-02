import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: #FFFFFF;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 1024px) {
    padding: 15px;
  }
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 45px;
  width: auto;

  @media (max-width: 768px) {
    height: 35px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: #333;
  font-size: 18px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background-color: #3498db;
    transition: width 0.3s ease;
  }

  &:hover::after, &.active::after {
    width: 100%;
  }

  &:hover {
    color: #3498db;
  }

  &.active {
    color: #3498db;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px; // Increased from 20px to 40px

  @media (max-width: 768px) {
    gap: 25px; // Increased from 15px to 25px for mobile screens
  }
`;

const ProfileButton = styled.button`
  background: #3498db;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 25px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 16px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;

  @media (max-width: 768px) {
    width: calc(100% - 30px);
    right: 15px;
    left: auto;
    max-width: 300px;
  }
`;

const DropdownTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
`;

const DropdownText = styled.p`
  margin: 5px 0;
  font-size: 14px;
  color: #555;
`;

const LogoutButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  width: 100%;

  &:hover {
    background-color: #d32f2f;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-100%'};
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SidebarCloseButton = styled.button`
  align-self: flex-end;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const SidebarNavButton = styled(NavButton)`
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
`;

function Navbar({ userData, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      <NavbarContainer>
        <LogoContainer>
          <Logo
            src={require("../assets/OCSC-EXPO-LOGO.png")}
            alt="Logo"
            onClick={() => handleNavigation("/")}
            role="button"
            tabIndex={0}
          />
        </LogoContainer>
        <TabContainer>
          <NavButton
            onClick={() => handleNavigation("/scanner")}
            className={location.pathname === "/scanner" ? "active" : ""}
          >
            Scanner
          </NavButton>
          <NavButton
            onClick={() => handleNavigation("/download")}
            className={location.pathname === "/download" ? "active" : ""}
          >
            Download List
          </NavButton>
        </TabContainer>
        <RightContainer>
          <MenuButton onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </MenuButton>
          <ProfileButton onClick={toggleDropdown} ref={profileButtonRef}>
            <FontAwesomeIcon icon={faUser} />
          </ProfileButton>
        </RightContainer>
        {showDropdown && userData && (
          <Dropdown ref={dropdownRef}>
            <DropdownTitle>User Profile</DropdownTitle>
            <DropdownText>
              <strong>Username:</strong> {userData.Username}
            </DropdownText>
            <DropdownText>
              <strong>Institution:</strong> {userData.Institution}
            </DropdownText>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </Dropdown>
        )}
      </NavbarContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarCloseButton onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </SidebarCloseButton>
        <SidebarNavButton
          onClick={() => handleNavigation("/scanner")}
          className={location.pathname === "/scanner" ? "active" : ""}
        >
          Scanner
        </SidebarNavButton>
        <SidebarNavButton
          onClick={() => handleNavigation("/download")}
          className={location.pathname === "/download" ? "active" : ""}
        >
          Download List
        </SidebarNavButton>
      </Sidebar>
    </>
  );
}

export default Navbar;