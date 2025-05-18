import React from "react";
import styled from "styled-components";
import { FooterInfo } from "./styles";

const InputAreaContainer = styled.div`
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 20%);
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    padding: 12px 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  transition: all 0.2s ease;
  margin: 0 auto;
  width: calc(100% - 32px);
  position: relative;
  min-height: 56px;
  box-sizing: border-box;

  &:focus-within {
    border-color: #0d6efd;
    box-shadow: 0 2px 12px rgba(13, 110, 253, 0.2);
    background-color: #fff;
  }

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    border-radius: 12px;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  padding: 8px 12px;
  font-size: 15px;
  min-height: 24px;
  max-height: 200px;
  overflow-y: auto;
  background: transparent;
  line-height: 1.5;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  
  &::placeholder {
    color: #9ca3af;
    opacity: 0.8;
  }
  
  &:focus {
    outline: none;
  }
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
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background-color: #0d8a6c;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }

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

const ComingSoonPopup = styled.div`
  position: absolute;
  top: -50px;
  left: 0;
  z-index: 100;
  animation: fadeInOut 3s ease;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    15% {
      opacity: 1;
      transform: translateY(0);
    }
    85% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

const PopupContent = styled.div`
  background-color: #343a40;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  svg {
    margin-right: 8px;
    color: #ffc107;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 20px;
    border-width: 8px 8px 0;
    border-style: solid;
    border-color: #343a40 transparent transparent;
  }
`;

const InputArea = ({
  input,
  setInput,
  handleSendMessage,
  handleKeyDown,
  textAreaRef,
  isLoading,
}) => {
  const [showAttachmentPopup, setShowAttachmentPopup] = React.useState(false);

  return (
    <InputAreaContainer>
      <InputContainer>
        <InputActions>
          <ActionButton
            title="Attach file"
            onClick={() => {
              setShowAttachmentPopup(true);
              setTimeout(() => setShowAttachmentPopup(false), 3000);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ActionButton>
          {showAttachmentPopup && (
            <ComingSoonPopup>
              <PopupContent>
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
                <span>Demo Only</span>
              </PopupContent>
            </ComingSoonPopup>
          )}
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
      {/* Footer removed as requested */}
    </InputAreaContainer>
  );
};

export default InputArea;
