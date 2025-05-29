import React, { Fragment, useEffect, useState } from "react";
import { TWExecutionsDetailedTableComponent } from "../TWExecutionsDetailedTableComponent";
import { testkubeApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { TestWorkflowExecutionsResult } from '../../types';
import { TestkubeErrorPage } from '../utils/TestkubeErrorComponent';
import { TWESummaryMetricsComponent } from '../TWESummaryMetricsComponent';
import { TestkubeLoadingComponent } from '../utils/TestkubeLoadingComponent';
import { ContentHeader, EmptyState } from "@backstage/core-components";
import { useStyles } from "../TestkubeDashboardPage/tableHeading";

export const TestkubeEntityPage = () => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [lastExecutions, setLastExecutions] = useState<TestWorkflowExecutionsResult>();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const classes = useStyles();

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

  if (loading) {
    return (
      <TestkubeLoadingComponent />
    );
  }

  if (error) {
    return (
      <TestkubeErrorPage error={error} />
    );
  }

  if (!lastExecutions) {
    return (
      <div className={classes.empty}>
        <EmptyState
          missing="data"
          title="No data available"
          description="No executions were returned from Testkube."
        />
      </div>
    );
  }

  return (
    <Fragment>
      <ContentHeader title={isRefreshing ? 'Actualizando datos...' : ''}></ContentHeader>
      <TWESummaryMetricsComponent totals={lastExecutions.totals}></TWESummaryMetricsComponent>
      <br />
      <TWExecutionsDetailedTableComponent data={lastExecutions.results}></TWExecutionsDetailedTableComponent>
    </Fragment>
  );
};
