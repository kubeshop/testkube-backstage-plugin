# Testkube Backstage Plugin

This repository contains the official Testkube plugins for [Backstage](https://backstage.io):

- **Testkube UI plugin** (`plugins/testkube`): adds a Testkube dashboard and an entity-level tests summary page to your Backstage frontend.
- **Testkube backend plugin** (`plugins/testkube-backend`): exposes a `testkube` backend service that proxies requests to the Testkube API and provides additional metadata endpoints used by the UI plugin.

The `packages/app` and `packages/backend` folders contain an example Backstage app wired with these plugins for local development.

## Repository layout

- **Root Backstage app**
  - `packages/app`: example Backstage frontend application.
  - `packages/backend`: example Backstage backend using the new backend system.
- **Plugins**
  - `plugins/testkube`: Testkube UI (frontend) plugin.
  - `plugins/testkube-backend`: Testkube backend plugin.

For detailed installation and configuration instructions, see:

- **UI plugin**: `plugins/testkube/README.md`
- **Backend plugin**: `plugins/testkube-backend/README.md`

## Running the example app locally

This repo includes a full Backstage app you can use to try the Testkube plugins end‑to‑end.

### Prerequisites

- **Node.js** 20 or later.
- A running **Testkube Standalone Agent**. See the Testkube documentation for [installation instructions](https://docs.testkube.io/articles/install/standalone-agent).
- Access to a Kubernetes cluster where Testkube is running (for example via [Kind](https://kind.sigs.k8s.io/)).

Optional but recommended for local testing:

- Port‑forward the Testkube API:

```bash
kubectl port-forward svc/testkube-api-server -n testkube 8088:8088
```

### Configure Testkube connection

In `app-config.yaml`, configure the `testkube` section (a sensible local default is already present):

```yaml
testkube:
  apiUrl: 'http://localhost:8088'

  # enterprise settings (optional)
  # enterprise: true
  # uiUrl: https://app.testkube.io
  # organizations:
  #   - id: <your-organization-id>
  #     apiKey: <your-api-key-with-only-read-access!!>
```

### Start the Backstage example app

From the repository root:

```bash
yarn install
yarn start
```

This will start both the frontend (on port `3000`) and backend (on port `7007`). The Testkube dashboard and entity pages are available in the example app once the plugins are loaded.

### Troubleshooting GitHub auth locally

If you need to debug GitHub authentication instead of using guest auth locally:

1. Create or update `app-config.local.yaml`:

```yaml
app:
  signInPage: github

auth:
  environment: development
  githubAccess:
    allowedDomains:
      - domain.example
    whitelistedEmails:
      - user@example.com
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        signIn:
          resolvers:
            - resolver: domainUserProvisioning

catalog:
  rules:
    - allow: [Component, System, API, Resource, Location, User, Group]
```

2. Export GitHub OAuth credentials in your shell:

```bash
export AUTH_GITHUB_CLIENT_ID=<your_client_id>
export AUTH_GITHUB_CLIENT_SECRET=<your_client_secret>
```

3. In your GitHub OAuth App, set callback URL to:

```text
http://localhost:7007/api/auth/github/handler/frame
```

4. Start the app:

```bash
yarn start
```

5. Verify effective frontend config (optional but useful):

```bash
yarn backstage-cli config:print --frontend --config app-config.yaml --config app-config.local.yaml
```

You should see `app.signInPage: github` in the output. If not, stop and restart `yarn start` after updating config files.

When changing `auth.githubAccess.allowedDomains` or `auth.githubAccess.whitelistedEmails`, restart the backend process to apply changes.

## Using the plugins in your own Backstage instance

If you want to integrate Testkube into your own Backstage deployment, follow the plugin‑specific guides:

- **UI plugin** setup: `plugins/testkube/README.md`
- **Backend plugin** setup: `plugins/testkube-backend/README.md`

These READMEs cover installation, configuration, and how to add the Testkube dashboard and entity tabs to your own Backstage app.
