import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

import type EnterpriseService from '../services/enterpriseService';
import type { Config } from '../services/configService';
import type ProxyService from '../services/proxyService';

const POLL_INTERVAL_MS = 5_000;
const TERMINAL_STATUSES = new Set(['passed', 'failed', 'aborted']);

type TestWorkflowExecution = {
  id: string;
  name: string;
  result: {
    status: string;
  };
};

type TestWorkflow = {
  name?: string;
};

type WorkflowInput = {
  name: string;
  config?: Record<string, string>;
  target?: {
    match?: Record<string, string[]>;
    not?: Record<string, string[]>;
    replicate?: string[];
  };
};

type ActionResult = {
  workflow: string;
  executionId?: string;
  testkubeStatus: string;
  status: 'green' | 'red';
  url?: string;
};

type Services = {
  config: Config;
  proxyService: ReturnType<typeof ProxyService>;
  enterpriseService: ReturnType<typeof EnterpriseService>;
};

const isTestWorkflowExecution = (
  value: unknown,
): value is TestWorkflowExecution => {
  if (!value || typeof value !== 'object') return false;
  const execution = value as Partial<TestWorkflowExecution>;
  return (
    typeof execution.id === 'string' &&
    typeof execution.name === 'string' &&
    typeof execution.result?.status === 'string'
  );
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.text();
  return body
    ? `${response.status} ${response.statusText}: ${body}`
    : `${response.status} ${response.statusText}`;
};

const wait = (signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timeout);
      reject(new Error('Testkube workflow polling was cancelled'));
    };
    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, POLL_INTERVAL_MS);

    if (signal?.aborted) {
      onAbort();
    } else {
      signal?.addEventListener('abort', onAbort, { once: true });
    }
  });

export const createRunTestWorkflowsAction = ({
  config,
  proxyService,
  enterpriseService,
}: Services) =>
  createTemplateAction({
    id: 'testkube:run-test-workflows',
    description:
      'Run Testkube Enterprise Test Workflows and fail unless all executions pass',
    schema: {
      input: z =>
        z
          .object({
            workflows: z
              .array(
                z.object({
                  name: z.string().min(1),
                  config: z.record(z.string()).optional(),
                  target: z
                    .object({
                      match: z
                        .record(z.array(z.string().min(1)).min(1))
                        .optional(),
                      not: z
                        .record(z.array(z.string().min(1)).min(1))
                        .optional(),
                      replicate: z.array(z.string().min(1)).min(1).optional(),
                    })
                    .optional(),
                }),
              )
              .optional()
              .default([])
              .describe('Named Test Workflows and their execution settings'),
            selector: z
              .string()
              .min(1)
              .optional()
              .describe('Kubernetes label selector for Test Workflows'),
            orgId: z.string().min(1).describe('Testkube organization ID'),
            envId: z.string().min(1).describe('Testkube environment ID'),
            timeoutSeconds: z
              .number()
              .int()
              .positive()
              .optional()
              .default(1800)
              .describe('Maximum time to wait for all workflows'),
          })
          .refine(input => input.workflows.length > 0 || input.selector, {
            message: 'At least one workflow name or selector is required',
          })
          .refine(
            input =>
              new Set(input.workflows.map(workflow => workflow.name)).size ===
              input.workflows.length,
            {
              message: 'Workflow names must be unique',
              path: ['workflows'],
            },
          ),
      output: {
        status: z => z.enum(['green', 'red']),
        results: z =>
          z.array(
            z.object({
              workflow: z.string(),
              executionId: z.string().optional(),
              testkubeStatus: z.string(),
              status: z.enum(['green', 'red']),
              url: z.string().url().optional(),
            }),
          ),
      },
    },
    async handler(ctx) {
      if (!config.isEnterprise) {
        throw new Error(
          'testkube:run-test-workflows requires testkube.enterprise: true',
        );
      }

      const org = config.organizations.find(
        organization => organization.id === ctx.input.orgId,
      );
      if (!org) {
        throw new Error(
          `Testkube organization is not configured: ${ctx.input.orgId}`,
        );
      }

      const [organization, environments] = await Promise.all([
        enterpriseService.getOrganizationMetadata({ orgId: org.id }),
        enterpriseService.getEnvironments({ org }),
      ]);
      const environment = environments.find(
        candidate => candidate.id === ctx.input.envId,
      );

      if (!organization?.slug) {
        throw new Error(`Testkube organization was not found: ${org.id}`);
      }
      if (!environment?.slug) {
        throw new Error(
          `Testkube environment was not found: ${ctx.input.envId}`,
        );
      }

      const dashboardBaseUrl = `${config.uiUrl}/organization/${organization.slug}/environment/${environment.slug}/dashboard/executions`;
      const deadline = Date.now() + ctx.input.timeoutSeconds * 1_000;
      const request = (path: string, method: string, body?: object) =>
        proxyService.send({
          path,
          method,
          body,
          orgId: org.id,
          envId: ctx.input.envId,
          apiKey: org.apiKey,
        });

      const selectedWorkflows = new Map(
        (ctx.input.workflows ?? []).map(workflow => [workflow.name, workflow]),
      );
      if (ctx.input.selector) {
        const response = await request(
          `/v1/test-workflows?selector=${encodeURIComponent(
            ctx.input.selector,
          )}`,
          'GET',
        );
        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }

        const workflows = (await response.json()) as TestWorkflow[];
        workflows.forEach(workflow => {
          if (workflow.name && !selectedWorkflows.has(workflow.name)) {
            selectedWorkflows.set(workflow.name, { name: workflow.name });
          }
        });
      }

      const workflows = [...selectedWorkflows.values()] as WorkflowInput[];
      if (workflows.length === 0) {
        throw new Error(
          `No Testkube workflows matched selector: ${ctx.input.selector}`,
        );
      }

      const triggers = await Promise.allSettled(
        workflows.map(async workflow => {
          const response = await request(
            `/v1/test-workflows/${encodeURIComponent(
              workflow.name,
            )}/executions`,
            'POST',
            {
              disableWebhooks: false,
              ...(workflow.config && { config: workflow.config }),
              ...(workflow.target && { target: workflow.target }),
            },
          );
          if (!response.ok) {
            throw new Error(await getErrorMessage(response));
          }

          const payload: unknown = await response.json();
          const executions = Array.isArray(payload) ? payload : [payload];
          if (
            executions.length === 0 ||
            !executions.every(isTestWorkflowExecution)
          ) {
            throw new Error('Testkube returned an invalid execution response');
          }
          return { workflow: workflow.name, executions };
        }),
      );

      const results: ActionResult[] = [];
      const executions: Array<{
        workflow: string;
        execution: TestWorkflowExecution;
      }> = [];

      triggers.forEach((trigger, index) => {
        const workflow = workflows[index].name;
        if (trigger.status === 'fulfilled') {
          executions.push(
            ...trigger.value.executions.map(execution => ({
              workflow,
              execution,
            })),
          );
        } else {
          const message =
            trigger.reason instanceof Error
              ? trigger.reason.message
              : String(trigger.reason);
          ctx.logger.error(`Failed to trigger Testkube workflow ${workflow}`, {
            error: message,
          });
          results.push({
            workflow,
            testkubeStatus: 'trigger_error',
            status: 'red',
          });
        }
      });

      const completed = await Promise.all(
        executions.map(async ({ workflow, execution }) => {
          const url = `${dashboardBaseUrl}/${execution.id}`;
          let latest = execution;

          while (!TERMINAL_STATUSES.has(latest.result.status)) {
            if (Date.now() >= deadline) {
              return {
                workflow,
                executionId: execution.id,
                testkubeStatus: 'timeout',
                status: 'red' as const,
                url,
              };
            }

            await wait(ctx.signal);

            try {
              const response = await request(
                `/v1/test-workflows/${encodeURIComponent(
                  workflow,
                )}/executions/${encodeURIComponent(execution.id)}`,
                'GET',
              );
              if (!response.ok) {
                throw new Error(await getErrorMessage(response));
              }
              latest = (await response.json()) as TestWorkflowExecution;
            } catch (error) {
              ctx.logger.warn(
                `Unable to poll Testkube workflow ${workflow}; retrying`,
                {
                  executionId: execution.id,
                  error: error instanceof Error ? error.message : String(error),
                },
              );
            }
          }

          return {
            workflow,
            executionId: execution.id,
            testkubeStatus: latest.result.status,
            status:
              latest.result.status === 'passed'
                ? ('green' as const)
                : ('red' as const),
            url,
          };
        }),
      );
      results.push(...completed);

      const status = results.every(result => result.status === 'green')
        ? 'green'
        : 'red';
      ctx.output('status', status);
      ctx.output('results', results);

      results.forEach(result => {
        const log = `${result.status.toUpperCase()}: ${result.workflow} (${
          result.testkubeStatus
        })${result.url ? ` ${result.url}` : ''}`;
        if (result.status === 'green') {
          ctx.logger.info(log);
        } else {
          ctx.logger.error(log);
        }
      });

      if (status === 'red') {
        const failed = results
          .filter(result => result.status === 'red')
          .map(result => `${result.workflow}: ${result.testkubeStatus}`)
          .join(', ');
        throw new Error(`Testkube quality gate failed: ${failed}`);
      }
    },
  });
