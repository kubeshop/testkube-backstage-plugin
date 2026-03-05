import React, { Fragment, useState } from 'react';
import {
  Table as BackstageTable,
  TableColumn,
} from '@backstage/core-components';
import { ShowLogsDialog } from './ShowLogsDialog';
import { ShowManifestDialog } from './ShowManifestDialog';
import { TableAction } from './TableAction';
import { components } from '../../../types/openapi';
import { ExecutionStatusBadge } from '../../molecules/ExecutionStatusBadge';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { ExecutionDialog } from '../ExecutionDialog';
import { ManifestDialog } from '../ManifestDialog';

type TableProps = {
  data: components['schemas']['TestWorkflowExecutionSummary'][];
};

export const Table: React.FC<TableProps> = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManifestDialogOpen, setIsManifestDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [executionId, setExecutionId] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleOpenExecutionDialog = (workflowNameParam: string, id: string) => {
    setIsDialogOpen(true);
    setWorkflowName(workflowNameParam);
    setExecutionId(id);
  };

  const handleOpenManifestDialog = (workflowNameParam: string) => {
    setIsManifestDialogOpen(true);
    setWorkflowName(workflowNameParam);
  };

  const action = (
    <Fragment>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Fragment>
  );

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
      render: (rowData: any) => <TableAction name={rowData.workflow.name} />,
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
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Test workflow started successfully"
        action={action}
      />
      <ExecutionDialog
        workflowName={workflowName}
        executionName="HOLA"
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
};
