import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const QueryProvider =
  <P extends PropsWithChildren>(WrappedComponent: React.FC<P>): React.FC<P> =>
  ({ ...props }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WrappedComponent {...(props as P)} />
      </QueryClientProvider>
    );
  };
