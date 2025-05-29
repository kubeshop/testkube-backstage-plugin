import { TableColumn } from '@backstage/core-components/*';
import { TestWorkflowExecutionSummary } from '../../types';
import { makeStyles } from '@material-ui/core';

export const columns: TableColumn<TestWorkflowExecutionSummary>[] = [
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
    type: 'string'
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
