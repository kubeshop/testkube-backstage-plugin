import React, { useEffect, useState } from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  Table,
  Link,
  EmptyState,
  HeaderLabel
} from '@backstage/core-components';
import { testkubeApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { columns, useStyles } from './tableHeading';
import { useTestkubeUI } from '../../utils/isTestkubeUiConfigured';
import { TestWorkflowExecutionsResult } from '../../types';
import { TestkubePageWrapper } from '../utils/TestkubePageWrapper';
import { TestkubeErrorPage } from '../utils/TestkubeErrorComponent';
import { TWESummaryMetricsComponent } from '../TWESummaryMetricsComponent';
import { TestkubeLoadingComponent } from '../utils/TestkubeLoadingComponent';

export const TestkubeDashboardPage = () => {

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

  const noDataState = (
    <div className={classes.empty}>
      <EmptyState
        missing="data"
        title="No data available"
        description="No executions were returned from Testkube."
      />
    </div>
  )

  if (loading) {
    return (
      <TestkubePageWrapper>
        <TestkubeLoadingComponent />
      </TestkubePageWrapper>
    );
  }

  if (error) {
    return (
      <TestkubePageWrapper>
        <TestkubeErrorPage error={error} />
      </TestkubePageWrapper>
    );
  }

  if (!lastExecutions) {
    return (
      <TestkubePageWrapper>
        {noDataState}
      </TestkubePageWrapper>
    );
  }

  return (
    <Page themeId="home">
      <Header title={title} subtitle="">
      <HeaderLabel label="Go to platform" value="https://app.testkube.io"></HeaderLabel>
    </Header>
    <Content>
      <ContentHeader title={isRefreshing ? `${String(title)} - Actualizando datos...` : String(title)}></ContentHeader>
      <TWESummaryMetricsComponent totals={lastExecutions.totals} />
      <br />
      <Table
        columns={columns}
        title="Last Executions"
        subtitle="The last 20 executions"
        options={{ paging: false }}
        data={lastExecutions.results}
        emptyContent={noDataState}
      />
    </Content>
    </Page>
  );
};
