import React, { Fragment } from "react";
import { Table, TableColumn } from "@backstage/core-components";
import { TWEShowLogsDialog } from "./TWEShowLogsDialog";
import { TWEShowManifestDialog } from "./TWEShowManifestDialog";
import { TWExecutionsDetailedTableAction } from "./TWExecutionsDetailedTableAction";
import { components } from "../../types";
import { TWEStatusBadge } from "../../utils/TWEStatusBadge";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type TWExecutionsDetailedTableComponentProps = {
  data: components["schemas"]["TestWorkflowExecutionSummary"][];
  reload: () => void;
};

export const TWExecutionsDetailedTableComponent = ({ data, reload }: TWExecutionsDetailedTableComponentProps) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const action = (
    <Fragment>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Fragment>
  );
  const reloadData = (message?: string) => {
    reload();
    if (message) {
      setMessage(message);
      setOpen(true);
    }
  };
  const testWorkflowsColumns: TableColumn[] = [
    { title: "Name", field: "name", render: (rowData: any) => (
      <TWEShowManifestDialog name={rowData.workflow.name} />
    )},
    { title: "Last execution", field: "lastExecution", render: (rowData: any) => (
      <TWEShowLogsDialog workflowName={rowData.workflow.name} executionName={rowData.name} executionId={rowData.id} small={true} />
    )},
    { title: "Status", field: "result.status", render: (rowData: any) => (
      <TWEStatusBadge status={rowData.result.status} />
    )},
    { title: "Duration", field: "result.totalDuration" },
    { title: "Scheduled at", field: "scheduledAt", type: 'datetime' },
    { title: "", field: "actions", width: "5px", sorting: false, render: (rowData: any) => (
      <TWExecutionsDetailedTableAction name={rowData.workflow.name} reload={reloadData} />
    )}
  ];

  return (
    <Fragment>
      <Table columns={testWorkflowsColumns} title="Last Executions" options={{ paging: false }} data={data}>
      </Table>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </Fragment>
  );
};
