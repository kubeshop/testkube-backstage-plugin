import React, { Fragment } from "react";
import { Button } from "@material-ui/core";
import { CodeSnippet, LinkButton } from "@backstage/core-components";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type TWEShowManifestDialogProps = {
  name: string;
}

export const TWEShowManifestDialog = ({ name }: TWEShowManifestDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    setOpen(false);
  };
  return (
  <Fragment>
    <LinkButton onClick={handleClickOpen} color="primary" to={""}>
      <span style={{ fontWeight: "bold", textTransform: "none" }}>{name}</span>
    </LinkButton>
    <Dialog
      maxWidth="md"
      fullWidth={true}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}>
        <DialogTitle id="dialog-title">
          Test Workflow Definition
        </DialogTitle>
        <DialogContent>
          <CodeSnippet language="yaml" showLineNumbers text={`kind: TestWorkflow
apiVersion: testworkflows.testkube.io/v1
metadata:
name: k6-sample
namespace: testkube
labels:
docs: example
spec:
content:
files:
- path: /data/example.js
  content: |-
    import http from 'k6/http';
    import { sleep } from 'k6';
    export default function () {
        http.get('https://test.k6.io');
        sleep(1);
    };
steps:
- name: Run Tests
workingDir: /data
run:
  image: grafana/k6:0.49.0
  env:
  - name: K6_WEB_DASHBOARD
    value: "true"
  - name: K6_WEB_DASHBOARD_EXPORT
    value: k6-test-report.html
  args:
  - run
  - example.js
artifacts:
  paths:
  - k6-test-report.html
status: {}`}></CodeSnippet>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  </Fragment>
  );
};
