import React, { Fragment, useState } from 'react';
import { Button } from '@material-ui/core';
import { CodeSnippet, LinkButton } from '@backstage/core-components';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading';
import { useApi } from '@backstage/frontend-plugin-api';
import { testkubeApiRef } from '../../../api';

type ShowManifestDialogProps = {
  name: string;
};

export const ShowManifestDialog: React.FC<ShowManifestDialogProps> = ({
  name,
}) => {
  const TestkubeAPI = useApi(testkubeApiRef);
  const [yaml, setYaml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [open, setOpen] = React.useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await TestkubeAPI.getTestWorkflow(name);
      setYaml(result);
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
      <LinkButton onClick={handleClickOpen} color="primary" to="">
        <span style={{ fontWeight: 'bold', textTransform: 'none' }}>
          {name}
        </span>
      </LinkButton>
      <Dialog
        maxWidth="md"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="dialog-title">Test Workflow Manifest</DialogTitle>
        <DialogContent>
          {loading && <Loading />}
          {!loading && !error && (
            <CodeSnippet language="yaml" showLineNumbers text={yaml} />
          )}
          {error && <Error error={error} />}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
