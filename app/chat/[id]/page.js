'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import ChatInterface from '../../../components/chat/ChatInterface';

export default function ChatPage({ params }) {
  const { id } = params;
  const [advisor, setAdvisor] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    // In a real app, we would fetch the advisor details from an API
    // For now, we'll use a mock implementation
    const advisors = {
      'general': {
        id: 'general',
        name: 'General',
        description: 'ChatERP - General doesn\'t generate IFC information and can be used for general purpose only. It protects IFC and client information.',
        icon: '📋'
      },
      'document-analyzer': {
        id: 'document-analyzer',
        name: 'Document Analyzer',
        description: 'The Document Analyzer can help you save significant time by automatically analyzing long and complex documents for you.',
        icon: '📄'
      },
      'ask-controllers': {
        id: 'ask-controllers',
        name: 'Ask Controllers',
        description: 'This advisor helps to understand the general impact of transactions/products on IFC\'s audited financial statements under generally accepted accounting principles (US GAAP).',
        icon: '🔍'
      },
      'askcba': {
        id: 'askcba',
        name: 'AskCBA',
        description: '"AskCBA" is CBA\'s knowledge-based Chatbot, which will assist you with queries related to Budget, Administration, Procurement and Real Estate policies, procedures, and systems.',
        icon: '💼'
      },
      'blended-finance': {
        id: 'blended-finance',
        name: 'Blended Finance',
        description: 'This advisor helps to understand the world of blended finance. Blended finance combines public and private funds to support development projects with high impact.',
        icon: '💰'
      },
      'business-risk': {
        id: 'business-risk',
        name: 'Business Risk Compliance Manual',
        description: 'Try the Compliance Manual to quickly and easily search and browse Business Risk and Compliance (BRC) policies and procedures.',
        icon: '📊'
      }
    };
    
    setAdvisor(advisors[id] || advisors['general']);
  }, [id]);

  if (!advisor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header />
      <ChatInterface advisor={advisor} />
    </div>
  );
}
