import React, { Fragment } from "react";
import { Table, TableColumn } from "@backstage/core-components";
import { TWEShowLogsDialog } from "./TWEShowLogsDialog";
import { TWEShowManifestDialog } from "./TWEShowManifestDialog";
import { TWExecutionsDetailedTableAction } from "./TWExecutionsDetailedTableAction";

type TWExecutionsDetailedTableComponentProps = {
  data: any[];
};

export const TWExecutionsDetailedTableComponent = ({ data }: TWExecutionsDetailedTableComponentProps) => {
  const testWorkflowsColumns: TableColumn[] = [
    { title: "Name", field: "name", render: (rowData: any) => (
      <TWEShowManifestDialog name={rowData.name} />
    )},
    { title: "Last execution", field: "lastExecution", render: (rowData: any) => (
      <TWEShowLogsDialog lastExecution={rowData.lastExecution} />
    )},
    { title: "Status", field: "status" },
    { title: "Duration", field: "duration" },
    { title: "Created at", field: "createdAt" },
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
