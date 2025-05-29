import React, { Fragment } from "react";
import { Button, Grid, IconButton, ListItem, Menu, MenuItem, Tooltip, Typography } from "@material-ui/core";
import { CodeSnippet, InfoCard, LinkButton, LogViewer, Table, TableColumn } from "@backstage/core-components";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArticleIcon from '@mui/icons-material/Article';
import { Dialog, DialogActions, DialogContent, DialogTitle, List } from "@mui/material";


export const TestkubeEntityPage = () => {
  const [open, setOpen] = React.useState(false);

  const testWorkflowsColumns: TableColumn[] = [
    { title: "Name", field: "name", render: (rowData: any) => (
      <LinkButton onClick={handleClickOpen} color="primary" to={""}>
        <span style={{ fontWeight: "bold", textTransform: "none" }}>{rowData.name}</span>
      </LinkButton>
    )},
    { title: "Last execution", field: "lastExecution", render: (rowData: any) => {
      const [openLogDialog, setOpenLogDialog] = React.useState(false);
      const closeLogDialog = () => {
        setOpenLogDialog(false);
      };
      return (<Fragment>
        <span style={{ paddingRight: "10px", textTransform: "none" }}>{rowData.lastExecution}</span>
        <Tooltip title="Show execution logs"><IconButton
          aria-label="more"
          id="long-button"
          aria-controls={undefined}
          aria-expanded={undefined}
          aria-haspopup="true"
          onClick={() => { setOpenLogDialog(true); }}>
          <ArticleIcon />
        </IconButton></Tooltip>
        <Dialog
          maxWidth="md"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          fullScreen
          open={openLogDialog}
          onClose={closeLogDialog}>
          <DialogTitle id="dialog-title">
            Execution Log Output: {rowData.lastExecution}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} direction="row" alignItems="stretch" style={{ minHeight: "300px" }}>
              <Grid item xs={12} sm={4} md={3}>
                <InfoCard>
                  <List>
                    <ListItem button>
                      <span style={{ fontWeight: "bold", textTransform: "none" }}>Initializing</span>
                    </ListItem>
                    <ListItem button>
                      <span style={{ fontWeight: "bold", textTransform: "none" }}>Clone Git Repository</span>
                    </ListItem>
                    <ListItem button>
                      <span style={{ fontWeight: "bold", textTransform: "none" }}>Run test</span>
                    </ListItem>
                  </List>
                </InfoCard>
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <div style={{ minHeight: "300px" }}>
                  <LogViewer text={`
No logs
No logs
No logs
No logs
No logs
                  `}></LogViewer>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={closeLogDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Fragment>)
    }},
    { title: "Status", field: "status" },
    { title: "Duration", field: "duration" },
    { title: "Created at", field: "createdAt" },
    { title: "", field: "actions", width: "5px", sorting: false, render: (rowData: any) => {
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);
      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      return (
      <Fragment>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slot="menu"
        >
          <MenuItem onClick={handleClose}>
            Executions history
          </MenuItem>
          <MenuItem onClick={handleClose}>
            Run
          </MenuItem>
        </Menu>
      </Fragment>
    )}}
  ];

  let data = [
    {
      name: "k6-sample",
      lastExecution: "k6-sample-10",
      status: "Passed",
      duration: "1m 30s",
      createdAt: "2023-10-01 12:00:00"
    }
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: any) => {
    event.stopPropagation();
    setOpen(false);
  };

  // TODO: refactor this metrics grid used in the dashboard as well, it should be a reusable component
  return (
    <Fragment>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Pass/Fail Ratio">
            <Typography variant="h5">
              0%
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Failed Executions">
            <Typography variant="h5">
              0
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard title="Total Executions">
            <Typography variant="h5">
              0
            </Typography>
          </InfoCard>
        </Grid>
      </Grid>
      <br />
      <Table columns={testWorkflowsColumns} title="Test Workflows" options={{ paging: false }} data={data}>
      </Table>
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
}
