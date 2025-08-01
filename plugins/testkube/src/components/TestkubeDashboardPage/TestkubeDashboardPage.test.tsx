import React from 'react';
import { TestkubeDashboardPage } from './TestkubeDashboardPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { TestkubeApi, testkubeApiRef } from '../../api';

describe('TestkubeDashboardPage', () => {
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

  it('should render', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[testkubeApiRef, testkubeApi]]}>
        <TestkubeDashboardPage />
      </TestApiProvider>
    );
    expect(
      screen.getByText('Testkube Dashboard'),
    ).toBeInTheDocument();
  });
});
