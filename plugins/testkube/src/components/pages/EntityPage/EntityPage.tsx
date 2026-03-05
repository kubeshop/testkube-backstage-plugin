import React, {
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useApi } from '@backstage/core-plugin-api';
import {
  ContentHeader,
  EmptyState,
  HeaderLabel,
  InfoCard,
  StructuredMetadataTable,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import {
  useTestkubeLabels,
  getTestkubeOrganization,
  getTestkubeEnvironments,
  useIsEnterpriseEnabled,
} from '../../../hooks/isTestkubeAvailable';
import { sleep } from '../../../utils/functions';
import { testkubeApiRef } from '../../../api';
import { components } from '../../../types/openapi';
import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading/Loading';

// move to components
import { Table } from '../../organisms/ExecutionsDetailedTable';
import { SummaryMetrics } from '../../organisms/SummaryMetrics';
import { useStyles } from '../../organisms/ExecutionsDetailedTable/Heading';

type TestWorkflowWithExecutionSummary =
  components['schemas']['TestWorkflowWithExecutionSummary'];
type TestWorkflowExecutionSummary =
  components['schemas']['TestWorkflowExecutionSummary'];

const cardContentStyle = { heightX: 200, width: 500 };

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid container spacing={4}>
    <Grid item>{children}</Grid>
  </Grid>
);

const mapToExecutionResult = (
  items: TestWorkflowWithExecutionSummary[],
): TestWorkflowExecutionSummary[] => {
  return items
    .filter(item => !!item.workflow)
    .map(item => {
      if (item.latestExecution) {
        return {
          ...item.latestExecution,
          workflow: item.workflow!,
        };
      }

      const wf = item.workflow!;
      return {
        id: `no-execution-${wf.name}`,
        name: wf.name!,
        number: 0,
        scheduledAt: '',
        statusAt: '',
        groupId: '',
        runnerId: '',
        workflow: wf,
      };
    });
};
export const EntityPage = () => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [lastExecutions, setLastExecutions] =
    useState<components['schemas']['TestWorkflowExecutionsResult']>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const classes = useStyles();

  const { entity } = useEntity();
  const labels = useTestkubeLabels();
  const isEnterprise = useIsEnterpriseEnabled();
  const metadata = {
    Organization: getTestkubeOrganization(entity),
    Environments: getTestkubeEnvironments(entity),
  };

  const fetchData = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        else setIsRefreshing(true);
        const filters: any = {
          labels,
          pageSize: 50,
          page: 0,
        };

        let workflowsWithExecutions: TestWorkflowWithExecutionSummary[][] = [];
        await sleep(1000);
        if (isEnterprise) {
          const organization = getTestkubeOrganization(entity);
          const environments = getTestkubeEnvironments(entity)
            .map(env => env.trim())
            .filter(env => env.length > 0);

          const allResults = await Promise.all(
            environments.map(env =>
              TestkubeAPI.getTestWorkflowsWithExecutions({
                ...filters,
                organization,
                environments: [env],
              }),
            ),
          );

          workflowsWithExecutions = allResults;
        } else {
          const results = await TestkubeAPI.getTestWorkflowsWithExecutions(
            filters,
          );
          workflowsWithExecutions = [results];
        }

        const flattened = workflowsWithExecutions.flat();
        const results = mapToExecutionResult(flattened);

        const computeMetrics = (executions: typeof results) => {
          const initial = {
            results: executions.length,
            passed: 0,
            failed: 0,
            aborted: 0,
            running: 0,
            queued: 0,
            noData: 0,
          };

          return executions.reduce((acc, e) => {
            const status = e.result?.status;
            if (status) {
              switch (status) {
                case 'passed':
                case 'failed':
                case 'aborted':
                case 'running':
                case 'queued':
                  acc[status]++;
                  break;
                default:
                  acc.noData++;
                  break;
              }
            } else {
              acc.noData++;
            }
            return acc;
          }, initial);
        };

        const metrics = computeMetrics(results);

        setLastExecutions({
          totals: metrics,
          filtered: metrics,
          results,
        });

        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        if (isInitial) setLoading(false);
        else setIsRefreshing(false);
      }
    },
    [TestkubeAPI, entity, labels, isEnterprise],
  );

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
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
    <>
      {isEnterprise && (
        <Wrapper>
          <InfoCard title="Testkube Enterprise Context" variant="fullHeight">
            <div style={cardContentStyle}>
              <StructuredMetadataTable metadata={metadata} />
            </div>
          </InfoCard>
        </Wrapper>
      )}
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
      <Table data={lastExecutions.results} reload={fetchData} />
    </>
  );
};
