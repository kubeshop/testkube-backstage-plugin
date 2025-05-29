import React, { Fragment } from "react";
import { Table, TableColumn } from "@backstage/core-components";
import { TWEShowLogsDialog } from "./TWEShowLogsDialog";
import { TWEShowManifestDialog } from "./TWEShowManifestDialog";
import { TWExecutionsDetailedTableAction } from "./TWExecutionsDetailedTableAction";
import { TestWorkflowExecutionSummary } from "../../types";

type TWExecutionsDetailedTableComponentProps = {
  data: TestWorkflowExecutionSummary[];
};

export const TWExecutionsDetailedTableComponent = ({ data }: TWExecutionsDetailedTableComponentProps) => {
  const testWorkflowsColumns: TableColumn[] = [
    { title: "Name", field: "name", render: (rowData: any) => (
      <TWEShowManifestDialog name={rowData.workflow.name} />
    )},
    { title: "Last execution", field: "lastExecution", render: (rowData: any) => (
      <TWEShowLogsDialog lastExecution={rowData.name} />
    )},
    { title: "Status", field: "result.status" },
    { title: "Duration", field: "result.totalDuration" },
    { title: "Scheduled at", field: "scheduledAt" },
    { title: "", field: "actions", width: "5px", sorting: false, render: (rowData: any) => (
      <TWExecutionsDetailedTableAction name={rowData.name} />
    )}
  ];

  return (
    <Fragment>
      <Table columns={testWorkflowsColumns} title="Test Workflows" options={{ paging: false }} data={data}>
      </Table>
    </Fragment>
  );
};
