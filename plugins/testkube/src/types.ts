export interface TestWorkflowExecution extends TestWorkflowExecutionSummary {
  runnerTarget?: ExecutionTarget;
  runnerOriginalTarget?: ExecutionTarget;
  namespace?: string;
  number?: number;
  assignedAt?: string;
  signature?: TestWorkflowSignature[];
  result?: TestWorkflowResult;
}

export interface ExecutionTarget {
  match: {
    [key: string]: string;
  };
  not: {
    [key: string]: string;
  };
  replicate: string[];
}

export interface TestWorkflowSignature {
  ref?: string;
  name?: string;
  category?: string;
  optional?: boolean;
  negative?: boolean;
  children?: TestWorkflowSignature[];
}

export interface TestWorkflowResult extends TestWorkflowResultSummary {
  initialization: TestWorkflowStepResult;
  steps: {
    [key: string]: TestWorkflowStepResult
  }
}

export interface TestWorkflowStepResult {
  errorMessage?: string;
  status?: string;
  exitCode?: number;
  queuedAt?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface TestWorkflowExecutionsResult {
  totals: ExecutionsTotals;
  filtered: ExecutionsTotals;
  results: TestWorkflowExecutionSummary[];
}

export interface ExecutionsTotals {
  results: number;
  passed: number;
  failed: number;
  queued: number;
  running: number;
}

export interface TestWorkflowExecutionSummary {
  id: string;
  groupId?: string;
  runnerId?: string;
  name: string;
  number?: number;
  scheduledAt?: string;
  statusAt?: string;
  result?: TestWorkflowResultSummary;
  workflow: TestWorkflowSummary;
  tags?: TestWorkflowTagValue;
  runningContext?: TestWorkflowRunningContext;
  configParams?: TestWorkflowExecutionConfig;
  reports?: TestWorkflowReport[];
  resourceAggregations?: TestWorkflowExecutionResourceAggregationsReport;
}

export interface TestWorkflowResultSummary {
  status: string;
  predictedStatus: string;
  queuedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: string;
  totalDuration?: string;
  durationMs: number;
  totalDurationMs: number;
  pausedMs: number;
};

export interface TestWorkflowSummary {
  name?: string;
  namespace?: string;
  labels?: {
      [key: string]: string;
  };
  annotations?: {
      [key: string]: string;
  };
};

export interface TestWorkflowTagValue {
  [key: string]: string;
};

export interface TestWorkflowRunningContext {
  interface: TestWorkflowRunningContextInterface;
  actor: TestWorkflowRunningContextActor;
};

export interface TestWorkflowRunningContextInterface {
  name?: string;
  type: string;
};

export interface TestWorkflowRunningContextActor {
  name?: string;
  email?: string;
  executionId?: string;
  executionPath?: string;
  executionReference?: string;
  type: string;
};

export interface TestWorkflowExecutionConfig {
    [key: string]: TestWorkflowExecutionConfigValue;
};

export interface TestWorkflowExecutionConfigValue {
  value?: string;
  emptyValue?: boolean;
  defaultValue?: string;
  emptyDefaultValue?: boolean;
  truncated?: boolean;
  sensitive?: boolean;
};

export interface TestWorkflowReport {
  ref?: string;
  kind?: "junit";
  file?: string;
  summary?: TestWorkflowReportSummary;
};

export interface TestWorkflowReportSummary {
  tests?: number;
  passed?: number;
  failed?: number;
  skipped?: number;
  errored?: number;
  duration?: number;
};

export interface TestWorkflowExecutionResourceAggregationsReport {
  global?: TestWorkflowExecutionResourceAggregationsByMeasurement;
  step?: TestWorkflowExecutionStepResourceAggregations[];
};

export interface TestWorkflowExecutionStepResourceAggregations {
  ref?: string;
  aggregations?: TestWorkflowExecutionResourceAggregationsByMeasurement;
};

export interface TestWorkflowExecutionResourceAggregationsByMeasurement {
  [key: string]: {
    [key: string]: TestWorkflowExecutionResourceAggregations;
  };
};

export interface TestWorkflowExecutionResourceAggregations {
  total?: number;
  min?: number;
  max?: number;
  avg?: number;
  stdDev?: number;
};
