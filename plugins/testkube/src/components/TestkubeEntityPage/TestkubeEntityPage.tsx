import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { TWExecutionsDetailedTableComponent } from "../TWExecutionsDetailedTableComponent";
import { testkubeApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { components } from '../../types';
import { TestkubeErrorPage } from '../../utils/TestkubeErrorComponent';
import { TWESummaryMetricsComponent } from '../TWESummaryMetricsComponent';
import { TestkubeLoadingComponent } from '../../utils/TestkubeLoadingComponent';
import { EmptyState, InfoCard, StructuredMetadataTable } from "@backstage/core-components";
import { useStyles } from "../TestkubeDashboardPage/tableHeading";
import { useEntity } from '@backstage/plugin-catalog-react';
import { useTestkubeLabels, getTestkubeOrganization, getTestkubeEnvironments, useIsEnterpriseEnabled } from "../../utils/isTestkubeAvailable";
import { Grid } from "@material-ui/core";

type TestWorkflowWithExecutionSummary = components["schemas"]["TestWorkflowWithExecutionSummary"];
type TestWorkflowExecutionSummary = components["schemas"]["TestWorkflowExecutionSummary"];

const cardContentStyle = { heightX: 200, width: 500 };

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid container spacing={4}>
    <Grid item>{children}</Grid>
  </Grid>
);

const mapToExecutionResult = (
  items: TestWorkflowWithExecutionSummary[]
): TestWorkflowExecutionSummary[] => {
  console.log (items)
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
export const TestkubeEntityPage = () => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [lastExecutions, setLastExecutions] = useState<components["schemas"]["TestWorkflowExecutionsResult"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const classes = useStyles();

  const { entity } = useEntity();
  const labels = useTestkubeLabels();
  const isEnterprise = useIsEnterpriseEnabled();
  const metadata = {
  Organization: getTestkubeOrganization(entity),
  Environments: getTestkubeEnvironments(entity)
};


  const fetchData = async (isInitial = false) => {
  try {
    if (isInitial) setLoading(true);

    const filters: any = {
      labels,
      pageSize: 50,
      page: 0,
    };

    let workflowsWithExecutions: TestWorkflowWithExecutionSummary[][] = [];

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
          })
        )
      );

      workflowsWithExecutions = allResults;
    } else {
      const results = await TestkubeAPI.getTestWorkflowsWithExecutions(filters);
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
    {isEnterprise && (
      <Wrapper>
      <InfoCard title="Testkube Enterprise Context" variant="fullHeight">
        <div style={cardContentStyle}>
          <StructuredMetadataTable 
        metadata={metadata}
      />
        </div>
      </InfoCard>
      </Wrapper>
    )}
    <TWESummaryMetricsComponent totals={lastExecutions.totals} />
    <br />
    <TWExecutionsDetailedTableComponent data={lastExecutions.results} />
  </Fragment>
 );
};
