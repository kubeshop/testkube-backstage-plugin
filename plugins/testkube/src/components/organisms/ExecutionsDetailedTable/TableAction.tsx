import { useCallback, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useRunTestWorkflowByNameMutation } from '../../../hooks/useApi';
import { useEnterpriseNavigation } from '../../../hooks/useEnterpriseNavigation';

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
  const { shouldNavigateToUi, navigate } = useEnterpriseNavigation();

  const [tooltipAnchorEl, setTooltipAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const isToolTipOpen = Boolean(tooltipAnchorEl);

  const handleTooltipClose = useCallback(() => {
    setTooltipAnchorEl(null);
  }, []);

  const handleTooltipOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTooltipAnchorEl(event.currentTarget);
  };

  const handleOpenHistoryDialog = useCallback(() => {
    handleTooltipClose();

    if (shouldNavigateToUi) {
      navigate(`dashboard/test-workflows/${name}/executions`);
      return;
    }

    onOpenExecutionHistoryDialog();
  }, [
    shouldNavigateToUi,
    name,
    onOpenExecutionHistoryDialog,
    handleTooltipClose,
    navigate,
  ]);

  const handleRunTestWorkflow = useCallback(() => {
    handleTooltipClose();

    if (shouldNavigateToUi) {
      navigate(`dashboard/test-workflows/${name}/overview`);
      return;
    }

    runTestWorkflow(
      { name },
      {
        onSettled: () => {
          onOpenSnackbar();
        },
      },
    );
  }, [
    shouldNavigateToUi,
    navigate,
    runTestWorkflow,
    name,
    onOpenSnackbar,
    handleTooltipClose,
  ]);

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
