# Testkube backend plugin for Backstage

This is the **Testkube backend plugin** for [Backstage](https://backstage.io).

It exposes a `testkube` backend service that:

- Proxies requests from the Testkube UI plugin to the Testkube API.
- Adds support for Testkube Enterprise organizations and environments.
- Provides metadata endpoints used by the UI plugin (organizations, environments, configuration, redirect URLs).

It is intended to be used together with the **Testkube UI plugin** (`@backstage-community/plugin-testkube`).

## Installation

Add the plugin to your Backstage backend:

````bash
yarn workspace packages/backend add @backstage-community/plugin-testkube-backend
``+

## Wiring the plugin into the backend

This plugin uses the new Backstage backend system (`createBackend`). In your `packages/backend/src/index.ts`, register the plugin:

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// other backend plugins...
backend.add(import('@backstage-community/plugin-testkube-backend'));

backend.start();
````

In this repository you can see a complete example in `packages/backend/src/index.ts`.

## Configuration

The plugin reads its configuration from the `testkube` section of `app-config.yaml`.

### OSS / local setup

For a local Testkube Standalone Agent (for example using `kubectl port-forward`), a minimal configuration looks like:

```yaml
testkube:
  apiUrl: 'http://localhost:8088'
```

This should point to the HTTP endpoint of your Testkube API server.

### Enterprise setup (optional)

When using Testkube Enterprise, you can configure multiple organizations and environments. The backend plugin will:

- Use per‑organization API keys when proxying requests.
- Resolve environments and redirect URLs via the Testkube Enterprise API.

Example configuration:

```yaml
testkube:
  # Base URL of the Testkube API
  apiUrl: 'https://api.testkube.io'

  # Enable enterprise mode
  enterprise: true

  # Base URL of the Testkube UI (used to build redirect URLs)
  uiUrl: 'https://app.testkube.io'

  # List of organizations this Backstage instance should be able to access
  organizations:
    - id: <your-organization-id>
      apiKey: ${TESTKUBE_ORG_1_API_KEY}
    - id: <another-organization-id>
      apiKey: ${TESTKUBE_ORG_2_API_KEY}
```

> **Note**
>
> For enterprise mode to work, `enterprise` must be set to `true`, `uiUrl` must be provided, and at least one organization with an `id` and `apiKey` must be configured.

## HTTP endpoints

The backend plugin registers an HTTP router for the `testkube` service. The Testkube UI plugin uses the following endpoints:

- `GET /config` – returns a summary of the Testkube configuration (enterprise enabled, organization count).
- `GET /organizations` – returns the list of organizations that the UI can select from.
- `GET /organizations/:index/environments` – returns the list of environments for the organization at the given index.
- `GET /redirect` – returns a redirect URL into the Testkube UI for the selected organization and environment.
- `ALL /*` – proxies all other paths to the configured Testkube API (`apiUrl`), optionally using organization/environment information and API keys in enterprise mode.

All routes are protected using Backstage’s `httpAuth` service, and incoming requests are logged.

## Relationship with the UI plugin

The Testkube UI plugin (`@backstage-community/plugin-testkube`):

- Discovers this backend using the Backstage discovery API with the service ID `testkube`.
- Calls the metadata endpoints and proxy paths exposed by this backend plugin.

Make sure you:

1. Install and configure this backend plugin.
2. Install and configure the UI plugin as described in `plugins/testkube/README.md`.

With both plugins configured, Backstage will provide a Testkube dashboard and entity pages powered by your Testkube instance.
