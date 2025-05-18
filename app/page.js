'use client';

import { useState } from 'react';
import Header from '../components/Header';
import AdvisorSelection from '../components/AdvisorSelection';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  return (
    <div className="app">
      <Header />
      
      {selectedAdvisor ? (
        <ChatInterface advisor={selectedAdvisor} />
      ) : (
        <AdvisorSelection onSelectAdvisor={setSelectedAdvisor} />
      )}
    </div>
  );
}
