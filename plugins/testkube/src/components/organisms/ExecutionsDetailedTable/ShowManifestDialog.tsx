import React, { useCallback } from 'react';
import { LinkButton } from '@backstage/core-components';

import { useEnterpriseNavigation } from '../../../hooks/useEnterpriseNavigation';

type ShowManifestDialogProps = {
  name: string;
  onOpen(): void;
};

export const ShowManifestDialog: React.FC<ShowManifestDialogProps> = ({
  name,
  onOpen,
}) => {
  const { shouldNavigateToUi, navigate } = useEnterpriseNavigation();

  const handleClick = useCallback(() => {
    if (shouldNavigateToUi) {
      navigate(`dashboard/test-workflows/${name}/settings/definition`);
      return;
    }

    onOpen();
  }, [shouldNavigateToUi, onOpen, navigate, name]);

  return (
    <LinkButton onClick={handleClick} color="primary" to="">
      <span style={{ fontWeight: 'bold', textTransform: 'none' }}>{name}</span>
    </LinkButton>
  );
};
