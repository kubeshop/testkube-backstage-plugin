import { TableColumn } from '@backstage/core-components/*';
import { TestWorkflowExecutionSummary } from '../../types';
import { makeStyles } from '@material-ui/core';

export const columns: TableColumn<TestWorkflowExecutionSummary>[] = [

  { 
    title: 'Execution #',
    field: 'id',
    type: 'string',
    highlight: true
  },

  { 
    title: 'Test Name', 
    field: 'name',
    type: 'string',
    highlight: true
  },

  { 
    title: 'Status',
    field: 'statusAt',
    type: 'string'
  },

  {
    title: 'Start Time',
    field: 'scheduledAt',
    type: 'string'
  },

  { 
    title: 'End Time',
    field: 'endTime',
    type: 'string'
  },
];

export const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));
