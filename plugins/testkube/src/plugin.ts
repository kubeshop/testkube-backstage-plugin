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
  featureFlags: [{ name: 'testkube' }],
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

export const TestkubeDashboardPage = testkubePlugin.provide(
  createComponentExtension({
    name: 'TestkubeDashboardPage',
    component: {
      lazy: () =>
      import('./components/TestkubeDashboardPage').then(
        m => m.TestkubeDashboardPage,
      ),
    },
  }),
);

export const TestkubeEntityPage = testkubePlugin.provide(
  createComponentExtension({
    name: 'TestkubeEntityPage',
    component: {
      lazy: () =>
        import('./components/TestkubeEntityPage').then(
          m => m.TestkubeEntityPage,
        ),
      },
  }),
);
