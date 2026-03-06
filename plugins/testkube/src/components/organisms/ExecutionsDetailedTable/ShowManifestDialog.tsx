import React from 'react';
import { LinkButton } from '@backstage/core-components';

type ShowManifestDialogProps = {
  name: string;
  onOpen(): void;
};

export const ShowManifestDialog: React.FC<ShowManifestDialogProps> = ({
  name,
  onOpen,
}) => (
  <LinkButton onClick={onOpen} color="primary" to="">
    <span style={{ fontWeight: 'bold', textTransform: 'none' }}>{name}</span>
  </LinkButton>
);
