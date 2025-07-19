import { TESTKUBE_LABELS, TESTKUBE_ENVIRONMENTS, TESTKUBE_ORGANIZATION } from './annotations';
import { Entity } from '@backstage/catalog-model';
import { useApi, configApiRef } from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';

export const isTestkubeAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[TESTKUBE_LABELS]);


/**
 * Retorna los labels de testkube desde la entidad del catálogo.
 */
export const useTestkubeLabels = (): string => {
  const { entity } = useEntity();
  const labels = entity.metadata.annotations?.[TESTKUBE_LABELS];
  if (!labels) {
    throw new Error("'testkube.io/labels' annotation is missing in the entity");
  }
  return labels;
};

/**
 * Retorna la organización desde las anotaciones (enterprise).
 */
export const getTestkubeOrganization = (entity: Entity): string => {
  const value = entity.metadata.annotations?.[TESTKUBE_ORGANIZATION];
  if (!value) {
    throw new Error("'testkube.io/organization' annotation is missing in the entity");
  }
  return value;
};

/**
 * Retorna un array con los entornos desde las anotaciones (enterprise).
 */
export const getTestkubeEnvironments = (entity: Entity): string[] => {
  const value = entity.metadata.annotations?.[TESTKUBE_ENVIRONMENTS];
  if (!value) {
    throw new Error("'testkube.io/environments' annotation is missing in the entity");
  }
  return value.split(',').map(env => env.trim()).filter(Boolean);
};

export const useIsEnterpriseEnabled = (): boolean => {
  const config = useApi(configApiRef);
  return config.getOptionalBoolean('testkube.enterprise') ?? false;
};

