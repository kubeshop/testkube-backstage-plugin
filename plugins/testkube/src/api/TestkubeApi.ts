import { createApiRef } from '@backstage/core-plugin-api';
import {
  TestWorkflowExecution,
  TestWorkflowExecutionsResult
} from '../types';

export const testkubeApiRef = createApiRef<TestkubeApi>({
  id: 'plugin.testkube.service',
});

export type TestkubeApi = {
  getTestWorkflowExecutionsResult(): Promise<TestWorkflowExecutionsResult>;
  getTestWorkflow(id: string): Promise<string>;
  getTestWorkflowExecutionById(workflowName: string, executionId: string): Promise<TestWorkflowExecution>;
  getTestWorkflowExecutionLog(workflowName: string, executionId: string): Promise<string>;
};
