import styled from "styled-components";

// Container styles
export const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 60px);
  background-color: #f8f9fa;
  overflow: hidden;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const MainContent = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.sidebarVisible ? "280px" : "0")};
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: margin-left 0.3s ease;
  overflow-x: hidden;
  position: relative;
  width: ${(props) => (props.sidebarVisible ? "calc(100% - 280px)" : "100%")};
  right: 0;
  background-color: #fff;
  border-radius: 8px 0 0 0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    border-radius: 0;
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 0 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  height: calc(100% - 180px);
  padding-bottom: 100px; /* Increased from 40px to 100px for more bottom padding */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 20px;

  h1 {
    font-size: 32px;
    margin-bottom: 24px;
    color: #343541;
    font-weight: 600;
  }

  p {
    font-size: 16px;
    color: #6e6e80;
    max-width: 600px;
    margin-bottom: 32px;
    line-height: 1.6;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
`;

export const Tab = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.active ? "#0d6efd" : "#6c757d")};
  border-bottom: 2px solid
    ${(props) => (props.active ? "#0d6efd" : "transparent")};
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

export const FooterInfo = styled.div`
  text-align: center;
  padding: 8px 0 8px;
  font-size: 12px;
  color: #6c757d;
  margin-top: 8px;

  a {
    color: #0d6efd;
    text-decoration: none;
    margin: 0 4px;
  }
`;

export const ThinkModeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 0 16px;
  font-size: 14px;
  color: #6c757d;
`;

export const InfoTooltip = styled.span`
  position: relative;
  display: inline-block;
  margin-left: 8px;
  cursor: help;

  &:before {
    content: "?";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background-color: #6c757d;
    border-radius: 50%;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  &:hover:after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #343a40;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 100;
    margin-bottom: 5px;
    width: max-content;
    max-width: 250px;
  }
`;

export const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;

  svg {
    margin-right: 8px;
  }

  &:hover {
    color: #0d6efd;
  }
`;
