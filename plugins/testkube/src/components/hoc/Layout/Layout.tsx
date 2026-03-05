import React, { PropsWithChildren } from 'react';
import { Page, Header, Content } from '@backstage/core-components';

type LayoutProps = {
  title?: string;
  subtitle?: string;
};

export const Layout =
  <P extends PropsWithChildren>(
    WrappedComponent: React.FC<P>,
  ): React.FC<P & LayoutProps> =>
  ({ title, subtitle, ...props }) => {
    return (
      <Page themeId="home">
        <Header
          title={title || 'Testkube Dashboard'}
          subtitle={
            subtitle ||
            'Test Orchestration at ULTRA Scale for Cloud Native Applications'
          }
        />
        <Content>
          <WrappedComponent {...(props as P)} />
        </Content>
      </Page>
    );
  };
