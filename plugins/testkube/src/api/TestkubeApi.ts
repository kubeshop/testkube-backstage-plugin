import { createApiRef } from '@backstage/core-plugin-api';
import {
  TestWorkflowExecutionsResult
} from '../types';

export const testkubeApiRef = createApiRef<TestkubeApi>({
  id: 'plugin.testkube.service',
});

export type TestkubeApi = {
  getTestWorkflowExecutionsResult(
  ): Promise<TestWorkflowExecutionsResult>;
  getTestWorkflow(id: string): Promise<string>;
};
