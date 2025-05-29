import React, { Fragment } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from '@mui/icons-material/MoreVert';

type TWExecutionsDetailedTableActionProps = {
  name: string;
}

export const TWExecutionsDetailedTableAction = ({ name }: TWExecutionsDetailedTableActionProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slot="menu"
      >
        <MenuItem onClick={handleClose}>
          Executions history
        </MenuItem>
        <MenuItem onClick={handleClose}>
          Run
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
