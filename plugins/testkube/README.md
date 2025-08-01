# Welcome to the Testkube plugin for Backstage!

> **IMPORTANT!**
>
> It's only supported the integration with Testkube OSS, we are planning a future integration with Testkube Enterprise.

This plugin allows you to centralize specific information about automated tests managed from the Testkube platform within Backstage, making it visible from a general perspective as well as by entity.

It has the following features:

* **Testkube Dashboard:** a page containing an overview of the latest automated test executions. It includes a panel with three metrics: Success/Failure Range, Failed Executions, and Total Executions. Below the metrics, the executions are listed with their respective identifier, execution time, execution date, status, and test workflow name.

* **Testkube Entity Page:** a page containing a view of the automated test workflows related to an Entity based on its annotations. It includes a panel with three metrics: Success/Failure Range, Failed Executions, and Total Executions, all respecting the filter by Entity. Then, under the metrics, the automated test workflows are listed with its name and information about last execution: identifier, duration, scheduling date, and current status. The table also allows you to perform four different actions:

  * View the test workflow definition in YAML format.
  * View the logs of the last execution.
  * View the history of the last executions. This history also offers the option to view the log for each execution.
  * Run the test workflow.

_This plugin was created through the Backstage CLI_

## Getting started

This is a Frontend Backstage plugin which means it only has to be configured at the `package/app` of your Backstage project.

### Installing plugin in my Backstage project

To install this plugin use the following command:

```bash
yarn workspace packages/app add @backstage-community/plugin-testkube
```

### Configuring plugin to connect to my Testkube Agent

This plugin only requires to configure the proxy to the Testkube API Server in the `app-config.yaml` file, use the following snippet to configure it:

```yaml
proxy:
  endpoints:
    '/testkube':
      # Here the URL to Testkube API Server HTTP port
      # This example shows how to connect using port forwarding
      target: 'http://localhost:8088'
      changeOrigin: true
      credentials: dangerously-allow-unauthenticated
```

### Adding Testkube plugin pages

#### Testkube Dashboard

To enable **Testkube Dashboard** into your Backstage project edit the file `packages/app/src/App.tsx` to include the following lines:

```javascript
(...)
import { TestkubeDashboardPage } from '@backstage-community/plugin-testkube';

(...)

const routes = (
  <FlatRoutes>
    (...)
    <Route path="/testkube" element={<TestkubeDashboardPage />} />
  </FlatRoutes>
(...)
```

Now it gonna be available at context path `/testkube` of your Backstage app, to also include this page in the side menu change the file `packages/app/src/components/Root/Root.tsx` to include the following lines:

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

Now **Teskube Dashboard** will appear in the side menu of your Backstage app.

> **Tip!**
>
> This plugin also has Feature Flags enabled, you can use it by enclosing the `SidebarItem` with `<FeatureFlagged with='testkube'></FeatureFlagged>`.

#### Testkube Entity Page

To enable **Testkube Entity Page** into your Backstage project edit the file `packages/app/src/components/catalog/EntityPage.tsx` to include the following lines:

```javascript
(...)
import { TestkubeEntityPage, isTestkubeAvailable } from '@backstage-community/plugin-testkube';

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

Now if any entity has the annotation `testkube.io/labels` the tab **Tests Summary** will appear in the entity page. However, it will only show there the test workflows that have the labels declared in the annotation, i.e. this entity:

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

Will show only test workflows which have the label `app=testkube-website`.


## Development guide

Before to start developing please read our [Contributing Manifest](../../CONTRIBUTING.md) and our [Code of Conduct](../../CODE_OF_CONDUCT.md).

We encorage everyone to contribute your changes and improvements raising a PR from your forked repositories 😁.

### Prepare local environment

* You must have installed:
  * Nodejs 20 or later.
  * Kubernetes CLI.
  * Helm CLI.
* Connect to a Kubernetes cluster, you can use [Kind](https://kind.sigs.k8s.io/) to have a local one.
* Testkube OSS running, check here the instructions to [install](https://docs.testkube.io/articles/install/standalone-agent).
* Port forward the Testkube API using the following command: `kubectl port-forward svc/testkube-api-server -n testkube 8088:8088`.
* Pre-load data using the following command from the root directory:

    ```bash
    ./example/testkube/load-data.sh
    ```

### Run Backtage

From the root directory:

```bash
yarn install
yarn dev
```

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
