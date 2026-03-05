import React from 'react';
import {
  StatusAborted,
  StatusError,
  StatusOK,
  StatusPending,
  StatusRunning,
} from '@backstage/core-components';

type StepStatusBadgeProps = {
  stepName: string;
  status?: string;
};

const statusMap = {
  passed: StatusOK,
  failed: StatusError,
  aborted: StatusAborted,
  running: StatusRunning,
  paused: StatusAborted,
  default: StatusPending,
};

export const StepStatusBadge: React.FC<StepStatusBadgeProps> = ({
  stepName,
  status,
}) => {
  const StatusComponent =
    statusMap[status as keyof typeof statusMap] || statusMap.default;

  return <StatusComponent>{stepName}</StatusComponent>;
};
