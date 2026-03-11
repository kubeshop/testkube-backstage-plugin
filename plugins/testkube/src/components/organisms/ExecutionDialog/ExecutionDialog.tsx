import { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { InfoCard, LogViewer } from '@backstage/core-components';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Loading } from '../../molecules/Loading';
import { Error } from '../../molecules/Error';
import {
  useExecution,
  useExecutionLog,
  useSlicedExecutionLog,
} from '../../../hooks/useApi';
import { StepList } from './StepList';

type ExecutionDialogProps = {
  workflowName: string;
  executionName?: string;
  executionId: string;
  isOpen: boolean;

  onClose(): void;
};

export const ExecutionDialog: React.FC<ExecutionDialogProps> = ({
  workflowName,
  executionName,
  executionId,
  isOpen,
  onClose,
}) => {
  const [currentStepRef, setCurrentStepRef] = useState<string>('init');
  const {
    data: log = '',
    isLoading: isLoadingLog,
    error: logError,
  } = useExecutionLog({
    workflowName,
    executionId,
  });

  const slicedLog = useSlicedExecutionLog({
    stepName: currentStepRef,
    log,
  });

  const {
    data: execution,
    isLoading: isLoadingExecution,
    error: executionError,
  } = useExecution({
    workflowName,
    executionId,
  });

  const isLoading = isLoadingLog || isLoadingExecution;
  const error = logError || executionError;
  const isDataReady =
    !isLoading && !error && slicedLog !== undefined && execution;

  return (
    <Dialog
      maxWidth="md"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullScreen
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle id="dialog-title">
        Execution Log Output: {execution?.name || executionName}
      </DialogTitle>
      <DialogContent>
        {(isLoading && <Loading />) ||
          (error && <Error error={error} />) ||
          (isDataReady && (
            <Grid
              container
              spacing={3}
              direction="row"
              alignItems="stretch"
              style={{ minHeight: '300px' }}
            >
              <Grid item xs={12} sm={4} md={3}>
                <InfoCard>
                  <StepList
                    execution={execution}
                    onStepClick={setCurrentStepRef}
                  />
                </InfoCard>
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <InfoCard>
                  {isLoadingLog && <Loading />}
                  {!isLoadingLog && !logError && (
                    <div style={{ minHeight: '300px' }}>
                      <LogViewer text={slicedLog} />
                    </div>
                  )}
                  {logError && <Error error={logError} />}
                </InfoCard>
              </Grid>
            </Grid>
          ))}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
