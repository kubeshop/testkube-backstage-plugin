import React, { useCallback, useEffect, useState } from 'react';
import {
  ContentHeader,
  Table,
  EmptyState,
  HeaderLabel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@mui/material/IconButton';

import { testkubeApiRef } from '../../../api';
import {
  columns,
  useStyles,
} from '../../organisms/ExecutionsDetailedTable/Heading';
import { SummaryMetrics } from '../../organisms/SummaryMetrics';
import { components } from '../../../types/openapi';
import { Layout as layout } from '../../hoc/Layout/Layout';
import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading';
import { sleep } from '../../../utils/functions';

export const DashboardPage = layout(() => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [lastExecutions, setLastExecutions] =
    useState<components['schemas']['TestWorkflowExecutionsResult']>();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const classes = useStyles();

  const fetchData = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        else setIsRefreshing(true);
        await sleep(1000);
        const executions = await TestkubeAPI.getTestWorkflowExecutionsResult();
        setLastExecutions(executions);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        if (isInitial) setLoading(false);
        else setIsRefreshing(false);
      }
    },
    [TestkubeAPI],
  );

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const noDataState = (
    <div className={classes.empty}>
      <EmptyState
        missing="data"
        title="No data available"
        description="No executions were returned from Testkube."
      />
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!lastExecutions) {
    return noDataState;
  }

  return (
    <>
      <ContentHeader
        title={
          isRefreshing ? 'Summary Metrics - Refreshing ...' : 'Summary Metrics'
        }
      >
        <HeaderLabel
          value={
            <IconButton
              disabled={isRefreshing}
              onClick={() => fetchData(false)}
            >
              <RefreshIcon />
            </IconButton>
          }
          label=""
        />
      </ContentHeader>
      <SummaryMetrics totals={lastExecutions.totals} />
      <br />
      <Table
        columns={columns}
        title="Last Executions"
        options={{ paging: false }}
        data={lastExecutions.results}
      />
    </>
  );
});
