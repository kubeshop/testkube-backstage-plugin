import type { ActionContext } from '@backstage/plugin-scaffolder-node';

import type { Config } from '../services/configService';
import { createRunTestWorkflowsAction } from './action';

const config: Config = {
  url: 'https://api.testkube.io',
  uiUrl: 'https://app.testkube.io',
  isEnterprise: true,
  skipTlsVerify: false,
  organizations: [{ id: 'org-1', apiKey: 'secret' }],
};

const execution = (id: string, status: string) => ({
  id,
  name: `execution-${id}`,
  result: { status },
});

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const context = (
  input: {
    workflows?: Array<{
      name: string;
      config?: Record<string, string>;
      target?: {
        match?: Record<string, string[]>;
        not?: Record<string, string[]>;
        replicate?: string[];
      };
    }>;
    selector?: string;
    orgId: string;
    envId: string;
    timeoutSeconds?: number;
  },
  outputs: Record<string, unknown>,
) =>
  ({
    input,
    output: jest.fn((name: string, value: unknown) => {
      outputs[name] = value;
    }),
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
  } as unknown as ActionContext<any, any>);

const services = (send: jest.Mock) =>
  ({
    config,
    proxyService: { send },
    enterpriseService: {
      getOrganizationMetadata: jest
        .fn()
        .mockResolvedValue({ id: 'org-1', slug: 'acme' }),
      getEnvironments: jest
        .fn()
        .mockResolvedValue([{ id: 'env-1', slug: 'production' }]),
    },
  } as unknown as Parameters<typeof createRunTestWorkflowsAction>[0]);

describe('testkube:run-test-workflows', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns green execution links when every workflow passes', async () => {
    const send = jest
      .fn()
      .mockResolvedValueOnce(response(execution('run-1', 'passed')))
      .mockResolvedValueOnce(response(execution('run-2', 'passed')));
    const outputs: Record<string, unknown> = {};
    const action = createRunTestWorkflowsAction(services(send));

    await action.handler(
      context(
        {
          workflows: [
            {
              name: 'api',
              config: { workers: '2' },
              target: {
                match: { environment: ['staging'] },
                not: { region: ['legacy'] },
                replicate: ['runner-1'],
              },
            },
            { name: 'browser' },
          ],
          orgId: 'org-1',
          envId: 'env-1',
        },
        outputs,
      ),
    );

    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/v1/test-workflows/api/executions',
        method: 'POST',
        orgId: 'org-1',
        envId: 'env-1',
        apiKey: 'secret',
        body: {
          disableWebhooks: false,
          config: { workers: '2' },
          target: {
            match: { environment: ['staging'] },
            not: { region: ['legacy'] },
            replicate: ['runner-1'],
          },
        },
      }),
    );
    expect(outputs).toEqual({
      status: 'green',
      results: [
        {
          workflow: 'api',
          executionId: 'run-1',
          testkubeStatus: 'passed',
          status: 'green',
          url: 'https://app.testkube.io/organization/acme/environment/production/dashboard/executions/run-1',
        },
        {
          workflow: 'browser',
          executionId: 'run-2',
          testkubeStatus: 'passed',
          status: 'green',
          url: 'https://app.testkube.io/organization/acme/environment/production/dashboard/executions/run-2',
        },
      ],
    });
  });

  it('resolves label selectors and de-duplicates explicit workflow names', async () => {
    const send = jest
      .fn()
      .mockResolvedValueOnce(
        response([{ name: 'api' }, { name: 'browser' }, { name: 'api' }]),
      )
      .mockResolvedValueOnce(response([execution('run-1', 'passed')]))
      .mockResolvedValueOnce(response([execution('run-2', 'passed')]));
    const outputs: Record<string, unknown> = {};
    const action = createRunTestWorkflowsAction(services(send));

    await action.handler(
      context(
        {
          workflows: [{ name: 'api' }],
          selector: 'app=backend',
          orgId: 'org-1',
          envId: 'env-1',
        },
        outputs,
      ),
    );

    expect(send).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: '/v1/test-workflows?selector=app%3Dbackend',
        method: 'GET',
      }),
    );
    expect(send).toHaveBeenCalledTimes(3);
    expect(outputs.results).toEqual([
      expect.objectContaining({ workflow: 'api', status: 'green' }),
      expect.objectContaining({ workflow: 'browser', status: 'green' }),
    ]);
  });

  it('fails when a selector matches no workflows', async () => {
    const send = jest.fn().mockResolvedValue(response([]));
    const action = createRunTestWorkflowsAction(services(send));

    await expect(
      action.handler(
        context(
          {
            selector: 'app=missing',
            orgId: 'org-1',
            envId: 'env-1',
          },
          {},
        ),
      ),
    ).rejects.toThrow('No Testkube workflows matched selector: app=missing');
  });

  it('outputs all results before failing a mixed quality gate', async () => {
    const send = jest
      .fn()
      .mockResolvedValueOnce(response(execution('run-1', 'failed')))
      .mockResolvedValueOnce(response(execution('run-2', 'passed')));
    const outputs: Record<string, unknown> = {};
    const action = createRunTestWorkflowsAction(services(send));

    await expect(
      action.handler(
        context(
          {
            workflows: [{ name: 'api' }, { name: 'browser' }],
            orgId: 'org-1',
            envId: 'env-1',
          },
          outputs,
        ),
      ),
    ).rejects.toThrow('Testkube quality gate failed: api: failed');

    expect(outputs.status).toBe('red');
    expect(outputs.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workflow: 'api',
          testkubeStatus: 'failed',
          status: 'red',
        }),
        expect.objectContaining({
          workflow: 'browser',
          testkubeStatus: 'passed',
          status: 'green',
        }),
      ]),
    );
  });

  it('polls transient errors until the execution passes', async () => {
    jest.useFakeTimers();
    const send = jest
      .fn()
      .mockResolvedValueOnce(response(execution('run-1', 'running')))
      .mockResolvedValueOnce(response({ error: 'temporary' }, 503))
      .mockResolvedValueOnce(response(execution('run-1', 'passed')));
    const outputs: Record<string, unknown> = {};
    const action = createRunTestWorkflowsAction(services(send));

    const result = action.handler(
      context(
        {
          workflows: [{ name: 'api' }],
          orgId: 'org-1',
          envId: 'env-1',
          timeoutSeconds: 30,
        },
        outputs,
      ),
    );

    await jest.advanceTimersByTimeAsync(10_000);
    await result;

    expect(send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        path: '/v1/test-workflows/api/executions/run-1',
        method: 'GET',
      }),
    );
    expect(outputs.status).toBe('green');
  });

  it('outputs a red timeout and fails the quality gate', async () => {
    jest.useFakeTimers();
    const send = jest
      .fn()
      .mockResolvedValueOnce(response(execution('run-1', 'running')))
      .mockResolvedValueOnce(response(execution('run-1', 'running')));
    const outputs: Record<string, unknown> = {};
    const action = createRunTestWorkflowsAction(services(send));

    const result = action.handler(
      context(
        {
          workflows: [{ name: 'api' }],
          orgId: 'org-1',
          envId: 'env-1',
          timeoutSeconds: 5,
        },
        outputs,
      ),
    );

    const expectation = expect(result).rejects.toThrow(
      'Testkube quality gate failed: api: timeout',
    );
    await jest.advanceTimersByTimeAsync(5_000);
    await expectation;

    expect(outputs.results).toEqual([
      expect.objectContaining({
        testkubeStatus: 'timeout',
        status: 'red',
      }),
    ]);
  });

  it('rejects standalone mode and unknown organizations', async () => {
    const outputs: Record<string, unknown> = {};
    const standalone = createRunTestWorkflowsAction({
      ...services(jest.fn()),
      config: { ...config, isEnterprise: false },
    });

    await expect(
      standalone.handler(
        context(
          {
            workflows: [{ name: 'api' }],
            orgId: 'org-1',
            envId: 'env-1',
          },
          outputs,
        ),
      ),
    ).rejects.toThrow('requires testkube.enterprise: true');

    const unknownOrg = createRunTestWorkflowsAction(services(jest.fn()));
    await expect(
      unknownOrg.handler(
        context(
          {
            workflows: [{ name: 'api' }],
            orgId: 'unknown',
            envId: 'env-1',
          },
          outputs,
        ),
      ),
    ).rejects.toThrow('Testkube organization is not configured: unknown');
  });
});
