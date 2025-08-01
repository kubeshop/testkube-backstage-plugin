import React, { Fragment, useState } from "react";
import { Button, Grid, IconButton, ListItem, ListSubheader, Tooltip } from "@material-ui/core";
import { InfoCard, LogViewer, StatusAborted, StatusError, StatusOK, StatusPending, StatusRunning } from "@backstage/core-components";
import ArticleIcon from '@mui/icons-material/Article';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import { useApi } from "@backstage/frontend-plugin-api";
import { testkubeApiRef } from "../../api";
import { components } from "../../types";
import { TestkubeLoadingComponent } from "../../utils/TestkubeLoadingComponent";
import { TestkubeErrorPage } from "../../utils/TestkubeErrorComponent";
import { sleep } from "../../utils/functions";

type TWEShowLogsDialogProps = {
  workflowName: string;
  executionName: string;
  executionId: string;
  small?: boolean;
};

export const TWEShowLogsDialog = ({ workflowName, executionName, executionId, small = true } : TWEShowLogsDialogProps) => {
  const [open, setOpenLogDialog] = React.useState(false);
  const TestkubeAPI = useApi(testkubeApiRef);
  const [stepsList, setStepsList] = useState<React.ReactNode>();
  const [logs, setLogs] = useState<string>('');
  const [loadingLog, setLoadingLog] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [logError, setLogError] = useState<Error | null>(null);

  const sliceLines = (fullLog: string, stepRef: string) => {
    const lines = fullLog.split('\n');
    if (lines.length === 0) return fullLog;
    let streamStarted = false;
    let isDone = false;
    return lines.filter((line, i) => {
      if ((stepRef === 'init' && i === 0) || (stepRef && line.startsWith(`${stepRef}start`))) {
        streamStarted = true
        return stepRef === '' ? streamStarted : !streamStarted;
      }
      if (streamStarted && /^\\\[a-z0-9]{7}\start\$/.test(line)) {
        isDone = true
        return !isDone;
      }
      return !isDone && streamStarted;
    }).join('\n');
  }
  const loadLog = async (stepRef: string) => {
    try {
      setLoadingLog(true);
      await sleep(1000)
      const log = await TestkubeAPI.getTestWorkflowExecutionLog(workflowName, executionId);
      const slicedLog = sliceLines(log, stepRef);
      setLogs(slicedLog);
      setLogError(null);
    } catch (err: any) {
      setLogError(err);
    } finally {
      setLoadingLog(false);
    }
  };
  const checkStepStatus = (stepName: string, status?: string) => {
    switch (status) {
      case 'passed':
        return (<StatusOK>{stepName}</StatusOK>);
      case 'failed':
        return (<StatusError>{stepName}</StatusError>);
      case 'aborted':
        return (<StatusAborted>{stepName}</StatusAborted>);
      case 'running':
        return (<StatusRunning>{stepName}</StatusRunning>);
      case 'paused':
        return (<StatusAborted>{stepName}</StatusAborted>);
      default:
        return (<StatusPending>{stepName}</StatusPending>);
    }
  }
  const generateStepsList = (execution: components["schemas"]["TestWorkflowExecution"]) => {
    const rows = execution.signature?.map(element => {
      if (element.children) {
        const childrenRows = element.children.map(children => {
          return (
            <ListItem button id={children.ref} style={{ paddingLeft: '40px'}} key={children.ref} onClick={() => {
              loadLog(children.ref || '');
            }}>
              {checkStepStatus(children.name || children.category || 'Undefined', execution.result?.steps[element.ref || ''].status)}
            </ListItem>
          )
        })
        return (
          <div>
            <ListItem button id={element.ref} key={element.ref} onClick={() => {
              loadLog(element.children ? element.children[0].ref || '' : '');
            }}>
              {checkStepStatus(element.name || element.category || 'Undefined', execution.result?.steps[element.ref || ''].status)}
            </ListItem>
            {childrenRows}
          </div>
        )
      }
      return (
        <ListItem button id={element.ref} key={element.ref} onClick={() => {
          loadLog(element.ref || '');
        }}>
          {checkStepStatus(element.name || element.category || 'Undefined', execution.result?.steps[element.ref || ''].status)}
        </ListItem>
      )
    });
    return (<List component="nav" id="steps" aria-labelledby="nested-list-subheader" subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Steps:
      </ListSubheader>
    }>
      <ListItem button id="init" key="init" onClick={() => {
        loadLog('init');
      }}>
        {checkStepStatus('Initializing', execution.result?.initialization.status)}
      </ListItem>
      {rows}
    </List>)
  }
  const fetchData = async () => {
    try {
      setLoading(true);
      const execution = await TestkubeAPI.getTestWorkflowExecutionById(workflowName, executionId);
      setStepsList(generateStepsList(execution));
      loadLog('init');
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const openLogDialog = () => {
    fetchData()
    setOpenLogDialog(true);
  }
  const closeLogDialog = () => {
    setOpenLogDialog(false);
  };
  const dialogContent = (
    <Grid container spacing={3} direction="row" alignItems="stretch" style={{ minHeight: "300px" }}>
      <Grid item xs={12} sm={4} md={3}>
        <InfoCard>
          {stepsList}
        </InfoCard>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <InfoCard>
          {loadingLog && <TestkubeLoadingComponent/>}
          {(!loadingLog && !logError) && <div style={{ minHeight: "300px" }}>
            <LogViewer  text={logs} />
          </div>}
          {logError && <TestkubeErrorPage error={logError} />}
        </InfoCard>
      </Grid>
    </Grid>
  )
  return (<Fragment>
    <Tooltip title="Show execution logs"><IconButton
      aria-label="more"
      id="long-button"
      aria-controls={undefined}
      aria-expanded={undefined}
      aria-haspopup="true"
      onClick={openLogDialog}>
      <ArticleIcon />
    </IconButton></Tooltip>
    {small && <span style={{ paddingRight: "10px", textTransform: "none" }}>{executionName}</span>}
    <Dialog
      maxWidth="md"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullScreen
      open={open}
      onClose={closeLogDialog}>
      <DialogTitle id="dialog-title">
        Execution Log Output: {executionName}
      </DialogTitle>
      <DialogContent>
        {loading && <TestkubeLoadingComponent/>}
        {(!loading && !error) && dialogContent}
        {error && <TestkubeErrorPage error={error} />}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={closeLogDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  </Fragment>)
}
