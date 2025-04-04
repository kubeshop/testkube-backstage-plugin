import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { testkubePlugin, TestkubePage } from '../src/plugin';

createDevApp()
  .registerPlugin(testkubePlugin)
  .addPage({
    element: <TestkubePage />,
    title: 'Testkube Dashboard',
    path: '/testkube',
  })
  .render();
