import { createApiRef } from '@backstage/core-plugin-api';
import {
  components,
  TestWorkflowWithExecutionsFilters
} from '../types';

export const testkubeApiRef = createApiRef<TestkubeApi>({
  id: 'plugin.testkube.service',
});

export type TestkubeApi = {
  getTestWorkflowExecutionsResult(): Promise<components["schemas"]["TestWorkflowExecutionsResult"]>;
  getTestWorkflow(id: string): Promise<string>;
  runTestWorkflowByName(workflowName: string): Promise<components["schemas"]["TestWorkflowExecution"][]>;
  getTestWorkflowExecutionsByName(workflowName: string): Promise<components["schemas"]["TestWorkflowExecutionsResult"]>;
  getTestWorkflowExecutionById(workflowName: string, executionId: string): Promise<components["schemas"]["TestWorkflowExecution"]>;
  getTestWorkflowExecutionLog(workflowName: string, executionId: string): Promise<string>;
  getTestWorkflowsWithExecutions(filters: TestWorkflowWithExecutionsFilters): Promise<components["schemas"]["TestWorkflowWithExecutionSummary"][]>;
};
