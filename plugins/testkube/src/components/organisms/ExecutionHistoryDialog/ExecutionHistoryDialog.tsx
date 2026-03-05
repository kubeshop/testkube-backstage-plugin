import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTestWorkflowExecutionsByName } from '../../../hooks/useApi';
import { ExecutionDialog } from '../ExecutionDialog';
import { ExecutionHistoryTable } from './ExecutionHistoryTable';

type ExecutionHistoryDialogProps = {
  name: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ExecutionHistoryDialog: React.FC<ExecutionHistoryDialogProps> = ({
  name,
  isOpen,
  onClose,
}) => {
  const { data: { results = [] } = {} } = useTestWorkflowExecutionsByName({
    name,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [executionId, setExecutionId] = useState('');

  const handleOpenExecutionDialog = (_: string, id: string) => {
    setIsDialogOpen(true);
    setExecutionId(id);
  };

  return (
    <>
      <Dialog fullScreen={false} maxWidth="xl" open={isOpen} onClose={onClose}>
        <DialogContent>
          <ExecutionHistoryTable
            executions={results}
            onOpenExecutionDialog={handleOpenExecutionDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <ExecutionDialog
        workflowName={name}
        executionId={executionId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};
