import React, { Fragment } from 'react';
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

type TableProps = {
  data: components['schemas']['TestWorkflowExecutionSummary'][];
  reload: () => void;
};

export const Table: React.FC<TableProps> = ({ data, reload }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const handleClose = () => {
    setOpen(false);
  };
  const action = (
    <Fragment>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Fragment>
  );
  const reloadData = (alertMessage?: string) => {
    reload();
    if (alertMessage) {
      setMessage(alertMessage);
      setOpen(true);
    }
  };
  const testWorkflowsColumns: TableColumn[] = [
    {
      title: 'Name',
      field: 'name',
      render: (rowData: any) => (
        <ShowManifestDialog name={rowData.workflow.name} />
      ),
    },
    {
      title: 'Last execution',
      field: 'lastExecution',
      render: (rowData: any) => (
        <ShowLogsDialog
          workflowName={rowData.workflow.name}
          executionName={rowData.name}
          executionId={rowData.id}
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
      render: (rowData: any) => (
        <TableAction name={rowData.workflow.name} reload={reloadData} />
      ),
    },
  ];

  return (
    <Fragment>
      <BackstageTable
        columns={testWorkflowsColumns}
        title="Test Workflows"
        options={{ paging: false }}
        data={data}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </Fragment>
  );
};
