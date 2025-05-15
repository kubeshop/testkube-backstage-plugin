import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  Table,
  Link,
  CodeSnippet,
  WarningPanel,
  Progress,
  EmptyState,
  HeaderLabel
} from '@backstage/core-components';
import { testkubeApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { columns, useStyles } from './tableHeading';
import { useTestkubeUI } from '../../utils/isTestkubeUiConfigured';
import { TestWorkflowExecutionsResult } from '../../types';

export const TestWorkflowExecutionsPage = () => {

  const TestkubeAPI = useApi(testkubeApiRef);
  const [lastExecutions, setLastExecutions] = useState<TestWorkflowExecutionsResult>();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const classes = useStyles();

  const testkubeUIUrl = useTestkubeUI();
  const title = testkubeUIUrl ? (
    <>
      {`Test Workflow Executions: `}
      <Link to={`${testkubeUIUrl}`} />
    </>
  ) : (
    `Test Workflow Executions`
  );

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setIsRefreshing(true);

      const executions = await TestkubeAPI.getTestWorkflowExecutionsResult();
      console.log('executions >>>', executions);
      setLastExecutions(executions);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      if (isInitial) setLoading(false);
      else setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Progress />;

  if (error) {
    return (
      <WarningPanel severity="error" title="Could not fetch Test Workflow Executions from TestKube.">
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  if (!lastExecutions) {
    return (
      <EmptyState
        missing="data"
        title="No data available"
        description="No executions were returned from Testkube."
      />
    );
  }

  return (
    <Page themeId="home">
      <Header title={title} subtitle="Test Automation Execution Platform">
      <HeaderLabel label="Go to platform" value="https://app.testkube.io"></HeaderLabel>
    </Header>
    <Content>
      <ContentHeader title={isRefreshing ? `${String(title)} - Actualizando datos...` : String(title)}></ContentHeader>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Pass/Fail Ratio">
            <Typography variant="h5">
              {lastExecutions.totals.passed * 100 / lastExecutions.totals.results || 0}%
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Failed Executions">
            <Typography variant="h5">
              {lastExecutions.totals.failed}
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Total Executions">
            <Typography variant="h5">
              {lastExecutions.totals.results}
            </Typography>
          </InfoCard>
        </Grid>
      </Grid>
      <br />
      <Table
        columns={columns}
        title="Last Executions"
        subtitle="The last 20 executions"
        options={{ paging: false }}
        data={lastExecutions.results}
        emptyContent={
          <div className={classes.empty}>
            <EmptyState
              missing="data"
              title="No data to show"
              description="No data to show"
            />
          </div>
        }
      />
    </Content>
    </Page>
  );
};