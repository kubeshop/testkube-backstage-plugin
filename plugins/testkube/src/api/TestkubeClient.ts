import { DiscoveryApi, IdentityApi } from "@backstage/core-plugin-api/*";
import { TestkubeApi } from "./TestkubeApi";
import { components, TestWorkflowWithExecutionsFilters} from "../types";


export type Options = {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
};

export class TestkubeClient implements TestkubeApi {
  // @ts-ignore
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
    console.log(`${await this.discoveryApi.getBaseUrl('proxy')}/testkube`);
    return `${await this.discoveryApi.getBaseUrl('proxy')}/testkube`;
  }

  private async fetcher(url: string, headers?: any, output: string = 'json', method: string = 'GET', body: any = null) {
    const { token: idToken } = await this.identityApi.getCredentials();
    const proxyUrl = await this.getBaseUrl();
    const response = await fetch(`${proxyUrl}${url}`, {
      method: method || 'GET',
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
        ...headers
      },
    });
    if (!response.ok) {
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    if (output === 'text') return await response.text();
    return await response.json();
  }

  async getTestWorkflowExecutionsResult() {
    return (await this.fetcher('/v1/test-workflow-executions')) as components["schemas"]["TestWorkflowExecutionsResult"];
  }

  async getTestWorkflow(id: string) {
    return (await this.fetcher(`/v1/test-workflows/${id}`,
      {
        'accept': 'text/yaml'
      },
      'text'
    )) as string;
  }

  async getTestWorkflowExecutionById(workflowName: string, executionId: string) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions/${executionId}`,
    )) as components["schemas"]["TestWorkflowExecution"];
  }

  async runTestWorkflowByName(workflowName: string) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions`,
      {},
      'json',
      'POST',
      {}
    )) as components["schemas"]["TestWorkflowExecution"][];
  }

  async getTestWorkflowExecutionsByName(workflowName: string) {
    return (await this.fetcher(`/v1/test-workflows/${workflowName}/executions`)) as components["schemas"]["TestWorkflowExecutionsResult"];
  }

  async getTestWorkflowExecutionLog(workflowName: string, executionId: string) {
    return (await this.fetcher(
      `/v1/test-workflows/${workflowName}/executions/${executionId}/logs`,
      {
        'accept': 'text/plain'
      },
      'text'
    )) as string;
  }

  async getTestWorkflowsWithExecutions(filters: TestWorkflowWithExecutionsFilters): Promise<components["schemas"]["TestWorkflowWithExecutionSummary"][]> {
  const {
    labels,
    page = 0,
    pageSize = 14,
    organization,
    environments,
  } = filters;

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (labels) {
    query.append('selector', labels);
  }

  // Si hay organización y entornos => modo enterprise
  if (organization && environments?.length === 1) {
    const endpoint = `/organizations/${organization}/environments/${environments[0]}/agent/test-workflow-with-executions?${query.toString()}`;
    const data = await this.fetcher(endpoint);
    return data as components["schemas"]["TestWorkflowWithExecutionSummary"][];
  }

  // Modo no enterprise
  const data = await this.fetcher(`/v1/test-workflow-with-executions?${query.toString()}`);
  return data as components["schemas"]["TestWorkflowWithExecutionSummary"][];
}
}
