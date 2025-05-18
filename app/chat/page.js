'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f8f9fa;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 32px;
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 16px;
  color: #343541;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6e6e80;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const AdvisorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  width: 100%;
  margin-top: 24px;
`;

const AdvisorCard = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: #10a37f;
  }
`;

const AdvisorIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`;

const AdvisorName = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
  color: #343541;
`;

const AdvisorDescription = styled.p`
  font-size: 14px;
  color: #6e6e80;
  text-align: center;
`;

export default function ChatPage() {
  const router = useRouter();
  
  const advisors = [
    {
      id: 'general',
      name: 'General Assistant',
      description: 'ChatERP - General can be used for general purpose inquiries and business assistance.',
      icon: '🌐'
    },
    {
      id: 'document-analyzer',
      name: 'Document Analyzer',
      description: 'Helps analyze long and complex documents to save you time.',
      icon: '📄'
    },
    {
      id: 'ask-controllers',
      name: 'Ask Controllers',
      description: 'Specialized assistant for accounting and financial control questions.',
      icon: '💼'
    },
    {
      id: 'personalize',
      name: 'Personalized Assistant',
      description: 'Adapts to your specific needs and remembers your preferences.',
      icon: '👤'
    }
  ];
  
  const handleAdvisorSelect = (advisorId) => {
    router.push(`/chat/${advisorId}`);
  };
  
  return (
    <>
      <Header />
      <Container>
        <Card>
          <Title>Choose Your Assistant</Title>
          <Description>
            Select the specialized assistant that best fits your current needs.
            Each assistant is optimized for different types of tasks.
          </Description>
          
          <AdvisorGrid>
            {advisors.map(advisor => (
              <AdvisorCard 
                key={advisor.id}
                onClick={() => handleAdvisorSelect(advisor.id)}
              >
                <AdvisorIcon>{advisor.icon}</AdvisorIcon>
                <AdvisorName>{advisor.name}</AdvisorName>
                <AdvisorDescription>{advisor.description}</AdvisorDescription>
              </AdvisorCard>
            ))}
          </AdvisorGrid>
        </Card>
      </Container>
    </>
  );
}
