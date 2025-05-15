import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { testkubeApiRef, TestkubeClient } from './api';

export const testkubePlugin = createPlugin({
  id: 'testkube',
  apis: [
    createApiFactory({
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
  ],
});

export const TestkubePage = testkubePlugin.provide(
  createComponentExtension({
    name: 'TestkubePage',
    component: {
      lazy: () =>
      import('./components/TestWorkflowExecutionsPage').then(
        m => m.TestWorkflowExecutionsPage,
      ),
    },
  }),
);