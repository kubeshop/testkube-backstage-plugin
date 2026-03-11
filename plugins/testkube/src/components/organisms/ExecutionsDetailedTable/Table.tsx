import { useState } from 'react';
import {
  Table as BackstageTable,
  TableColumn,
} from '@backstage/core-components';
import Snackbar from '@mui/material/Snackbar';

import { ShowLogsDialog } from './ShowLogsDialog';
import { ShowManifestDialog } from './ShowManifestDialog';
import { TableAction } from './TableAction';
import { components } from '../../../types/openapi';
import { ExecutionStatusBadge } from '../../molecules/ExecutionStatusBadge';
import { ExecutionDialog } from '../ExecutionDialog';
import { ManifestDialog } from '../ManifestDialog';
import { ExecutionHistoryDialog } from '../ExecutionHistoryDialog';

type TableProps = {
  data: components['schemas']['TestWorkflowExecutionSummary'][];
};

export const Table: React.FC<TableProps> = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExecutionHistoryDialogOpen, setIsExecutionHistoryDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
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

  const handleOpenExecutionHistoryDialog = (workflowNameParam: string) => {
    setIsExecutionHistoryDialogOpen(true);
    setWorkflowName(workflowNameParam);
  };

  const handleOpenSnackbar = (workflowNameParam: string) => {
    setIsSnackbarOpen(true);
    setWorkflowName(workflowNameParam);
  };

  const testWorkflowsColumns: TableColumn[] = [
    {
      title: 'Name',
      field: 'name',
      render: (rowData: any) => (
        <ShowManifestDialog
          name={rowData.workflow.name}
          onOpen={() => handleOpenManifestDialog(rowData.workflow.name)}
        />
      ),
    },
    {
      title: 'Last execution',
      field: 'lastExecution',
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
      title: 'Status',
      field: 'result.status',
      render: (rowData: any) => (
        <ExecutionStatusBadge status={rowData.result?.status} />
      ),
    },
    { title: 'Duration', field: 'result?.totalDuration' },
    { title: 'Scheduled at', field: 'scheduledAt', type: 'datetime' },
    {
      title: '',
      field: 'actions',
      width: '5px',
      sorting: false,
      render: (rowData: any) => (
        <TableAction
          name={rowData.workflow.name}
          onOpenExecutionHistoryDialog={() =>
            handleOpenExecutionHistoryDialog(rowData.workflow.name)
          }
          onOpenSnackbar={() => handleOpenSnackbar(rowData.workflow.name)}
        />
      ),
    },
  ];

  return (
    <>
      <BackstageTable
        columns={testWorkflowsColumns}
        title="Test Workflows"
        options={{ paging: false }}
        data={data}
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

      <ExecutionHistoryDialog
        name={workflowName}
        isOpen={isExecutionHistoryDialogOpen}
        onClose={() => setIsExecutionHistoryDialogOpen(false)}
      />

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000} // 5 seconds
        onClose={() => setIsSnackbarOpen(false)}
        message="Test workflow started successfully"
      />
    </>
  );
};
