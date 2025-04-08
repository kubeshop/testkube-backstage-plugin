import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  Table,
} from '@backstage/core-components';
import { TestWorkflowExecutions } from '../../types';
import { TestkubeClient } from '../../api/TestkubeClient';

var dashboard = {
  successRatio: 0,
  failedExecutions: 0,
  totalExecutions: 0,
}

const lastExecutionsColumns = [
  { title: 'Execution #', field: 'number' },
  { title: 'Test Name', field: 'name' },
  { title: 'Status', field: 'status' },
  { title: 'Start Time', field: 'scheduledAt' },
  { title: 'Last update Time', field: 'statusAt' },
];

const lastExecutions: TestWorkflowExecutions[] = []

TestkubeClient.listTestWorkflowExecutions()
  .then((response) => {
    if (!response || !response.results) {
      throw new Error('Invalid response format: results is missing');
    }
    dashboard.successRatio = response.totals.passed * 100 / response.totals.results;
    dashboard.failedExecutions = response.totals.failed;
    dashboard.totalExecutions = response.totals.results;
    if (!Array.isArray(response.results)) {
      throw new Error('Invalid response format: results is not an array');
    }
    const executions = response.results.map((execution: any) => ({
      number: execution.number,
      name: execution.name,
      status: execution.result.status,
      scheduledAt: new Date(execution.scheduledAt).toLocaleString(),
      statusAt: new Date(execution.statusAt).toLocaleString(),
    }));
    lastExecutions.push(...executions);
  })
  .catch((error) => {
    console.error('Error fetching test workflow executions:', error);
  }
);

export const DashboardComponent = () => (
  <Page themeId="home">
    <Header title="Testkube" subtitle="Test Automation Execution Platform">
      <HeaderLabel label="Go to platform" value="https://app.testkube.io"></HeaderLabel>
    </Header>
    <Content>
      <ContentHeader title="Dashboard"></ContentHeader>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Pass/Fail Ratio">
            <Typography variant="h5">
              {dashboard.successRatio}
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Failed Executions">
            <Typography variant="h5">
              {dashboard.failedExecutions}
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Total Executions">
            <Typography variant="h5">
              {dashboard.totalExecutions}
            </Typography>
          </InfoCard>
        </Grid>
      </Grid>
      <br />
      <Table columns={lastExecutionsColumns} title="Last Executions" subtitle='The last 20 executions' options={{ paging: false }} data={lastExecutions}>
      </Table>
    </Content>
  </Page>
);
