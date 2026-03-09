import React, { useCallback } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import ArticleIcon from '@mui/icons-material/Article';

import { useEnterpriseNavigation } from '../../../hooks/useEnterpriseNavigation';

type ShowLogsDialogProps = {
  executionName: string;
  executionId: string;
  onOpen(): void;
  small?: boolean;
};

export const ShowLogsDialog: React.FC<ShowLogsDialogProps> = ({
  executionName,
  executionId,
  small = true,
  onOpen,
}) => {
  const { shouldNavigateToUi, navigate } = useEnterpriseNavigation();

  const handleClick = useCallback(() => {
    if (shouldNavigateToUi) {
      navigate(`dashboard/executions/${executionId}/log-output`);
      return;
    }

    onOpen();
  }, [shouldNavigateToUi, onOpen, navigate, executionId]);

  return (
    <>
      <Tooltip title="Show execution logs">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={undefined}
          aria-expanded={undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <ArticleIcon />
        </IconButton>
      </Tooltip>
      {small && (
        <span style={{ paddingRight: '10px', textTransform: 'none' }}>
          {executionName}
        </span>
      )}
    </>
  );
};
