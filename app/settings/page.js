'use client';

import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f8f9fa;
`;

const ComingSoonCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 40px;
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #343541;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ComingSoonIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  color: #0d6efd;
`;

const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
`;

const FeatureItem = styled.div`
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  width: calc(50% - 8px);
  text-align: left;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #0d6efd;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
`;

export default function SettingsPage() {
  return (
    <>
      <Header />
      <Container>
        <ComingSoonCard>
          <ComingSoonIcon>⚙️</ComingSoonIcon>
          <Title>Settings Coming Soon</Title>
          <Subtitle>
            We're working hard to bring you a fully customizable experience.
            The settings page will be available in a future update.
          </Subtitle>
          
          <FeatureList>
            <FeatureItem>
              <FeatureTitle>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15c1.93 0 3.5-1.57 3.5-3.5S13.93 8 12 8s-3.5 1.57-3.5 3.5S10.07 15 12 15z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Appearance Settings
              </FeatureTitle>
              <FeatureDescription>
                Customize the look and feel of your ChatERP experience with themes and layout options.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureTitle>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Privacy Controls
              </FeatureTitle>
              <FeatureDescription>
                Manage your data and control what information is stored and shared.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureTitle>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-4 0h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Integration Settings
              </FeatureTitle>
              <FeatureDescription>
                Connect ChatERP with your favorite tools and services for a seamless workflow.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureTitle>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                User Preferences
              </FeatureTitle>
              <FeatureDescription>
                Set your default advisors, customize notifications, and tailor the experience to your needs.
              </FeatureDescription>
            </FeatureItem>
          </FeatureList>
        </ComingSoonCard>
      </Container>
    </>
  );
}
