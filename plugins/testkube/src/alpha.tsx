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

const TestkubeDashboardPage = PageBlueprint.make({
  params: {
    defaultPath: '/testkube',
    loader: () =>
      import('./components/pages/DashboardPage').then(
        m => m.DashboardPage as any,
      ),
  },
});

const TestkubeEntityPage = PageBlueprint.make({
  params: {
    defaultPath: '/tests-summary',
    loader: () =>
      import('./components/pages/EntityPage').then(m => m.EntityPage as any),
  },
});

export default createFrontendPlugin({
  id: 'testkube',
  extensions: [testkubeApi, TestkubeDashboardPage, TestkubeEntityPage],
});
