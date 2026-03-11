import { Button } from '@material-ui/core';
import { CodeSnippet } from '@backstage/core-components';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Error } from '../../molecules/Error';
import { Loading } from '../../molecules/Loading';
import { useTestWorkflow } from '../../../hooks/useApi';

type ManifestDialogProps = {
  name: string;
  isOpen: boolean;
  onClose(): void;
};

export const ManifestDialog: React.FC<ManifestDialogProps> = ({
  name,
  isOpen,
  onClose,
}) => {
  const { data: yaml = '', isLoading, error } = useTestWorkflow(name);

  return (
    <Dialog
      maxWidth="md"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle id="dialog-title">Test Workflow Manifest</DialogTitle>
      <DialogContent>
        {isLoading && <Loading />}
        {!isLoading && !error && (
          <CodeSnippet language="yaml" showLineNumbers text={yaml} />
        )}
        {error && <Error error={error} />}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
