import { createApiRef } from '@backstage/core-plugin-api';
import { components } from '../types/openapi';
import { TestWorkflowWithExecutionsFilters } from '../types/common';

export const testkubeApiRef = createApiRef<TestkubeApi>({
  id: 'plugin.testkube.service',
});

export type TestkubeConfig = {
  isEnterprise: boolean;
  organizationCount: number;
};

export type Organization = {
  index: number;
  id: string;
};

export type Environment = {
  id: string;
  slug: string;
  name: string;
};

export type OrgEnvParams = {
  orgIndex?: number | null;
  envSlug?: string | null;
};

export type TestkubeApi = {
  getConfig(): Promise<TestkubeConfig>;
  getOrganizations(): Promise<Organization[]>;
  getEnvironments(orgIndex: number): Promise<Environment[]>;

  getTestWorkflowExecutionsResult(
    orgEnv?: OrgEnvParams,
  ): Promise<components['schemas']['TestWorkflowExecutionsResult']>;
  getTestWorkflow(id: string, orgEnv?: OrgEnvParams): Promise<string>;
  runTestWorkflowByName(
    workflowName: string,
    orgEnv?: OrgEnvParams,
  ): Promise<components['schemas']['TestWorkflowExecution'][]>;
  getTestWorkflowExecutionsByName(
    workflowName: string,
    orgEnv?: OrgEnvParams,
  ): Promise<components['schemas']['TestWorkflowExecutionsResult']>;
  getTestWorkflowExecutionById(
    workflowName: string,
    executionId: string,
    orgEnv?: OrgEnvParams,
  ): Promise<components['schemas']['TestWorkflowExecution']>;
  getTestWorkflowExecutionLog(
    workflowName: string,
    executionId: string,
    orgEnv?: OrgEnvParams,
  ): Promise<string>;
  getTestWorkflowsWithExecutions(
    filters: TestWorkflowWithExecutionsFilters,
    orgEnv?: OrgEnvParams,
  ): Promise<components['schemas']['TestWorkflowWithExecutionSummary'][]>;
};
