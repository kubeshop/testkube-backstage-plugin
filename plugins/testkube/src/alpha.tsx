import React from 'react';
import {
  ApiBlueprint,
  createApiFactory,
  createFrontendPlugin,
  discoveryApiRef,
  identityApiRef,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { testkubeApiRef, TestkubeClient } from './api';

export const testkubeApi = ApiBlueprint.make({
    name: 'testkubeApi',
    params: {
      factory: createApiFactory({
        api: testkubeApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          identityApi: identityApiRef,
        },
        factory: ({ discoveryApi, identityApi }) =>
          new TestkubeClient({
            discoveryApi,
            identityApi,
          }),
      }),
    },
  });

  const TestkubePage = PageBlueprint.make({
    params: {
      defaultPath: '/testkube',
      loader: () => import('./components/TestWorkflowExecutionsPage').then(m => <m.TestWorkflowExecutionsPage />),
    },
  });

  export default createFrontendPlugin({
    id: 'testkube',
    extensions: [
      testkubeApi,
      TestkubePage,
    ],
  });