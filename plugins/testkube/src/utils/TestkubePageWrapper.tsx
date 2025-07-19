import React from 'react';
import { Page, Header, Content } from '@backstage/core-components';

interface TestkubePageWrapperProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const TestkubePageWrapper: React.FC<TestkubePageWrapperProps> = ({ title, subtitle, children }) => {
  return (
    <Page themeId="home">
      <Header title={title || "Testkube Dashboard"} subtitle={subtitle || "Test Orchestration at ULTRA Scale for Cloud Native Applications"} />
      <Content>
        {children}
      </Content>
    </Page>
  );
};
