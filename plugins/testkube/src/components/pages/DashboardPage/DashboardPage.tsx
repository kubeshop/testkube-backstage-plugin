import { useState } from 'react';
import {
  ContentHeader,
  Table,
  EmptyState,
  TableColumn,
} from '@backstage/core-components';

import { components } from '../../../types/openapi';
import { ExecutionStatusBadge } from '../../molecules/ExecutionStatusBadge';
import { useStyles } from '../../organisms/ExecutionsDetailedTable/Heading';
import { SummaryMetrics } from '../../organisms/SummaryMetrics';
import { Layout as layout } from '../../hoc/Layout/Layout';
import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading';
import { useExecutions } from '../../../hooks/useApi';
import { ShowLogsDialog } from '../../organisms/ExecutionsDetailedTable/ShowLogsDialog';
import { ExecutionDialog } from '../../organisms/ExecutionDialog';
import { ShowManifestDialog } from '../../organisms/ExecutionsDetailedTable/ShowManifestDialog';
import { ManifestDialog } from '../../organisms/ManifestDialog';

export const DashboardPage = layout(() => {
  const { data: executions, isLoading, error, isRefetching } = useExecutions();
  const { empty } = useStyles();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManifestDialogOpen, setIsManifestDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [executionId, setExecutionId] = useState('');

  const handleOpenExecutionDialog = (workflowNameParam: string, id: string) => {
    setIsDialogOpen(true);
    setWorkflowName(workflowNameParam);
    setExecutionId(id);
  };

  const handleOpenManifestDialog = (workflowNameParam: string) => {
    setIsManifestDialogOpen(true);
    setWorkflowName(workflowNameParam);
  };

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

  const columns: TableColumn<
    components['schemas']['TestWorkflowExecutionSummary']
  >[] = [
    {
      title: 'Execution',
      field: 'name',
      type: 'string',
      highlight: true,
      render: (rowData: any) => (
        <ShowLogsDialog
          executionName={rowData.name}
          executionId={rowData.id}
          onOpen={() =>
            handleOpenExecutionDialog(rowData.workflow.name, rowData.id)
          }
        />
      ),
    },
    {
      title: 'Test Workflow',
      field: 'workflow.name',
      type: 'string',
      highlight: true,
      render: (rowData: any) => (
        <ShowManifestDialog
          name={rowData.workflow.name}
          onOpen={() => handleOpenManifestDialog(rowData.workflow.name)}
        />
      ),
    },
    {
      title: 'Status',
      field: 'result.status',
      type: 'string',
      render: (rowData: any) => (
        <ExecutionStatusBadge status={rowData.result?.status} />
      ),
    },
    {
      title: 'Scheduled at',
      field: 'scheduledAt',
      type: 'datetime',
    },
    {
      title: 'Duration',
      field: 'result.totalDuration',
      type: 'time',
    },
  ];

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

      <ExecutionDialog
        workflowName={workflowName}
        executionId={executionId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <ManifestDialog
        name={workflowName}
        isOpen={isManifestDialogOpen}
        onClose={() => setIsManifestDialogOpen(false)}
      />
    </>
  );
});
