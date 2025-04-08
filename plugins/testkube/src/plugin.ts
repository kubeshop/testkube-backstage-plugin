import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const testkubePlugin = createPlugin({
  id: 'testkube',
  routes: {
    root: rootRouteRef,
  },
  featureFlags: [
    {
      name: 'testkube'
    }
  ]
});

export const TestkubePage = testkubePlugin.provide(
  createRoutableExtension({
    name: 'TestkubePage',
    component: () =>
      import('./components/DashboardComponent').then(m => m.DashboardComponent),
    mountPoint: rootRouteRef,
  }),
);
