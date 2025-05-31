import { DiscoveryApi, IdentityApi } from "@backstage/core-plugin-api/*";
import { TestkubeApi } from "./TestkubeApi";
import { TestWorkflowExecution, TestWorkflowExecutionsResult } from "../types";


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

  private async fetcher(url: string, headers?: any, output: string = 'json') {
    const { token: idToken } = await this.identityApi.getCredentials();
    const proxyUrl = await this.getBaseUrl();
    const response = await fetch(`${proxyUrl}${url}`, {
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
    return (await this.fetcher('/v1/test-workflow-executions')) as TestWorkflowExecutionsResult;
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
    )) as TestWorkflowExecution;
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
}
