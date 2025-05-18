'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 800px;
  margin: 60px auto 0;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Message = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: ${props => props.isUser ? 'white' : '#f7f7f8'};
  border: 1px solid #e5e5e5;
`;

const ThinkContent = styled.div`
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #476582;
  white-space: pre-wrap;
  overflow-x: auto;
  border-left: 3px solid #a8c6df;
  font-family: monospace;
  line-height: 1.6;
`;

const ThinkHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 600;
  color: #3c5a80;
`;

const Button = styled.button`
  background-color: #10a37f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #0d8a6c;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  margin-left: 10px;
  
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
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #10a37f;
  }
  
  input:checked + .slider:before {
    transform: translateX(16px);
  }
`;

const ThinkModeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6c757d;
`;

export default function TestThinkingPage() {
  const [thinkMode, setThinkMode] = useState(true);
  
  // Sample messages with thinking content
  const messages = [
    {
      id: 1,
      content: "Show me an example of the thinking mode",
      isUser: true
    },
    {
      id: 2,
      content: `I need to analyze what the user is asking about the thinking mode feature.

The user wants to see an example of the thinking mode in action.

I should demonstrate how the thinking mode works by showing my thought process.

I'll explain the purpose of thinking mode and how it can be useful for transparency.
</think>

Here's an example of the thinking mode feature! If you can see my thought process above this message, then it's working correctly. The thinking mode allows you to see how I analyze and process your questions before providing a final answer. It's useful for understanding my reasoning process and for debugging complex queries.`,
      isUser: false
    }
  ];
  
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
  
  return (
    <>
      <Header />
      <Container>
        <Title>Thinking Mode Test Page</Title>
        
        <ThinkModeToggle>
          Think Mode
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={thinkMode}
              onChange={() => setThinkMode(!thinkMode)}
            />
            <span className="slider"></span>
          </ToggleSwitch>
        </ThinkModeToggle>
        
        {messages.map(message => {
          if (message.isUser) {
            return (
              <Message key={message.id} isUser={true}>
                {message.content}
              </Message>
            );
          } else {
            // Parse AI messages for think content
            const { thinkContent, finalContent } = parseThinkContent(message.content);
            
            return (
              <Message key={message.id} isUser={false}>
                {thinkContent && thinkMode && (
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
                    {thinkContent}
                  </ThinkContent>
                )}
                {finalContent}
              </Message>
            );
          }
        })}
        
        <Button onClick={() => window.location.href = '/chat/id_123'}>
          Go Back to Chat
        </Button>
      </Container>
    </>
  );
}
