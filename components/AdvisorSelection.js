import React from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const AdvisorSelectionContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 20px 40px 20px; /* Increased top padding to account for fixed header */
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const AdvisorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const AdvisorCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const AdvisorIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #f0f4f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #3b82f6;
  font-size: 24px;
`;

const AdvisorInfo = styled.div`
  flex: 1;
`;

const AdvisorName = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
`;

const AdvisorDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const advisors = [
  {
    id: "general",
    name: "General",
    description:
      "ChatERP - General doesn't generate IFC information and can be used for general purpose only. It protects IFC and client information.",
    icon: "📋",
  },
  {
    id: "document-analyzer",
    name: "Document Analyzer",
    description:
      "The Document Analyzer can help you save significant time by automatically analyzing long and complex documents for you.",
    icon: "📄",
  },
  {
    id: "ask-controllers",
    name: "Ask Controllers",
    description:
      "This advisor helps to understand the general impact of transactions/products on IFC's audited financial statements under generally accepted accounting principles (US GAAP).",
    icon: "🔍",
  },
  {
    id: "askcba",
    name: "AskCBA",
    description:
      '"AskCBA" is CBA\'s knowledge-based Chatbot, which will assist you with queries related to Budget, Administration, Procurement and Real Estate policies, procedures, and systems.',
    icon: "💼",
  },
  {
    id: "blended-finance",
    name: "Blended Finance",
    description:
      "This advisor helps to understand the world of blended finance. Blended finance combines public and private funds to support development projects with high impact.",
    icon: "💰",
  },
  {
    id: "business-risk",
    name: "Business Risk Compliance Manual",
    description:
      "Try the Compliance Manual to quickly and easily search and browse Business Risk and Compliance (BRC) policies and procedures.",
    icon: "📊",
  },
];

function AdvisorSelection({ onSelectAdvisor }) {
  const router = useRouter();

  const handleAdvisorSelect = (advisor) => {
    if (onSelectAdvisor) {
      onSelectAdvisor(advisor);
    } else {
      router.push(`/chat/${advisor.id}`);
    }
  };
  return (
    <AdvisorSelectionContainer>
      <Title>Choose your ChatERP advisor</Title>
      <Description>
        A suite of ChatERP advisors designed to streamline tasks and enhance
        your digital experience. These advisors can guide you with IFC
        information and knowledge. Select any preferred advisor and set it as
        your default for your next visit.
      </Description>

      <AdvisorsGrid>
        {advisors.map((advisor) => (
          <AdvisorCard
            key={advisor.id}
            onClick={() => handleAdvisorSelect(advisor)}
          >
            <AdvisorIcon>{advisor.icon}</AdvisorIcon>
            <AdvisorInfo>
              <AdvisorName>{advisor.name}</AdvisorName>
              <AdvisorDescription>{advisor.description}</AdvisorDescription>
            </AdvisorInfo>
          </AdvisorCard>
        ))}
      </AdvisorsGrid>
    </AdvisorSelectionContainer>
  );
}

export default AdvisorSelection;
