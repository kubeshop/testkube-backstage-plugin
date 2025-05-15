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

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/keymap/triggers": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Test triggers keymap
       * @description Returns a keymap (supported/allowed fields) for the test trigger UI screen
       */
      get: operations["getKeyMap"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/triggers": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test triggers
       * @description List test triggers from the kubernetes cluster
       */
      get: operations["listTestTriggers"];
      put?: never;
      /**
       * Create new test trigger
       * @description Create new test trigger CRD inside a Kubernetes cluster
       */
      post: operations["createTestTrigger"];
      /**
       * Delete test triggers
       * @description Deletes all or labeled test triggers
       */
      delete: operations["deleteTestTriggers"];
      options?: never;
      head?: never;
      /**
       * Bulk update test triggers
       * @description Updates test triggers provided as an array in the request body
       */
      patch: operations["bulkUpdateTestTriggers"];
      trace?: never;
  };
  "/triggers/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test trigger by ID
       * @description Get test trigger by ID from CRD in kubernetes cluster
       */
      get: operations["getTestTriggerByID"];
      put?: never;
      post?: never;
      /**
       * Delete test trigger
       * @description Deletes a test trigger
       */
      delete: operations["deleteTestTrigger"];
      options?: never;
      head?: never;
      /**
       * Update test trigger
       * @description Update test trigger
       */
      patch: operations["updateTestTrigger"];
      trace?: never;
  };
  "/test-suites": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get all test suites
       * @description Returns array of test suites
       */
      get: operations["listTestSuites"];
      put?: never;
      /**
       * Create new test suite
       * @description Create new test suite action
       */
      post: operations["createTestSuite"];
      /**
       * Delete test suites
       * @description Deletes all or labeled test suites
       */
      delete: operations["deleteTestSuites"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suites/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite by ID
       * @description Returns test suite with given name
       */
      get: operations["getTestSuiteByID"];
      put?: never;
      post?: never;
      /**
       * Delete test suite
       * @description Deletes a test suite
       */
      delete: operations["deleteTestSuite"];
      options?: never;
      head?: never;
      /**
       * Update test suite
       * @description Update test based on test suite content or git based data
       */
      patch: operations["updateTestSuite"];
      trace?: never;
  };
  "/test-suites/{id}/metrics": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite metrics
       * @description Gets test suite metrics for given tests executions, with particular execution status and timings
       */
      get: operations["getTestSuiteMetrics"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suites/{id}/tests": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List tests for test suite
       * @description List available tests for test suite
       */
      get: operations["listTestSuiteTests"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suites/{id}/abort": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Abort all executions of a test suite
       * @description Abort all test executions of a test suite
       */
      post: operations["abortTestSuiteExecutions"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suite-with-executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get all test suite with executions
       * @description Returns array of test suite with executions
       */
      get: operations["listTestSuiteWithExecutions"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suite-with-executions/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite by ID with execution
       * @description Returns test suite with given name with execution
       */
      get: operations["getTestSuiteByIDWithExecution"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suites/{id}/executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get all test suite executions
       * @description Returns array of all available test suite executions
       */
      get: operations["listTestSuiteExecutions"];
      put?: never;
      /**
       * Starts new test suite execution
       * @description New test suite execution returns new execution details on successful execution start
       */
      post: operations["executeTestSuite"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suites/{id}/executions/{executionID}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite execution
       * @description Returns test suite execution with given executionID
       */
      get: operations["getTestSuiteExecution"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      /**
       * Aborts testsuite execution
       * @description Aborts testsuite execution with given executionID
       */
      patch: operations["abortTestSuiteExecution"];
      trace?: never;
  };
  "/test-suites/{id}/executions/{executionID}/artifacts": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite execution artifacts
       * @description Returns test suite execution artifacts with given executionID
       */
      get: operations["getTestSuiteExecutionArtifactsByTestsuite"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suite-executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get all test suite executions
       * @description Returns array of test suite executions
       */
      get: operations["listAllTestSuiteExecutions"];
      put?: never;
      /**
       * Starts new test suite executions
       * @description New test suite executions returns new executions details on successful executions start
       */
      post: operations["executeTestSuites"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-suite-executions/{executionID}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite execution by ID
       * @description Returns test suite execution with given executionID
       */
      get: operations["getTestSuiteExecutionByID"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      /**
       * Aborts testsuite execution
       * @description Aborts testsuite execution with given executionID
       */
      patch: operations["abortTestSuiteExecutionByID"];
      trace?: never;
  };
  "/test-suite-executions/{executionID}/artifacts": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test suite execution artifacts
       * @description Returns test suite execution artifacts with given executionID
       */
      get: operations["getTestSuiteExecutionArtifacts"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get all test executions
       * @description Returns array of test executions
       */
      get: operations["listExecutions"];
      put?: never;
      /**
       * Starts new test executions
       * @description New test executions returns new executions details on successful executions start
       */
      post: operations["executeTests"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions/{executionID}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test execution by ID
       * @description Returns execution with given executionID
       */
      get: operations["getExecutionByID"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions/{id}/artifacts": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get execution's artifacts by ID
       * @description Returns artifacts of the given executionID
       */
      get: operations["getExecutionArtifacts"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions/{id}/logs": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get execution's logs by ID
       * @description Returns logs of the given executionID
       */
      get: operations["getExecutionLogs"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions/{id}/logs/v2": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get execution's logs by ID version 2
       * @description Returns logs of the given executionID version 2
       */
      get: operations["getExecutionLogsV2"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions/{id}/artifacts/{filename}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Download artifact
       * @description Download the artifact file from the given execution
       */
      get: operations["downloadFile"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executions/{id}/artifact-archive": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Download artifact archive
       * @description Download the artifact archive from the given execution
       */
      get: operations["downloadArchive"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/tests": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List tests
       * @description List available tests
       */
      get: operations["listTests"];
      put?: never;
      /**
       * Create new test
       * @description Create new test based on file content, uri or git based data
       */
      post: operations["createTest"];
      /**
       * Delete tests
       * @description Deletes all or labeled tests
       */
      delete: operations["deleteTests"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/tests/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test
       * @description Gets the specified test
       */
      get: operations["getTest"];
      put?: never;
      post?: never;
      /**
       * Delete test
       * @description Deletes a test
       */
      delete: operations["deleteTest"];
      options?: never;
      head?: never;
      /**
       * Update test
       * @description Update test based on test content or git based data
       */
      patch: operations["updateTest"];
      trace?: never;
  };
  "/tests/{id}/abort": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Abort all executions of a test
       * @description Abort all test executions
       */
      post: operations["abortTestExecutions"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/tests/{id}/metrics": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test metrics
       * @description Gets test metrics for given tests executions, with particular execution status and timings
       */
      get: operations["getTestMetrics"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-with-executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test with executions
       * @description List available test with executions
       */
      get: operations["listTestWithExecutions"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-with-executions/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test with execution
       * @description Gets the specified test with execution
       */
      get: operations["getTestWithExecution"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/tests/{id}/executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get all test executions
       * @description Returns array of all available test executions
       */
      get: operations["listTestExecutions"];
      put?: never;
      /**
       * Starts new test execution
       * @description New test execution returns new execution details on successful execution start
       */
      post: operations["executeTest"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/tests/{id}/executions/{executionID}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test execution
       * @description Returns execution with given executionID
       */
      get: operations["getTestExecution"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      /**
       * Aborts execution
       * @description Aborts execution with given executionID
       */
      patch: operations["abortExecution"];
      trace?: never;
  };
  "/executors": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List executors
       * @description List executors available in cluster
       */
      get: operations["listExecutors"];
      put?: never;
      /**
       * Create new executor
       * @description Create new executor based on variables passed in request
       */
      post: operations["createExecutor"];
      /**
       * Delete executors
       * @description Deletes labeled executors
       */
      delete: operations["deleteExecutors"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/executors/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get executor details
       * @description Returns executors data with executions passed to executor
       */
      get: operations["getExecutor"];
      put?: never;
      post?: never;
      /**
       * Delete executor
       * @description Deletes executor by its name
       */
      delete: operations["deleteExecutor"];
      options?: never;
      head?: never;
      /**
       * Update executor
       * @description Update new executor based on variables passed in request
       */
      patch: operations["updateExecutor"];
      trace?: never;
  };
  "/executor-by-types": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get executor details by type
       * @description Returns executors data with executions passed to executor
       */
      get: operations["getExecutorByType"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/labels": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List labels
       * @description list all available labels
       */
      get: operations["listLabels"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/tags": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List tags
       * @description list all available tags
       */
      get: operations["listTags"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/webhooks": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List webhooks
       * @description List webhooks available in cluster
       */
      get: operations["listWebhooks"];
      put?: never;
      /**
       * Create new webhook
       * @description Create new webhook based on variables passed in request
       */
      post: operations["createWebhook"];
      /**
       * Delete webhooks
       * @description Deletes labeled webhooks
       */
      delete: operations["deleteWebhooks"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/webhooks/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get webhook details
       * @description Returns webhook
       */
      get: operations["getWebhook"];
      put?: never;
      post?: never;
      /**
       * Delete webhook
       * @description Deletes webhook by its name
       */
      delete: operations["deleteWebhook"];
      options?: never;
      head?: never;
      /**
       * Update new webhook
       * @description Update new webhook based on variables passed in request
       */
      patch: operations["updateWebhook"];
      trace?: never;
  };
  "/webhook-templates": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List webhook templates
       * @description List webhook templates available in cluster
       */
      get: operations["listWebhookTemplates"];
      put?: never;
      /**
       * Create new webhook template
       * @description Create new webhook template based on variables passed in request
       */
      post: operations["createWebhookTemplate"];
      /**
       * Delete webhook templates
       * @description Deletes labeled webhook templates
       */
      delete: operations["deleteWebhookTemplates"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/webhook-templates/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get webhook template details
       * @description Returns webhook template
       */
      get: operations["getWebhookTemplate"];
      put?: never;
      post?: never;
      /**
       * Delete webhook template
       * @description Deletes webhook template by its name
       */
      delete: operations["deleteWebhookTemplate"];
      options?: never;
      head?: never;
      /**
       * Update new webhook template
       * @description Update new webhook template based on variables passed in request
       */
      patch: operations["updateWebhookTemplate"];
      trace?: never;
  };
  "/templates": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List templates
       * @description List templates available in cluster
       */
      get: operations["listTemplates"];
      put?: never;
      /**
       * Create new template
       * @description Create new template based on variables passed in request
       */
      post: operations["createTemplate"];
      /**
       * Delete templates
       * @description Deletes labeled templates
       */
      delete: operations["deleteTemplates"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/templates/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get template details
       * @description Returns template
       */
      get: operations["getTemplate"];
      put?: never;
      post?: never;
      /**
       * Delete template
       * @description Deletes template by its name
       */
      delete: operations["deleteTemplate"];
      options?: never;
      head?: never;
      /**
       * Update new template
       * @description Update new template based on variables passed in request
       */
      patch: operations["updateTemplate"];
      trace?: never;
  };
  "/config": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get config
       * @description Get config from cluster storage state
       */
      get: operations["getConfig"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      /**
       * Update config
       * @description Updates config in cluster storage state
       */
      patch: operations["updateConfigKey"];
      trace?: never;
  };
  "/debug": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get debug information
       * @description Gets information that is needed for debugging and opening Testkube bug reports
       */
      get: operations["getDebugInfo"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-sources": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test sources
       * @description List test sources available in cluster
       */
      get: operations["listTestSources"];
      put?: never;
      /**
       * Create new test source
       * @description Create new test source based on variables passed in request
       */
      post: operations["createTestSource"];
      /**
       * Delete test sources
       * @description Deletes labeled test sources
       */
      delete: operations["deleteTestSources"];
      options?: never;
      head?: never;
      /**
       * Process test source batch (create, update, delete)
       * @description Process test source batch based on variables passed in request
       */
      patch: operations["processTestSourceBatch"];
      trace?: never;
  };
  "/test-sources/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test source data
       * @description Returns test sources data
       */
      get: operations["getTestSource"];
      put?: never;
      post?: never;
      /**
       * Delete test source
       * @description Deletes test source by its name
       */
      delete: operations["deleteTestSource"];
      options?: never;
      head?: never;
      /**
       * Update test source
       * @description Update test source based on test content or git based data
       */
      patch: operations["updateTestSource"];
      trace?: never;
  };
  "/uploads": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Upload file
       * @description Upload file to be used in executions and tests
       */
      post: operations["uploads"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/repositories": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Validate new repository
       * @description Validate new repository based on variables passed in request
       */
      post: operations["validateRepository"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/secrets": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List secrets
       * @description List secrets available in cluster
       */
      get: operations["listSecrets"];
      put?: never;
      /**
       * Create secret
       * @description Create secret in the cluster
       */
      post: operations["createSecret"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/secrets/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get secret
       * @description Get secret in the cluster
       */
      get: operations["getSecret"];
      put?: never;
      post?: never;
      /**
       * Delete secret
       * @description Delete secret in the cluster
       */
      delete: operations["deleteSecret"];
      options?: never;
      head?: never;
      /**
       * Update secret
       * @description Update secret in the cluster
       */
      patch: operations["updateSecret"];
      trace?: never;
  };
  "/test-workflows": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflows
       * @description List test workflows from the kubernetes cluster
       */
      get: operations["listTestWorkflows"];
      put?: never;
      /**
       * Create test workflow
       * @description Create test workflow in the kubernetes cluster
       */
      post: operations["createTestWorkflow"];
      /**
       * Delete test workflows
       * @description Delete test workflows from the kubernetes cluster
       */
      delete: operations["deleteTestWorkflows"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-with-executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflows with latest execution
       * @description List test workflows from the kubernetes cluster with latest execution
       */
      get: operations["listTestWorkflowWithExecutions"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-with-executions/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow details with latest execution
       * @description Get test workflow details from the kubernetes cluster with latest execution
       */
      get: operations["getTestWorkflowWithExecution"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-with-executions/{id}/tags": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflow execution tags
       * @description List test workflow execution tags for all executed test workflows
       */
      get: operations["listTestWorkflowWithExecutionTags"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflow executions
       * @description List test workflow executions
       */
      get: operations["listTestWorkflowExecutionsByTestWorkflow"];
      put?: never;
      /**
       * Execute test workflow
       * @description Execute test workflow in the kubernetes cluster
       */
      post: operations["executeTestWorkflow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/tags": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflow execution tags
       * @description List test workflow execution tags for all executed test workflows
       */
      get: operations["listTestWorkflowTagsByTestWorkflow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/metrics": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow metrics
       * @description Get metrics of test workflow executions
       */
      get: operations["getTestWorkflowMetrics"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/executions/{executionID}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow execution
       * @description Get test workflow execution details
       */
      get: operations["getTestWorkflowExecutionByTestWorkflow"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/executions/{executionID}/abort": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Abort test workflow execution
       * @description Abort test workflow execution
       */
      post: operations["abortTestWorkflowExecutionByTestWorkflow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/executions/{executionID}/rerun": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Rerun test workflow execution
       * @description Rerun test workflow execution
       */
      post: operations["rerunTestWorkflowExecutionByTestWorkflow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflow executions
       * @description List test workflow executions
       */
      get: operations["listTestWorkflowExecutions"];
      put?: never;
      /**
       * Execute test workflows
       * @description Execute test workflows in the kubernetes cluster
       */
      post: operations["executeTestWorkflows"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions/{executionID}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow execution
       * @description Get test workflow execution details
       */
      get: operations["getTestWorkflowExecution"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions/{executionID}/artifacts": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow execution's artifacts by ID
       * @description Returns artifacts of the given executionID
       */
      get: operations["getTestWorkflowExecutionArtifacts"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions/{executionID}/artifacts/{filename}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Download test workflow artifact
       * @description Download the artifact file from the given execution
       */
      get: operations["downloadTestWorkflowArtifact"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions/{executionID}/artifact-archive": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Download test workflow artifact archive
       * @description Download the artifact archive from the given execution
       */
      get: operations["downloadTestWorkflowArtifactArchive"];
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions/{executionID}/abort": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Abort test workflow execution
       * @description Abort test workflow execution
       */
      post: operations["abortTestWorkflowExecution"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-executions/{executionID}/rerun": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Rerun test workflow execution
       * @description Rerun test workflow execution
       */
      post: operations["rerunTestWorkflowExecution"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}/abort": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Abort all test workflow executions
       * @description Abort all test workflow executions
       */
      post: operations["abortAllTestWorkflowExecutions"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/preview-test-workflow": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /**
       * Preview test workflow
       * @description Preview test workflow after including templates inside
       */
      post: operations["previewTestWorkflow"];
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflows/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow details
       * @description Get test workflow details from the kubernetes cluster
       */
      get: operations["getTestWorkflow"];
      /**
       * Update test workflow details
       * @description Update test workflow details in the kubernetes cluster
       */
      put: operations["updateTestWorkflow"];
      post?: never;
      /**
       * Delete test workflow
       * @description Delete test workflow from the kubernetes cluster
       */
      delete: operations["deleteTestWorkflow"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-templates": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * List test workflow templates
       * @description List test workflow templates from the kubernetes cluster
       */
      get: operations["listTestWorkflowTemplates"];
      put?: never;
      /**
       * Create test workflow template
       * @description Create test workflow template in the kubernetes cluster
       */
      post: operations["createTestWorkflowTemplate"];
      /**
       * Delete test workflow templates
       * @description Delete test workflow templates from the kubernetes cluster
       */
      delete: operations["deleteTestWorkflowTemplates"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/test-workflow-templates/{id}": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /**
       * Get test workflow template details
       * @description Get test workflow template details from the kubernetes cluster
       */
      get: operations["getTestWorkflowTemplate"];
      /**
       * Update test workflow template details
       * @description Update test workflow template details in the kubernetes cluster
       */
      put: operations["updateTestWorkflowTemplate"];
      post?: never;
      /**
       * Delete test workflow template
       * @description Delete test workflow template from the kubernetes cluster
       */
      delete: operations["deleteTestWorkflowTemplate"];
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
      ExecutionsMetrics: {
          /**
           * @description Percentage pass to fail ratio
           * @example 50
           */
          passFailRatio?: number;
          /**
           * @description 50th percentile of all durations
           * @example 7m2.71s
           */
          executionDurationP50?: string;
          /**
           * @description 50th percentile of all durations in milliseconds
           * @example 422
           */
          executionDurationP50ms?: number;
          /**
           * @description 90th percentile of all durations
           * @example 7m2.71s
           */
          executionDurationP90?: string;
          /**
           * @description 90th percentile of all durations in milliseconds
           * @example 422
           */
          executionDurationP90ms?: number;
          /**
           * @description 95th percentile of all durations
           * @example 7m2.71s
           */
          executionDurationP95?: string;
          /**
           * @description 95th percentile of all durations in milliseconds
           * @example 422
           */
          executionDurationP95ms?: number;
          /**
           * @description 99th percentile of all durations
           * @example 7m2.71s
           */
          executionDurationP99?: string;
          /**
           * @description 99th percentile of all durations in milliseconds
           * @example 422
           */
          executionDurationP99ms?: number;
          /**
           * @description total executions number
           * @example 2
           */
          totalExecutions?: number;
          /**
           * @description failed executions number
           * @example 1
           */
          failedExecutions?: number;
          /** @description List of test/testsuite executions */
          executions?: components["schemas"]["ExecutionsMetricsExecutions"][];
      };
      ExecutionsMetricsExecutions: {
          executionId?: string;
          groupId?: string;
          duration?: string;
          durationMs?: number;
          status?: string;
          name?: string;
          /** Format: date-time */
          startTime?: string;
          runnerId?: string;
      };
      /**
       * @description execution variables passed to executor converted to vars for usage in tests
       * @example {
       *       "var1": {
       *         "name": "var1",
       *         "type": "basic",
       *         "value": "value1"
       *       },
       *       "secret1": {
       *         "name": "secret1",
       *         "type": "secret",
       *         "value": "secretvalue1"
       *       }
       *     }
       */
      Variables: {
          [key: string]: components["schemas"]["Variable"];
      };
      Variable: {
          name?: string;
          value?: string;
          type?: components["schemas"]["VariableType"];
          secretRef?: components["schemas"]["SecretRef"];
          configMapRef?: components["schemas"]["ConfigMapRef"];
      };
      /** @enum {string} */
      VariableType: "basic" | "secret";
      ObjectRef: {
          /**
           * @description object kubernetes namespace
           * @example testkube
           */
          namespace?: string;
          /**
           * @description object name
           * @example name
           */
          name: string;
      };
      /** @description Testkube internal reference for secret storage in Kubernetes secrets */
      SecretRef: {
          /** @description object kubernetes namespace */
          namespace?: string;
          /** @description object name */
          name: string;
          /** @description object key */
          key: string;
      };
      /** @description Testkube internal reference for data in Kubernetes config maps */
      ConfigMapRef: {
          /** @description object kubernetes namespace */
          namespace?: string;
          /** @description object name */
          name: string;
          /** @description object key */
          key: string;
      };
      TestSuite: {
          /** @example test-suite1 */
          name: string;
          /** @example testkube */
          namespace?: string;
          /** @example collection of tests */
          description?: string;
          /**
           * @description Run these batch steps before whole suite
           * @example [
           *       {
           *         "stopOnFailure": true,
           *         "execute": [
           *           {
           *             "test": "example-test"
           *           }
           *         ]
           *       }
           *     ]
           */
          before?: components["schemas"]["TestSuiteBatchStep"][];
          /**
           * @description Batch steps to run
           * @example [
           *       {
           *         "stopOnFailure": true,
           *         "execute": [
           *           {
           *             "test": "example-test"
           *           }
           *         ]
           *       }
           *     ]
           */
          steps?: components["schemas"]["TestSuiteBatchStep"][];
          /**
           * @description Run these batch steps after whole suite
           * @example [
           *       {
           *         "stopOnFailure": true,
           *         "execute": [
           *           {
           *             "test": "example-test"
           *           }
           *         ]
           *       }
           *     ]
           */
          after?: components["schemas"]["TestSuiteBatchStep"][];
          /**
           * @description test suite labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description schedule to run test suite
           * @example * * * * *
           */
          schedule?: string;
          /**
           * @default 1
           * @example 1
           */
          repeats: number;
          /** Format: date-time */
          created?: string;
          executionRequest?: components["schemas"]["TestSuiteExecutionRequest"];
          status: components["schemas"]["TestSuiteStatus"];
          /** @description if test suite is offline and cannot be executed */
          readOnly?: boolean;
      };
      TestSuiteV2: {
          /** @example test-suite1 */
          name: string;
          /** @example testkube */
          namespace?: string;
          /** @example collection of tests */
          description?: string;
          /**
           * @description Run this step before whole suite
           * @example [
           *       {
           *         "stopTestOnFailure": true,
           *         "execute": {
           *           "namespace": "testkube",
           *           "name": "example-test"
           *         }
           *       }
           *     ]
           */
          before?: components["schemas"]["TestSuiteStepV2"][];
          /**
           * @description Steps to run
           * @example [
           *       {
           *         "stopTestOnFailure": true,
           *         "execute": {
           *           "namespace": "testkube",
           *           "name": "example-test"
           *         }
           *       }
           *     ]
           */
          steps?: components["schemas"]["TestSuiteStepV2"][];
          /**
           * @description Run this step after whole suite
           * @example [
           *       {
           *         "stopTestOnFailure": true,
           *         "execute": {
           *           "namespace": "testkube",
           *           "name": "example-test"
           *         }
           *       }
           *     ]
           */
          after?: components["schemas"]["TestSuiteStepV2"][];
          /**
           * @description test suite labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description schedule to run test suite
           * @example * * * * *
           */
          schedule?: string;
          /**
           * @default 1
           * @example 1
           */
          repeats: number;
          /** Format: date-time */
          created?: string;
          executionRequest?: components["schemas"]["TestSuiteExecutionRequest"];
          status: components["schemas"]["TestSuiteStatus"];
      };
      /** @enum {string} */
      TestSuiteStepType: "executeTest" | "delay";
      /** @description set of steps run in parallel */
      TestSuiteBatchStep: {
          /** @default true */
          stopOnFailure: boolean;
          downloadArtifacts?: components["schemas"]["DownloadArtifactOptions"];
          execute?: components["schemas"]["TestSuiteStep"][];
      };
      /** @description options to download artifacts from previous steps */
      DownloadArtifactOptions: {
          /** @default false */
          allPreviousSteps: boolean;
          /** @description previous step numbers starting from 1 */
          previousStepNumbers?: number[];
          /** @description previous test names */
          previousTestNames?: string[];
      };
      TestSuiteStep: {
          /**
           * @description object name
           * @example name
           */
          test?: string;
          /**
           * Format: duration
           * @description delay duration in time units
           * @example 1s
           */
          delay?: string;
          /** @description test suite step execution request parameters */
          executionRequest?: components["schemas"]["TestSuiteStepExecutionRequest"];
      };
      TestSuiteStepV2: {
          /** @default true */
          stopTestOnFailure: boolean;
          execute?: components["schemas"]["TestSuiteStepExecuteTestV2"];
          delay?: components["schemas"]["TestSuiteStepDelayV2"];
      };
      TestSuiteStepExecuteTestV2: components["schemas"]["ObjectRef"];
      TestSuiteStepDelayV2: {
          /**
           * @description delay duration in milliseconds
           * @default 0
           */
          duration: number;
      };
      /** @description Test suite executions data */
      TestSuiteExecution: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc1
           */
          id: string;
          /**
           * @description execution name
           * @example test-suite1.needlessly-sweet-imp
           */
          name: string;
          /** @description object name and namespace */
          testSuite: components["schemas"]["ObjectRef"];
          status?: components["schemas"]["TestSuiteExecutionStatus"];
          /**
           * @deprecated
           * @description Environment variables passed to executor. Deprecated: use Basic Variables instead
           * @example {
           *       "record": "true",
           *       "prefix": "some-"
           *     }
           */
          envs?: {
              [key: string]: string;
          };
          variables?: components["schemas"]["Variables"];
          /**
           * @description secret uuid
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly secretUUID?: string;
          /**
           * Format: date-time
           * @description test start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description test end time
           */
          endTime?: string;
          /**
           * @description test duration
           * @example 2m
           */
          duration?: string;
          /**
           * @description test duration in ms
           * @example 6000
           */
          durationMs?: number;
          /** @description steps execution results */
          stepResults?: components["schemas"]["TestSuiteStepExecutionResultV2"][];
          /** @description batch steps execution results */
          executeStepResults?: components["schemas"]["TestSuiteBatchStepExecutionResult"][];
          /**
           * @description test suite labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /** @description running context for the test suite execution */
          runningContext?: components["schemas"]["RunningContext"];
          /** @description test suite execution name started the test suite execution */
          testSuiteExecutionName?: string;
          /**
           * @description whether webhooks on this execution are disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disableWebhooks: boolean;
      };
      TestSuiteExecutionCR: {
          /** @description test suite name and namespace */
          testSuite: components["schemas"]["ObjectRef"];
          /** @description test suite execution request parameters */
          executionRequest?: components["schemas"]["TestSuiteExecutionRequest"];
          /** @description test suite execution status */
          status?: components["schemas"]["TestSuiteExecutionStatusCR"];
      };
      /** @description test suite execution status */
      TestSuiteExecutionStatusCR: {
          latestExecution?: components["schemas"]["TestSuiteExecution"];
          /**
           * Format: int64
           * @description test suite execution generation
           */
          generation?: number;
      };
      /** @enum {string} */
      TestSuiteExecutionStatus: "queued" | "running" | "passed" | "failed" | "aborting" | "aborted" | "timeout";
      /** @description execution result returned from executor */
      TestSuiteStepExecutionResult: {
          step?: components["schemas"]["TestSuiteStep"];
          /** @description object name and namespace */
          test?: components["schemas"]["ObjectRef"];
          /** @description test step execution, NOTE: the execution output will be empty, retrieve it directly form the test execution */
          execution?: components["schemas"]["Execution"];
      };
      /** @description execution result returned from executor */
      TestSuiteStepExecutionResultV2: {
          step?: components["schemas"]["TestSuiteStepV2"];
          /** @description object name and namespace */
          test?: components["schemas"]["ObjectRef"];
          /** @description test step execution */
          execution?: components["schemas"]["Execution"];
      };
      /** @description execution result returned from executor */
      TestSuiteBatchStepExecutionResult: {
          step?: components["schemas"]["TestSuiteBatchStep"];
          execute?: components["schemas"]["TestSuiteStepExecutionResult"][];
          /**
           * Format: date-time
           * @description step start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description step end time
           */
          endTime?: string;
          /**
           * @description step duration
           * @example 2m
           */
          duration?: string;
      };
      /** @description the result for a page of executions */
      TestSuiteExecutionsResult: {
          totals: components["schemas"]["ExecutionsTotals"];
          filtered?: components["schemas"]["ExecutionsTotals"];
          results: components["schemas"]["TestSuiteExecutionSummary"][];
      };
      /** @description Test execution summary */
      TestSuiteExecutionSummary: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc1
           */
          id: string;
          /**
           * @description execution name
           * @example test-suite1.needlessly-sweet-imp
           */
          name: string;
          /**
           * @description name of the test suite
           * @example test-suite1
           */
          testSuiteName: string;
          status: components["schemas"]["TestSuiteExecutionStatus"];
          /**
           * Format: date-time
           * @description test suite execution start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description test suite execution end time
           */
          endTime?: string;
          /**
           * @description test suite execution duration
           * @example 00:00:09
           */
          duration?: string;
          /**
           * @description test suite execution duration in ms
           * @example 9009
           */
          durationMs?: number;
          execution?: components["schemas"]["TestSuiteBatchStepExecutionSummary"][];
          /**
           * @description test suite and execution labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
      };
      /** @description Test suite execution summary */
      TestSuiteStepExecutionSummary: {
          /** @example 62f395e004109209b50edfc4 */
          id: string;
          /**
           * @description execution name
           * @example run:testkube/test1
           */
          name: string;
          /**
           * @description test name
           * @example test1
           */
          testName?: string;
          status: components["schemas"]["ExecutionStatus"];
          type?: components["schemas"]["TestSuiteStepType"];
      };
      /** @description Test suite batch execution summary */
      TestSuiteBatchStepExecutionSummary: {
          execute?: components["schemas"]["TestSuiteStepExecutionSummary"][];
      };
      /** @description test suite status */
      TestSuiteStatus: {
          latestExecution?: components["schemas"]["TestSuiteExecutionCore"];
      };
      /** @description test suite execution core */
      TestSuiteExecutionCore: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc4
           */
          id?: string;
          /**
           * Format: date-time
           * @description test suite execution start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description test suite execution end time
           */
          endTime?: string;
          status?: components["schemas"]["TestSuiteExecutionStatus"];
      };
      Test: {
          /**
           * @description test name
           * @example test1
           */
          name?: string;
          /**
           * @description test namespace
           * @example testkube
           */
          namespace?: string;
          /**
           * @description test description
           * @example this test is used for that purpose
           */
          description?: string;
          /**
           * @description test type
           * @example postman/collection
           */
          type?: string;
          /** @description test content */
          content?: components["schemas"]["TestContent"];
          /**
           * @description reference to test source resource
           * @example my-private-repository-test
           */
          source?: string;
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          created?: string;
          /**
           * @description test labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description schedule to run test
           * @example * * * * *
           */
          schedule?: string;
          /** @description if test is offline and cannot be executed */
          readOnly?: boolean;
          /**
           * @description list of file paths that will be needed from uploads
           * @example [
           *       "settings/config.txt"
           *     ]
           */
          uploads?: string[];
          executionRequest?: components["schemas"]["ExecutionRequest"];
          status?: components["schemas"]["TestStatus"];
      };
      TestExecutionCR: {
          /** @description test name and namespace */
          test: components["schemas"]["ObjectRef"];
          /** @description test execution request parameters */
          executionRequest?: components["schemas"]["ExecutionRequest"];
          /** @description test execution status */
          status?: components["schemas"]["TestExecutionStatusCR"];
      };
      /** @description test execution status */
      TestExecutionStatusCR: {
          latestExecution?: components["schemas"]["Execution"];
          /**
           * Format: int64
           * @description test execution generation
           */
          generation?: number;
      };
      TestContent: {
          /**
           * @description type of sources a runner can get data from.
           *       string: String content (e.g. Postman JSON file).
           *       file-uri: content stored on the webserver.
           *       git-file: the file stored in the Git repo in the given repository.path field (Deprecated: use git instead).
           *       git-dir: the entire git repo or git subdirectory depending on the  repository.path field (Testkube does a shadow clone and sparse checkout to limit IOs in the case of monorepos). (Deprecated: use git instead).
           *       git: automatically provisions either a file, directory or whole git repository depending on the repository.path field.
           *
           * @enum {string}
           */
          type?: "string" | "file-uri" | "git-file" | "git-dir" | "git";
          repository?: components["schemas"]["Repository"];
          /** @description test content data as string */
          data?: string;
          /**
           * @description test content
           * @example https://github.com/kubeshop/testkube
           */
          uri?: string;
      };
      /** @description test content request body */
      TestContentRequest: {
          repository?: components["schemas"]["RepositoryParameters"];
      };
      /** @description test content update body */
      TestContentUpdate: components["schemas"]["TestContent"] | null;
      /** @description test content update request body */
      TestContentUpdateRequest: components["schemas"]["TestContentRequest"] | null;
      /** @description Test source resource for shared test content */
      TestSource: {
          /**
           * @description test source name
           * @example testsource1
           */
          name?: string;
          /**
           * @description test source namespace
           * @example testkube
           */
          namespace?: string;
          /** @description test source labels */
          labels?: {
              [key: string]: string;
          };
      } & components["schemas"]["TestContent"];
      /** @description Test source resource update for shared test content */
      TestSourceUpdate: ({
          /**
           * @description test source name
           * @example testsource1
           */
          name?: string;
          /**
           * @description test source namespace
           * @example testkube
           */
          namespace?: string;
          /** @description test source labels */
          labels?: {
              [key: string]: string;
          };
      } & components["schemas"]["TestContent"]) | null;
      /** @description test source create request body */
      TestSourceUpsertRequest: {
          /**
           * @description test source name
           * @example testsource1
           */
          name?: string;
          /**
           * @description test source namespace
           * @example testkube
           */
          namespace?: string;
          /** @description test source labels */
          labels?: {
              [key: string]: string;
          };
      } & components["schemas"]["TestContent"];
      /** @description test source update request body */
      TestSourceUpdateRequest: ({
          /**
           * @description test source name
           * @example testsource1
           */
          name?: string;
          /**
           * @description test source namespace
           * @example testkube
           */
          namespace?: string;
          /** @description test source labels */
          labels?: {
              [key: string]: string;
          };
      } & components["schemas"]["TestContent"]) | null;
      /** @description test status */
      TestStatus: {
          latestExecution?: components["schemas"]["ExecutionCore"];
      };
      /** @description test execution core */
      ExecutionCore: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc4
           */
          id?: string;
          /**
           * @description execution number
           * @example 1
           */
          number?: number;
          /**
           * Format: date-time
           * @description test start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description test end time
           */
          endTime?: string;
          status?: components["schemas"]["ExecutionStatus"];
      };
      /** @description test execution */
      Execution: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc4
           */
          id?: string;
          /**
           * @description unique test name (CRD Test name)
           * @example example-test
           */
          testName?: string;
          /**
           * @description unique test suite name (CRD Test suite name), if it's run as a part of test suite
           * @example test-suite1
           */
          testSuiteName?: string;
          /**
           * @description test namespace
           * @example testkube
           */
          testNamespace?: string;
          /**
           * @description test type e.g. postman/collection
           * @example postman/collection
           */
          testType?: string;
          /**
           * @description execution name
           * @example test-suite1-example-test-1
           */
          name?: string;
          /**
           * @description execution number
           * @example 1
           */
          number?: number;
          /**
           * @deprecated
           * @description Environment variables passed to executor. Deprecated: use Basic Variables instead
           * @example {
           *       "record": "true",
           *       "prefix": "some-"
           *     }
           */
          envs?: {
              [key: string]: string;
          };
          /**
           * @description executor image command
           * @example [
           *       "curl"
           *     ]
           */
          command?: string[];
          /**
           * @description additional arguments/flags passed to executor binary
           * @example [
           *       "--concurrency",
           *       "2",
           *       "--remote",
           *       "--some",
           *       "blabla"
           *     ]
           */
          args?: string[];
          /**
           * @description usage mode for arguments
           * @enum {string}
           */
          args_mode?: "append" | "override" | "replace";
          variables?: components["schemas"]["Variables"];
          /**
           * @description in case the variables file is too big, it will be uploaded to storage
           * @example false
           */
          isVariablesFileUploaded?: boolean;
          /** @description variables file content - need to be in format for particular executor (e.g. postman envs file) */
          variablesFile?: string;
          /**
           * @description test secret uuid
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly testSecretUUID?: string;
          /**
           * @description test suite secret uuid, if it's run as a part of test suite
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly testSuiteSecretUUID?: string;
          content?: components["schemas"]["TestContent"];
          /**
           * Format: date-time
           * @description test start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description test end time
           */
          endTime?: string;
          /**
           * @description test duration
           * @example 88s
           */
          duration?: string;
          /**
           * @description test duration in milliseconds
           * @example 10000
           */
          durationMs?: number;
          /** @description result get from executor */
          executionResult?: components["schemas"]["ExecutionResult"];
          /**
           * @description test and execution labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description list of file paths that need to be copied into the test from uploads
           * @example [
           *       "settings/config.txt"
           *     ]
           */
          uploads?: string[];
          /**
           * @description minio bucket name to get uploads from
           * @example execution-c01d7cf6-ec3f-47f0-9556-a5d6e9009a43
           */
          bucketName?: string;
          /** @description configuration parameters for storing test artifacts */
          artifactRequest?: components["schemas"]["ArtifactRequest"];
          /**
           * @description script to run before test execution
           * @example echo -n '$SECRET_ENV' > ./secret_file
           */
          preRunScript?: string;
          /**
           * @description script to run after test execution
           * @example sleep 30
           */
          postRunScript?: string;
          /** @description execute post run script before scraping (prebuilt executor only) */
          executePostRunScriptBeforeScraping?: boolean;
          /** @description run scripts using source command (container executor only) */
          sourceScripts?: boolean;
          /** @description running context for the test execution */
          runningContext?: components["schemas"]["RunningContext"];
          /**
           * @description shell used in container executor
           * @example /bin/sh
           */
          containerShell?: string;
          /** @description test execution name started the test execution */
          testExecutionName?: string;
          /** @description execution ids for artifacts to download */
          downloadArtifactExecutionIDs?: string[];
          /** @description test names for artifacts to download from latest executions */
          downloadArtifactTestNames?: string[];
          /** @description configuration parameters for executed slave pods */
          slavePodRequest?: components["schemas"]["PodRequest"];
          /** @description namespace for test execution (Pro edition only) */
          executionNamespace?: string;
          /**
           * @description whether webhooks on this execution are disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disableWebhooks: boolean;
      };
      /** @description API server artifact */
      Artifact: {
          /** @description artifact file path */
          name?: string;
          /** @description file size in bytes */
          size?: number;
          /**
           * @description execution name that produced the artifact
           * @example test-1
           */
          executionName?: string;
          /** @enum {string} */
          status?: "ready" | "processing" | "failed";
      };
      /** @description the result for a page of executions */
      ExecutionsResult: {
          totals: components["schemas"]["ExecutionsTotals"];
          filtered?: components["schemas"]["ExecutionsTotals"];
          results: components["schemas"]["ExecutionSummary"][];
      };
      /** @description Execution summary */
      ExecutionSummary: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc4
           */
          id: string;
          /**
           * @description execution name
           * @example test-suite1-test1
           */
          name: string;
          /**
           * @description execution number
           * @example 1
           */
          number?: number;
          /**
           * @description name of the test
           * @example test1
           */
          testName: string;
          /**
           * @description name of the test
           * @example testkube
           */
          testNamespace?: string;
          /**
           * @description the type of test for this execution
           * @example postman/collection
           */
          testType: string;
          status: components["schemas"]["ExecutionStatus"];
          /**
           * Format: date-time
           * @description test execution start time
           */
          startTime?: string;
          /**
           * Format: date-time
           * @description test execution end time
           */
          endTime?: string;
          /**
           * @description calculated test duration
           * @example 00:00:13
           */
          duration?: string;
          /**
           * @description calculated test duration in ms
           * @example 10000
           */
          durationMs?: number;
          /**
           * @description test and execution labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /** @description running context for the test execution */
          runningContext?: components["schemas"]["RunningContext"];
      };
      /** @enum {string} */
      ExecutionStatus: "queued" | "running" | "passed" | "failed" | "aborted" | "timeout" | "skipped";
      /** @description execution result returned from executor */
      ExecutionResult: {
          status: components["schemas"]["ExecutionStatus"];
          /** @description RAW Test execution output, depends of reporter used in particular tool */
          output?: string;
          /**
           * @description output type depends of reporter used in particular tool
           * @enum {string}
           */
          outputType?: "text/plain" | "application/junit+xml" | "application/json";
          /** @description error message when status is error, separate to output as output can be partial in case of error */
          errorMessage?: string;
          /** @description execution steps (for collection of requests) */
          steps?: components["schemas"]["ExecutionStepResult"][];
          reports?: {
              junit?: string;
          };
      };
      /** @description execution result data */
      ExecutionStepResult: {
          /**
           * @description step name
           * @example step1
           */
          name: string;
          /**
           * Format: duration
           * @example 10m0s
           */
          duration?: string;
          /**
           * @description execution step status
           * @enum {string}
           */
          status: "passed" | "failed";
          assertionResults?: components["schemas"]["AssertionResult"][];
      };
      /** @description execution result data */
      AssertionResult: {
          /** @example assertion1 */
          name?: string;
          /** @enum {string} */
          status?: "passed" | "failed";
          errorMessage?: string | null;
      };
      /** @description various execution counters */
      ExecutionsTotals: {
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
      };
      /** @description Server information with build version, build commit etc. */
      ServerInfo: {
          /**
           * @description build version
           * @example v1.4.4
           */
          version: string;
          /**
           * @description build commit
           * @example aaff223ae68aab1af56e8ed8c84c2b80ed63d9b8
           */
          commit?: string;
          /**
           * @description server installaton namespace
           * @example my-testkube
           */
          namespace?: string;
          /**
           * @description cluster id
           * @example my-cluster-id
           */
          clusterId?: string;
          /**
           * @description currently configured testkube API context
           * @example cloud|oss
           */
          context?: string;
          /**
           * @description cloud organization id
           * @example tkcorg_xxxx
           */
          orgId?: string;
          /**
           * @description cloud env id
           * @example tkcenv_xxxx
           */
          envId?: string;
          /**
           * @description helm chart version
           * @example 1.4.14
           */
          helmchartVersion?: string;
          /**
           * @description dashboard uri
           * @example http://localhost:8080
           */
          dashboardUri?: string;
          /**
           * @deprecated
           * @description enable secret endpoint to list secrets in namespace
           */
          enableSecretEndpoint?: boolean;
          /**
           * @deprecated
           * @description disable secret creation for tests and test sources
           */
          disableSecretCreation?: boolean;
          secret?: components["schemas"]["SecretConfig"];
          features?: components["schemas"]["Features"];
          /** @description execution namespaces */
          executionNamespaces?: string[];
          /**
           * @description docker image version
           * @example 2.1.2
           */
          dockerImageVersion?: string;
      };
      /** @description repository representation for tests in git repositories */
      Repository: {
          /**
           * @description VCS repository type
           * @enum {string}
           */
          type: "git";
          /**
           * @description uri of content file or git directory
           * @example https://github.com/kubeshop/testkube
           */
          uri: string;
          /**
           * @description branch/tag name for checkout
           * @example main
           */
          branch?: string;
          /**
           * @description commit id (sha) for checkout
           * @example b928cbb7186944ab9275937ec1ac3d3738ca2e1d
           */
          commit?: string;
          /**
           * @description if needed we can checkout particular path (dir or file) in case of BIG/mono repositories
           * @example test/perf
           */
          path?: string;
          /** @description git auth username for private repositories */
          username?: string;
          /** @description git auth token for private repositories */
          token?: string;
          usernameSecret?: components["schemas"]["SecretRef"];
          tokenSecret?: components["schemas"]["SecretRef"];
          /** @description secret with certificate for private repositories. Should contain one key ending with .crt such as "mycorp.crt", whose value is the certificate file content, suitable for git config http.sslCAInfo */
          certificateSecret?: string;
          /**
           * @description if provided we checkout the whole repository and run test from this directory
           * @example /
           */
          workingDir?: string;
          /**
           * @description auth type for git requests
           * @enum {string}
           */
          authType?: "basic" | "header";
      };
      /** @description repository parameters for tests in git repositories */
      RepositoryParameters: {
          /**
           * @description branch/tag name for checkout
           * @example main
           */
          branch?: string;
          /**
           * @description commit id (sha) for checkout
           * @example b928cbb7186944ab9275937ec1ac3d3738ca2e1d
           */
          commit?: string;
          /**
           * @description if needed we can checkout particular path (dir or file) in case of BIG/mono repositories
           * @example test/perf
           */
          path?: string;
          /**
           * @description if provided we checkout the whole repository and run test from this directory
           * @example /
           */
          workingDir?: string;
      };
      /** @description repository update body */
      RepositoryUpdate: components["schemas"]["Repository"] | null;
      /** @description repository update parameters for tests in git repositories */
      RepositoryUpdateParameters: components["schemas"]["RepositoryParameters"] | null;
      /** @description artifact request body with test artifacts */
      ArtifactRequest: {
          /**
           * @description artifact storage class name for container executor
           * @example artifact-volume-local
           */
          storageClassName?: string;
          /** @description artifact volume mount path for container executor */
          volumeMountPath?: string;
          /** @description artifact directories for scraping */
          dirs?: string[];
          /** @description regexp to filter scraped artifacts, single or comma separated */
          masks?: string[];
          /**
           * @description artifact bucket storage
           * @example test1-artifacts
           */
          storageBucket?: string;
          /** @description don't use a separate folder for execution artifacts */
          omitFolderPerExecution?: boolean;
          /** @description whether to share volume between pods */
          sharedBetweenPods?: boolean;
          /** @description whether to use default storage class name */
          useDefaultStorageClassName?: boolean;
          /** @description run scraper as pod sidecar container */
          sidecarScraper?: boolean;
      };
      /** @description artifact request update body */
      ArtifactUpdateRequest: components["schemas"]["ArtifactRequest"] | null;
      /** @description pod request body */
      PodRequest: {
          /** @description pod resources request parameters */
          resources?: components["schemas"]["PodResourcesRequest"];
          /** @description pod template extensions */
          podTemplate?: string;
          /** @description name of the template resource */
          podTemplateReference?: string;
      };
      /** @description pod request update body */
      PodUpdateRequest: components["schemas"]["PodRequest"] | null;
      /** @description pod resources request specification */
      PodResourcesRequest: {
          /** @description pod resources requests */
          requests?: components["schemas"]["ResourceRequest"];
          /** @description pod resources limits */
          limits?: components["schemas"]["ResourceRequest"];
      };
      /** @description pod resources update request specification */
      PodResourcesUpdateRequest: components["schemas"]["PodResourcesRequest"] | null;
      /** @description resource request specification */
      ResourceRequest: {
          /**
           * @description requested cpu units
           * @example 250m
           */
          cpu?: string;
          /**
           * @description requested memory units
           * @example 64Mi
           */
          memory?: string;
      };
      /** @description resource update request specification */
      ResourceUpdateRequest: components["schemas"]["ResourceRequest"] | null;
      /** @description test execution request body */
      ExecutionRequest: {
          /**
           * Format: bson objectId
           * @description execution id
           * @example 62f395e004109209b50edfc1
           */
          id?: string;
          /**
           * @description test execution custom name
           * @example testing with 1000 users
           */
          name?: string;
          /**
           * @description unique test suite name (CRD Test suite name), if it's run as a part of test suite
           * @example test-suite1
           */
          testSuiteName?: string;
          /** @description test execution number */
          number?: number;
          /**
           * @description test execution labels
           * @example {
           *       "users": "3",
           *       "prefix": "some-"
           *     }
           */
          executionLabels?: {
              [key: string]: string;
          };
          /**
           * @description test kubernetes namespace ("testkube" when not set)
           * @example testkube
           */
          namespace?: string;
          /**
           * @description in case the variables file is too big, it will be uploaded
           * @example false
           */
          isVariablesFileUploaded?: boolean;
          /** @description variables file content - need to be in format for particular executor (e.g. postman envs file) */
          variablesFile?: string;
          variables?: components["schemas"]["Variables"];
          /**
           * @description test secret uuid
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly testSecretUUID?: string;
          /**
           * @description test suite secret uuid, if it's run as a part of test suite
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly testSuiteSecretUUID?: string;
          /**
           * @description executor image command
           * @example [
           *       "curl"
           *     ]
           */
          command?: string[];
          /**
           * @description additional executor binary arguments
           * @example [
           *       "--repeats",
           *       "5",
           *       "--insecure"
           *     ]
           */
          args?: string[];
          /**
           * @description usage mode for arguments
           * @enum {string}
           */
          args_mode?: "append" | "override" | "replace";
          /**
           * @description container image, executor will run inside this image
           * @example kubeshop/testkube-executor-custom:1.10.11-dev-0a9c91
           */
          image?: string;
          /** @description container image pull secrets */
          imagePullSecrets?: components["schemas"]["LocalObjectReference"][];
          /**
           * @deprecated
           * @description Environment variables passed to executor. Deprecated: use Basic Variables instead
           * @example {
           *       "record": "true",
           *       "prefix": "some-"
           *     }
           */
          envs?: {
              [key: string]: string;
          };
          /**
           * @deprecated
           * @description Execution variables passed to executor from secrets. Deprecated: use Secret Variables instead
           * @example {
           *       "secret_key_name1": "secret-name",
           *       "secret_Key_name2": "secret-name"
           *     }
           */
          secretEnvs?: {
              [key: string]: string;
          };
          /** @description whether to start execution sync or async */
          sync?: boolean;
          /**
           * @description http proxy for executor containers
           * @example user:pass@my.proxy.server:8080
           */
          httpProxy?: string;
          /**
           * @description https proxy for executor containers
           * @example user:pass@my.proxy.server:8081
           */
          httpsProxy?: string;
          /**
           * @description whether to run test as negative test
           * @example false
           */
          negativeTest?: boolean;
          /**
           * @description whether negativeTest was changed by user
           * @example false
           */
          isNegativeTestChangedOnRun?: boolean;
          /**
           * Format: int64
           * @description duration in seconds the test may be active, until its stopped
           * @example 1
           */
          activeDeadlineSeconds?: number;
          /**
           * @description list of file paths that need to be copied into the test from uploads
           * @example [
           *       "settings/config.txt"
           *     ]
           */
          uploads?: string[];
          /**
           * @description minio bucket name to get uploads from
           * @example execution-c01d7cf6-ec3f-47f0-9556-a5d6e9009a43
           */
          bucketName?: string;
          /** @description configuration parameters for storing test artifacts */
          artifactRequest?: components["schemas"]["ArtifactRequest"];
          /** @description job template extensions */
          jobTemplate?: string;
          /** @description name of the template resource */
          jobTemplateReference?: string;
          /** @description cron job template extensions */
          cronJobTemplate?: string;
          /** @description name of the template resource */
          cronJobTemplateReference?: string;
          /** @description adjusting parameters for test content */
          contentRequest?: components["schemas"]["TestContentRequest"];
          /**
           * @description script to run before test execution
           * @example echo -n '$SECRET_ENV' > ./secret_file
           */
          preRunScript?: string;
          /**
           * @description script to run after test execution
           * @example sleep 30
           */
          postRunScript?: string;
          /** @description execute post run script before scraping (prebuilt executor only) */
          executePostRunScriptBeforeScraping?: boolean;
          /** @description run scripts using source command (container executor only) */
          sourceScripts?: boolean;
          /** @description scraper template extensions */
          scraperTemplate?: string;
          /** @description name of the template resource */
          scraperTemplateReference?: string;
          /** @description pvc template extensions */
          pvcTemplate?: string;
          /** @description name of the template resource */
          pvcTemplateReference?: string;
          /** @description config map references */
          envConfigMaps?: components["schemas"]["EnvReference"][];
          /** @description secret references */
          envSecrets?: components["schemas"]["EnvReference"][];
          /** @description running context for the test execution */
          runningContext?: components["schemas"]["RunningContext"];
          /** @description test execution name started the test execution */
          testExecutionName?: string;
          /** @description execution ids for artifacts to download */
          downloadArtifactExecutionIDs?: string[];
          /** @description test names for artifacts to download from latest executions */
          downloadArtifactTestNames?: string[];
          /** @description configuration parameters for executed slave pods */
          slavePodRequest?: components["schemas"]["PodRequest"];
          /** @description namespace for test execution (Pro edition only) */
          executionNamespace?: string;
          /**
           * @description whether webhooks on this execution are disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disableWebhooks: boolean;
      };
      /** @description test step execution request body */
      TestSuiteStepExecutionRequest: {
          /**
           * @description test execution labels
           * @example {
           *       "users": "3",
           *       "prefix": "some-"
           *     }
           */
          executionLabels?: {
              [key: string]: string;
          };
          variables?: components["schemas"]["Variables"];
          /**
           * @description executor image command
           * @example [
           *       "curl"
           *     ]
           */
          command?: string[];
          /**
           * @description additional executor binary arguments
           * @example [
           *       "--repeats",
           *       "5",
           *       "--insecure"
           *     ]
           */
          args?: string[];
          /**
           * @description usage mode for arguments
           * @enum {string}
           */
          args_mode?: "append" | "override" | "replace";
          /** @description whether to start execution sync or async */
          sync?: boolean;
          /**
           * @description http proxy for executor containers
           * @example user:pass@my.proxy.server:8080
           */
          httpProxy?: string;
          /**
           * @description https proxy for executor containers
           * @example user:pass@my.proxy.server:8081
           */
          httpsProxy?: string;
          /**
           * @description whether to run test as negative test
           * @example false
           */
          negativeTest?: boolean;
          /** @description job template extensions */
          jobTemplate?: string;
          /** @description name of the template resource */
          jobTemplateReference?: string;
          /** @description cron job template extensions */
          cronJobTemplate?: string;
          /** @description name of the template resource */
          cronJobTemplateReference?: string;
          /** @description scraper template extensions */
          scraperTemplate?: string;
          /** @description name of the template resource */
          scraperTemplateReference?: string;
          /** @description pvc template extensions */
          pvcTemplate?: string;
          /** @description name of the template resource */
          pvcTemplateReference?: string;
          /** @description running context for the test execution */
          runningContext?: components["schemas"]["RunningContext"];
          /**
           * @description whether webhooks on the execution of this step are disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disableWebhooks: boolean;
      };
      /** @description test execution request update body */
      ExecutionUpdateRequest: components["schemas"]["ExecutionRequest"] | null;
      /** @description test suite execution request body */
      TestSuiteExecutionRequest: {
          /**
           * @description test execution custom name
           * @example testing with 1000 users
           */
          name?: string;
          /**
           * @description test suite execution number
           * @example 1
           */
          number?: number;
          /**
           * @description test kubernetes namespace ("testkube" when not set)
           * @example testkube
           */
          namespace?: string;
          variables?: components["schemas"]["Variables"];
          /**
           * @description secret uuid
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly secretUUID?: string;
          /**
           * @description test suite labels
           * @example {
           *       "users": "3",
           *       "prefix": "some-"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description execution labels
           * @example {
           *       "users": "3",
           *       "prefix": "some-"
           *     }
           */
          executionLabels?: {
              [key: string]: string;
          };
          /** @description whether to start execution sync or async */
          sync?: boolean;
          /**
           * @description http proxy for executor containers
           * @example user:pass@my.proxy.server:8080
           */
          httpProxy?: string;
          /**
           * @description https proxy for executor containers
           * @example user:pass@my.proxy.server:8081
           */
          httpsProxy?: string;
          /**
           * Format: int32
           * @description duration in seconds the test suite may be active, until its stopped
           * @example 1
           */
          timeout?: number;
          /** @description adjusting parameters for test content */
          contentRequest?: components["schemas"]["TestContentRequest"];
          /** @description running context for the test suite execution */
          runningContext?: components["schemas"]["RunningContext"];
          /** @description job template extensions */
          jobTemplate?: string;
          /** @description name of the template resource */
          jobTemplateReference?: string;
          /** @description cron job template extensions */
          cronJobTemplate?: string;
          /** @description name of the template resource */
          cronJobTemplateReference?: string;
          /** @description scraper template extensions */
          scraperTemplate?: string;
          /** @description name of the template resource */
          scraperTemplateReference?: string;
          /** @description pvc template extensions */
          pvcTemplate?: string;
          /** @description name of the template resource */
          pvcTemplateReference?: string;
          /**
           * Format: int32
           * @description number of tests run in parallel
           * @example 10
           */
          concurrencyLevel?: number;
          /** @description test suite execution name started the test suite execution */
          testSuiteExecutionName?: string;
          /**
           * @description whether webhooks on the execution of this test suite are disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disableWebhooks: boolean;
      };
      /** @description test suite execution update request body */
      TestSuiteExecutionUpdateRequest: components["schemas"]["TestSuiteExecutionRequest"] | null;
      /** @description test create request body */
      TestUpsertRequest: components["schemas"]["Test"];
      /** @description test update request body */
      TestUpdateRequest: components["schemas"]["Test"] | null;
      /** @description test suite create request body */
      TestSuiteUpsertRequest: WithRequired<components["schemas"]["TestSuite"], "name" | "namespace"> & WithRequired<components["schemas"]["ObjectRef"], "name" | "namespace">;
      /** @description test suite create request body */
      TestSuiteUpsertRequestV2: WithRequired<components["schemas"]["TestSuiteV2"], "name" | "namespace"> & WithRequired<components["schemas"]["ObjectRef"], "name" | "namespace">;
      /** @description test suite update body */
      TestSuiteUpdateRequest: (components["schemas"]["TestSuite"] & components["schemas"]["ObjectRef"]) | null;
      /** @description test suite update body */
      TestSuiteUpdateRequestV2: (components["schemas"]["TestSuiteV2"] & components["schemas"]["ObjectRef"]) | null;
      /** @description test trigger create or update request body */
      TestTriggerUpsertRequest: WithRequired<components["schemas"]["TestTrigger"], "resource" | "resourceSelector" | "event" | "action" | "execution" | "testSelector"> & components["schemas"]["ObjectRef"];
      /** @description executor create request body */
      ExecutorUpsertRequest: WithRequired<components["schemas"]["Executor"], "types"> & WithRequired<components["schemas"]["ObjectRef"], "name" | "namespace">;
      /** @description executor update request body */
      ExecutorUpdateRequest: (components["schemas"]["Executor"] & components["schemas"]["ObjectRef"]) | null;
      /** @description webhook create request body */
      WebhookCreateRequest: components["schemas"]["Webhook"];
      /** @description webhook update request body */
      WebhookUpdateRequest: components["schemas"]["Webhook"] | null;
      /** @description webhook template create request body */
      WebhookTemplateCreateRequest: components["schemas"]["WebhookTemplate"];
      /** @description webhook template update request body */
      WebhookTemplateUpdateRequest: components["schemas"]["WebhookTemplate"] | null;
      /** @description CRD based executor data */
      Executor: {
          /** @description ExecutorType one of "rest" for rest openapi based executors or "job" which will be default runners for testkube soon */
          executorType?: string;
          /** @description Image for kube-job */
          image?: string;
          slaves?: components["schemas"]["SlavesMeta"];
          /** @description container image pull secrets */
          imagePullSecrets?: components["schemas"]["LocalObjectReference"][];
          /**
           * @description executor image command
           * @example [
           *       "curl"
           *     ]
           */
          command?: string[];
          /**
           * @description additional executor binary argument
           * @example [
           *       "--repeats",
           *       "5",
           *       "--insecure"
           *     ]
           */
          args?: string[];
          /** @description Types defines what types can be handled by executor e.g. "postman/collection", ":curl/command" etc */
          types?: string[];
          /** @description URI for rest based executors */
          uri?: string;
          /** @description list of handled content types */
          contentTypes?: string[];
          /** @description Job template to launch executor */
          jobTemplate?: string;
          /** @description name of the template resource */
          jobTemplateReference?: string;
          /**
           * @description executor labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /** @description Available executor features */
          features?: ("artifacts" | "junit-report")[];
          meta?: components["schemas"]["ExecutorMeta"];
          /** @description use data dir as working dir for executor */
          useDataDirAsWorkingDir?: boolean;
      };
      /** @description Executor details with Executor data and additional information like list of executions */
      ExecutorDetails: {
          /** @description Executor name */
          name?: string;
          executor?: components["schemas"]["Executor"];
          executions?: components["schemas"]["ExecutionsResult"];
      };
      /** @description CRD based executor data */
      ExecutorOutput: {
          /**
           * @description One of possible output types
           * @enum {string}
           */
          type: "error" | "log" | "event" | "result";
          /** @description Message/event data passed from executor (like log lines etc) */
          content?: string;
          /** @description Execution result when job is finished */
          result?: components["schemas"]["ExecutionResult"];
          /**
           * Format: date-time
           * @description Timestamp of log
           * @example 2018-03-20T09:12:28Z
           */
          time?: string;
      };
      /** @description Log format version 2 */
      LogV2: {
          /**
           * Format: date-time
           * @description Timestamp of log
           * @example 2018-03-20T09:12:28Z
           */
          time?: string;
          /** @description Message/event data passed from executor (like log lines etc) */
          content?: string;
          /** @description One of possible log types */
          type?: string;
          /**
           * @description One of possible log sources
           * @enum {string}
           */
          source: "job-pod" | "test-scheduler" | "container-executor" | "job-executor";
          /** @description indicates a log error */
          error?: boolean;
          /**
           * @description One of possible log versions
           * @enum {string}
           */
          version?: "v1" | "v2";
          /**
           * @description additional log details
           * @example {
           *       "argsl": "passed command arguments"
           *     }
           */
          metadata?: {
              [key: string]: string;
          };
          /** @description Old output - for backwards compatibility - will be removed for non-structured logs */
          v1?: components["schemas"]["LogV1"];
      };
      /** @description Log format version 1 */
      LogV1: {
          /** @description output for previous log format */
          result?: components["schemas"]["ExecutionResult"];
      };
      /** @description Executor meta data */
      ExecutorMeta: {
          /**
           * @description URI for executor icon
           * @example /assets/k6.jpg
           */
          iconURI?: string;
          /**
           * @description URI for executor docs
           * @example https://docs.testkube.io/test-types/executor-k6
           */
          docsURI?: string;
          /**
           * @description executor tooltips
           * @example {
           *       "general": "please provide k6 test script for execution"
           *     }
           */
          tooltips?: {
              [key: string]: string;
          };
      };
      /** @description Executor meta update data */
      ExecutorMetaUpdate: components["schemas"]["ExecutorMeta"] | null;
      /** @description Slave data for executing tests in distributed environment */
      SlavesMeta: {
          /**
           * @description slave image
           * @example kubeshop/ex-slaves-image:latest
           */
          image: string;
      };
      /** @description running context for test or test suite execution */
      RunningContext: {
          /**
           * @description One of possible context types
           * @enum {string}
           */
          type: "userCLI" | "userUI" | "testsuite" | "testtrigger" | "scheduler" | "testworkflow";
          /** @description Context value depending from its type */
          context?: string;
      };
      /** @description running context for test workflow execution */
      TestWorkflowRunningContext: {
          interface: components["schemas"]["TestWorkflowRunningContextInterface"];
          actor: components["schemas"]["TestWorkflowRunningContextActor"];
      };
      /** @description running context interface for test workflow execution */
      TestWorkflowRunningContextInterface: {
          /** @description interface name */
          name?: string;
          type: components["schemas"]["TestWorkflowRunningContextInterfaceType"];
      };
      /** @description running context actor for test workflow execution */
      TestWorkflowRunningContextActor: {
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
          type: components["schemas"]["TestWorkflowRunningContextActorType"];
      };
      /**
       * @description supported interfaces for test workflow running context
       * @enum {string}
       */
      TestWorkflowRunningContextInterfaceType: "cli" | "ui" | "api" | "ci/cd" | "internal";
      /**
       * @description supported actors for test workflow running context
       * @enum {string}
       */
      TestWorkflowRunningContextActorType: "cron" | "testtrigger" | "user" | "testworkflow" | "testworkflowexecution" | "program";
      /** @description CRD based webhook data */
      Webhook: {
          /** @example webhook1 */
          name: string;
          /** @example testkube */
          namespace?: string;
          /** @example https://hooks.app.com/services/1 */
          uri?: string;
          events?: components["schemas"]["EventType"][];
          /** @description Labels to filter for tests and test suites */
          selector?: string;
          /** @description will load the generated payload for notification inside the object */
          payloadObjectField?: string;
          /** @description golang based template for notification payload */
          payloadTemplate?: string;
          /** @description name of the template resource */
          payloadTemplateReference?: string;
          /**
           * @description webhook headers (golang template supported)
           * @example {
           *       "Content-Type": "application/xml"
           *     }
           */
          headers?: {
              [key: string]: string;
          };
          /**
           * @description webhook labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description webhook annotations
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          annotations?: {
              [key: string]: string;
          };
          /**
           * @description whether webhook is disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disabled: boolean;
          config?: components["schemas"]["WebhookConfig"];
          parameters?: components["schemas"]["WebhookParameterSchema"][];
          webhookTemplateRef?: components["schemas"]["WebhookTemplateRef"];
      };
      /** @description CRD based webhook data template */
      WebhookTemplate: {
          /** @example webhook1 */
          name: string;
          /** @example testkube */
          namespace?: string;
          /** @example https://hooks.app.com/services/1 */
          uri?: string;
          events?: components["schemas"]["EventType"][];
          /** @description Labels to filter for tests and test suites */
          selector?: string;
          /** @description will load the generated payload for notification inside the object */
          payloadObjectField?: string;
          /** @description golang based template for notification payload */
          payloadTemplate?: string;
          /** @description name of the template resource */
          payloadTemplateReference?: string;
          /**
           * @description webhook headers (golang template supported)
           * @example {
           *       "Content-Type": "application/xml"
           *     }
           */
          headers?: {
              [key: string]: string;
          };
          /**
           * @description webhook labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description webhook annotations
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          annotations?: {
              [key: string]: string;
          };
          /**
           * @description whether webhook is disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disabled: boolean;
          config?: components["schemas"]["WebhookConfig"];
          parameters?: components["schemas"]["WebhookParameterSchema"][];
      };
      /** @description Event data */
      Event: {
          /** @description UUID of event */
          id: string;
          /** @description stream topic */
          streamTopic?: string;
          resource: components["schemas"]["EventResource"];
          /** @description ID of resource */
          resourceId: string;
          type: components["schemas"]["EventType"];
          testExecution?: components["schemas"]["Execution"];
          testSuiteExecution?: components["schemas"]["TestSuiteExecution"];
          testWorkflowExecution?: components["schemas"]["TestWorkflowExecution"];
          /** @description cluster name of event */
          clusterName?: string;
          /**
           * @description environment variables
           * @example {
           *       "WEBHOOK_PARAMETER": "any value"
           *     }
           */
          envs?: {
              [key: string]: string;
          };
          external?: boolean;
      };
      /** @enum {string} */
      EventResource: "test" | "testsuite" | "executor" | "trigger" | "webhook" | "webhooktemplate" | "testexecution" | "testsuiteexecution" | "testsource" | "testworkflow" | "testworkflowexecution";
      /** @enum {string} */
      EventType: "start-test" | "end-test-success" | "end-test-failed" | "end-test-aborted" | "end-test-timeout" | "become-test-up" | "become-test-down" | "become-test-failed" | "become-test-aborted" | "become-test-timeout" | "start-testsuite" | "end-testsuite-success" | "end-testsuite-failed" | "end-testsuite-aborted" | "end-testsuite-timeout" | "become-testsuite-up" | "become-testsuite-down" | "become-testsuite-failed" | "become-testsuite-aborted" | "become-testsuite-timeout" | "queue-testworkflow" | "start-testworkflow" | "end-testworkflow-success" | "end-testworkflow-failed" | "end-testworkflow-aborted" | "become-testworkflow-up" | "become-testworkflow-down" | "become-testworkflow-failed" | "become-testworkflow-aborted" | "created" | "updated" | "deleted";
      /** @description Listener result after sending particular event */
      EventResult: {
          /** @description UUID of event */
          id?: string;
          /** @description error message if any */
          error?: string;
          /**
           * Format: error
           * @description result of event
           */
          result?: string;
      };
      /** @description Test with latest Execution result */
      TestWithExecution: {
          test: components["schemas"]["Test"];
          latestExecution?: components["schemas"]["Execution"];
      };
      /** @description Test with latest Execution result summary */
      TestWithExecutionSummary: {
          test: components["schemas"]["Test"];
          latestExecution?: components["schemas"]["ExecutionSummary"];
      };
      /** @description Test suite with latest execution result */
      TestSuiteWithExecution: {
          testSuite: components["schemas"]["TestSuite"];
          latestExecution?: components["schemas"]["TestSuiteExecution"];
      };
      /** @description Test suite with latest execution result */
      TestSuiteWithExecutionSummary: {
          testSuite: components["schemas"]["TestSuite"];
          latestExecution?: components["schemas"]["TestSuiteExecutionSummary"];
      };
      /** @description Testkube API config data structure */
      Config: {
          id: string;
          clusterId: string;
          enableTelemetry: boolean;
      };
      /** @description Testkube debug info */
      DebugInfo: {
          /** @example 1.4.9 */
          clientVersion?: string;
          /** @example v1.4.9 */
          serverVersion?: string;
          /** @example v1.23.4 */
          clusterVersion?: string;
          /** @example [
           *       "logline1",
           *       "logline2",
           *       "logline3"
           *     ] */
          apiLogs?: string[];
          /** @example [
           *       "logline1",
           *       "logline2",
           *       "logline3"
           *     ] */
          operatorLogs?: string[];
      };
      Features: {
          /** @description Log processing version 2 */
          logsV2: boolean;
      };
      TestTrigger: {
          /**
           * @description test trigger name
           * @example test1
           */
          name?: string;
          /**
           * @description test trigger namespace
           * @example testkube
           */
          namespace?: string;
          /**
           * @description test trigger labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description test trigger annotations
           * @example {
           *       "group": "teamA",
           *       "app": "backend"
           *     }
           */
          annotations?: {
              [key: string]: string;
          };
          resource: components["schemas"]["TestTriggerResources"];
          resourceSelector: components["schemas"]["TestTriggerSelector"];
          /**
           * @description listen for event for selected resource
           * @example modified
           */
          event: string;
          conditionSpec?: components["schemas"]["TestTriggerConditionSpec"];
          probeSpec?: components["schemas"]["TestTriggerProbeSpec"];
          action: components["schemas"]["TestTriggerActions"];
          actionParameters?: components["schemas"]["TestTriggerActionParameters"];
          execution: components["schemas"]["TestTriggerExecutions"];
          testSelector: components["schemas"]["TestTriggerSelector"];
          concurrencyPolicy?: components["schemas"]["TestTriggerConcurrencyPolicies"];
          /**
           * @description whether test trigger is disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disabled: boolean;
      };
      /** @description Reference to Kubernetes object */
      LocalObjectReference: {
          name?: string;
      };
      /** @description Reference to env resource */
      EnvReference: {
          reference: components["schemas"]["LocalObjectReference"];
          /**
           * @description whether we shoud mount resource
           * @example /etc/data
           */
          mount?: boolean;
          /** @description where we shoud mount resource */
          mountPath?: string;
          /**
           * @description whether we shoud map to variables from resource
           * @default false
           */
          mapToVariables: boolean;
      };
      TestTriggerSelector: {
          /**
           * @description kubernetes resource name selector
           * @example nginx
           */
          name?: string;
          /**
           * @description kubernetes resource name regex
           * @example nginx.*
           */
          nameRegex?: string;
          /**
           * @description resource namespace
           * @example testkube
           */
          namespace?: string;
          /**
           * @description kubernetes resource namespace regex
           * @example test*
           */
          namespaceRegex?: string;
          /** @description label selector for Kubernetes resources */
          labelSelector?: components["schemas"]["io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector"];
      };
      /**
       * @description supported kubernetes resources for test triggers
       * @enum {string}
       */
      TestTriggerResources: "pod" | "deployment" | "statefulset" | "daemonset" | "service" | "ingress" | "event" | "configmap";
      /**
       * @description supported test resources for test triggers
       * @enum {string}
       */
      TestTriggerExecutions: "test" | "testsuite" | "testworkflow";
      /**
       * @description supported actions for test triggers
       * @enum {string}
       */
      TestTriggerActions: "run";
      /** @description supported action parameters for test triggers */
      TestTriggerActionParameters: {
          config?: components["schemas"]["TestWorkflowConfigValue"];
          tags?: components["schemas"]["TestWorkflowTagValue"];
          target?: components["schemas"]["ExecutionTarget"];
      };
      TestTriggerConditionSpec: {
          /** @description list of test trigger conditions */
          conditions?: components["schemas"]["TestTriggerCondition"][];
          /**
           * Format: int32
           * @description duration in seconds the test trigger waits for conditions, until its stopped
           * @example 1
           */
          timeout?: number;
          /**
           * Format: int32
           * @description duration in seconds the test trigger waits between condition checks
           * @example 1
           */
          delay?: number;
      };
      /** @description supported condition for test triggers */
      TestTriggerCondition: {
          status: components["schemas"]["TestTriggerConditionStatuses"];
          /**
           * @description test trigger condition
           * @example Progressing
           */
          type: string;
          /**
           * @description test trigger condition reason
           * @example NewReplicaSetAvailable
           */
          reason?: string;
          /**
           * Format: int32
           * @description duration in seconds in the past from current time when the condition is still valid
           * @example 1
           */
          ttl?: number;
      };
      /**
       * @description supported kubernetes condition statuses for test triggers
       * @enum {string}
       */
      TestTriggerConditionStatuses: "True" | "False" | "Unknown";
      TestTriggerProbeSpec: {
          /** @description list of test trigger probes */
          probes?: components["schemas"]["TestTriggerProbe"][];
          /**
           * Format: int32
           * @description duration in seconds the test trigger waits for probes, until its stopped
           * @example 1
           */
          timeout?: number;
          /**
           * Format: int32
           * @description duration in seconds the test trigger waits between probes
           * @example 1
           */
          delay?: number;
      };
      /** @description supported probe for test triggers */
      TestTriggerProbe: {
          /**
           * @description test trigger condition probe scheme to connect to host, default is http
           * @example http
           */
          scheme?: string;
          /**
           * @description test trigger condition probe host, default is pod ip or service name
           * @example testkube-api-server
           */
          host?: string;
          /**
           * @description test trigger condition probe path to check, default is /
           * @example /
           */
          path?: string;
          /**
           * Format: int32
           * @description test trigger condition probe port to connect
           * @example 80
           */
          port?: number;
          /**
           * @description test trigger condition probe headers to submit
           * @example {
           *       "Content-Type": "application/xml"
           *     }
           */
          headers?: {
              [key: string]: string;
          };
      };
      /**
       * @description supported concurrency policies for test triggers
       * @enum {string}
       */
      TestTriggerConcurrencyPolicies: "allow" | "forbid" | "replace";
      TestTriggerKeyMap: {
          /**
           * @description list of supported values for resources
           * @example [
           *       "pod",
           *       "deployment",
           *       "statefulset",
           *       "daemonset",
           *       "service",
           *       "ingress",
           *       "event",
           *       "configmap"
           *     ]
           */
          resources: string[];
          /**
           * @description list of supported values for actions
           * @example [
           *       "run"
           *     ]
           */
          actions: string[];
          /**
           * @description list of supported values for executions
           * @example [
           *       "test",
           *       "testsuite"
           *     ]
           */
          executions: string[];
          /**
           * @description mapping between resources and supported events
           * @example {
           *       "pod": [
           *         "created",
           *         "modified",
           *         "deleted"
           *       ],
           *       "deployment": [
           *         "created",
           *         "modified",
           *         "deleted"
           *       ]
           *     }
           */
          events: {
              [key: string]: string[];
          };
          /**
           * @description list of supported values for conditions
           * @example [
           *       "Available",
           *       "Progressing"
           *     ]
           */
          conditions?: string[];
          /**
           * @description list of supported values for concurrency policies
           * @example [
           *       "allow",
           *       "forbid",
           *       "replace"
           *     ]
           */
          concurrencyPolicies: string[];
      };
      /** @description Test source batch request */
      TestSourceBatchRequest: {
          batch: components["schemas"]["TestSourceUpsertRequest"][];
      };
      /** @description Test source batch result */
      TestSourceBatchResult: {
          /**
           * @description created test sources
           * @example [
           *       "name1",
           *       "name2",
           *       "name3"
           *     ]
           */
          created?: string[];
          /**
           * @description updated test sources
           * @example [
           *       "name4",
           *       "name5",
           *       "name6"
           *     ]
           */
          updated?: string[];
          /**
           * @description deleted test sources
           * @example [
           *       "name7",
           *       "name8",
           *       "name9"
           *     ]
           */
          deleted?: string[];
      };
      /** @description Golang based template */
      Template: {
          /**
           * @description template name for reference
           * @example webhook-template
           */
          name: string;
          /**
           * @description template namespace
           * @example testkube
           */
          namespace?: string;
          type: components["schemas"]["TemplateType"];
          /**
           * @description template body to use
           * @example {"id": "{{ .Id }}"}
           */
          body: string;
          /**
           * @description template labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
      };
      /**
       * @description template type by purpose
       * @enum {string}
       */
      TemplateType: "job" | "container" | "cronjob" | "scraper" | "pvc" | "webhook" | "pod";
      /** @description template create request body */
      TemplateCreateRequest: components["schemas"]["Template"];
      /** @description template update request body */
      TemplateUpdateRequest: components["schemas"]["Template"] | null;
      /** @description Secret with keys */
      Secret: {
          /**
           * @description secret name
           * @example git-secret
           */
          name: string;
          /** @description secret namespace */
          namespace?: string;
          /**
           * @description secret type
           * @default Opaque
           */
          type: string;
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          createdAt?: string;
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          updatedAt?: string;
          /** @description is this Secret controlled by Testkube */
          controlled: boolean;
          owner?: components["schemas"]["SecretOwner"];
          /** @description labels associated with the secret */
          labels?: {
              [key: string]: string;
          };
          /**
           * @description secret keys
           * @example [
           *       "key1",
           *       "key2",
           *       "key3"
           *     ]
           */
          keys?: string[];
      };
      /** @description Secret input information */
      SecretInput: {
          /**
           * @description secret name
           * @example git-secret
           */
          name: string;
          /**
           * @description secret type
           * @default Opaque
           */
          type: string;
          /** @description secret namespace */
          namespace?: string;
          owner?: components["schemas"]["SecretOwner"];
          /** @description labels associated with the secret */
          labels?: {
              [key: string]: string;
          };
          /** @description data to store in the secret */
          data: {
              [key: string]: string;
          };
      };
      /** @description Secret input information to update */
      SecretUpdate: {
          /**
           * @description secret name
           * @example git-secret
           */
          name?: string;
          owner?: components["schemas"]["SecretOwner"];
          /** @description labels associated with the secret */
          labels?: {
              [key: string]: string;
          };
          /** @description data to store in the secret */
          data?: {
              [key: string]: string;
          };
      };
      /** @description Resource that owns the secret */
      SecretOwner: {
          /** @description kind of the resource that is the owner */
          kind: string;
          /** @description name of the owner resource */
          name: string;
      };
      SecretConfig: {
          /** @description prefix for the secrets created via Testkube */
          prefix: string;
          /** @description allow to list secrets created via Testkube */
          list: boolean;
          /** @description allow to list all secrets */
          listAll: boolean;
          /** @description allow to create a new secret via Testkube */
          create: boolean;
          /** @description allow to modify a secret created via Testkube */
          modify: boolean;
          /** @description allow to delete a secret created via Testkube */
          delete: boolean;
          /** @description allow to automatically create secrets via Testkube for sensitive credentials */
          autoCreate: boolean;
      };
      TestWorkflow: {
          /** @description kubernetes resource name */
          name?: string;
          /** @description kubernetes namespace */
          namespace?: string;
          /** @description human-readable description */
          description?: string;
          /**
           * @description test workflow labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /** @description test workflow annotations */
          annotations?: {
              [key: string]: string;
          };
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          created?: string;
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          updated?: string;
          spec?: components["schemas"]["TestWorkflowSpec"];
          /** @description if test workflow is offline and cannot be executed */
          readOnly?: boolean;
          status?: components["schemas"]["TestWorkflowStatusSummary"];
      };
      TestWorkflowExecutionRequest: {
          /** @description custom execution name */
          name?: string;
          config?: components["schemas"]["TestWorkflowConfigValue"];
          /** @description test workflow execution name started the test workflow execution */
          testWorkflowExecutionName?: string;
          /**
           * @description whether webhooks on the execution of this test workflow are disabled
           * @default false
           */
          disableWebhooks: boolean;
          tags?: components["schemas"]["TestWorkflowTagValue"];
          target?: components["schemas"]["ExecutionTarget"];
          /** @description running context for the test workflow execution (Pro edition only) */
          runningContext?: components["schemas"]["TestWorkflowRunningContext"];
          /** @description parent execution ids */
          parentExecutionIds?: string[];
      };
      ExecutionTarget: {
          /** @description runner labels to match */
          match?: {
              [key: string]: string[];
          };
          /** @description runner labels to NOT match */
          not?: {
              [key: string]: string[];
          };
          /** @description list of runner labels to replicate the executions */
          replicate?: string[];
      };
      TestWorkflowWithExecution: {
          workflow?: components["schemas"]["TestWorkflow"];
          latestExecution?: components["schemas"]["TestWorkflowExecution"];
      };
      TestWorkflowWithExecutionSummary: {
          workflow?: components["schemas"]["TestWorkflow"];
          latestExecution?: components["schemas"]["TestWorkflowExecutionSummary"];
      };
      TestWorkflowExecutionsResult: {
          totals: components["schemas"]["ExecutionsTotals"];
          filtered: components["schemas"]["ExecutionsTotals"];
          results: components["schemas"]["TestWorkflowExecutionSummary"][];
      };
      TestWorkflowExecution: {
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
          runnerTarget?: components["schemas"]["ExecutionTarget"];
          runnerOriginalTarget?: components["schemas"]["ExecutionTarget"];
          /**
           * @description execution name
           * @example some-workflow-name-1
           */
          name: string;
          /**
           * @description execution namespace
           * @example my-testkube
           */
          namespace?: string;
          /** @description sequence number for the execution */
          number?: number;
          /**
           * Format: date-time
           * @description when the execution has been scheduled to run
           */
          scheduledAt?: string;
          /**
           * Format: date-time
           * @description when the execution has been assigned to some runner
           */
          assignedAt?: string;
          /**
           * Format: date-time
           * @description when the execution result's status has changed last time (queued, passed, failed)
           */
          statusAt?: string;
          /** @description structured tree of steps */
          signature?: components["schemas"]["TestWorkflowSignature"][];
          result?: components["schemas"]["TestWorkflowResult"];
          /** @description additional information from the steps, like referenced executed tests or artifacts */
          output?: components["schemas"]["TestWorkflowOutput"][];
          /** @description generated reports from the steps, like junit */
          reports?: components["schemas"]["TestWorkflowReport"][];
          resourceAggregations?: components["schemas"]["TestWorkflowExecutionResourceAggregationsReport"];
          workflow: components["schemas"]["TestWorkflow"];
          resolvedWorkflow?: components["schemas"]["TestWorkflow"];
          /** @description test workflow execution name started the test workflow execution */
          testWorkflowExecutionName?: string;
          /**
           * @description whether webhooks on the execution of this test workflow are disabled
           * @default false
           * @example [
           *       true,
           *       false
           *     ]
           */
          disableWebhooks: boolean;
          tags?: components["schemas"]["TestWorkflowTagValue"];
          /** @description running context for the test workflow execution (Pro edition only) */
          runningContext?: components["schemas"]["TestWorkflowRunningContext"];
          configParams?: components["schemas"]["TestWorkflowExecutionConfig"];
      };
      TestWorkflowExecutionSummary: {
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
          result?: components["schemas"]["TestWorkflowResultSummary"];
          workflow: components["schemas"]["TestWorkflowSummary"];
          tags?: components["schemas"]["TestWorkflowTagValue"];
          /** @description running context for the test workflow execution (Pro edition only) */
          runningContext?: components["schemas"]["TestWorkflowRunningContext"];
          configParams?: components["schemas"]["TestWorkflowExecutionConfig"];
          /** @description generated reports from the steps, like junit */
          reports?: components["schemas"]["TestWorkflowReport"][];
          resourceAggregations?: components["schemas"]["TestWorkflowExecutionResourceAggregationsReport"];
      };
      TestWorkflowSummary: {
          name?: string;
          namespace?: string;
          labels?: {
              [key: string]: string;
          };
          annotations?: {
              [key: string]: string;
          };
      };
      TestWorkflowResultSummary: {
          status: components["schemas"]["TestWorkflowStatus"];
          predictedStatus: components["schemas"]["TestWorkflowStatus"];
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
      /** @description test workflow status */
      TestWorkflowStatusSummary: {
          latestExecution?: components["schemas"]["TestWorkflowExecutionSummary"];
      };
      TestWorkflowExecutionNotification: {
          /**
           * Format: date-time
           * @description timestamp for the notification if available
           */
          ts?: string;
          result?: components["schemas"]["TestWorkflowResult"];
          /** @description step reference, if related to some specific step */
          ref?: string;
          /** @description log content, if it's just a log. note, that it includes 30 chars timestamp + space */
          log?: string;
          output?: components["schemas"]["TestWorkflowOutput"];
          /** @description should it be considered temporary only for execution time */
          temporary?: boolean;
      };
      TestWorkflowOutput: {
          /** @description step reference */
          ref?: string;
          /** @description output kind name */
          name?: string;
          /** @description value returned */
          value?: {
              [key: string]: unknown;
          };
      };
      TestWorkflowReport: {
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
          summary?: components["schemas"]["TestWorkflowReportSummary"];
      };
      TestWorkflowReportSummary: {
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
      TestWorkflowExecutionResourceAggregationsReport: {
          global?: components["schemas"]["TestWorkflowExecutionResourceAggregationsByMeasurement"];
          step?: components["schemas"]["TestWorkflowExecutionStepResourceAggregations"][];
      };
      /** @description Step-based resource metrics aggregations (by measurement and field) */
      TestWorkflowExecutionStepResourceAggregations: {
          /** @description step reference */
          ref?: string;
          aggregations?: components["schemas"]["TestWorkflowExecutionResourceAggregationsByMeasurement"];
      };
      /** @description TestWorkflowExecutionResourceAggregationsByMeasurement provides resource usage aggregations
       *     for a specific measurement (e.g. CPU, Memory, etc.) across all steps in a TestWorkflowExecution.
       *      */
      TestWorkflowExecutionResourceAggregationsByMeasurement: {
          [key: string]: {
              [key: string]: components["schemas"]["TestWorkflowExecutionResourceAggregations"];
          };
      };
      /**
       * @description Scope of the resource metrics aggregations.
       * @enum {string}
       */
      TestWorkflowExecutionResourceAggregationsScope: "step" | "global";
      /** @description TestWorkflowExecutionResourceAggregations provides min, max, average, total,
       *     and standard deviation values for a resource metric.
       *      */
      TestWorkflowExecutionResourceAggregations: {
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
      TestWorkflowResult: {
          status: components["schemas"]["TestWorkflowStatus"];
          predictedStatus: components["schemas"]["TestWorkflowStatus"];
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
          /** @description Go-formatted (human-readable) total duration (incl. pause) */
          totalDuration?: string;
          /** @description Duration in milliseconds */
          durationMs: number;
          /** @description Pause duration in milliseconds */
          pausedMs: number;
          /** @description Total duration in milliseconds (incl. pause) */
          totalDurationMs: number;
          pauses?: components["schemas"]["TestWorkflowPause"][];
          initialization?: components["schemas"]["TestWorkflowStepResult"];
          steps?: {
              [key: string]: components["schemas"]["TestWorkflowStepResult"];
          };
      };
      TestWorkflowPause: {
          /** @description step at which it was paused */
          ref: string;
          /**
           * Format: date-time
           * @description when the pause has started
           */
          pausedAt: string;
          /**
           * Format: date-time
           * @description when the pause has ended
           */
          resumedAt?: string;
      };
      TestWorkflowStepResult: {
          errorMessage?: string;
          status?: components["schemas"]["TestWorkflowStepStatus"];
          exitCode?: number;
          /**
           * Format: date-time
           * @description when the container was created
           */
          queuedAt?: string;
          /**
           * Format: date-time
           * @description when the container was started
           */
          startedAt?: string;
          /**
           * Format: date-time
           * @description when the container was finished
           */
          finishedAt?: string;
      };
      TestWorkflowSignature: {
          /** @description step reference */
          ref?: string;
          /** @description step name */
          name?: string;
          /** @description step category, that may be used as name fallback */
          category?: string;
          /** @description is the step/group meant to be optional */
          optional?: boolean;
          /** @description is the step/group meant to be negative */
          negative?: boolean;
          children?: components["schemas"]["TestWorkflowSignature"][];
      };
      /** @enum {string} */
      TestWorkflowStatus: "queued" | "running" | "paused" | "passed" | "failed" | "aborted";
      /** @enum {string} */
      TestWorkflowStepStatus: "queued" | "running" | "paused" | "passed" | "failed" | "timeout" | "skipped" | "aborted";
      TestWorkflowTemplate: {
          /** @description kubernetes resource name */
          name?: string;
          /** @description kubernetes namespace */
          namespace?: string;
          /** @description human-readable description */
          description?: string;
          /**
           * @description test workflow labels
           * @example {
           *       "env": "prod",
           *       "app": "backend"
           *     }
           */
          labels?: {
              [key: string]: string;
          };
          /** @description test workflow annotations */
          annotations?: {
              [key: string]: string;
          };
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          created?: string;
          /**
           * Format: date-time
           * @example 2022-07-30T06:54:15Z
           */
          updated?: string;
          spec?: components["schemas"]["TestWorkflowTemplateSpec"];
      };
      TestWorkflowStepParallel: components["schemas"]["TestWorkflowSpec"] & components["schemas"]["TestWorkflowStepExecuteStrategy"] & components["schemas"]["TestWorkflowStepControl"] & components["schemas"]["TestWorkflowStepOperations"] & {
          /** @description how many resources could be scheduled in parallel */
          parallelism?: number;
          /** @description worker description to display */
          description?: string;
          logs?: components["schemas"]["BoxedString"];
          /** @description list of files to send to parallel steps */
          transfer?: components["schemas"]["TestWorkflowStepParallelTransfer"][];
          /** @description list of files to fetch from parallel steps */
          fetch?: components["schemas"]["TestWorkflowStepParallelFetch"][];
          template?: components["schemas"]["TestWorkflowTemplateRef"];
      };
      TestWorkflowIndependentStepParallel: components["schemas"]["TestWorkflowTemplateSpec"] & components["schemas"]["TestWorkflowStepExecuteStrategy"] & components["schemas"]["TestWorkflowStepControl"] & components["schemas"]["TestWorkflowStepOperations"] & {
          /** @description how many resources could be scheduled in parallel */
          parallelism?: number;
          /** @description worker description to display */
          description?: string;
          logs?: components["schemas"]["BoxedString"];
          /** @description list of files to send to parallel steps */
          transfer?: components["schemas"]["TestWorkflowStepParallelTransfer"][];
          /** @description list of files to fetch from parallel steps */
          fetch?: components["schemas"]["TestWorkflowStepParallelFetch"][];
      };
      TestWorkflowIndependentServiceSpec: components["schemas"]["TestWorkflowStepExecuteStrategy"] & components["schemas"]["TestWorkflowStepRun"] & {
          /** @description service description to display */
          description?: string;
          /** @description maximum time until reaching readiness */
          timeout?: string;
          /** @description list of files to send to parallel steps */
          transfer?: components["schemas"]["TestWorkflowStepParallelTransfer"][];
          content?: components["schemas"]["TestWorkflowContent"];
          pod?: components["schemas"]["TestWorkflowPodConfig"];
          logs?: components["schemas"]["BoxedString"];
          restartPolicy?: string;
          readinessProbe?: components["schemas"]["Probe"];
          pvcs?: {
              [key: string]: components["schemas"]["TestWorkflowPvcConfig"];
          };
      };
      TestWorkflowServiceSpec: components["schemas"]["TestWorkflowStepExecuteStrategy"] & components["schemas"]["TestWorkflowIndependentServiceSpec"] & {
          use?: components["schemas"]["TestWorkflowTemplateRef"][];
      };
      TestWorkflowStepExecuteStrategy: {
          count?: components["schemas"]["BoxedString"];
          maxCount?: components["schemas"]["BoxedString"];
          /** @description matrix of parameters to spawn instances */
          matrix?: {
              [key: string]: string | string[];
          };
          /** @description parameters that should be distributed across sharded instances */
          shards?: {
              [key: string]: string | string[];
          };
      };
      TestWorkflowStepParallelTransfer: {
          /** @description path to load the files from */
          from: string;
          /** @description path to save the files to */
          to?: string;
          files?: components["schemas"]["TestWorkflowTarballFilePattern"];
          mount?: components["schemas"]["BoxedBoolean"];
      };
      TestWorkflowStepParallelFetch: {
          /** @description path to fetch files from */
          from: string;
          /** @description path to save the files to */
          to?: string;
          files?: components["schemas"]["TestWorkflowTarballFilePattern"];
      };
      TestWorkflowSystem: {
          pureByDefault?: components["schemas"]["BoxedBoolean"];
          isolatedContainers?: components["schemas"]["BoxedBoolean"];
      };
      TestWorkflowSpec: {
          use?: components["schemas"]["TestWorkflowTemplateRef"][];
          config?: components["schemas"]["TestWorkflowConfigSchema"];
          system?: components["schemas"]["TestWorkflowSystem"];
          content?: components["schemas"]["TestWorkflowContent"];
          services?: {
              [key: string]: components["schemas"]["TestWorkflowServiceSpec"];
          };
          container?: components["schemas"]["TestWorkflowContainerConfig"];
          job?: components["schemas"]["TestWorkflowJobConfig"];
          pod?: components["schemas"]["TestWorkflowPodConfig"];
          setup?: components["schemas"]["TestWorkflowStep"][];
          steps?: components["schemas"]["TestWorkflowStep"][];
          after?: components["schemas"]["TestWorkflowStep"][];
          events?: components["schemas"]["TestWorkflowEvent"][];
          execution?: components["schemas"]["TestWorkflowTagSchema"];
          pvcs?: {
              [key: string]: components["schemas"]["TestWorkflowPvcConfig"];
          };
      };
      TestWorkflowTemplateSpec: {
          config?: components["schemas"]["TestWorkflowConfigSchema"];
          system?: components["schemas"]["TestWorkflowSystem"];
          content?: components["schemas"]["TestWorkflowContent"];
          services?: {
              [key: string]: components["schemas"]["TestWorkflowIndependentServiceSpec"];
          };
          container?: components["schemas"]["TestWorkflowContainerConfig"];
          job?: components["schemas"]["TestWorkflowJobConfig"];
          pod?: components["schemas"]["TestWorkflowPodConfig"];
          setup?: components["schemas"]["TestWorkflowIndependentStep"][];
          steps?: components["schemas"]["TestWorkflowIndependentStep"][];
          after?: components["schemas"]["TestWorkflowIndependentStep"][];
          events?: components["schemas"]["TestWorkflowEvent"][];
          execution?: components["schemas"]["TestWorkflowTagSchema"];
          pvcs?: {
              [key: string]: components["schemas"]["TestWorkflowPvcConfig"];
          };
      };
      TestWorkflowStepControl: {
          /** @description should the step be paused initially */
          paused?: boolean;
          /** @description is the step expected to fail */
          negative?: boolean;
          /** @description is the step optional, so the failure won't affect the TestWorkflow result */
          optional?: boolean;
          retry?: components["schemas"]["TestWorkflowRetryPolicy"];
          /** @description maximum time this step may take */
          timeout?: string;
      };
      TestWorkflowStepOperations: {
          /** @description delay before the step */
          delay?: string;
          /** @description script to run in a default shell for the container */
          shell?: string;
          run?: components["schemas"]["TestWorkflowStepRun"];
          execute?: components["schemas"]["TestWorkflowStepExecute"];
          artifacts?: components["schemas"]["TestWorkflowStepArtifacts"];
      };
      TestWorkflowIndependentStep: {
          /** @description readable name for the step */
          name?: string;
          /** @description expression to declare under which conditions the step should be run; defaults to "passed", except artifacts where it defaults to "always" */
          condition?: string;
          pure?: components["schemas"]["BoxedBoolean"];
          /** @description should the step be paused initially */
          paused?: boolean;
          /** @description is the step expected to fail */
          negative?: boolean;
          /** @description is the step optional, so the failure won't affect the TestWorkflow result */
          optional?: boolean;
          retry?: components["schemas"]["TestWorkflowRetryPolicy"];
          /** @description maximum time this step may take */
          timeout?: string;
          /** @description delay before the step */
          delay?: string;
          content?: components["schemas"]["TestWorkflowContent"];
          services?: {
              [key: string]: components["schemas"]["TestWorkflowIndependentServiceSpec"];
          };
          /** @description script to run in a default shell for the container */
          shell?: string;
          run?: components["schemas"]["TestWorkflowStepRun"];
          workingDir?: components["schemas"]["BoxedString"];
          container?: components["schemas"]["TestWorkflowContainerConfig"];
          execute?: components["schemas"]["TestWorkflowStepExecute"];
          artifacts?: components["schemas"]["TestWorkflowStepArtifacts"];
          parallel?: components["schemas"]["TestWorkflowIndependentStepParallel"];
          /** @description nested setup steps to run */
          setup?: components["schemas"]["TestWorkflowIndependentStep"][];
          /** @description nested steps to run */
          steps?: components["schemas"]["TestWorkflowIndependentStep"][];
      };
      TestWorkflowStep: {
          /** @description readable name for the step */
          name?: string;
          /** @description expression to declare under which conditions the step should be run; defaults to "passed", except artifacts where it defaults to "always" */
          condition?: string;
          pure?: components["schemas"]["BoxedBoolean"];
          /** @description should the step be paused initially */
          paused?: boolean;
          /** @description is the step expected to fail */
          negative?: boolean;
          /** @description is the step optional, so the failure won't affect the TestWorkflow result */
          optional?: boolean;
          /** @description list of TestWorkflowTemplates to use */
          use?: components["schemas"]["TestWorkflowTemplateRef"][];
          template?: components["schemas"]["TestWorkflowTemplateRef"];
          retry?: components["schemas"]["TestWorkflowRetryPolicy"];
          /** @description maximum time this step may take */
          timeout?: string;
          /** @description delay before the step */
          delay?: string;
          content?: components["schemas"]["TestWorkflowContent"];
          services?: {
              [key: string]: components["schemas"]["TestWorkflowServiceSpec"];
          };
          /** @description script to run in a default shell for the container */
          shell?: string;
          run?: components["schemas"]["TestWorkflowStepRun"];
          workingDir?: components["schemas"]["BoxedString"];
          container?: components["schemas"]["TestWorkflowContainerConfig"];
          execute?: components["schemas"]["TestWorkflowStepExecute"];
          artifacts?: components["schemas"]["TestWorkflowStepArtifacts"];
          parallel?: components["schemas"]["TestWorkflowStepParallel"];
          /** @description nested setup steps to run */
          setup?: components["schemas"]["TestWorkflowStep"][];
          /** @description nested steps to run */
          steps?: components["schemas"]["TestWorkflowStep"][];
      };
      TestWorkflowStepExecute: {
          /** @description how many resources could be scheduled in parallel */
          parallelism?: number;
          /** @description only schedule the resources, don't watch for the results (unless it is needed for parallelism) */
          async?: boolean;
          /** @description tests to schedule */
          tests?: components["schemas"]["TestWorkflowStepExecuteTestRef"][];
          /** @description workflows to schedule */
          workflows?: components["schemas"]["TestWorkflowStepExecuteTestWorkflowRef"][];
      };
      TestWorkflowStepExecuteTestWorkflowRef: components["schemas"]["TestWorkflowStepExecuteStrategy"] & {
          /** @description TestWorkflow name to include */
          name?: string;
          /** @description TestWorkflow execution description to display */
          description?: string;
          /** @description TestWorkflow execution name override */
          executionName?: string;
          tarball?: {
              [key: string]: components["schemas"]["TestWorkflowTarballRequest"];
          };
          config?: components["schemas"]["TestWorkflowConfigValue"];
          /** @description label selector for test workflow */
          selector?: components["schemas"]["LabelSelector"];
          target?: components["schemas"]["ExecutionTarget"];
      };
      TestWorkflowStepExecuteTestRef: components["schemas"]["TestWorkflowStepExecuteStrategy"] & {
          /** @description test name to schedule */
          name?: string;
          /** @description test execution description to display */
          description?: string;
          count?: components["schemas"]["BoxedString"];
          maxCount?: components["schemas"]["BoxedString"];
          executionRequest?: components["schemas"]["TestWorkflowStepExecuteTestExecutionRequest"];
          tarball?: {
              [key: string]: components["schemas"]["TestWorkflowTarballRequest"];
          };
      };
      TestWorkflowTarballRequest: {
          /** @description path to load the files from */
          from: string;
          files?: components["schemas"]["TestWorkflowTarballFilePattern"];
      };
      /** @description dynamic expression or static list of file patterns to pack */
      TestWorkflowTarballFilePattern: {
          static?: unknown[];
          expression?: string;
      };
      TestWorkflowStepExecuteTestExecutionRequest: {
          /**
           * @description test execution custom name
           * @example testing with 1000 users
           */
          name?: string;
          /**
           * @description test execution labels
           * @example {
           *       "users": "3",
           *       "prefix": "some-"
           *     }
           */
          executionLabels?: {
              [key: string]: string;
          };
          /**
           * @description in case the variables file is too big, it will be uploaded
           * @example false
           */
          isVariablesFileUploaded?: boolean;
          /** @description variables file content - need to be in format for particular executor (e.g. postman envs file) */
          variablesFile?: string;
          variables?: components["schemas"]["Variables"];
          /**
           * @description test secret uuid
           * @example 7934600f-b367-48dd-b981-4353304362fb
           */
          readonly testSecretUUID?: string;
          /**
           * @description executor image command
           * @example [
           *       "curl"
           *     ]
           */
          command?: string[];
          /**
           * @description additional executor binary arguments
           * @example [
           *       "--repeats",
           *       "5",
           *       "--insecure"
           *     ]
           */
          args?: string[];
          /**
           * @description usage mode for arguments
           * @enum {string}
           */
          argsMode?: "append" | "override" | "replace";
          /**
           * @description container image, executor will run inside this image
           * @example kubeshop/testkube-executor-custom:1.10.11-dev-0a9c91
           */
          image?: string;
          /** @description container image pull secrets */
          imagePullSecrets?: components["schemas"]["LocalObjectReference"][];
          /** @description whether to start execution sync or async */
          sync?: boolean;
          /**
           * @description http proxy for executor containers
           * @example user:pass@my.proxy.server:8080
           */
          httpProxy?: string;
          /**
           * @description https proxy for executor containers
           * @example user:pass@my.proxy.server:8081
           */
          httpsProxy?: string;
          /**
           * @description whether to run test as negative test
           * @example false
           */
          negativeTest?: boolean;
          /**
           * Format: int64
           * @description duration in seconds the test may be active, until its stopped
           * @example 1
           */
          activeDeadlineSeconds?: number;
          /** @description configuration parameters for storing test artifacts */
          artifactRequest?: components["schemas"]["ArtifactRequest"];
          /** @description job template extensions */
          jobTemplate?: string;
          /** @description cron job template extensions */
          cronJobTemplate?: string;
          /**
           * @description script to run before test execution
           * @example echo -n '$SECRET_ENV' > ./secret_file
           */
          preRunScript?: string;
          /**
           * @description script to run after test execution
           * @example sleep 30
           */
          postRunScript?: string;
          /** @description execute post run script before scraping (prebuilt executor only) */
          executePostRunScriptBeforeScraping?: boolean;
          /** @description run scripts using source command (container executor only) */
          sourceScripts?: boolean;
          /** @description scraper template extensions */
          scraperTemplate?: string;
          /** @description pvc template extensions */
          pvcTemplate?: string;
          /** @description config map references */
          envConfigMaps?: components["schemas"]["EnvReference"][];
          /** @description secret references */
          envSecrets?: components["schemas"]["EnvReference"][];
          /** @description namespace for test execution (Pro edition only) */
          executionNamespace?: string;
      };
      TestWorkflowStepArtifacts: {
          workingDir?: components["schemas"]["BoxedString"];
          compress?: components["schemas"]["TestWorkflowStepArtifactsCompression"];
          /** @description file paths to fetch from the container */
          paths: string[];
      };
      TestWorkflowStepArtifactsCompression: {
          /** @description artifact name */
          name?: string;
      };
      TestWorkflowRetryPolicy: {
          /** @description how many times at most it should retry */
          count: number;
          /** @description until when it should retry (defaults to "passed") */
          until?: string;
      };
      TestWorkflowTarget: {
          /** @description labels to attach to the job */
          match?: {
              [key: string]: string[];
          };
          /** @description labels to attach to the job */
          not?: {
              [key: string]: string[];
          };
          replicate?: string[];
      };
      TestWorkflowContent: {
          git?: components["schemas"]["TestWorkflowContentGit"];
          files?: components["schemas"]["TestWorkflowContentFile"][];
          tarball?: components["schemas"]["TestWorkflowContentTarball"][];
      };
      TestWorkflowContentGit: {
          /** @description uri for the Git repository */
          uri?: string;
          /** @description branch, commit or a tag name to fetch */
          revision?: string;
          /** @description plain text username to fetch with */
          username?: string;
          usernameFrom?: components["schemas"]["EnvVarSource"];
          /** @description plain text token to fetch with */
          token?: string;
          tokenFrom?: components["schemas"]["EnvVarSource"];
          /** @description plain text SSH private key to fetch with */
          sshKey?: string;
          sshKeyFrom?: components["schemas"]["EnvVarSource"];
          authType?: components["schemas"]["ContentGitAuthType"];
          /** @description where to mount the fetched repository contents (defaults to "repo" directory in the data volume) */
          mountPath?: string;
          /** @description enable cone mode for sparse checkout with paths */
          cone?: boolean;
          /** @description paths to fetch for the sparse checkout */
          paths?: string[];
      };
      TestWorkflowContentFile: {
          /** @description path where the file should be accessible at */
          path: string;
          /** @description plain-text content to put inside */
          content?: string;
          contentFrom?: components["schemas"]["EnvVarSource"];
          mode?: components["schemas"]["BoxedInteger"];
      };
      TestWorkflowContentTarball: {
          /** @description url for the tarball to extract */
          url: string;
          /** @description path where the tarball should be extracted */
          path: string;
          mount?: components["schemas"]["BoxedBoolean"];
      };
      TestWorkflowRef: {
          /** @description TestWorkflow name to include */
          name: string;
          config?: components["schemas"]["TestWorkflowConfigValue"];
      };
      TestWorkflowTemplateRef: {
          /** @description TestWorkflowTemplate name to include */
          name: string;
          config?: components["schemas"]["TestWorkflowConfigValue"];
      };
      TestWorkflowJobConfig: {
          /** @description labels to attach to the job */
          labels?: {
              [key: string]: string;
          };
          /** @description annotations to attach to the job */
          annotations?: {
              [key: string]: string;
          };
          /** @description namespace for execution of test workflow */
          namespace?: string;
          activeDeadlineSeconds?: components["schemas"]["BoxedInteger"];
      };
      TestWorkflowPodConfig: {
          /** @description labels to attach to the pod */
          labels?: {
              [key: string]: string;
          };
          /** @description annotations to attach to the pod */
          annotations?: {
              [key: string]: string;
          };
          /** @description secret references for pulling images */
          imagePullSecrets?: components["schemas"]["LocalObjectReference"][];
          /** @description default service account name for the containers */
          serviceAccountName?: string;
          /** @description label selector for node that the pod should land on */
          nodeSelector?: {
              [key: string]: string;
          };
          /** @description volumes to append to the pod */
          volumes?: components["schemas"]["Volume"][];
          activeDeadlineSeconds?: components["schemas"]["BoxedInteger"];
          dnsPolicy?: string;
          nodeName?: string;
          securityContext?: components["schemas"]["PodSecurityContext"];
          hostname?: string;
          subdomain?: string;
          affinity?: components["schemas"]["Affinity"];
          tolerations?: components["schemas"]["Toleration"][];
          hostAliases?: components["schemas"]["HostAlias"][];
          priorityClassName?: string;
          priority?: components["schemas"]["BoxedInteger"];
          dnsConfig?: components["schemas"]["PodDNSConfig"];
          preemptionPolicy?: components["schemas"]["BoxedString"];
          topologySpreadConstraints?: components["schemas"]["TopologySpreadConstraint"][];
          schedulingGates?: components["schemas"]["PodSchedulingGate"][];
          resourceClaims?: components["schemas"]["PodResourceClaim"][];
      };
      TestWorkflowContainerConfig: {
          workingDir?: components["schemas"]["BoxedString"];
          /** @description image to be used for the container */
          image?: string;
          imagePullPolicy?: components["schemas"]["ImagePullPolicy"];
          /** @description environment variables to append to the container */
          env?: components["schemas"]["EnvVar"][];
          /** @description external environment variables to append to the container */
          envFrom?: components["schemas"]["EnvFromSource"][];
          command?: components["schemas"]["BoxedStringList"];
          args?: components["schemas"]["BoxedStringList"];
          resources?: components["schemas"]["TestWorkflowResources"];
          securityContext?: components["schemas"]["SecurityContext"];
          /** @description volumes to mount to the container */
          volumeMounts?: components["schemas"]["VolumeMount"][];
      };
      TestWorkflowStepRun: {
          workingDir?: components["schemas"]["BoxedString"];
          /** @description image to be used for the container */
          image?: string;
          imagePullPolicy?: components["schemas"]["ImagePullPolicy"];
          /** @description environment variables to append to the container */
          env?: components["schemas"]["EnvVar"][];
          /** @description external environment variables to append to the container */
          envFrom?: components["schemas"]["EnvFromSource"][];
          command?: components["schemas"]["BoxedStringList"];
          args?: components["schemas"]["BoxedStringList"];
          shell?: components["schemas"]["BoxedString"];
          resources?: components["schemas"]["TestWorkflowResources"];
          securityContext?: components["schemas"]["SecurityContext"];
          /** @description volumes to mount to the container */
          volumeMounts?: components["schemas"]["VolumeMount"][];
      };
      /** @description map of configuration values used in the test workflow execution */
      TestWorkflowExecutionConfig: {
          [key: string]: components["schemas"]["TestWorkflowExecutionConfigValue"];
      };
      /** @description configuration values used in the test workflow execution */
      TestWorkflowExecutionConfigValue: {
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
      /** @description configuration values to pass to the template */
      TestWorkflowConfigValue: {
          [key: string]: string;
      };
      /** @description configuration definition */
      TestWorkflowConfigSchema: {
          [key: string]: components["schemas"]["TestWorkflowParameterSchema"];
      };
      TestWorkflowResources: {
          limits?: components["schemas"]["TestWorkflowResourcesList"];
          requests?: components["schemas"]["TestWorkflowResourcesList"];
      };
      TestWorkflowResourcesList: {
          /** @description number of CPUs */
          cpu?: string;
          /** @description size of RAM memory */
          memory?: string;
          /** @description storage size */
          storage?: string;
          /** @description ephemeral storage size */
          "ephemeral-storage"?: string;
      };
      TestWorkflowParameterSchema: {
          /** @description human-readable description for the property */
          description?: string;
          type: components["schemas"]["TestWorkflowParameterType"];
          /** @description list of acceptable values */
          enum?: string[];
          /** @description example value for the parameter */
          example?: string;
          default?: components["schemas"]["BoxedString"];
          /** @description predefined format for the string */
          format?: string;
          /** @description regular expression to match */
          pattern?: string;
          minLength?: components["schemas"]["BoxedInteger"];
          maxLength?: components["schemas"]["BoxedInteger"];
          minimum?: components["schemas"]["BoxedInteger"];
          maximum?: components["schemas"]["BoxedInteger"];
          exclusiveMinimum?: components["schemas"]["BoxedInteger"];
          exclusiveMaximum?: components["schemas"]["BoxedInteger"];
          multipleOf?: components["schemas"]["BoxedInteger"];
          /**
           * @description whether this value should be stored in the secret
           * @default false
           */
          sensitive: boolean;
      };
      /**
       * @description type of the config parameter
       * @enum {string}
       */
      TestWorkflowParameterType: "string" | "integer" | "number" | "boolean";
      TestWorkflowEvent: {
          cronjob?: components["schemas"]["TestWorkflowCronJobConfig"];
      };
      /** @description cron job configuration */
      TestWorkflowCronJobConfig: {
          /**
           * @description cron schedule to run a test workflow
           * @example * * * * *
           */
          cron: string;
          /** @description labels to attach to the cron job */
          labels?: {
              [key: string]: string;
          };
          /** @description annotations to attach to the cron job */
          annotations?: {
              [key: string]: string;
          };
          config?: components["schemas"]["TestWorkflowConfigValue"];
          target?: components["schemas"]["ExecutionTarget"];
      };
      TestWorkflowExecutionCR: {
          /** @description test workflow name and namespace */
          testWorkflow: components["schemas"]["ObjectRef"];
          /** @description test workflow execution request parameters */
          executionRequest?: components["schemas"]["TestWorkflowExecutionRequest"];
          /** @description test workflow execution status */
          status?: components["schemas"]["TestWorkflowExecutionStatusCR"];
      };
      /** @description test workflow execution status */
      TestWorkflowExecutionStatusCR: {
          latestExecution?: components["schemas"]["TestWorkflowExecution"];
          /**
           * Format: int64
           * @description test workflow execution generation
           */
          generation?: number;
      };
      /** @description tag values to pass to the test workflow execution */
      TestWorkflowTagValue: {
          [key: string]: string;
      };
      /** @description test workflow execution tag definition */
      TestWorkflowTagSchema: {
          tags?: components["schemas"]["TestWorkflowTagValue"];
          target?: components["schemas"]["ExecutionTarget"];
      };
      TestWorkflowExecutionTags: {
          tags?: components["schemas"]["TestWorkflowTagValue"];
      };
      /**
       * @description auth type for git requests
       * @enum {string}
       */
      ContentGitAuthType: "basic" | "header";
      BoxedStringList: {
          value: string[];
      };
      BoxedString: {
          value: string;
      };
      BoxedInteger: {
          value: number;
      };
      BoxedBoolean: {
          value: boolean;
      };
      /** @enum {string} */
      ImagePullPolicy: "Always" | "Never" | "IfNotPresent";
      EnvVar: {
          global?: components["schemas"]["BoxedBoolean"];
          name?: string;
          value?: string;
          valueFrom?: components["schemas"]["EnvVarSource"];
      };
      ConfigMapEnvSource: {
          name: string;
          /** @default false */
          optional: boolean;
      };
      SecretEnvSource: {
          name: string;
          /** @default false */
          optional: boolean;
      };
      EnvFromSource: {
          prefix?: string;
          configMapRef?: components["schemas"]["ConfigMapEnvSource"];
          secretRef?: components["schemas"]["SecretEnvSource"];
      };
      SecurityContext: {
          privileged?: components["schemas"]["BoxedBoolean"];
          runAsUser?: components["schemas"]["BoxedInteger"];
          runAsGroup?: components["schemas"]["BoxedInteger"];
          runAsNonRoot?: components["schemas"]["BoxedBoolean"];
          readOnlyRootFilesystem?: components["schemas"]["BoxedBoolean"];
          allowPrivilegeEscalation?: components["schemas"]["BoxedBoolean"];
      };
      PodSecurityContext: {
          seLinuxOptions?: components["schemas"]["SELinuxOptions"];
          windowsOptions?: components["schemas"]["WindowsSecurityContextOptions"];
          runAsUser?: components["schemas"]["BoxedInteger"];
          runAsGroup?: components["schemas"]["BoxedInteger"];
          runAsNonRoot?: components["schemas"]["BoxedBoolean"];
          supplementalGroups?: number[];
          supplementalGroupsPolicy?: components["schemas"]["BoxedString"];
          fsGroup?: components["schemas"]["BoxedInteger"];
          sysctls?: components["schemas"]["Sysctl"][];
          fsGroupChangePolicy?: components["schemas"]["BoxedString"];
          seccompProfile?: components["schemas"]["SeccompProfile"];
          appArmorProfile?: components["schemas"]["AppArmorProfile"];
          seLinuxChangePolicy?: components["schemas"]["BoxedString"];
      };
      SELinuxOptions: {
          user?: string;
          role?: string;
          type?: string;
          level?: string;
      };
      WindowsSecurityContextOptions: {
          gmsaCredentialSpecName?: components["schemas"]["BoxedString"];
          gmsaCredentialSpec?: components["schemas"]["BoxedString"];
          runAsUserName?: components["schemas"]["BoxedString"];
          hostProcess?: components["schemas"]["BoxedBoolean"];
      };
      Sysctl: {
          name?: string;
          value?: string;
      };
      SeccompProfile: {
          type?: string;
          localhostProfile?: components["schemas"]["BoxedString"];
      };
      AppArmorProfile: {
          type?: string;
          localhostProfile?: components["schemas"]["BoxedString"];
      };
      Toleration: {
          key?: string;
          operator?: string;
          value?: string;
          effect?: string;
          tolerationSeconds?: components["schemas"]["BoxedInteger"];
      };
      HostAlias: {
          ip?: string;
          hostnames?: string[];
      };
      TopologySpreadConstraint: {
          maxSkew?: number;
          topologyKey?: string;
          whenUnsatisfiable?: string;
          labelSelector?: components["schemas"]["LabelSelector"];
          minDomains?: components["schemas"]["BoxedInteger"];
          nodeAffinityPolicy?: components["schemas"]["BoxedString"];
          nodeTaintsPolicy?: components["schemas"]["BoxedString"];
          matchLabelKeys?: string[];
      };
      PodSchedulingGate: {
          name?: string;
      };
      PodResourceClaim: {
          name?: string;
          source?: components["schemas"]["ClaimSource"];
      };
      ClaimSource: {
          resourceClaimName?: components["schemas"]["BoxedString"];
          resourceClaimTemplateName?: components["schemas"]["BoxedString"];
      };
      NodeSelectorRequirement: {
          key?: string;
          operator?: string;
          values?: string[];
      };
      NodeSelectorTerm: {
          matchExpressions?: components["schemas"]["NodeSelectorRequirement"][];
          matchFields?: components["schemas"]["NodeSelectorRequirement"][];
      };
      NodeSelector: {
          nodeSelectorTerms?: components["schemas"]["NodeSelectorTerm"][];
      };
      PreferredSchedulingTerm: {
          weight?: number;
          preference: components["schemas"]["NodeSelectorTerm"];
      };
      NodeAffinity: {
          requiredDuringSchedulingIgnoredDuringExecution?: components["schemas"]["NodeSelector"];
          preferredDuringSchedulingIgnoredDuringExecution?: components["schemas"]["PreferredSchedulingTerm"][];
      };
      PodAffinity: {
          requiredDuringSchedulingIgnoredDuringExecution?: components["schemas"]["PodAffinityTerm"][];
          preferredDuringSchedulingIgnoredDuringExecution?: components["schemas"]["WeightedPodAffinityTerm"][];
      };
      LabelSelectorRequirement: {
          key?: string;
          operator?: string;
          values?: string[];
      };
      LabelSelector: {
          matchLabels?: {
              [key: string]: string;
          };
          matchExpressions?: components["schemas"]["LabelSelectorRequirement"][];
      };
      PodAffinityTerm: {
          labelSelector?: components["schemas"]["LabelSelector"];
          namespaces?: string[];
          topologyKey?: string;
          namespaceSelector?: components["schemas"]["LabelSelector"];
      };
      WeightedPodAffinityTerm: {
          weight?: number;
          podAffinityTerm: components["schemas"]["PodAffinityTerm"];
      };
      Affinity: {
          nodeAffinity?: components["schemas"]["NodeAffinity"];
          podAffinity?: components["schemas"]["PodAffinity"];
          podAntiAffinity?: components["schemas"]["PodAffinity"];
      };
      PodDNSConfig: {
          nameservers?: string[];
          searches?: string[];
          options?: components["schemas"]["PodDNSConfigOption"][];
      };
      PodDNSConfigOption: {
          name?: string;
          value?: components["schemas"]["BoxedString"];
      };
      /** @description Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */
      Probe: {
          initialDelaySeconds?: number;
          timeoutSeconds?: number;
          periodSeconds?: number;
          successThreshold?: number;
          failureThreshold?: number;
          terminationGracePeriodSeconds?: components["schemas"]["BoxedInteger"];
          exec?: components["schemas"]["ExecAction"];
          httpGet?: components["schemas"]["HTTPGetAction"];
          tcpSocket?: components["schemas"]["TCPSocketAction"];
          grpc?: components["schemas"]["GRPCAction"];
      };
      ExecAction: {
          /** @description Command is the command line to execute inside the container, the working directory for the command is root ('/') in the container's filesystem. Exit status of 0 is treated as live/healthy and non-zero is unhealthy. */
          command?: string[];
      };
      HTTPGetAction: {
          path?: string;
          port?: string;
          host?: string;
          scheme?: string;
          httpHeaders?: components["schemas"]["HTTPHeader"][];
      };
      HTTPHeader: {
          name?: string;
          value?: string;
      };
      TCPSocketAction: {
          port?: string;
          host?: string;
      };
      GRPCAction: {
          port?: number;
          service?: components["schemas"]["BoxedString"];
      };
      /** @description VolumeMount describes a mounting of a Volume within a container. */
      VolumeMount: {
          /** @description Path within the container at which the volume should be mounted.  Must not contain ':'. */
          mountPath: string;
          mountPropagation?: components["schemas"]["BoxedString"];
          /** @description This must match the Name of a Volume. */
          name: string;
          /** @description Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false. */
          readOnly?: boolean;
          /** @description Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root). */
          subPath?: string;
          /** @description Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive. */
          subPathExpr?: string;
      };
      /** @description hostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath --- TODO(jonesdl) We need to restrict who can use host directory mounts and who can/can not mount host directories as read/write. */
      HostPathVolumeSource: {
          /** @description path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath */
          path: string;
          type?: components["schemas"]["BoxedString"];
      };
      /** @description emptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir */
      EmptyDirVolumeSource: {
          /** @description medium represents what type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir */
          medium?: string;
          sizeLimit?: components["schemas"]["BoxedString"];
      };
      /** @description gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
      GCEPersistentDiskVolumeSource: {
          /** @description fsType is filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk TODO: how do we prevent errors in the filesystem from compromising the machine */
          fsType?: string;
          /**
           * Format: int32
           * @description partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
           */
          partition?: number;
          /** @description pdName is unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
          pdName: string;
          /** @description readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
          readOnly?: boolean;
      };
      /** @description awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
      AWSElasticBlockStoreVolumeSource: {
          /** @description fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore TODO: how do we prevent errors in the filesystem from compromising the machine */
          fsType?: string;
          /**
           * Format: int32
           * @description partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).
           */
          partition?: number;
          /** @description readOnly value true will force the readOnly setting in VolumeMounts. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
          readOnly?: boolean;
          /** @description volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
          volumeID: string;
      };
      /** @description secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret */
      SecretVolumeSource: {
          defaultMode?: components["schemas"]["BoxedInteger"];
          /** @description items If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
          items?: {
              /** @description key is the key to project. */
              key: string;
              mode?: components["schemas"]["BoxedInteger"];
              /** @description path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'. */
              path: string;
          }[];
          /** @description optional field specify whether the Secret or its keys must be defined */
          optional?: boolean;
          /** @description secretName is the name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret */
          secretName?: string;
      };
      /** @description nfs represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
      NFSVolumeSource: {
          /** @description path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
          path: string;
          /** @description readOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
          readOnly?: boolean;
          /** @description server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
          server: string;
      };
      /** @description persistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
      PersistentVolumeClaimVolumeSource: {
          /** @description claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
          claimName: string;
          /** @description readOnly Will force the ReadOnly setting in VolumeMounts. Default false. */
          readOnly?: boolean;
      };
      /** @description cephFS represents a Ceph FS mount on the host that shares a pod's lifetime */
      CephFSVolumeSource: {
          /** @description monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
          monitors: string[];
          /** @description path is Optional: Used as the mounted root, rather than the full Ceph tree, default is / */
          path?: string;
          /** @description readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
          readOnly?: boolean;
          /** @description secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
          secretFile?: string;
          secretRef?: components["schemas"]["LocalObjectReference"];
          /** @description user is optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
          user?: string;
      };
      /** @description azureFile represents an Azure File Service mount on the host and bind mount to the pod. */
      AzureFileVolumeSource: {
          /** @description readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
          readOnly?: boolean;
          /** @description secretName is the  name of secret that contains Azure Storage Account Name and Key */
          secretName: string;
          /** @description shareName is the azure share Name */
          shareName: string;
      };
      /** @description configMap represents a configMap that should populate this volume */
      ConfigMapVolumeSource: {
          defaultMode?: components["schemas"]["BoxedInteger"];
          /** @description items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
          items?: {
              /** @description key is the key to project. */
              key: string;
              mode?: components["schemas"]["BoxedInteger"];
              /** @description path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'. */
              path: string;
          }[];
          /** @description Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid? */
          name?: string;
          /** @description optional specify whether the ConfigMap or its keys must be defined */
          optional?: boolean;
      };
      /** @description azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. */
      AzureDiskVolumeSource: {
          cachingMode?: components["schemas"]["BoxedString"];
          /** @description diskName is the Name of the data disk in the blob storage */
          diskName: string;
          /** @description diskURI is the URI of data disk in the blob storage */
          diskURI: string;
          fsType?: components["schemas"]["BoxedString"];
          kind?: components["schemas"]["BoxedString"];
          /** @description readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
          readOnly?: boolean;
      };
      /** @description Represents a source location of a volume to mount, managed by an external CSI driver */
      CSIVolumeSource: {
          /** @description driver is the name of the CSI driver that handles this volume. */
          driver?: string;
          readOnly?: components["schemas"]["BoxedBoolean"];
          fsType?: components["schemas"]["BoxedString"];
          /** @description volumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values. */
          volumeAttributes?: {
              [key: string]: string;
          };
          nodePublishSecretRef?: components["schemas"]["LocalObjectReference"];
      };
      /** @description Represents a projected volume source */
      ProjectedVolumeSource: {
          defaultMode?: components["schemas"]["BoxedInteger"];
          /** @description sources is the list of volume projections. Each entry in this list handles one source. */
          sources?: {
              /** @description ClusterTrustBundle allows a pod to access the `.spec.trustBundle` field of ClusterTrustBundle objects in an auto-updating file. */
              clusterTrustBundle?: {
                  labelSelector?: components["schemas"]["LabelSelector"];
                  name?: components["schemas"]["BoxedString"];
                  optional?: components["schemas"]["BoxedBoolean"];
                  /** @description Relative path from the volume root to write the bundle. */
                  path: string;
                  signerName?: components["schemas"]["BoxedString"];
              };
              /** @description configMap information about the configMap data to project */
              configMap?: {
                  /** @description items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
                  items?: {
                      /** @description key is the key to project. */
                      key: string;
                      mode?: components["schemas"]["BoxedInteger"];
                      /** @description path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'. */
                      path: string;
                  }[];
                  /** @description Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid? */
                  name?: string;
                  optional?: components["schemas"]["BoxedBoolean"];
              };
              /** @description downwardAPI information about the downwardAPI data to project */
              downwardAPI?: {
                  /** @description Items is a list of DownwardAPIVolume file */
                  items?: {
                      fieldRef?: components["schemas"]["FieldRef"];
                      mode?: components["schemas"]["BoxedInteger"];
                      /** @description path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'. */
                      path: string;
                      resourceFieldRef?: components["schemas"]["ResourceFieldRef"];
                  }[];
              };
              /** @description secret information about the secret data to project */
              secret?: {
                  /** @description items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
                  items?: {
                      /** @description key is the key to project. */
                      key: string;
                      mode?: components["schemas"]["BoxedInteger"];
                      /** @description path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'. */
                      path: string;
                  }[];
                  /** @description Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid? */
                  name?: string;
                  optional?: components["schemas"]["BoxedBoolean"];
              };
              /** @description serviceAccountToken is information about the serviceAccountToken data to project */
              serviceAccountToken?: {
                  /** @description audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver. */
                  audience?: string;
                  expirationSeconds?: components["schemas"]["BoxedInteger"];
                  /** @description path is the path relative to the mount point of the file to project the token into. */
                  path: string;
              };
          }[];
      };
      /** @description Volume represents a named volume in a pod that may be accessed by any container in the pod. */
      Volume: {
          name: string;
          hostPath?: components["schemas"]["HostPathVolumeSource"];
          emptyDir?: components["schemas"]["EmptyDirVolumeSource"];
          gcePersistentDisk?: components["schemas"]["GCEPersistentDiskVolumeSource"];
          awsElasticBlockStore?: components["schemas"]["AWSElasticBlockStoreVolumeSource"];
          secret?: components["schemas"]["SecretVolumeSource"];
          nfs?: components["schemas"]["NFSVolumeSource"];
          persistentVolumeClaim?: components["schemas"]["PersistentVolumeClaimVolumeSource"];
          cephfs?: components["schemas"]["CephFSVolumeSource"];
          azureFile?: components["schemas"]["AzureFileVolumeSource"];
          azureDisk?: components["schemas"]["AzureDiskVolumeSource"];
          configMap?: components["schemas"]["ConfigMapVolumeSource"];
          csi?: components["schemas"]["CSIVolumeSource"];
          projected?: components["schemas"]["ProjectedVolumeSource"];
      };
      VolumeSource: Record<string, never>;
      /** @description EnvVarSource represents a source for the value of an EnvVar. */
      EnvVarSource: {
          /** @description Selects a key of a ConfigMap. */
          configMapKeyRef?: {
              /** @description The key to select. */
              key: string;
              /** @description Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid? */
              name?: string;
              /** @description Specify whether the ConfigMap or its key must be defined */
              optional?: boolean;
          };
          fieldRef?: components["schemas"]["FieldRef"];
          resourceFieldRef?: components["schemas"]["ResourceFieldRef"];
          /** @description Selects a key of a secret in the pod's namespace */
          secretKeyRef?: {
              /** @description The key of the secret to select from.  Must be a valid secret key. */
              key: string;
              /** @description Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid? */
              name?: string;
              /** @description Specify whether the Secret or its key must be defined */
              optional?: boolean;
          };
      };
      /** @description Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['<KEY>']`, `metadata.annotations['<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs. */
      FieldRef: {
          /** @description Version of the schema the FieldPath is written in terms of, defaults to "v1". */
          apiVersion?: string;
          /** @description Path of the field to select in the specified API version. */
          fieldPath: string;
      };
      /** @description Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported. */
      ResourceFieldRef: {
          /** @description Container name: required for volumes, optional for env vars */
          containerName?: string;
          divisor?: string;
          /** @description Required: resource to select */
          resource: string;
      };
      TestWorkflowPvcConfig: {
          /** @description Access mode for claim storage. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes */
          accessModes?: string[];
          /** @description Volume mode indicates the consumption of the volume as either a filesystem or block device. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#volume-mode */
          volumeMode?: components["schemas"]["BoxedString"];
          /** @description Resources required for pvc */
          resources?: components["schemas"]["TestWorkflowResources"];
          /** @description Storage class name specifies the name of a StorageClass. More info: https://kubernetes.io/docs/concepts/storage/storage-classes/ */
          storageClassName?: components["schemas"]["BoxedString"];
          /** @description Volume name is used to identify the volume */
          volumeName?: string;
          /** @description Only the volumes whose labels match the selector can be bound to the claim */
          selector?: components["schemas"]["LabelSelector"];
          /** @description Data source field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) */
          dataSource?: components["schemas"]["TypedLocalObjectReference"];
          /** @description Data source reference specifies the object from which to populate the volume with data, if a non-empty volume is desired */
          dataSourceRef?: components["schemas"]["TypedObjectReference"];
          /** @description Volume attributes class name may be used to set the VolumeAttributesClass used by this claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#volumeattributesclass */
          volumeAttributesClassName?: components["schemas"]["BoxedString"];
      };
      /** @description TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace */
      TypedLocalObjectReference: {
          /** @description api group is the group for the resource being referenced */
          apiGroup?: components["schemas"]["BoxedString"];
          /** @description kind is the type of resource being referenced */
          kind?: string;
          /** @description name is the name of resource being referenced */
          name?: string;
      };
      /** @description TypedObjectReference contains enough information to let you locate the typed referenced object inside the specified namespace */
      TypedObjectReference: {
          /** @description Namespace is the namespace of resource being referenced */
          namespace?: components["schemas"]["BoxedString"];
      } & components["schemas"]["TypedLocalObjectReference"];
      /** @description parameter definition */
      WebhookParameterSchema: {
          /** @description unique parameter name */
          name: string;
          /** @description description for the parameter */
          description?: string;
          /**
           * @description whether parameter is required
           * @default false
           */
          required: boolean;
          /** @description example value for the parameter */
          example?: string;
          default?: components["schemas"]["BoxedString"];
          /** @description regular expression to match */
          pattern?: string;
      };
      /** @description configuration value */
      WebhookConfigValue: {
          /** @description public value to use in webhook template */
          value?: components["schemas"]["BoxedString"];
          /** @description private value stored in secret to use in webhook template */
          secret?: components["schemas"]["SecretRef"];
      };
      /** @description configuration values */
      WebhookConfig: {
          [key: string]: components["schemas"]["WebhookConfigValue"];
      };
      WebhookTemplateRef: {
          /** @description webhook template name to use */
          name: string;
      };
      /** @description problem response in case of error */
      Problem: {
          /**
           * @description Type contains a URI that identifies the problem type.
           * @example https://kubeshop.io/testkube/problems/invalidtestname
           */
          type?: string;
          /**
           * @description Title is a short, human-readable summary of the problem type. This title SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
           * @example Invalid test name
           */
          title?: string;
          /**
           * @description HTTP status code for this occurrence of the problem.
           * @example 500
           */
          status?: number;
          /**
           * @description A human-readable explanation specific to this occurrence of the problem.
           * @example Your test name can't contain forbidden characters like "}}}" passed
           */
          detail?: string;
          /**
           * @description A URI that identifies the specific occurrence of the problem. This URI may or may not yield further information if de-referenced.
           * @example http://10.23.23.123:8088/tests
           */
          instance?: string;
      };
      /** @description A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values. */
      "io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement": {
          /** @description key is the label key that the selector applies to. */
          key: string;
          /** @description operator represents a key's relationship to a set of values. Valid operators ard In, NotIn, Exists and DoesNotExist. */
          operator: string;
          /** @description values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch. */
          values?: string[];
      };
      /** @description A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */
      "io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector": {
          /** @description matchExpressions is a list of label selector requirements. The requirements are ANDed. */
          matchExpressions?: components["schemas"]["io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement"][];
          /** @description matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed. */
          matchLabels?: {
              [key: string]: string;
          };
      };
  };
  responses: never;
  parameters: {
      /** @description test namespaced name to filter */
      TestName: string;
      /** @description object type */
      Type: string;
      /** @description text to search in name and test name */
      TextSearch: string;
      /** @description unique id of the object */
      ID: string;
      /** @description unique id of the object execution */
      executionID: string;
      /** @description filename of the object usually used for artifacts */
      Filename: string;
      /** @description last N days to show */
      LastNDays: number;
      /** @description limit records count same as pageSize */
      Limit: number;
      /** @description the number of executions to get, setting to 0 will return only totals */
      PageSize: number;
      /** @description the page index to start at */
      PageIndex: number;
      /** @description startDate for filtering in ISO-8601 format, i.e. "yyyy-mm-dd" */
      StartDateFilter: string;
      /** @description endDate for filtering */
      EndDateFilter: string;
      /** @description optional status filter containing multiple values separated by comma */
      TestExecutionsStatusFilter: components["schemas"]["TestSuiteExecutionStatus"];
      /** @description optional status filter containing multiple values separated by comma */
      ExecutionsStatusFilter: components["schemas"]["ExecutionStatus"];
      Selector: string;
      TestWorkflowNames: string[];
      ExecutionSelector: string;
      ConcurrencyLevel: number;
      TestExecutionName: string;
      TestSuiteExecutionName: string;
      TestWorkflowExecutionName: string;
      Namespace: string;
      Name: string;
      Mask: string;
      /** @description dont delete executions */
      SkipDeleteExecutions: boolean;
      /** @description test type of the executor */
      TestType: string;
      /** @description should inline templates in the resolved workflow */
      InlineTemplates: boolean;
      /** @description flag to request all resources */
      All: boolean;
      /** @description dont delete CRD */
      SkipDeleteCRD: boolean;
      TagSelector: string;
      ActorName: string;
      ActorType: string;
  };
  requestBodies: {
      /** @description Upload files request body data */
      UploadsBody: {
          content: {
              "multipart/form-data": {
                  /** @example test-1 */
                  parentName?: string;
                  /** @enum {string} */
                  parentType?: "test" | "execution";
                  /** @example folder/file.txt */
                  filePath?: string;
              };
          };
      };
  };
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getKeyMap: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful get operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestTriggerKeyMap"];
              };
          };
      };
  };
  listTestTriggers: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestTrigger"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTestTrigger: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test trigger body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestTriggerUpsertRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestTrigger"];
                  "text/yaml": string;
              };
          };
          /** @description problem with test trigger definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestTriggers: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test trigger not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  bulkUpdateTestTriggers: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description array of test trigger upsert requests */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestTriggerUpsertRequest"][];
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestTrigger"][];
              };
          };
          /** @description problem with test trigger definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestTriggerByID: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestTrigger"];
                  "text/yaml": string;
              };
          };
          /** @description test trigger not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestTrigger: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description test trigger not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTestTrigger: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test trigger upsert request */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestTriggerUpsertRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestTrigger"];
              };
          };
          /** @description problem with test trigger definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test trigger not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestSuites: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
              /** @description text to search in name and test name */
              textSearch?: components["parameters"]["TextSearch"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuite"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with listing test suites from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTestSuite: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test details body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSuiteUpsertRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuite"];
              };
          };
          /** @description problem with test suite definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestSuites: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteByID: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuite"];
                  "text/yaml": string;
              };
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description could not get execution result from the database */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestSuite: {
      parameters: {
          query?: {
              /** @description dont delete CRD */
              skipDeleteCRD?: components["parameters"]["SkipDeleteCRD"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTestSuite: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test suite details body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSuiteUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuite"];
              };
          };
          /** @description problem with test suite definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteMetrics: {
      parameters: {
          query?: {
              /** @description last N days to show */
              last?: components["parameters"]["LastNDays"];
              /** @description limit records count same as pageSize */
              limit?: components["parameters"]["Limit"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionsMetrics"];
              };
          };
          /** @description problem with read information from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestSuiteTests: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Test"][];
                  "text/yaml": string;
              };
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortTestSuiteExecutions: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description no execution found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with aborting test suite execution */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestSuiteWithExecutions: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
              /** @description text to search in name and test name */
              textSearch?: components["parameters"]["TextSearch"];
              /** @description optional status filter containing multiple values separated by comma */
              status?: components["parameters"]["TestExecutionsStatusFilter"];
              /** @description the number of executions to get, setting to 0 will return only totals */
              pageSize?: components["parameters"]["PageSize"];
              /** @description the page index to start at */
              page?: components["parameters"]["PageIndex"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteWithExecutionSummary"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test suite with executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test suite from Kubernetes clusteer */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteByIDWithExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteWithExecution"];
                  "text/yaml": string;
              };
          };
          /** @description problem with getting test suite with execution from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestSuiteExecutions: {
      parameters: {
          query?: {
              /** @description the number of executions to get, setting to 0 will return only totals */
              pageSize?: components["parameters"]["PageSize"];
              /** @description the page index to start at */
              page?: components["parameters"]["PageIndex"];
              /** @description optional status filter containing multiple values separated by comma */
              status?: components["parameters"]["TestExecutionsStatusFilter"];
              /** @description startDate for filtering in ISO-8601 format, i.e. "yyyy-mm-dd" */
              startDate?: components["parameters"]["StartDateFilter"];
              /** @description endDate for filtering */
              endDate?: components["parameters"]["EndDateFilter"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteExecutionsResult"];
              };
          };
          /** @description problem with getting test suite executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  executeTestSuite: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
              /** @description last N days to show */
              last?: components["parameters"]["LastNDays"];
              testSuiteExecutionName?: components["parameters"]["TestSuiteExecutionName"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description body passed to configure execution */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSuiteExecutionRequest"];
          };
      };
      responses: {
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteExecutionsResult"];
              };
          };
          /** @description problem with request body */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with test suite execution */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteExecution"];
              };
          };
          /** @description test not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test suite executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with Kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortTestSuiteExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteExecutionArtifactsByTestsuite: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Artifact"];
              };
          };
          /** @description test suite not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test suite executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listAllTestSuiteExecutions: {
      parameters: {
          query?: {
              /** @description last N days to show */
              last?: components["parameters"]["LastNDays"];
              /** @description test namespaced name to filter */
              test?: components["parameters"]["TestName"];
              /** @description text to search in name and test name */
              textSearch?: components["parameters"]["TextSearch"];
              /** @description the number of executions to get, setting to 0 will return only totals */
              pageSize?: components["parameters"]["PageSize"];
              /** @description the page index to start at */
              page?: components["parameters"]["PageIndex"];
              /** @description optional status filter containing multiple values separated by comma */
              status?: components["parameters"]["TestExecutionsStatusFilter"];
              /** @description startDate for filtering in ISO-8601 format, i.e. "yyyy-mm-dd" */
              startDate?: components["parameters"]["StartDateFilter"];
              /** @description endDate for filtering */
              endDate?: components["parameters"]["EndDateFilter"];
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteExecutionsResult"];
              };
          };
          /** @description problem with getting test suite executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  executeTestSuites: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
              selector?: components["parameters"]["Selector"];
              concurrency?: components["parameters"]["ConcurrencyLevel"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description body passed to configure executions */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSuiteExecutionRequest"];
          };
      };
      responses: {
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteExecutionsResult"][];
              };
          };
          /** @description problem with request body */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with test suites executions */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteExecutionByID: {
      parameters: {
          query?: {
              /** @description last N days to show */
              last?: components["parameters"]["LastNDays"];
          };
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSuiteExecution"];
              };
          };
          /** @description problem with getting test suite execution from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortTestSuiteExecutionByID: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSuiteExecutionArtifacts: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Artifact"];
              };
          };
          /** @description problem with getting test suite executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listExecutions: {
      parameters: {
          query?: {
              /** @description test namespaced name to filter */
              test?: components["parameters"]["TestName"];
              /** @description object type */
              type?: components["parameters"]["Type"];
              /** @description text to search in name and test name */
              textSearch?: components["parameters"]["TextSearch"];
              /** @description the number of executions to get, setting to 0 will return only totals */
              pageSize?: components["parameters"]["PageSize"];
              /** @description the page index to start at */
              page?: components["parameters"]["PageIndex"];
              /** @description optional status filter containing multiple values separated by comma */
              status?: components["parameters"]["ExecutionsStatusFilter"];
              /** @description startDate for filtering in ISO-8601 format, i.e. "yyyy-mm-dd" */
              startDate?: components["parameters"]["StartDateFilter"];
              /** @description endDate for filtering */
              endDate?: components["parameters"]["EndDateFilter"];
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionsResult"];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  executeTests: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
              selector?: components["parameters"]["Selector"];
              executionSelector?: components["parameters"]["ExecutionSelector"];
              concurrency?: components["parameters"]["ConcurrencyLevel"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description body passed to configure executions */
      requestBody: {
          content: {
              "application/json": components["schemas"]["ExecutionRequest"];
          };
      };
      responses: {
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionResult"][];
              };
          };
          /** @description problem with request body */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with test executions */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getExecutionByID: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Execution"];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with reading secrets from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getExecutionArtifacts: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Artifact"][];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting execution's artifacts from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getExecutionLogs: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutorOutput"][];
              };
          };
          /** @description problem with getting execution's logs */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getExecutionLogsV2: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["LogV2"][];
              };
          };
          /** @description problem with getting execution's logs version 2 */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  downloadFile: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description filename of the object usually used for artifacts */
              filename: components["parameters"]["Filename"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/octet-stream": string;
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting artifacts from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  downloadArchive: {
      parameters: {
          query?: {
              mask?: components["parameters"]["Mask"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/octet-stream": string;
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting artifact archive from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTests: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
              /** @description text to search in name and test name */
              textSearch?: components["parameters"]["TextSearch"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Test"][];
                  "text/yaml": string;
              };
          };
          /** @description invalid parameters */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTest: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test details body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestUpsertRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Test"];
              };
          };
          /** @description problem with test definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTests: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description no tests found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with deleting tests and their executions */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTest: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Test"];
                  "text/yaml": string;
              };
          };
          /** @description invalid parameters */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTest: {
      parameters: {
          query?: {
              /** @description dont delete executions */
              skipDeleteExecutions?: components["parameters"]["SkipDeleteExecutions"];
              /** @description dont delete CRD */
              skipDeleteCRD?: components["parameters"]["SkipDeleteCRD"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description no tests found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with deleting test and its executions */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTest: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test details body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Test"];
              };
          };
          /** @description problem with test definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortTestExecutions: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description no execution found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with aborting test execution */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestMetrics: {
      parameters: {
          query?: {
              /** @description last N days to show */
              last?: components["parameters"]["LastNDays"];
              /** @description limit records count same as pageSize */
              limit?: components["parameters"]["Limit"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionsMetrics"];
              };
          };
          /** @description problem with getting metrics */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from storage */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWithExecutions: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
              /** @description text to search in name and test name */
              textSearch?: components["parameters"]["TextSearch"];
              /** @description optional status filter containing multiple values separated by comma */
              status?: components["parameters"]["ExecutionsStatusFilter"];
              /** @description the number of executions to get, setting to 0 will return only totals */
              pageSize?: components["parameters"]["PageSize"];
              /** @description the page index to start at */
              page?: components["parameters"]["PageIndex"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWithExecutionSummary"][];
                  "text/yaml": string;
              };
          };
          /** @description invalid parameters */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting tests and their executions */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWithExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWithExecution"];
                  "text/yaml": string;
              };
          };
          /** @description invalid parameters */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description no tests found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting tests and their executions */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestExecutions: {
      parameters: {
          query?: {
              /** @description last N days to show */
              last?: components["parameters"]["LastNDays"];
              /** @description the number of executions to get, setting to 0 will return only totals */
              pageSize?: components["parameters"]["PageSize"];
              /** @description the page index to start at */
              page?: components["parameters"]["PageIndex"];
              /** @description optional status filter containing multiple values separated by comma */
              status?: components["parameters"]["ExecutionsStatusFilter"];
              /** @description startDate for filtering in ISO-8601 format, i.e. "yyyy-mm-dd" */
              startDate?: components["parameters"]["StartDateFilter"];
              /** @description endDate for filtering */
              endDate?: components["parameters"]["EndDateFilter"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionsResult"];
              };
          };
          /** @description test or execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  executeTest: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
              testExecutionName?: components["parameters"]["TestExecutionName"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description body passed to configure execution */
      requestBody: {
          content: {
              "application/json": components["schemas"]["ExecutionRequest"];
          };
      };
      responses: {
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionResult"];
              };
          };
          /** @description problem with request body */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with test execution */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Execution"];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test executions from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with reading secrets from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listExecutors: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Executor"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createExecutor: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description executor request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["ExecutorUpsertRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutorDetails"];
              };
          };
          /** @description problem with executor definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteExecutors: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getExecutor: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutorDetails"];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting executor data */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteExecutor: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description executor deleted successfuly */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateExecutor: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description executor request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["ExecutorUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutorDetails"];
              };
          };
          /** @description problem with executor definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description executor not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getExecutorByType: {
      parameters: {
          query: {
              /** @description test type of the executor */
              testType: components["parameters"]["TestType"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutorDetails"];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting executor data */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listLabels: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": {
                      [key: string]: string[];
                  };
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTags: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": {
                      [key: string]: string[];
                  };
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listWebhooks: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Webhook"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createWebhook: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description webhook request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["WebhookCreateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Webhook"];
              };
          };
          /** @description problem with webhook definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteWebhooks: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getWebhook: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Webhook"];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description webhook not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting webhook data */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteWebhook: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description webhook deleted successfuly */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description webhook not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateWebhook: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description webhook request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["WebhookUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Webhook"];
              };
          };
          /** @description problem with webhook definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description webhook not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listWebhookTemplates: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["WebhookTemplate"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createWebhookTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description webhook template request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["WebhookTemplateCreateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["WebhookTemplate"];
              };
          };
          /** @description problem with webhook template definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteWebhookTemplates: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getWebhookTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["WebhookTemplate"];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description webhook template not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting webhook template data */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteWebhookTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description webhook template deleted successfuly */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description webhook template not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateWebhookTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description webhook template request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["WebhookTemplateUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["WebhookTemplate"];
              };
          };
          /** @description problem with webhook template definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description webhook template not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTemplates: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Template"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description template request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TemplateCreateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Template"];
              };
          };
          /** @description problem with template definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTemplates: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Template"];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description template not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting template data */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description template deleted successfuly */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description template not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description template request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TemplateUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Template"];
              };
          };
          /** @description problem with template definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description template not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getConfig: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description get successful */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Config"];
              };
          };
          /** @description config not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting config from cluster storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateConfigKey: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description config request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["Config"];
          };
      };
      responses: {
          /** @description update successful */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Config"];
              };
          };
          /** @description problem with input */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description config not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with updating key in cluster storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getDebugInfo: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["DebugInfo"];
              };
          };
          /** @description problem with getting execution logs from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting debug information from the Kuberenetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestSources: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSource"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTestSource: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test source request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSourceUpsertRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "text/yaml": string;
              };
          };
          /** @description successful operation */
          201: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSource"];
              };
          };
          /** @description problem with test source definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestSources: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with read information from kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  processTestSourceBatch: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test source batch request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSourceBatchRequest"];
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSourceBatchResult"];
              };
          };
          /** @description problem with test source definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestSource: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSource"];
                  "text/yaml": string;
              };
          };
          /** @description problem with input for CRD generation */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test source not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting test source data */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestSource: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description test source deleted successfuly */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTestSource: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test source body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestSourceUpdateRequest"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestSource"];
              };
          };
          /** @description problem with test source definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description test source not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  uploads: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody: components["requestBodies"]["UploadsBody"];
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": string;
                  "text/yaml": string;
              };
          };
          /** @description problem with the input */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description could not upload file */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  validateRepository: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description repository request body data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["Repository"];
          };
      };
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with repository definition - probably some bad input occurs (invalid JSON body or similar) */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with creating folder for partial git checkout */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster or git server */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listSecrets: {
      parameters: {
          query?: {
              /** @description flag to request all resources */
              all?: components["parameters"]["All"];
              namespace?: components["parameters"]["Namespace"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Secret"][];
              };
          };
          /** @description secret management is disabled */
          403: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createSecret: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description secret data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["SecretInput"];
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Secret"];
              };
          };
          /** @description invalid input data */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret management or modification are disabled */
          403: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getSecret: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Secret"];
              };
          };
          /** @description invalid input data */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret is not controlled by Testkube or secret management is disabled */
          403: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteSecret: {
      parameters: {
          query?: {
              namespace?: components["parameters"]["Namespace"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description invalid input data */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret is not controlled by Testkube or secret management or modification are disabled */
          403: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateSecret: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description secret data */
      requestBody: {
          content: {
              "application/json": components["schemas"]["SecretUpdate"];
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Secret"];
              };
          };
          /** @description invalid input data */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret is not controlled by Testkube or secret management or modification are disabled */
          403: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description secret not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflows: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflow"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test workflow body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflow"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful creation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflow"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestWorkflows: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
              testWorkflowNames?: components["parameters"]["TestWorkflowNames"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflowWithExecutions: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowWithExecutionSummary"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflowWithExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowWithExecution"];
                  "text/yaml": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflowWithExecutionTags: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": {
                      [key: string]: string[];
                  };
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflowExecutionsByTestWorkflow: {
      parameters: {
          query?: {
              tagSelector?: components["parameters"]["TagSelector"];
              actorName?: components["parameters"]["ActorName"];
              actorType?: components["parameters"]["ActorType"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecutionsResult"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  executeTestWorkflow: {
      parameters: {
          query?: {
              testWorkflowExecutionName?: components["parameters"]["TestWorkflowExecutionName"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test workflow execution request */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflowExecutionRequest"];
          };
      };
      responses: {
          /** @description successful execution */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecution"][];
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflowTagsByTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": {
                      [key: string]: string[];
                  };
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflowMetrics: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["ExecutionsMetrics"];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflowExecutionByTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecution"];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortTestWorkflowExecutionByTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  rerunTestWorkflowExecutionByTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      /** @description test workflow running context */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflowRunningContext"];
          };
      };
      responses: {
          /** @description successful execution */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecution"];
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflowExecutions: {
      parameters: {
          query?: {
              tagSelector?: components["parameters"]["TagSelector"];
              actorName?: components["parameters"]["ActorName"];
              actorType?: components["parameters"]["ActorType"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecutionsResult"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  executeTestWorkflows: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
              concurrency?: components["parameters"]["ConcurrencyLevel"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test workflow execution request */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflowExecutionRequest"];
          };
      };
      responses: {
          /** @description successful execution */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecution"][];
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflowExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecution"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflowExecutionArtifacts: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["Artifact"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting execution's artifacts from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  downloadTestWorkflowArtifact: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
              /** @description filename of the object usually used for artifacts */
              filename: components["parameters"]["Filename"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/octet-stream": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting artifacts from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  downloadTestWorkflowArtifactArchive: {
      parameters: {
          query?: {
              mask?: components["parameters"]["Mask"];
          };
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/octet-stream": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description execution not found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem with getting artifact archive from storage */
          500: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortTestWorkflowExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  rerunTestWorkflowExecution: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object execution */
              executionID: components["parameters"]["executionID"];
          };
          cookie?: never;
      };
      /** @description test workflow running context */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflowRunningContext"];
          };
      };
      responses: {
          /** @description successful execution */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowExecution"];
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  abortAllTestWorkflowExecutions: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  previewTestWorkflow: {
      parameters: {
          query?: {
              /** @description should inline templates in the resolved workflow */
              inline?: components["parameters"]["InlineTemplates"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test workflow body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflow"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description resolved test workflow */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflow"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflow"];
                  "text/yaml": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTestWorkflow: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test workflow body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflow"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflow"];
                  "text/yaml": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestWorkflow: {
      parameters: {
          query?: {
              /** @description dont delete executions */
              skipDeleteExecutions?: components["parameters"]["SkipDeleteExecutions"];
              /** @description dont delete CRD */
              skipDeleteCRD?: components["parameters"]["SkipDeleteCRD"];
          };
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  listTestWorkflowTemplates: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful list operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowTemplate"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  createTestWorkflowTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description test workflow template body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflowTemplate"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful creation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowTemplate"][];
                  "text/yaml": string;
              };
          };
          /** @description problem with body parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestWorkflowTemplates: {
      parameters: {
          query?: {
              selector?: components["parameters"]["Selector"];
          };
          header?: never;
          path?: never;
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description problem with selector parsing - probably some bad input occurs */
          400: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  getTestWorkflowTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowTemplate"];
                  "text/yaml": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  updateTestWorkflowTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      /** @description test workflow template body */
      requestBody: {
          content: {
              "application/json": components["schemas"]["TestWorkflowTemplate"];
              "text/yaml": string;
          };
      };
      responses: {
          /** @description successful operation */
          200: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/json": components["schemas"]["TestWorkflowTemplate"];
                  "text/yaml": string;
              };
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
  deleteTestWorkflowTemplate: {
      parameters: {
          query?: never;
          header?: never;
          path: {
              /** @description unique id of the object */
              id: components["parameters"]["ID"];
          };
          cookie?: never;
      };
      requestBody?: never;
      responses: {
          /** @description no content */
          204: {
              headers: {
                  [name: string]: unknown;
              };
              content?: never;
          };
          /** @description missing Pro subscription for a commercial feature */
          402: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description the resource has not been found */
          404: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
          /** @description problem communicating with kubernetes cluster */
          502: {
              headers: {
                  [name: string]: unknown;
              };
              content: {
                  "application/problem+json": components["schemas"]["Problem"][];
              };
          };
      };
  };
}
type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

