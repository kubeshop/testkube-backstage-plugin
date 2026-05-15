import { TESTKUBE_LABELS } from '../constants/annotations';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';

export const useLabels = (): string | undefined => {
  const { entity } = useEntity();
  return entity.metadata.annotations?.[TESTKUBE_LABELS];
};

export const isTestkubeAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[TESTKUBE_LABELS]);
