import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import ThinkContent from "./ThinkContent";

const MessageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isUser',
})`
  width: 100%;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.isUser ? "white" : "#f7f7f8")};
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
  align-items: center;
`;

const MessageContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isUser' && prop !== 'isProcessing',
})`
  max-width: 800px;
  width: 100%;
  color: ${(props) => (props.isProcessing ? "#6c757d" : "#343541")};
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
  background-color: ${(props) => (props.isUser ? "transparent" : "white")};
  border-radius: 8px;
  padding: ${(props) => (props.isUser ? "0" : "16px")};

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
      props.isUser ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
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

// Function to parse think content from a message
const parseThinkContent = (content) => {
  if (!content) return { thinkContent: null, finalContent: content };
  
  // If content is an object (shouldn't happen, but just in case)
  if (typeof content !== 'string') {
    return { thinkContent: null, finalContent: String(content) };
  }

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
  const closingTagIndex = content.indexOf('</think>');
  if (closingTagIndex !== -1) {
    // Everything before the closing tag is thinking content
    const thinkContent = content.substring(0, closingTagIndex).trim();
    // Everything after the closing tag is final content
    const finalContent = content.substring(closingTagIndex + 9).trim(); // 9 is length of </think>
    
    return { thinkContent, finalContent };
  }
  
  // Check for opening tag without closing tag (in case we're still streaming)
  const openingTagIndex = content.indexOf('<think>');
  if (openingTagIndex !== -1) {
    const thinkContent = content.substring(openingTagIndex + 7).trim(); // 7 is length of <think>
    return { thinkContent, finalContent: '' };
  }

  // If no thinking content is found, return the original content as finalContent
  return { thinkContent: null, finalContent: content };
};

const Message = ({ message, thinkMode }) => {
  if (message.isUser) {
    // Render user messages normally
    return (
      <MessageContainer isUser={true}>
        <MessageContent isUser={true}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </MessageContent>
      </MessageContainer>
    );
  } else {
    // For streaming messages, show the content as-is
    if (message.isStreaming) {
      // Try to extract think content if in think mode
      let thinkContent = null;
      let displayContent = message.content;
      
      if (thinkMode) {
        const parsed = parseThinkContent(message.content);
        thinkContent = parsed.thinkContent;
        displayContent = parsed.finalContent;
      }
      
      return (
        <MessageContainer isUser={false}>
          {thinkContent && thinkMode && (
            <ThinkContent content={thinkContent} isThinking={true} />
          )}
          <MessageContent isUser={false} isProcessing={message.isProcessing}>
            <ReactMarkdown>{displayContent}</ReactMarkdown>
            {message.isProcessing && (
              <div className="processing-indicator">
                <style jsx>{`
                  .processing-indicator {
                    display: flex;
                    align-items: center;
                    margin-top: 8px;
                    font-style: italic;
                    color: #6c757d;
                  }
                  @keyframes dots {
                    0%, 20% { content: '.'; }
                    40% { content: '..'; }
                    60%, 100% { content: '...'; }
                  }
                  .processing-indicator::after {
                    content: '';
                    animation: dots 1.5s infinite;
                    margin-left: 2px;
                  }
                `}</style>
                Processing your message
              </div>
            )}
            {message.isStreaming && !message.isProcessing && (
              <span className="cursor-blink">
                <style jsx>{`
                  @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                  }
                  .cursor-blink::after {
                    content: '|';
                    animation: blink 1s infinite;
                    color: #666;
                    margin-left: 2px;
                  }
                `}</style>
              </span>
            )}
          </MessageContent>
        </MessageContainer>
      );
    }
    
    // For non-streaming AI messages
    const thinkContent = message.thinkContent || 
      (thinkMode ? parseThinkContent(message.content).thinkContent : null);
    
    const displayContent = message.thinkContent !== undefined 
      ? message.content 
      : parseThinkContent(message.content).finalContent;

    return (
      <MessageContainer isUser={false}>
        {thinkContent && thinkMode && (
          <ThinkContent content={thinkContent} isThinking={false} />
        )}
        <MessageContent isUser={false}>
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        </MessageContent>
      </MessageContainer>
    );
  }
};

export default Message;
