import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatService from "../../app/utils/ChatService";
import { advisorThemes } from "../../app/utils/advisorThemes";
import Header from "../Header";
import Message from "./Message";
import Sidebar from "./Sidebar";
import InputArea from "./InputArea";
import {
  Container,
  MainContent,
  ChatMessages,
  WelcomeMessage,
  TabsContainer,
  Tab,
  ThinkModeToggle,
  InfoTooltip,
  SidebarToggle,
} from "./styles";

const ChatInterface = ({ advisor }) => {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [thinkMode, setThinkMode] = useState(false); // Disabled think mode by default
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedThink, setExpandedThink] = useState({});

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any ongoing streaming when component unmounts
      if (streamingMessage) {
        setStreamingMessage(null);
      }
    };
  }, [streamingMessage]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
    // Add test message if no messages exist
    if (messages.length === 0) {
      addTestMessage();
    }
  }, []);

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
            // If we don't have a current session, load the most recent one
            if (!sessionId) {
              const mostRecentSessionId = history.sessions[0].sessionId;
              try {
                const savedSession = localStorage.getItem(mostRecentSessionId);
                if (savedSession) {
                  const parsedSession = JSON.parse(savedSession);
                  if (
                    parsedSession.messages &&
                    Array.isArray(parsedSession.messages)
                  ) {
                    setMessages(parsedSession.messages);
                    setSessionId(mostRecentSessionId);
                    if (parsedSession.advisor && parsedSession.advisor.id) {
                      setActiveTab(parsedSession.advisor.id);
                    }
                    if (parsedSession.thinkMode !== undefined) {
                      setThinkMode(parsedSession.thinkMode);
                    }
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
    if (!sessionId) return; // Don't save if no session ID

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

      // Generate a title based on the conversation
      let title = "New Chat";

      // First try to use the first user message
      const firstUserMessage = messages.find((msg) => msg.isUser);
      if (firstUserMessage?.content) {
        title = firstUserMessage.content.substring(0, 50);
        if (firstUserMessage.content.length > 50) {
          title += "...";
        }
      }
      // If no user message, try to use the first AI message
      else {
        const firstAIMessage = messages.find((msg) => !msg.isUser);
        if (firstAIMessage?.content) {
          title = firstAIMessage.content.substring(0, 50);
          if (firstAIMessage.content.length > 50) {
            title += "...";
          }
        }
      }

      // Create or update session summary
      const sessionSummary = {
        sessionId,
        title: title || "New Chat",
        advisor: {
          id: activeTab,
          name: advisorThemes[activeTab]?.name || "Advisor",
        },
        lastUpdated: new Date().toISOString(),
        messageCount: messages.length,
      };

      // Check if current session is already in history
      const sessionIndex = history.sessions.findIndex(
        (session) => session.sessionId === sessionId
      );

      // Update or add session to history
      if (sessionIndex !== -1) {
        // Keep the existing title if it's not the default and we're not changing it
        const existingSession = history.sessions[sessionIndex];
        if (existingSession.title && existingSession.title !== "New Chat") {
          sessionSummary.title = existingSession.title;
        }
        history.sessions[sessionIndex] = sessionSummary;
      } else {
        // Add new session to the beginning of the array
        history.sessions.unshift(sessionSummary);
      }

      // Limit history to 10 most recent sessions
      history.sessions = history.sessions.slice(0, 10);

      // Save updated history
      localStorage.setItem("chatERP-history", JSON.stringify(history));

      // Update the chat history state
      setChatHistory(history.sessions);
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Save current session to localStorage
  const saveSession = () => {
    if (sessionId && messages.length > 0) {
      try {
        const sessionData = {
          messages,
          advisor: { id: activeTab },
          thinkMode,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(sessionId, JSON.stringify(sessionData));

        // Also update the chat history
        saveChatHistory();
      } catch (error) {
        console.error("Error saving session:", error);
      }
    }
  };

  // Effect to save session when messages change
  useEffect(() => {
    saveSession();
  }, [messages, activeTab, thinkMode]);

  // Clear current session and start a new one
  const startNewSession = () => {
    const newSessionId = `chat-session-${Date.now()}`;
    const newSession = {
      sessionId: newSessionId,
      title: "New Chat",
      lastUpdated: new Date().toISOString(),
      advisor: { id: activeTab },
      messageCount: 0,
    };

    // Update chat history with the new session
    const existingHistory = JSON.parse(
      localStorage.getItem("chatERP-history") || '{"sessions":[]}'
    );
    existingHistory.sessions.unshift(newSession);

    // Limit to 10 most recent sessions
    existingHistory.sessions = existingHistory.sessions.slice(0, 10);

    // Save updated history
    localStorage.setItem("chatERP-history", JSON.stringify(existingHistory));

    // Update state
    setSessionId(newSessionId);
    setMessages([]);
    setInput("");

    // Force update chat history in the UI
    loadChatHistory();
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
        title: "New Chat", // Reset the title
      };
      localStorage.setItem(sessionId, JSON.stringify(sessionData));

      // Update the session in chat history
      const updatedHistory = [...chatHistory];
      const sessionIndex = updatedHistory.findIndex(
        (s) => s.sessionId === sessionId
      );

      if (sessionIndex !== -1) {
        updatedHistory[sessionIndex] = {
          ...updatedHistory[sessionIndex],
          title: "New Chat",
          lastUpdated: new Date().toISOString(),
          messageCount: 0,
        };

        setChatHistory(updatedHistory);

        // Save updated history to localStorage
        const historyData = { sessions: updatedHistory };
        localStorage.setItem("chatERP-history", JSON.stringify(historyData));
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
      // Remove the session from chat history
      const updatedHistory = chatHistory.filter((session) => session.id !== id);
      setChatHistory(updatedHistory);

      // Save to localStorage
      localStorage.setItem("chatERP-history", JSON.stringify(updatedHistory));

      // If the deleted session is the current one, switch to a new session
      if (id === sessionId) {
        startNewSession();
      }

      // Show confirmation message
      const confirmationMessage = {
        id: `confirmation-${Date.now()}`,
        content: "Session deleted successfully.",
        isUser: false,
        timestamp: new Date(),
        isConfirmation: true,
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

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create user message
    const userMessage = {
      id: Date.now(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
    }

    // Create AI message placeholder
    const aiMessageId = Date.now() + 1;
    const aiMessage = {
      id: aiMessageId,
      content: "", // Empty content, the processing indicator will be shown by the Message component
      isUser: false,
      timestamp: new Date(),
      isStreaming: true, // Set to true to show the animation while waiting
      isProcessing: true, // Flag to indicate this is a processing message
    };

    // Add empty AI message to chat
    setMessages((prev) => [...prev, aiMessage]);
    setStreamingMessage(aiMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          advisorId: activeTab,
          stream: false, // Disable streaming
          thinkMode, // Restored but set to false by default
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the response based on the format
      let content = '';
      if (data.choices && data.choices[0]?.message?.content) {
        // OpenAI format
        content = data.choices[0].message.content;
      } else if (data.content) {
        // Direct content
        content = data.content;
      } else if (data.text) {
        // Text field
        content = data.text;
      } else {
        console.warn('Unexpected response format:', data);
        content = 'Received an unexpected response format.';
      }

      // Parse think content if in think mode
      let thinkContent = null;
      let displayContent = content;
      
      if (thinkMode) {
        const parsed = parseThinkContent(content);
        thinkContent = parsed.thinkContent;
        displayContent = parsed.finalContent;
      }

      // Update the message with the final content
      const finalMessage = {
        ...aiMessage,
        content: displayContent.trim(),
        thinkContent: thinkContent,
        isStreaming: false, // Set to false to stop the animation
        isThinking: false,
        isProcessing: false, // Remove the processing flag
      };

      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg.id === aiMessageId ? finalMessage : msg
        )
      );
      
      setStreamingMessage(null);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);

      setStreamingMessage(null);
      setMessages((prev) => {
        // Remove the loading message if it exists
        const filtered = prev.filter((msg) => msg.id !== aiMessageId);

        // Add error message
        return [
          ...filtered,
          {
            id: Date.now() + 1,
            content: "Sorry, there was an error processing your request.",
            isUser: false,
            timestamp: new Date(),
            isError: true,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse think content from a message
  const parseThinkContent = (content) => {
    // ...

    // Standard format: <think>thinking content</think>final content
    const standardThinkRegex = /<think>([\s\S]*?)<\/think>/;

    // Try standard format
    const standardMatch = content.match(standardThinkRegex);
    if (standardMatch && standardMatch[1]) {
      // Extract the thinking content
      const thinkContent = standardMatch[1].trim();
      // Remove the <think>...</think> tag to get the final content
      const finalContent = content.replace(standardThinkRegex, "").trim();
      return { thinkContent, finalContent };
    }

    // Check for closing tag without opening tag
    const closingTagIndex = content.indexOf("</think>");
    if (closingTagIndex !== -1) {
      // Everything before the closing tag is thinking content
      const thinkContent = content.substring(0, closingTagIndex).trim();
      // Everything after the closing tag is final content
      const finalContent = content.substring(closingTagIndex + 9).trim(); // 9 is length of </think>

      return { thinkContent, finalContent };
    }

    // If no thinking content is found, return the original content as finalContent
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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Sidebar
        chatHistory={chatHistory}
        sessionId={sessionId}
        startNewSession={startNewSession}
        loadSession={loadSession}
        deleteSession={deleteSession}
      />
      <Container>
        <MainContent sidebarVisible={showSidebar}>
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
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  thinkMode={thinkMode}
                />
              ))}
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
            {/* Think mode toggle removed as requested */}
          </TabsContainer>

          <InputArea
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
            textAreaRef={textAreaRef}
            isLoading={isLoading}
          />
        </MainContent>
      </Container>
    </>
  );
};

export default ChatInterface;
