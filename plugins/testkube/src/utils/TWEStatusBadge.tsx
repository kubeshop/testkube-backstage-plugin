import React from 'react';
import { StatusAborted, StatusError, StatusOK, StatusPending, StatusRunning } from '@backstage/core-components';

export const TWEStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'passed':
      return (<StatusOK>Passed</StatusOK>);
    case 'failed':
      return (<StatusError>Failed</StatusError>);
    case 'aborted':
      return (<StatusAborted>Aborted</StatusAborted>);
    case 'queued':
      return (<StatusPending>Queued</StatusPending>);
    case 'running':
      return (<StatusRunning>Running</StatusRunning>);
    case 'paused':
      return (<StatusAborted>Paused</StatusAborted>);
    default:
      return (<StatusPending />);
  }
}
