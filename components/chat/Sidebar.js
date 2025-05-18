import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
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

const Sidebar = ({ 
  chatHistory, 
  sessionId, 
  startNewSession, 
  loadSession, 
  deleteSession 
}) => {
  return (
    <SidebarContainer>
      <div
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
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
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
    </SidebarContainer>
  );
};

export default Sidebar;
