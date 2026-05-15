import { EntityPage } from './EntityPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen, waitFor } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { TestkubeApi, testkubeApiRef } from '../../../api';
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('TestkubeEntityPage', () => {
  const entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'software',
      description: 'This is the description',
      annotations: {
        'testkube.io/organization': 'test',
        'testkube.io/environments': 'dev,test',
        'testkube.io/labels': 'app=test',
      },
    },
  };
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  const testkubeApi: Partial<TestkubeApi> = {};

  const createTestkubeApi = (
    overrides: Partial<TestkubeApi> = {},
  ): Partial<TestkubeApi> => ({
    getConfig: jest.fn().mockResolvedValue({
      isEnterprise: false,
      organizationCount: 0,
    }),
    getRedirectUrl: jest
      .fn()
      .mockResolvedValue({ url: 'https://testkube.example' }),
    ...overrides,
  });

  it('should render', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[testkubeApiRef, testkubeApi]]}>
        <EntityProvider entity={entity}>
          <EntityPage />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(screen.getByText('Loading data ...')).toBeInTheDocument();
  });

  it('passes entity label annotation to getTestWorkflowsWithExecutions', async () => {
    const getTestWorkflowsWithExecutions = jest.fn().mockResolvedValue([]);

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            testkubeApiRef,
            createTestkubeApi({ getTestWorkflowsWithExecutions }),
          ],
        ]}
      >
        <EntityProvider entity={entity}>
          <EntityPage />
        </EntityProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(getTestWorkflowsWithExecutions).toHaveBeenCalledWith(
        { labels: 'app=test' },
        { orgIndex: null, envSlug: null },
      );
    });
  });

  it('should not fetch or render entity content when labels annotation is missing', async () => {
    const getTestWorkflowsWithExecutions = jest.fn().mockResolvedValue([]);

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            testkubeApiRef,
            createTestkubeApi({ getTestWorkflowsWithExecutions }),
          ],
        ]}
      >
        <EntityProvider
          entity={{
            ...entity,
            metadata: {
              ...entity.metadata,
              annotations: {
                'testkube.io/organization': 'test',
                'testkube.io/environments': 'dev,test',
              },
            },
          }}
        >
          <EntityPage />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(screen.queryByText('Loading data ...')).not.toBeInTheDocument();
    expect(
      screen.queryByText('No executions were returned from Testkube.'),
    ).not.toBeInTheDocument();
    expect(getTestWorkflowsWithExecutions).not.toHaveBeenCalled();
  });
});
