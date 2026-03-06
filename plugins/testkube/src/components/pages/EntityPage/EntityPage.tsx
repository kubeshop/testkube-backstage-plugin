import React from 'react';
import { ContentHeader, EmptyState } from '@backstage/core-components';

import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading/Loading';
import { Table } from '../../organisms/ExecutionsDetailedTable';
import { SummaryMetrics } from '../../organisms/SummaryMetrics';
import { useStyles } from '../../organisms/ExecutionsDetailedTable/Heading';
import { useLabels } from '../../../hooks/useLabels';
import { QueryProvider as withQueryProvider } from '../../hoc/QueryProvider';
import { useTestWorkflowsWithExecutions } from '../../../hooks/useApi';

export const EntityPage: React.FC = withQueryProvider(() => {
  const labels = useLabels();

  const {
    data: {
      totals = { results: 0, passed: 0, failed: 0, queued: 0, running: 0 },
      results,
    } = {},
    isLoading,
    error,
  } = useTestWorkflowsWithExecutions({
    filters: {
      labels,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!results) {
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
    <>
      <ContentHeader title="Summary Metrics" />
      <SummaryMetrics totals={totals} />
      <br />
      <Table data={results} />
    </>
  );
});
