import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import {
  TestkubeApi,
  TestkubeConfig,
  Organization,
  Environment,
} from './TestkubeApi';
import { components } from '../types/openapi';
import { TestWorkflowWithExecutionsFilters } from '../types/common';

export type Options = {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
};

export class TestkubeClient implements TestkubeApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  private async getBaseUrl() {
    return await this.discoveryApi.getBaseUrl('testkube');
  }

  private async fetcher(
    url: string,
    options: {
      headers?: Record<string, string>;
      output?: 'json' | 'text';
      method?: string;
      body?: any;
      orgIndex?: number | null;
      envSlug?: string | null;
    } = {},
  ) {
    const {
      headers = {},
      output = 'json',
      method = 'GET',
      body = null,
      orgIndex,
      envSlug,
    } = options;

    const { token: idToken } = await this.identityApi.getCredentials();
    const proxyUrl = await this.getBaseUrl();

    const requestHeaders: Record<string, string> = {
      'User-Agent': 'backstage',
      'Content-Type': 'application/json',
      ...(idToken && { Authorization: `Bearer ${idToken}` }),
      ...headers,
    };

    if (orgIndex !== null && orgIndex !== undefined) {
      requestHeaders['x-org-index'] = orgIndex.toString();
    }
    if (envSlug) {
      requestHeaders['x-env-slug'] = envSlug;
    }

    const response = await fetch(`${proxyUrl}${url}`, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: requestHeaders,
    });

    if (!response.ok) {
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    if (output === 'text') return await response.text();
    return await response.json();
  }

  async getConfig(): Promise<TestkubeConfig> {
    return (await this.fetcher('/config')) as TestkubeConfig;
  }

  async getOrganizations(): Promise<Organization[]> {
    const response = (await this.fetcher('/organizations')) as {
      organizations: Organization[];
    };
    return response.organizations;
  }

  async getEnvironments(orgIndex: number): Promise<Environment[]> {
    const response = (await this.fetcher(
      `/organizations/${orgIndex}/environments`,
    )) as { environments: Environment[] };
    return response.environments;
  }

  async getTestWorkflowExecutionsResult(orgEnv?: {
    orgIndex?: number | null;
    envSlug?: string | null;
  }) {
    return (await this.fetcher('/v1/test-workflow-executions', {
      ...orgEnv,
    })) as components['schemas']['TestWorkflowExecutionsResult'];
  }

  async getTestWorkflow(
    id: string,
    orgEnv?: { orgIndex?: number | null; envSlug?: string | null },
  ) {
    return (await this.fetcher(`/v1/test-workflows/${id}`, {
      headers: { accept: 'text/yaml' },
      output: 'text',
      ...orgEnv,
    })) as string;
  }

  async getTestWorkflowExecutionById(
    workflowName: string,
    executionId: string,
    orgEnv?: { orgIndex?: number | null; envSlug?: string | null },
  ) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions/${executionId}`,
      { ...orgEnv },
    )) as components['schemas']['TestWorkflowExecution'];
  }

  async runTestWorkflowByName(
    workflowName: string,
    orgEnv?: { orgIndex?: number | null; envSlug?: string | null },
  ) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions`,
      {
        method: 'POST',
        body: {},
        ...orgEnv,
      },
    )) as components['schemas']['TestWorkflowExecution'][];
  }

  async getTestWorkflowExecutionsByName(
    workflowName: string,
    orgEnv?: { orgIndex?: number | null; envSlug?: string | null },
  ) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions`,
      {
        ...orgEnv,
      },
    )) as components['schemas']['TestWorkflowExecutionsResult'];
  }

  async getTestWorkflowExecutionLog(
    workflowName: string,
    executionId: string,
    orgEnv?: { orgIndex?: number | null; envSlug?: string | null },
  ) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions/${executionId}/logs`,
      {
        headers: { accept: 'text/plain' },
        output: 'text',
        ...orgEnv,
      },
    )) as string;
  }

  async getTestWorkflowsWithExecutions(
    filters: TestWorkflowWithExecutionsFilters,
    orgEnv?: { orgIndex?: number | null; envSlug?: string | null },
  ): Promise<components['schemas']['TestWorkflowWithExecutionSummary'][]> {
    const { labels, page = 0, pageSize = 14 } = filters;

    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (labels) {
      query.append('selector', labels);
    }

    const data = await this.fetcher(
      `/v1/test-workflow-with-executions?${query.toString()}`,
      { ...orgEnv },
    );
    return data as components['schemas']['TestWorkflowWithExecutionSummary'][];
  }

  async getRedirectUrl(orgEnv?: {
    orgIndex?: number | null;
    envSlug?: string | null;
  }): Promise<{ url: string }> {
    const response = await this.fetcher(`/redirect`, { ...orgEnv });

    return response as { url: string };
  }
}
