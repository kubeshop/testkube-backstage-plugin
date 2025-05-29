import React, { Fragment } from "react";
import { TWExecutionsDetailedTableComponent } from "../TWExecutionsDetailedTableComponent";
import { TWESummaryMetricsComponent } from "../TWESummaryMetricsComponent";

export const TestkubeEntityPage = () => {
  return (
    <Fragment>
      <TWESummaryMetricsComponent totals={{
        results: 4,
        passed: 2,
        failed: 2,
        queued: 0,
        running: 0,
      }}></TWESummaryMetricsComponent>
      <br />
      <TWExecutionsDetailedTableComponent data={[]}></TWExecutionsDetailedTableComponent>
    </Fragment>
  );
};
