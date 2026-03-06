import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useRunTestWorkflowByNameMutation } from '../../../hooks/useApi';

type TableActionProps = {
  name: string;
  onOpenExecutionHistoryDialog(): void;
  onOpenSnackbar(): void;
};

export const TableAction: React.FC<TableActionProps> = ({
  name,
  onOpenExecutionHistoryDialog,
  onOpenSnackbar,
}) => {
  const { mutate: runTestWorkflow, isPending } =
    useRunTestWorkflowByNameMutation();

  const [tooltipAnchorEl, setTooltipAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const isToolTipOpen = Boolean(tooltipAnchorEl);

  const handleTooltipClose = () => {
    setTooltipAnchorEl(null);
  };

  const handleTooltipOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTooltipAnchorEl(event.currentTarget);
  };

  const handleOpenHistoryDialog = () => {
    handleTooltipClose();
    onOpenExecutionHistoryDialog();
  };

  const handleRunTestWorkflow = () => {
    handleTooltipClose();
    runTestWorkflow(
      { name },
      {
        onSettled: () => {
          onOpenSnackbar();
        },
      },
    );
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={isToolTipOpen ? 'long-menu' : undefined}
        aria-expanded={isToolTipOpen ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleTooltipOpen}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        anchorEl={tooltipAnchorEl}
        open={isToolTipOpen}
        onClose={handleTooltipClose}
      >
        <MenuItem onClick={handleOpenHistoryDialog}>
          Executions history
        </MenuItem>
        <MenuItem disabled={isPending} onClick={handleRunTestWorkflow}>
          {isPending ? 'Running...' : 'Run'}
        </MenuItem>
      </Menu>
    </>
  );
};
