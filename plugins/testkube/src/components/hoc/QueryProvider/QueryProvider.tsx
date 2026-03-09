import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrgEnvProvider } from '../../../context';
import { OrgEnvSelector } from '../../molecules/OrgEnvSelector';
import Box from '@mui/material/Box';

const queryClient = new QueryClient();

export const QueryProvider =
  <P extends PropsWithChildren>(WrappedComponent: React.FC<P>): React.FC<P> =>
  ({ ...props }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <OrgEnvProvider>
          <Box sx={{ mb: 2 }}>
            <OrgEnvSelector />
          </Box>
          <WrappedComponent {...(props as P)} />
        </OrgEnvProvider>
      </QueryClientProvider>
    );
  };
