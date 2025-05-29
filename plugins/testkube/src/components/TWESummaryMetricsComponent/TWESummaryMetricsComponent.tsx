import React, { Fragment } from "react";
import { Grid, Typography } from "@material-ui/core";
import { InfoCard } from "@backstage/core-components";
import { ExecutionsTotals } from "../../types";

type TWESummaryMetricsComponentProps = {
  totals: ExecutionsTotals;
};

export const TWESummaryMetricsComponent = ({ totals }: TWESummaryMetricsComponentProps) => {
  return (
    <Fragment>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Pass/Fail Ratio">
            <Typography variant="h5">
              {(totals.passed * 100 / totals.results).toFixed(2) || 0}%
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Failed Executions">
            <Typography variant="h5">
              {totals.failed}
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Total Executions">
            <Typography variant="h5">
              {totals.results}
            </Typography>
          </InfoCard>
        </Grid>
      </Grid>
    </Fragment>
  )
};
