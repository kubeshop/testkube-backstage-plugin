import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { testkubePlugin, TestkubeDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(testkubePlugin)
  .addPage({
    element: <TestkubeDashboardPage />,
    title: 'Testkube Dashboard',
    path: '/testkube',
  })
  .render();
