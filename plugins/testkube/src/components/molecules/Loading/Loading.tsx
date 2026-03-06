import React from 'react';
import { Typography } from '@material-ui/core';
import { Progress } from '@backstage/core-components';

export const Loading = () => (
  <>
    <Typography variant="h5">Loading data ...</Typography>
    <br />
    <Progress />
  </>
);
