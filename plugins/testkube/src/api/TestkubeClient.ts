import { DiscoveryApi, IdentityApi } from "@backstage/core-plugin-api/*";
import { TestkubeApi } from "./TestkubeApi";
import { TestWorkflowExecutionsResult } from "../types";


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

  private async fetcher(url: string) {
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });
    if (!response.ok) {
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    return await response.json();
  }

  async getTestWorkflowExecutionsResult() {
    const proxyUrl = await this.getBaseUrl();

    return (await this.fetcher(
      `${proxyUrl}/v1/test-workflow-executions`,
    )) as TestWorkflowExecutionsResult;
  }

}
