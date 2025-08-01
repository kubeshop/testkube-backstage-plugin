import React, { Fragment, useState } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useApi } from "@backstage/frontend-plugin-api";
import { testkubeApiRef } from "../../api";
import { components } from "../../types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { EmptyState, Table, TableColumn } from "@backstage/core-components";
import { useStyles } from "../TestkubeDashboardPage/tableHeading";
import { TWEStatusBadge } from "../../utils/TWEStatusBadge";
import { TWEShowLogsDialog } from "./TWEShowLogsDialog";

type TWExecutionsDetailedTableActionProps = {
  name: string;
  reload?: (message?: string) => void;
}

export const TWExecutionsDetailedTableAction = ({ name, reload }: TWExecutionsDetailedTableActionProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const [executionHistory, setExecutionHistory] = useState<components["schemas"]["TestWorkflowExecutionSummary"][]>([]);
  const columns: TableColumn<components["schemas"]["TestWorkflowExecutionSummary"]>[] = [
    {
      title: 'Execution',
      field: 'name',
      type: 'string',
      highlight: true
    },
    {
      title: 'Status',
      field: 'result.status',
      type: 'string',
      render: (rowData: any) => (
        <TWEStatusBadge status={rowData.result.status} />
      )
    },
    { title: "Duration", field: "result.totalDuration" },
    { title: "Scheduled at", field: "scheduledAt", type: 'datetime' },
    { title: "", field: "actions", width: "5px", sorting: false, render: (rowData: any) => (
      <TWEShowLogsDialog workflowName={rowData.workflow.name} executionName={rowData.name} executionId={rowData.id} small={false} />
    )}
  ];
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openHistoryExecutions, setOpenHistoryExecutions] = React.useState(false);
  const closeHistoryExecutions = () => {
    setOpenHistoryExecutions(false);
  };
  const openHistoryExecutionsDialog = async () => {
    setOpenHistoryExecutions(true);
    const result = await TestkubeAPI.getTestWorkflowExecutionsByName(name);
    setExecutionHistory(result.results);
    handleClose();
  }
  const runTestWorkflow = async () => {
    const result = await TestkubeAPI.runTestWorkflowByName(name);
    let message = 'Test workflow started successfully';
    if (result instanceof Error) {
      message = `Error running test workflow: ${result.message}`;
    }
    reload?.(message);
    handleClose();
  }
  const noDataState = (
    <div className={classes.empty}>
      <EmptyState
        missing="data"
        title="No data available"
        description="No executions were returned from Testkube."
      />
    </div>
  )
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
        <MenuItem onClick={openHistoryExecutionsDialog}>
          Executions history
        </MenuItem>
        <MenuItem onClick={runTestWorkflow}>
          Run
        </MenuItem>
      </Menu>
      <Dialog
        fullScreen={false}
        maxWidth="xl"
        open={openHistoryExecutions}
        onClose={closeHistoryExecutions}
      >
        <DialogContent>
          <Table
            columns={columns}
            title="Executions history"
            options={{ paging: false }}
            data={executionHistory}
            emptyContent={noDataState}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHistoryExecutions}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
