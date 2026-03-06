import { TESTKUBE_LABELS } from '../constants/annotations';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';

export const useLabels = (): string => {
  const { entity } = useEntity();
  const labels = entity.metadata.annotations?.[TESTKUBE_LABELS];
  if (!labels) {
    throw new Error("'testkube.io/labels' annotation is missing in the entity");
  }
  return labels;
};

export const isTestkubeAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[TESTKUBE_LABELS]);
