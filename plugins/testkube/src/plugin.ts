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
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
