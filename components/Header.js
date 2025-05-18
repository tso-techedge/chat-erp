import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #0a3977;
  color: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #062c5e;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
`;

const LogoIcon = styled.div`
  margin-right: 10px;
`;

const MenuButtonContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  min-width: 220px;
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  overflow: hidden;
  border: 1px solid #f0f0f0;
`;

const MenuItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #343a40;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;

  &:hover {
    background-color: #f8f9fa;
  }

  svg {
    margin-right: 10px;
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: #e9ecef;
  margin: 4px 0;
`;

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
  // Function to handle starting a new chat
  const handleNewChat = () => {
    // You can implement this functionality or link to the new chat page
    setMenuOpen(false);
    // Trigger new chat functionality from ChatInterface component
    if (window.startNewSession) {
      window.startNewSession();
    }
  };
  
  // Function to clear conversations
  const handleClearConversations = () => {
    setMenuOpen(false);
    // Clear localStorage chat history
    localStorage.removeItem('chatERP-history');
    // Reload the page to reset the UI
    window.location.reload();
  };
  
  return (
    <HeaderContainer>
      <Logo as={Link} href="/" style={{ textDecoration: 'none', color: 'white', cursor: 'pointer' }}>
        <LogoIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2" />
          </svg>
        </LogoIcon>
        ChatERP
      </Logo>
      <Link href="/chat" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Chat
      </Link>
      <MenuButtonContainer ref={menuRef}>
        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M4 12h16m-7 6h7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </MenuButton>
        
        <DropdownMenu isOpen={menuOpen}>
          <MenuItem onClick={handleNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Chat
          </MenuItem>
          
          <MenuItem as={Link} href="/settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15c1.93 0 3.5-1.57 3.5-3.5S13.93 8 12 8s-3.5 1.57-3.5 3.5S10.07 15 12 15z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Settings
          </MenuItem>
          

          
          <MenuItem as="a" href="/help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Help & FAQ
          </MenuItem>
        </DropdownMenu>
      </MenuButtonContainer>
    </HeaderContainer>
  );
}

export default Header;
