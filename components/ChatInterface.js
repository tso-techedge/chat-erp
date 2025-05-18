import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ChatService from "../app/utils/ChatService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Sidebar = styled.div`
  width: 280px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow: hidden;
  z-index: 50;
  padding-bottom: 20px;
  height: calc(100vh - 60px);
`;

const ChatHistory = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ChatItem = styled.div`
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #e9ecef;
  }
  
  .chat-item-content {
    flex: 1;
    overflow: hidden;
  }

  .date {
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 4px;
  }

  .title {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #e9ecef;
    border-left: 3px solid #0d6efd;
  `}
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
  padding: 0;
  visibility: hidden;
  
  ${ChatItem}:hover & {
    visibility: visible;
  }
  
  &:hover {
    background-color: #dc3545;
    color: white;
    opacity: 1;
  }
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  width: calc(100% - 20px);
  height: 40px;

  &:hover {
    background-color: #0b5ed7;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  svg {
    margin-right: 8px;
  }
`;

const MainContent = styled.div`
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

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  position: relative;
  height: calc(100% - 140px); /* Account for input area and tabs */
  padding-bottom: 20px; /* Add extra padding at the bottom */
`;

const WelcomeMessage = styled.div`
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

const ClearButton = styled.button`
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  margin-top: 16px;
  
  &:hover {
    background-color: #e9ecef;
    color: #212529;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const Message = styled.div`
  width: 100%;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.isUser ? "white" : "#f7f7f8")};
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
  align-items: center;
`;

const MessageContent = styled.div`
  max-width: 800px;
  width: 100%;
  color: ${(props) => (props.isUser ? "#343541" : "#343541")};
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
  background-color: ${props => props.isUser ? 'transparent' : 'white'};
  border-radius: 8px;
  padding: ${props => props.isUser ? '0' : '16px'};

  /* Markdown styling */
  & p {
    margin: 0 0 16px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }

  & a {
    color: ${(props) => (props.isUser ? "white" : "#0d6efd")};
    text-decoration: underline;
  }

  & code {
    font-family: monospace;
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)"};
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
  }

  & pre {
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
    border-radius: 4px;
    padding: 8px 12px;
    overflow-x: auto;
    margin: 10px 0;
  }

  & pre code {
    background-color: transparent;
    padding: 0;
  }

  & ul,
  & ol {
    margin: 10px 0;
    padding-left: 24px;
  }

  & blockquote {
    border-left: 4px solid
      ${(props) => (props.isUser ? "rgba(255, 255, 255, 0.3)" : "#ced4da")};
    margin: 10px 0;
    padding-left: 12px;
    color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.9)" : "#6c757d"};
  }

  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin-top: 16px;
    margin-bottom: 10px;
    font-weight: 600;
  }

  & table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
  }

  & th,
  & td {
    border: 1px solid
      ${(props) => (props.isUser ? "rgba(255, 255, 255, 0.2)" : "#dee2e6")};
    padding: 6px 8px;
    text-align: left;
  }

  & th {
    background-color: ${(props) =>
      props.isUser ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.03)"};
  }
`;

const ThinkContent = styled.div`
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #476582;
  white-space: pre-wrap;
  overflow-x: auto;
  border-left: 3px solid #a8c6df;
  font-family: monospace;
  line-height: 1.6;
  width: 100%;
  max-width: 800px;
`;

const ThinkHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #3c5a80;

  span {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 6px;
    }
  }
`;

const InputArea = styled.div`
  width: 100%;
  border-top: 1px solid #f0f0f0;
  padding: 16px 16px 32px;
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  padding: 10px 16px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  transition: all 0.2s ease;
  margin-bottom: 10px;
  
  &:focus-within {
    border-color: #0d6efd;
    box-shadow: 0 4px 16px rgba(13, 110, 253, 0.15);
  }
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  padding: 8px 0;
  font-size: 16px;
  min-height: 24px;
  max-height: 200px;
  overflow-y: auto;
  font-family: inherit;
  background-color: transparent;
  line-height: 1.5;
  color: #343541;
  transition: all 0.2s ease;
  margin: 0 8px;
  
  &::placeholder {
    color: #a0a0a0;
    opacity: 0.8;
  }
  
  &:focus::placeholder {
    opacity: 0.5;
  }
  
  &:disabled {
    background-color: #e5e5e5;
    color: #8e8ea0;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background-color: #10a37f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  
  &:hover:not(:disabled) {
    background-color: #0d8a6c;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #e5e5e5;
    color: #8e8ea0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const InputActions = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
  padding-right: 8px;
  border-right: 1px solid #e5e5e5;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 4px;
  transition: all 0.2s ease;
  padding: 0;
  
  &:hover {
    background-color: #f0f0f0;
    color: #0d6efd;
  }
  
  &:active {
    background-color: #e9ecef;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
`;

const CurrentAdvisorBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  margin: 8px auto;
  background-color: #e9ecef;
  border-radius: 16px;
  font-size: 13px;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  width: fit-content;
  max-width: 800px;
  z-index: 10;

  &:hover {
    background-color: #dee2e6;
  }

  svg {
    margin-right: 6px;
    color: #0a3977;
  }
`;

const ThemeDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 8px;
  overflow: hidden;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  svg {
    margin-right: 10px;
    color: #0a3977;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #e9ecef;
    font-weight: 500;
  `}
`;

const SidebarToggle = styled.button`
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

const InfoTooltip = styled.span`
  position: relative;
  display: inline-block;
  margin-left: 8px;
  cursor: help;
  
  &:before {
    content: '?';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #6c757d;
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

const ThinkModeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 0 16px;
  font-size: 14px;
  color: #6c757d;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin-left: 8px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 20px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #0d6efd;
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

const Tab = styled.div`
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

const FooterInfo = styled.div`
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

const ChatInterface = ({ advisor }) => {
  const router = useRouter();

  // Define available advisor themes
  const advisorThemes = [
    {
      id: "general",
      name: "General Assistant",
      icon: "globe",
      description: "General ERP assistant for all business processes",
    },
    {
      id: "document-analyzer",
      name: "Document Analyzer",
      icon: "document",
      description: "Helps analyze long and complex documents",
    },
    {
      id: "ask-controllers",
      name: "Financial Controller",
      icon: "finance",
      description: "Provides guidance on financial statements and US GAAP",
    },
    {
      id: "askcba",
      name: "Budget & Admin",
      icon: "budget",
      description:
        "Assists with Budget, Administration, Procurement, and Real Estate policies",
    },
    {
      id: "blended-finance",
      name: "Blended Finance",
      icon: "blend",
      description:
        "Expert on blended finance combining public and private funds",
    },
    {
      id: "business-risk",
      name: "Business Risk",
      icon: "risk",
      description:
        "Helps with Business Risk and Compliance (BRC) policies and procedures",
    },
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [thinkMode, setThinkMode] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedThink, setExpandedThink] = useState({});
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);
  const themeDropdownRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate a new session ID if one doesn't exist
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `chat-session-${Date.now()}`;
      setSessionId(newSessionId);

      // Try to load existing session from localStorage
      const savedSession = localStorage.getItem(newSessionId);
      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession);
          if (parsedSession.messages && Array.isArray(parsedSession.messages)) {
            setMessages(parsedSession.messages);
          }
          if (parsedSession.advisor && parsedSession.advisor.id) {
            setActiveTab(parsedSession.advisor.id);
          }
          if (parsedSession.thinkMode !== undefined) {
            setThinkMode(parsedSession.thinkMode);
          }
        } catch (error) {
          console.error("Error parsing saved session:", error);
        }
      } else {
        // Load chat history if no current session exists
        loadChatHistory();
        
        // If no messages exist after loading history, add a test message
        if (messages.length === 0) {
          // Add a test message with thinking content
          const testUserMessage = {
            id: Date.now(),
            content: "test thinking",
            isUser: true,
            timestamp: new Date(),
          };
          
          const testAIMessage = {
            id: Date.now() + 1,
            content: `I need to analyze what the user is asking about testing or thinking functionality.

The user seems to be testing the thinking mode feature of the application.

I should provide information about how thinking mode works and demonstrate that the feature is functioning correctly.

I'll explain the purpose of thinking mode and how it can be useful for transparency.
</think>

I see you're testing the thinking mode feature! This is working correctly if you can see my thought process above this message. The thinking mode allows you to see how I analyze and process your questions before providing a final answer. It's useful for understanding my reasoning process and for debugging complex queries.`,
            isUser: false,
            timestamp: new Date(),
          };
          
          setMessages([testUserMessage, testAIMessage]);
        }
      }
    }
  }, []);

  // Save session to localStorage whenever messages, advisor, or thinkMode changes
  useEffect(() => {
    if (sessionId) {
      const sessionData = {
        messages,
        advisor: { id: activeTab },
        thinkMode,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(sessionId, JSON.stringify(sessionData));

      // Also update chat history
      saveChatHistory();
    }
  }, [messages, activeTab, thinkMode, sessionId]);

  // Add a test message with thinking content if no messages exist
  const addTestMessage = () => {
    if (messages.length === 0) {
      const testUserMessage = {
        id: Date.now(),
        content: "test thinking",
        isUser: true,
        timestamp: new Date(),
      };
      
      const testAIMessage = {
        id: Date.now() + 1,
        content: `I need to analyze what the user is asking about testing or thinking functionality.

The user seems to be testing the thinking mode feature of the application.

I should provide information about how thinking mode works and demonstrate that the feature is functioning correctly.

I'll explain the purpose of thinking mode and how it can be useful for transparency.
</think>

I see you're testing the thinking mode feature! This is working correctly if you can see my thought process above this message. The thinking mode allows you to see how I analyze and process your questions before providing a final answer. It's useful for understanding my reasoning process and for debugging complex queries.`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages([testUserMessage, testAIMessage]);
    }
  };
  
  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const chatHistoryData = localStorage.getItem("chatERP-history");
      if (chatHistoryData) {
        const history = JSON.parse(chatHistoryData);
        if (history.sessions && Array.isArray(history.sessions)) {
          // Update the chat history state for the sidebar
          setChatHistory(history.sessions);

          // If we have sessions in history but no current session,
          // load the most recent one
          if (history.sessions.length > 0 && history.sessions[0].sessionId) {
            const mostRecentSession = localStorage.getItem(
              history.sessions[0].sessionId
            );
            if (mostRecentSession) {
              try {
                const parsedSession = JSON.parse(mostRecentSession);
                if (
                  parsedSession.messages &&
                  Array.isArray(parsedSession.messages)
                ) {
                  setMessages(parsedSession.messages);
                  setSessionId(history.sessions[0].sessionId);
                  if (parsedSession.advisor && parsedSession.advisor.id) {
                    setActiveTab(parsedSession.advisor.id);
                  }
                  if (parsedSession.thinkMode !== undefined) {
                    setThinkMode(parsedSession.thinkMode);
                  }
                }
              } catch (error) {
                console.error("Error parsing most recent session:", error);
              }
            }
          }
        } else {
          setChatHistory([]);
        }
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setChatHistory([]);
    }
  };

  // Save chat history to localStorage
  const saveChatHistory = () => {
    try {
      // Get existing history or create new one
      const existingHistory = localStorage.getItem("chatERP-history");
      let history = { sessions: [] };

      if (existingHistory) {
        try {
          history = JSON.parse(existingHistory);
          if (!history.sessions) {
            history.sessions = [];
          }
        } catch (error) {
          console.error("Error parsing existing history:", error);
        }
      }

      // Check if current session is already in history
      const sessionIndex = history.sessions.findIndex(
        (s) => s.sessionId === sessionId
      );

      // Create session summary
      const sessionSummary = {
        sessionId,
        title:
          messages.length > 0
            ? messages[0].content.substring(0, 50) + "..."
            : "New Chat",
        lastUpdated: new Date().toISOString(),
        messageCount: messages.length,
      };

      // Update or add session to history
      if (sessionIndex !== -1) {
        history.sessions[sessionIndex] = sessionSummary;
      } else {
        // Add new session to the beginning of the array
        history.sessions.unshift(sessionSummary);
      }

      // Limit history to 10 most recent sessions
      history.sessions = history.sessions.slice(0, 10);

      // Save updated history
      localStorage.setItem("chatERP-history", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Clear current session and start a new one
  const startNewSession = () => {
    const newSessionId = `chat-session-${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([]);
    setInput("");
  };
  
  // Clear the current conversation but keep the same session
  const clearConversation = () => {
    // Clear messages state
    setMessages([]);
    setInput("");
    setStreamingMessage(null);
    
    // Update the session in localStorage
    if (sessionId) {
      const sessionData = {
        messages: [],
        advisor: { id: activeTab },
        thinkMode,
        lastUpdated: new Date().toISOString(),
        title: "New Chat" // Reset the title
      };
      localStorage.setItem(sessionId, JSON.stringify(sessionData));
      
      // Update the session in chat history
      const updatedHistory = [...chatHistory];
      const sessionIndex = updatedHistory.findIndex(s => s.sessionId === sessionId);
      
      if (sessionIndex !== -1) {
        updatedHistory[sessionIndex] = {
          ...updatedHistory[sessionIndex],
          title: "New Chat",
          lastUpdated: new Date().toISOString(),
          messageCount: 0
        };
        
        setChatHistory(updatedHistory);
        
        // Save updated history to localStorage
        const historyData = { sessions: updatedHistory };
        localStorage.setItem('chatERP-history', JSON.stringify(historyData));
      }
    }
  };

  // Expose startNewSession globally so Header component can access it
  useEffect(() => {
    window.startNewSession = startNewSession;

    // Cleanup function
    return () => {
      delete window.startNewSession;
    };
  }, []);

  // Handle clicking outside the theme dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target)
      ) {
        setThemeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [themeDropdownRef]);

  // Load a specific chat session
  const loadSession = (id) => {
    try {
      const savedSession = localStorage.getItem(id);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        if (parsedSession.messages && Array.isArray(parsedSession.messages)) {
          setMessages(parsedSession.messages);
          setSessionId(id);
          if (parsedSession.advisor && parsedSession.advisor.id) {
            setActiveTab(parsedSession.advisor.id);
          }
          if (parsedSession.thinkMode !== undefined) {
            setThinkMode(parsedSession.thinkMode);
          }
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };
  
  // Delete a chat session
  const deleteSession = (id) => {
    try {
      // Remove the session from localStorage
      localStorage.removeItem(id);
      
      // Update the chat history by removing the deleted session
      const updatedHistory = chatHistory.filter(session => session.sessionId !== id);
      setChatHistory(updatedHistory);
      
      // Save the updated history to localStorage
      const historyData = JSON.stringify({ sessions: updatedHistory });
      localStorage.setItem("chatERP-history", historyData);
      
      // If the current session is the one being deleted, start a new session
      if (sessionId === id) {
        startNewSession();
      }
      
      // Show a brief confirmation message
      const confirmationMessage = {
        id: Date.now(),
        content: "Chat session deleted successfully.",
        isUser: false,
        isSystemMessage: true,
        timestamp: new Date(),
      };
      
      // Display the confirmation message temporarily
      setMessages([confirmationMessage]);
      setTimeout(() => {
        if (sessionId !== id) {
          // If we didn't switch to a new session, clear the confirmation message
          setMessages([]);
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Adjust textarea height
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
      }

      // Create a placeholder for the AI response
      const aiMessageId = Date.now() + 1;
      setStreamingMessage({
        id: aiMessageId,
        content: "",
        isUser: false,
        timestamp: new Date(),
      });

      // Get the current advisor based on activeTab
      const currentAdvisor = advisorThemes.find(
        (theme) => theme.id === activeTab
      );

      // For testing purposes, use the simulated response directly
      const simulatedResponse = ChatService.getSimulatedResponse(input, currentAdvisor);
      
      // Simulate streaming by sending chunks of the response
      const chunks = ChatService.chunkString(simulatedResponse, 10);
      
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Delay between chunks
        
        // Update the streaming message with the new content
        setStreamingMessage((prev) => ({
          ...prev,
          content: prev ? prev.content + chunk : chunk,
        }));
      }
      
      // When streaming is done, add the final message to the messages array
      setStreamingMessage((prev) => {
        if (prev) {
          setMessages((messages) => [...messages, prev]);
          return null;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      // Handle error
      setStreamingMessage(null);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "Sorry, there was an error processing your request.",
          isUser: false,
          timestamp: new Date(),
          isError: true,
        },
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse think content from a message
  const parseThinkContent = (content) => {
    if (!content) return { thinkContent: null, finalContent: content };

    // Support both <think>...</think> and Deepseek style thinking
    const standardThinkRegex = /<think>([\s\S]*?)<\/think>/;
    const deepseekThinkRegex = /([\s\S]*?)<\/think>([\s\S]*)/;
    
    // Try standard format first
    const standardMatch = content.match(standardThinkRegex);
    if (standardMatch && standardMatch[1]) {
      // Extract the thinking content and the final content
      const thinkContent = standardMatch[1].trim();
      const finalContent = content.replace(standardThinkRegex, "").trim();
      return { thinkContent, finalContent };
    }
    
    // Try Deepseek format
    const deepseekMatch = content.match(deepseekThinkRegex);
    if (deepseekMatch && deepseekMatch[1] && deepseekMatch[2]) {
      // Extract the thinking content (before </think>) and the final content (after </think>)
      const thinkContent = deepseekMatch[1].trim();
      const finalContent = deepseekMatch[2].trim();
      return { thinkContent, finalContent };
    }

    return { thinkContent: null, finalContent: content };
  };

  // Toggle the expanded state of a think section
  const toggleThinkExpanded = (messageId) => {
    setExpandedThink((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Sidebar>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <NewChatButton onClick={startNewSession}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Chat
          </NewChatButton>

          <ChatHistory>
            {chatHistory.length > 0 ? (
              chatHistory.map((session) => (
                <ChatItem
                  key={session.sessionId}
                  onClick={() => loadSession(session.sessionId)}
                  active={sessionId === session.sessionId}
                >
                  <div className="chat-item-content">
                    <div className="date">
                      {new Date(session.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="title">{session.title}</div>
                  </div>
                  <DeleteButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.sessionId);
                    }}
                    title="Delete chat"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </DeleteButton>
                </ChatItem>
              ))
            ) : (
              <div
                style={{
                  padding: "20px",
                  color: "#6c757d",
                  fontSize: "14px",
                  textAlign: "center",
                  marginTop: "20px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                No chat history
              </div>
            )}
          </ChatHistory>
        </div>
      </Sidebar>
      <Container>
        <MainContent sidebarVisible={showSidebar}>
          <CurrentAdvisorBadge
            ref={themeDropdownRef}
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {activeTab === "general" ? (
                <path
                  d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ) : activeTab === "document-analyzer" ? (
                <path
                  d="M14 3v4a1 1 0 001 1h4M17 21h-10a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ) : activeTab === "ask-controllers" ? (
                <path
                  d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM3 12h1m17 0h1M5.6 5.6l.7.7m12.1-.7l-.7.7M12 3v1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ) : (
                <path
                  d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              )}
            </svg>
            Current mode:{" "}
            {advisorThemes.find((t) => t.id === activeTab)?.name || "General"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                marginLeft: "6px",
                transform: themeDropdownOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <ThemeDropdown isOpen={themeDropdownOpen}>
              {advisorThemes.map((theme) => (
                <ThemeOption
                  key={theme.id}
                  active={activeTab === theme.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(theme.id);
                    setThemeDropdownOpen(false);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {theme.id === "general" && (
                      <path
                        d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                    {theme.id === "document-analyzer" && (
                      <path
                        d="M14 3v4a1 1 0 001 1h4M17 21h-10a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                    {theme.id === "ask-controllers" && (
                      <path
                        d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM3 12h1m17 0h1M5.6 5.6l.7.7m12.1-.7l-.7.7M12 3v1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                    {theme.id === "askcba" && (
                      <path
                        d="M9 7h6m-6 4h6m-6 4h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                    {theme.id === "blended-finance" && (
                      <path
                        d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                    {theme.id === "business-risk" && (
                      <path
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                  {theme.name}
                </ThemeOption>
              ))}
            </ThemeDropdown>
          </CurrentAdvisorBadge>

          {messages.length === 0 ? (
            <WelcomeMessage>
              <h1>ChatERP</h1>
              <p>
                {advisor
                  ? advisor.description
                  : "Ask me anything about your business data or general questions. I'm here to help with financial analysis, inventory management, and more."}
              </p>
  
            </WelcomeMessage>
          ) : (
            <ChatMessages>
              {messages.map((message) => {
                if (message.isUser) {
                  // Render user messages normally
                  return (
                    <Message key={message.id} isUser={true}>
                      <MessageContent isUser={true}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </MessageContent>
                    </Message>
                  );
                } else {
                  // Parse AI messages for think content
                  const { thinkContent, finalContent } = parseThinkContent(
                    message.content
                  );

                  return (
                    <Message key={message.id} isUser={false}>
                      {thinkContent && (
                        <ThinkContent>

                          <ThinkHeader>
                            <span>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z"
                                  fill="currentColor"
                                />
                              </svg>
                              Thinking Process
                            </span>
                          </ThinkHeader>
                          <ReactMarkdown>{thinkContent}</ReactMarkdown>
                        </ThinkContent>
                      )}
                      <MessageContent isUser={false}>
                        <ReactMarkdown>{finalContent}</ReactMarkdown>
                      </MessageContent>
                    </Message>
                  );
                }
              })}
              <div ref={messagesEndRef} />
            </ChatMessages>
          )}

          <TabsContainer>
            <SidebarToggle onClick={() => setShowSidebar(!showSidebar)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12h18M3 6h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {showSidebar ? "Hide History" : "Show History"}
            </SidebarToggle>

            <Tab
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              General
            </Tab>
            <Tab
              active={activeTab === "personalize"}
              onClick={() => setActiveTab("personalize")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15c1.93 0 3.5-1.57 3.5-3.5S13.93 8 12 8s-3.5 1.57-3.5 3.5S10.07 15 12 15z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Personalize
            </Tab>
            <ThinkModeToggle>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: '6px' }}
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z"
                  fill="currentColor"
                />
              </svg>
              Thinking Process
              <InfoTooltip data-tooltip="Always shows the AI's thought process for transparency"></InfoTooltip>
            </ThinkModeToggle>
          </TabsContainer>

          <InputArea>
            <InputContainer>
              <InputActions>
                <ActionButton title="Attach file">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </ActionButton>
              </InputActions>
              <TextArea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question. (Shift + Enter for new line)"
                rows={1}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SendButton>
            </InputContainer>
            <FooterInfo>© {new Date().getFullYear()} ChatERP</FooterInfo>
          </InputArea>
        </MainContent>
      </Container>
    </>
  );
};

export default ChatInterface;
