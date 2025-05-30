import React, { Fragment } from "react";
import { Button, Grid, IconButton, ListItem, Tooltip } from "@material-ui/core";
import { InfoCard, LogViewer } from "@backstage/core-components";
import ArticleIcon from '@mui/icons-material/Article';
import { Dialog, DialogActions, DialogContent, DialogTitle, List } from "@mui/material";

type TWEShowLogsDialogProps = {
  lastExecution: string;
};

export const TWEShowLogsDialog = ({ lastExecution } : TWEShowLogsDialogProps) => {
  const [openLogDialog, setOpenLogDialog] = React.useState(false);
  const closeLogDialog = () => {
    setOpenLogDialog(false);
  };
  return (<Fragment>
    <Tooltip title="Show execution logs"><IconButton
      aria-label="more"
      id="long-button"
      aria-controls={undefined}
      aria-expanded={undefined}
      aria-haspopup="true"
      onClick={() => { setOpenLogDialog(true); }}>
      <ArticleIcon />
    </IconButton></Tooltip>
    <span style={{ paddingRight: "10px", textTransform: "none" }}>{lastExecution}</span>
    <Dialog
      maxWidth="md"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullScreen
      open={openLogDialog}
      onClose={closeLogDialog}>
      <DialogTitle id="dialog-title">
        Execution Log Output: {lastExecution}
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
}
