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
      <Header title={title || "Testkube"} subtitle={subtitle || "Test Automation Execution Platform"} />
      <Content>
        {children}
      </Content>
    </Page>
  );
};
