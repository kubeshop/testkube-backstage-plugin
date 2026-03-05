import React from 'react';
import { ContentHeader, Table, EmptyState } from '@backstage/core-components';

import {
  columns,
  useStyles,
} from '../../organisms/ExecutionsDetailedTable/Heading';
import { SummaryMetrics } from '../../organisms/SummaryMetrics';

import { Layout as layout } from '../../hoc/Layout/Layout';
import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading';
import { useExecutions } from '../../../hooks/useApi';

export const DashboardPage = layout(() => {
  const { data: executions, isLoading, error, isRefetching } = useExecutions();
  const { empty } = useStyles();

  const noDataState = (
    <div className={empty}>
      <EmptyState
        missing="data"
        title="No data available"
        description="No executions were returned from Testkube."
      />
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!executions) {
    return noDataState;
  }

  const {
    results = [],
    totals = { results: 0, passed: 0, failed: 0, queued: 0, running: 0 },
  } = executions;

  return (
    <>
      <ContentHeader
        title={
          isRefetching ? 'Summary Metrics - Refreshing ...' : 'Summary Metrics'
        }
      />
      <SummaryMetrics totals={totals} />
      <Table
        style={{ marginTop: '20px' }}
        columns={columns}
        title="Last Executions"
        options={{ paging: false }}
        data={results}
      />
    </>
  );
});
