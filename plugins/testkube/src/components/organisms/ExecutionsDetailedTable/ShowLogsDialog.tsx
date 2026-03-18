import { useCallback } from 'react';
import { LinkButton } from '@backstage/core-components';

import { useEnterpriseNavigation } from '../../../hooks/useEnterpriseNavigation';

type ShowLogsDialogProps = {
  executionName: string;
  executionId: string;
  onOpen(): void;
  small?: boolean;
};

export const ShowLogsDialog: React.FC<ShowLogsDialogProps> = ({
  executionName,
  executionId,
  onOpen,
}) => {
  const { shouldNavigateToUi, navigate } = useEnterpriseNavigation();

  const handleClick = useCallback(() => {
    if (shouldNavigateToUi) {
      navigate(`dashboard/executions/${executionId}`);
      return;
    }

    onOpen();
  }, [shouldNavigateToUi, onOpen, navigate, executionId]);

  return (
    <>
      <LinkButton onClick={handleClick} color="primary" to="">
        <span style={{ fontWeight: 'bold', textTransform: 'none' }}>
          {executionName}
        </span>
      </LinkButton>
    </>
  );
};
