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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [open, setOpen] = React.useState(false);
  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setIsRefreshing(true);
      const yaml = await TestkubeAPI.getTestWorkflow(name);
      console.log('Yaml:', yaml);
      setYaml(yaml.toString());
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      if (isInitial) setLoading(false);
      else setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
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
          Test Workflow Manifest {isRefreshing && "- Refreshing data ..."}
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
