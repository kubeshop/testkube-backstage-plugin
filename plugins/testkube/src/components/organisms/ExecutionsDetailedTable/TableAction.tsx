import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { ExecutionHistoryDialog } from '../ExecutionHistoryDialog';
import { useRunTestWorkflowByNameMutation } from '../../../hooks/useApi';

type TableActionProps = {
  name: string;
};

export const TableAction: React.FC<TableActionProps> = ({ name }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: runTestWorkflow, isPending } =
    useRunTestWorkflowByNameMutation({
      name,
    });

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
    setIsDialogOpen(true);
  };

  const handleRunTestWorkflow = () => {
    runTestWorkflow();
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
        slot="menu"
      >
        <MenuItem onClick={handleOpenHistoryDialog}>
          Executions history
        </MenuItem>
        <MenuItem disabled={isPending} onClick={handleRunTestWorkflow}>
          {isPending ? 'Running...' : 'Run'}
        </MenuItem>
      </Menu>

      <ExecutionHistoryDialog
        name={name}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};
