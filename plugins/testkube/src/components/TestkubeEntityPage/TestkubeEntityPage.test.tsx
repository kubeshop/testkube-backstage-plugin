import React from 'react';
import { TestkubeEntityPage } from './TestkubeEntityPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { TestkubeApi, testkubeApiRef } from '../../api';
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('TestkubeEntityPage', () => {
  const entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'software',
      description: 'This is the description',
      annotations: {
        "testkube.io/organization": 'test',
        "testkube.io/environments": 'dev,test',
        "testkube.io/labels": 'app=test',
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

  it('should render', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[testkubeApiRef, testkubeApi]]}>
        <EntityProvider entity={entity}>
          <TestkubeEntityPage />
        </EntityProvider>
      </TestApiProvider>);
    expect(
      screen.getByText('Loading data ...'),
    ).toBeInTheDocument();
  });
});
