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

export const DashboardPage = testkubePlugin.provide(
  createComponentExtension({
    name: 'DashboardPage',
    component: {
      lazy: () =>
        import('./components/pages/DashboardPage').then(
          m => m.DashboardPage as any,
        ),
    },
  }),
);

export const EntityPage = testkubePlugin.provide(
  createComponentExtension({
    name: 'EntityPage',
    component: {
      lazy: () =>
        import('./components/pages/EntityPage').then(m => m.EntityPage),
    },
  }),
);
