import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';

import ArticleIcon from '@mui/icons-material/Article';

type ShowLogsDialogProps = {
  executionName: string;
  onOpen(): void;
  small?: boolean;
};

export const ShowLogsDialog: React.FC<ShowLogsDialogProps> = ({
  executionName,
  small = true,
  onOpen,
}) => {
  return (
    <>
      <Tooltip title="Show execution logs">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={undefined}
          aria-expanded={undefined}
          aria-haspopup="true"
          onClick={onOpen}
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
