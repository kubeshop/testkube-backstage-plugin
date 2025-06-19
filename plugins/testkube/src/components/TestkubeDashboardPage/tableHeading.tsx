import React from 'react';
import { TableColumn } from '@backstage/core-components';
import { components } from '../../types';
import { makeStyles } from '@material-ui/core';
import { TWEStatusBadge } from '../../utils/TWEStatusBadge';

export const columns: TableColumn<components["schemas"]["TestWorkflowExecutionsResult"]>[] = [
  {
    title: 'Execution',
    field: 'name',
    type: 'string',
    highlight: true
  },
  {
    title: 'Test Workflow',
    field: 'workflow.name',
    type: 'string',
    highlight: true
  },
  {
    title: 'Status',
    field: 'result.status',
    type: 'string',
    render: (rowData: any) => (
      <TWEStatusBadge status={rowData.result.status} />
    )
  },
  {
    title: 'Start Time',
    field: 'scheduledAt',
    type: 'datetime'
  },
  {
    title: 'End Time',
    field: 'result.finishedAt',
    type: 'datetime'
  },
];

export const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));
