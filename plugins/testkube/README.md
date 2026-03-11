# Welcome to the Testkube plugin for Backstage!

This is the **Testkube UI (frontend) plugin** for [Backstage](https://backstage.io).

It allows you to centralize information about automated tests managed by Testkube directly inside Backstage, both at a global level and at the entity level.

It provides the following main features:

- **Testkube Dashboard:** a page containing an overview of the latest automated test executions. It includes a panel with three metrics: Success/Failure Range, Failed Executions, and Total Executions. Below the metrics, the executions are listed with their identifier, execution time, execution date, status, and test workflow name.

- **Testkube Entity Page:** a page containing a view of the automated test workflows related to an entity based on its annotations. It includes a panel with the same three metrics, all respecting the filter by entity. Under the metrics, the automated test workflows are listed with their name and information about the last execution: identifier, duration, scheduling date, and current status. The table also allows you to:

  - View the test workflow definition in YAML format.
  - View the logs of the last execution.
  - View the history of the last executions (including logs for each execution).
  - Run the test workflow.

_This plugin was originally created through the Backstage CLI._

## Getting started

This is a **frontend** Backstage plugin and must be used together with the **Testkube backend plugin** (`@testkube/backstage-plugin-backend`), which exposes the `testkube` backend service used by this UI.

For backend setup details, see `plugins/testkube-backend/README.md`.

### Installing the plugins in my Backstage project

Install the UI plugin in your Backstage app:

```bash
yarn workspace packages/app add @testkube/backstage-plugin
```

Install the backend plugin in your Backstage backend:

```bash
yarn workspace packages/backend add @testkube/backstage-plugin-backend
```

### Configuring the backend to connect to my Testkube Agent

Register the backend plugin in `packages/backend/src/index.ts` using the new backend system:

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// other plugins...
backend.add(import('@testkube/backstage-plugin-backend'));

backend.start();
```

Then configure the connection to Testkube in your `app-config.yaml` file using the `testkube` section:

```yaml
testkube:
  # Base URL of the Testkube API (for example, using port forwarding)
  apiUrl: 'http://localhost:8088'

  # enterprise settings (optional)
  # enterprise: true
  # uiUrl: https://app.testkube.io
  # organizations:
  #   - id: <your-organization-id>
  #     apiKey: <your-api-key-with-only-read-access!!>
```

You can find a working example of this configuration in this repository’s root `app-config.yaml`.

### Adding Testkube plugin pages

#### Testkube Dashboard

To enable **Testkube Dashboard** into your Backstage project edit the file `packages/app/src/App.tsx` to include the following lines:

```javascript
(...)
import { TestkubeDashboardPage } from '@testkube/backstage-plugin';

(...)

const routes = (
  <FlatRoutes>
    (...)
    <Route path="/testkube" element={<TestkubeDashboardPage />} />
  </FlatRoutes>
(...)
```

Now it will be available at context path `/testkube` of your Backstage app. To also include this page in the side menu, change the file `packages/app/src/components/Root/Root.tsx` to include the following lines:

```javascript
(...)
import BarChartIcon from '@material-ui/icons/BarChart';

(...)

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      (...)
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        (...)
        <SidebarItem icon={BarChartIcon} to="testkube" text="Testkube" />
        (...)
      </SidebarGroup>
      (...)
    </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
```

Now **Testkube Dashboard** will appear in the side menu of your Backstage app.

> **Tip**
>
> This plugin also has feature flags enabled. You can use them by enclosing the `SidebarItem` with `<FeatureFlagged with="testkube"></FeatureFlagged>`.

#### Testkube Entity Page

To enable **Testkube Entity Page** into your Backstage project edit the file `packages/app/src/components/catalog/EntityPage.tsx` to include the following lines:

```javascript
(...)
import { TestkubeEntityPage, isTestkubeAvailable } from '@testkube/backstage-plugin';

const testkubeSummaryPage = (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item xs={12}>
      <TestkubeEntityPage />
    </Grid>
  </Grid>
);

(...)

const websiteEntityPage = (
  <EntityLayout>
    (...)
    <EntityLayout.Route path="/tests-summary" title="Tests Summary" if={isTestkubeAvailable}>
      {testkubeSummaryPage}
    </EntityLayout.Route>
  </EntityLayout>
);
(...)
```

Now if any entity has the annotation `testkube.io/labels` the tab **Tests Summary** will appear in the entity page. It will only show the test workflows that have the labels declared in the annotation, i.e. this entity:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: testkube-website
  annotations:
    testkube.io/labels: app=testkube-website
  labels:
    app: testkube
spec:
  type: website
  lifecycle: experimental
  owner: guests
  system: testkube
```

will show only test workflows which have the label `app=testkube-website`.

## Development guide

Before starting to develop, please read our [Contributing Manifest](../../CONTRIBUTING.md) and our [Code of Conduct](../../CODE_OF_CONDUCT.md).

We encourage everyone to contribute changes and improvements by raising a PR from your forked repositories.

### Prepare local environment

- You must have installed:
  - Node.js 20 or later.
  - Kubernetes CLI.
  - Helm CLI.
- Connect to a Kubernetes cluster (you can use [Kind](https://kind.sigs.k8s.io/) to have a local one).
- Have Testkube OSS running; see the instructions to [install](https://docs.testkube.io/articles/install/standalone-agent).
- Port forward the Testkube API using the following command:

  ```bash
  kubectl port-forward svc/testkube-api-server -n testkube 8088:8088
  ```

- Pre-load example data using the following command from the repository root:

  ```bash
  ./example/testkube/load-data.sh
  ```

### Run Backstage (example app)

From the repository root:

```bash
yarn install
yarn dev
```

### Run the plugin in isolation

You can also serve the plugin in isolation by running the following in the plugin directory:

```bash
yarn start
```

This method of serving the plugin provides quicker iteration speed and a faster startup with hot reloads. It is only meant for local development, and the setup for it can be found inside the [`/dev`](./dev) directory.
