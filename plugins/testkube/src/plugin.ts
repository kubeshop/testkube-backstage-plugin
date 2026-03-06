import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import type { ReactElement } from 'react';

import { testkubeApiRef, TestkubeClient } from './api';

type BackstageLazyComponent = (
  props: Record<string, unknown>,
) => ReactElement | null;

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
        import('./components/pages/DashboardPage').then(
          m => m.DashboardPage as BackstageLazyComponent,
        ),
    },
  }),
);

export const TestkubeEntityPage = testkubePlugin.provide(
  createComponentExtension({
    name: 'TestkubeEntityPage',
    component: {
      lazy: () =>
        import('./components/pages/EntityPage').then(
          m => m.EntityPage as BackstageLazyComponent,
        ),
    },
  }),
);
