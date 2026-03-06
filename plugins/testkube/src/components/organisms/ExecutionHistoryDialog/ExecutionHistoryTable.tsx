import React from 'react';
import { EmptyState, Table, TableColumn } from '@backstage/core-components';

import { ExecutionStatusBadge } from '../../molecules/ExecutionStatusBadge';
import { components } from '../../../types/openapi';

import { useStyles } from '../ExecutionsDetailedTable/Heading';
import { ShowLogsDialog } from '../ExecutionsDetailedTable/ShowLogsDialog';

type ExecutionHistoryTableProps = {
  executions: components['schemas']['TestWorkflowExecutionSummary'][];
  onOpenExecutionDialog(workflowName: string, executionId: string): void;
};

export const ExecutionHistoryTable: React.FC<ExecutionHistoryTableProps> = ({
  executions,
  onOpenExecutionDialog,
}) => {
  const classes = useStyles();

  const columns: TableColumn<
    components['schemas']['TestWorkflowExecutionSummary']
  >[] = [
    {
      title: 'Execution',
      field: 'name',
      type: 'string',
      highlight: true,
    },
    {
      title: 'Status',
      field: 'result.status',
      type: 'string',
      render: (rowData: any) => (
        <ExecutionStatusBadge status={rowData.result.status} />
      ),
    },
    { title: 'Duration', field: 'result.totalDuration' },
    { title: 'Scheduled at', field: 'scheduledAt', type: 'datetime' },
    {
      title: '',
      field: 'actions',
      width: '5px',
      sorting: false,
      render: (rowData: any) => (
        <ShowLogsDialog
          executionName={rowData.name}
          small={false}
          onOpen={() =>
            onOpenExecutionDialog(rowData.workflow.name, rowData.id)
          }
        />
      ),
    },
  ];

  const noDataState = (
    <div className={classes.empty}>
      <EmptyState
        missing="data"
        title="No data available"
        description="No executions were returned from Testkube."
      />
    </div>
  );

  return (
    <>
      <Table
        columns={columns}
        title="Executions history"
        options={{ paging: false }}
        data={executions}
        emptyContent={noDataState}
      />
    </>
  );
};
