import { components } from './openapi';

export type TestWorkflowWithExecutionsFilters = {
  labels?: string;
  page?: number;
  pageSize?: number;
  organization?: string;
  environments?: string[];
};

export type TestWorkflowWithExecutionSummary =
  components['schemas']['TestWorkflowWithExecutionSummary'];

export type TestWorkflowExecutionSummary =
  components['schemas']['TestWorkflowExecutionSummary'];
