import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // Using vscDarkPlus for better code highlighting

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const ThinkContentContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0;
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  border: 1px solid #e9ecef;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ThinkHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f1f3f5;
  color: #495057;
  font-weight: 500;
  font-size: 13px;
  border-bottom: 1px solid #e9ecef;
  user-select: none;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ThinkIcon = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ThinkBody = styled.div`
  padding: 12px;
  font-family: 'SF Mono', 'Roboto Mono', 'Courier New', monospace;
  line-height: 1.6;
  background: white;
  font-size: 13px;
  color: #333;
  
  p {
    margin: 0 0 8px 0;
    color: #333;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  pre {
    background: #f8f9fa;
    border-radius: 4px;
    padding: 12px;
    overflow-x: auto;
    margin: 8px 0;
    border: 1px solid #e9ecef;
    font-size: 12px;
  }
  
  code {
    font-family: 'SF Mono', 'Roboto Mono', 'Courier New', monospace;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 4px;
    border-radius: 3px;
    color: #d63384;
  }
  
  pre code {
    background: none;
    padding: 0;
    color: #333;
  }
  
  a {
    color: #0d6efd;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ThinkingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6c757d;
  font-size: 12px;
  padding: 4px 0 8px 0;
  
  span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #6c757d;
    border-radius: 50%;
    opacity: 0.6;
    
    &:nth-child(1) { animation: ${pulse} 1.4s ease-in-out 0s infinite; }
    &:nth-child(2) { animation: ${pulse} 1.4s ease-in-out 0.2s infinite; }
    &:nth-child(3) { animation: ${pulse} 1.4s ease-in-out 0.4s infinite; }
  }
`;

const ThinkContent = ({ content, isStreaming = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [displayContent, setDisplayContent] = useState('');
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Handle streaming content updates
  useEffect(() => {
    if (!content) {
      setDisplayContent('');
      return;
    }
    
    // If not streaming, update immediately
    if (!isStreaming) {
      setDisplayContent(content);
      return;
    }
    
    // For streaming, add a small delay to make it look more natural
    const timeout = setTimeout(() => {
      setDisplayContent(content);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [content, isStreaming]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderMarkdown = (content) => (
    <ReactMarkdown
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              customStyle={{
                margin: '8px 0',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '12px',
                lineHeight: '1.5',
                background: '#f8f9fa'
              }}
              codeTagProps={{
                style: {
                  fontFamily: '"SF Mono", "Roboto Mono", "Courier New", monospace'
                }
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} style={{
              fontFamily: '"SF Mono", "Roboto Mono", "Courier New", monospace',
              fontSize: '12px',
              background: 'rgba(0,0,0,0.05)',
              padding: '2px 4px',
              borderRadius: '3px',
              color: '#d63384'
            }} {...props}>
              {children}
            </code>
          );
        },
        p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.6' }} {...props} />,
        a: ({node, ...props}) => <a style={{ color: '#0d6efd', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" {...props} />,
        ul: ({node, ...props}) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }} {...props} />,
        ol: ({node, ...props}) => <ol style={{ margin: '8px 0', paddingLeft: '20px' }} {...props} />,
        li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );

  if (!isMounted || !content) return null;

  return (
    <ThinkContentContainer>
      <ThinkHeader>
        <HeaderLeft>
          <ThinkIcon>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ThinkIcon>
          <span>Thinking</span>
        </HeaderLeft>
        {isStreaming && (
          <ThinkingIndicator>
            <span></span>
            <span></span>
            <span></span>
          </ThinkingIndicator>
        )}
      </ThinkHeader>
      <ThinkBody>
        {renderMarkdown(displayContent)}
      </ThinkBody>
    </ThinkContentContainer>
  );
};

export default ThinkContent;
