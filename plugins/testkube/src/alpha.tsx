import {
  ApiBlueprint,
  createApiFactory,
  identityApiRef,
  discoveryApiRef,
  createFrontendPlugin,
  createRouteRef,
  PageBlueprint,
  ExtensionDefinition,
} from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { testkubeApiRef } from './api/TestkubeApi';
import { TestkubeClient } from './api/TestkubeClient';
import { isTestkubeAvailable } from './hooks/useLabels';
import BugReportIcon from '@material-ui/icons/BugReport';

const testkubeDashboardRouteRef = createRouteRef();

const testkubeApi = ApiBlueprint.make({
  name: 'testkubeApi',
  params: defineParams =>
    defineParams(
      createApiFactory({
        api: testkubeApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          identityApi: identityApiRef,
        },
        factory: ({ discoveryApi, identityApi }) =>
          new TestkubeClient({ discoveryApi, identityApi }),
      }),
    ),
});

const TestkubeDashboardPage = PageBlueprint.make({
  name: 'dashboard',
  params: {
    path: '/testkube',
    title: 'Testkube',
    icon: <BugReportIcon />,
    routeRef: testkubeDashboardRouteRef,
    loader: () =>
      import('./components/pages/DashboardPage').then(m => <m.DashboardPage />),
  },
});

const TestkubeEntityContent = EntityContentBlueprint.make({
  name: 'tests-summary',
  params: {
    path: '/tests-summary',
    title: 'Testkube',
    filter: isTestkubeAvailable,
    loader: () =>
      import('./components/pages/EntityPage').then(m => <m.EntityPage />),
  },
});

const extensions: ExtensionDefinition[] = [
  testkubeApi as ExtensionDefinition,
  TestkubeDashboardPage as ExtensionDefinition,
  TestkubeEntityContent as ExtensionDefinition,
];

export default createFrontendPlugin({
  pluginId: 'testkube',
  routes: {
    root: testkubeDashboardRouteRef,
  },
  extensions,
});
