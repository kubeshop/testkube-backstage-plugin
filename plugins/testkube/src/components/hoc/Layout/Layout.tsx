import { PropsWithChildren } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrgEnvProvider } from '../../../context';
import { OrgEnvSelector } from '../../molecules/OrgEnvSelector';
import Box from '@mui/material/Box';

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <OrgEnvProvider>
          <Page themeId="home">
            <Header
              title={title || 'Testkube Dashboard'}
              subtitle={
                subtitle ||
                'Test Orchestration at ULTRA Scale for Cloud Native Applications'
              }
            />
            <Content>
              <Box sx={{ mb: 2 }}>
                <OrgEnvSelector />
              </Box>
              <WrappedComponent {...(props as P)} />
            </Content>
          </Page>
        </OrgEnvProvider>
      </QueryClientProvider>
    );
  };
