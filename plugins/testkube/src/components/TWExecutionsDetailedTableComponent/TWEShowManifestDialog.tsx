import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { CodeSnippet, LinkButton } from "@backstage/core-components";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { TestkubeErrorPage } from "../../utils/TestkubeErrorComponent";
import { TestkubeLoadingComponent } from "../../utils/TestkubeLoadingComponent";
import { useApi } from "@backstage/frontend-plugin-api";
import { testkubeApiRef } from "../../api";

type TWEShowManifestDialogProps = {
  name: string;
}

export const TWEShowManifestDialog = ({ name }: TWEShowManifestDialogProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [yaml, setYaml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [open, setOpen] = React.useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const yaml = await TestkubeAPI.getTestWorkflow(name);
      setYaml(yaml);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    fetchData();
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
          Test Workflow Manifest
        </DialogTitle>
        <DialogContent>
          {loading && <TestkubeLoadingComponent/>}
          {(!loading && !error) && <CodeSnippet language="yaml" showLineNumbers text={yaml}></CodeSnippet>}
          {error && <TestkubeErrorPage error={error}></TestkubeErrorPage>}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  </Fragment>
  );
};
