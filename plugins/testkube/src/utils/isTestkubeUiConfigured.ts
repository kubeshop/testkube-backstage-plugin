import { configApiRef, useApi } from '@backstage/frontend-plugin-api';

export const useTestkubeUI = () => {
  const configApi = useApi(configApiRef);
  const testkubeUiUrl = configApi.getOptionalString('testkube.uiUrl');
  return testkubeUiUrl;
};