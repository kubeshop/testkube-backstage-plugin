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

/**
 * TestWorkflowExecutionsResult representa los resultados de la búsqueda de ejecuciones de flujos de trabajo de tests.
 */
export interface TestWorkflowExecutionsResult {
  /** Totales de ejecuciones (todos) */
  totals: ExecutionsTotals;

  /** Totales de ejecuciones (filtrados) */
  filtered: ExecutionsTotals;

  /** Lista de ejecuciones resumen */
  results: TestWorkflowExecutionSummary[];
}

/**
 * ExecutionsTotals representa un resumen de conteos de ejecuciones por estado.
 */
export interface ExecutionsTotals {
  /** @description the total number of executions available */
  results: number;
  /** @description the total number of passed executions available */
  passed: number;
  /** @description the total number of failed executions available */
  failed: number;
  /** @description the total number of queued executions available */
  queued: number;
  /** @description the total number of running executions available */
  running: number;
}

/**
 * TestWorkflowExecutionSummary representa un resumen de una única ejecución de flujo de trabajo.
 */
export interface TestWorkflowExecutionSummary {
  /**
   * Format: bson objectId
   * @description unique execution identifier
   * @example 62f395e004109209b50edfc1
   */
  id: string;
  /**
   * Format: bson objectId
   * @description identifier for group of correlated executions
   * @example 62f395e004109209b50edfc1
   */
  groupId?: string;
  /** @description identifier of the runner where it has been executed */
  runnerId?: string;
  /**
   * @description execution name
   * @example some-workflow-name-1
   */
  name: string;
  /** @description sequence number for the execution */
  number?: number;
  /**
   * Format: date-time
   * @description when the execution has been scheduled to run
   */
  scheduledAt?: string;
  /**
   * Format: date-time
   * @description when the execution result's status has changed last time (queued, passed, failed)
   */
  statusAt?: string;
  result?: TestWorkflowResultSummary;
  workflow: TestWorkflowSummary;
  tags?: TestWorkflowTagValue;
  /** @description running context for the test workflow execution (Pro edition only) */
  runningContext?: TestWorkflowRunningContext;
  configParams?: TestWorkflowExecutionConfig;
  /** @description generated reports from the steps, like junit */
  reports?: TestWorkflowReport[];
  resourceAggregations?: TestWorkflowExecutionResourceAggregationsReport;
}

export interface TestWorkflowResultSummary {
  status: string; /*components["schemas"]["TestWorkflowStatus"];*/
  predictedStatus: string; /*components["schemas"]["TestWorkflowStatus"];*/
  /**
   * Format: date-time
   * @description when the pod was created
   */
  queuedAt?: string;
  /**
   * Format: date-time
   * @description when the pod has been successfully assigned
   */
  startedAt?: string;
  /**
   * Format: date-time
   * @description when the pod has been completed
   */
  finishedAt?: string;
  /** @description Go-formatted (human-readable) duration */
  duration?: string;
  /** @description Go-formatted (human-readable) duration (incl. pause) */
  totalDuration?: string;
  /** @description Duration in milliseconds */
  durationMs: number;
  /** @description Duration in milliseconds (incl. pause) */
  totalDurationMs: number;
  /** @description Pause duration in milliseconds */
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
/** @description running context interface for test workflow execution */
export interface TestWorkflowRunningContextInterface {
  /** @description interface name */
  name?: string;
  type: string;/*components["schemas"]["TestWorkflowRunningContextInterfaceType"];*/
};
/** @description running context actor for test workflow execution */
export interface TestWorkflowRunningContextActor {
  /** @description actor name */
  name?: string;
  /** @description actor email */
  email?: string;
  /** @description test workflow execution id */
  executionId?: string;
  /** @description all test workflow execution ids starting from the root */
  executionPath?: string;
  /** @description reference test workflow execution id */
  executionReference?: string;
  type: string; /*components["schemas"]["TestWorkflowRunningContextActorType"];*/
};

export interface TestWorkflowExecutionConfig {
    [key: string]: TestWorkflowExecutionConfigValue;
};

export interface TestWorkflowExecutionConfigValue {
  /** @description configuration value */
  value?: string;
  /** @description configuration value is empty */
  emptyValue?: boolean;
  /** @description configuration value default */
  defaultValue?: string;
  /** @description configuration value default is empty */
  emptyDefaultValue?: boolean;
  /** @description indicates if the value is truncated */
  truncated?: boolean;
  /** @description marks value as sensitive */
  sensitive?: boolean;
};

export interface TestWorkflowReport {
  /** @description step reference */
  ref?: string;
  /**
   * @description report kind/type
   * @example junit
   * @enum {string}
   */
  kind?: "junit";
  /** @description file path to full report in artifact storage */
  file?: string;
  summary?: TestWorkflowReportSummary;
};

export interface TestWorkflowReportSummary {
  /** @description total number of test cases */
  tests?: number;
  /** @description number of passed test cases */
  passed?: number;
  /** @description number of failed test cases */
  failed?: number;
  /** @description number of skipped test cases */
  skipped?: number;
  /** @description number of error test cases */
  errored?: number;
  /**
   * Format: int64
   * @description total duration of all test cases in milliseconds
   */
  duration?: number;
};


/** @description TestWorkflowExecutionResourceAggregationsReport provides resource usage aggregations
 *     for an entire TestWorkflowExecution (globally) and also per-step (by measurements).
 *      */
export interface TestWorkflowExecutionResourceAggregationsReport {
  global?: TestWorkflowExecutionResourceAggregationsByMeasurement;
  step?: TestWorkflowExecutionStepResourceAggregations[];
};
/** @description Step-based resource metrics aggregations (by measurement and field) */
export interface TestWorkflowExecutionStepResourceAggregations {
  /** @description step reference */
  ref?: string;
  aggregations?: TestWorkflowExecutionResourceAggregationsByMeasurement;
};
/** @description TestWorkflowExecutionResourceAggregationsByMeasurement provides resource usage aggregations
 *     for a specific measurement (e.g. CPU, Memory, etc.) across all steps in a TestWorkflowExecution.
 *      */
export interface TestWorkflowExecutionResourceAggregationsByMeasurement {
  [key: string]: {
    [key: string]: TestWorkflowExecutionResourceAggregations;
  };
};

export interface TestWorkflowExecutionResourceAggregations {
  /**
   * Format: float64
   * @description Total sum of the metric.
   */
  total?: number;
  /**
   * Format: float64
   * @description Minimum value of the metric.
   */
  min?: number;
  /**
   * Format: float64
   * @description Maximum value of the metric.
   */
  max?: number;
  /**
   * Format: float64
   * @description Average value of the metric.
   */
  avg?: number;
  /**
   * Format: float64
   * @description Standard deviation of the metric.
   */
  stdDev?: number;
};
