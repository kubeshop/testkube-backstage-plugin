import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { Progress } from '@backstage/core-components';

export const Loading = () => (
  <Fragment>
    <Typography variant="h5">Loading data ...</Typography>
    <br />
    <Progress />
  </Fragment>
);
