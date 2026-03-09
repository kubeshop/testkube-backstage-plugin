import { useCallback } from 'react';

import { useConfig } from './useMetadata';
import { useRedirectUrl } from './useApi';

export const useEnterpriseNavigation = () => {
  const { data: backendConfig } = useConfig();

  const shouldNavigateToUi = backendConfig?.isEnterprise ?? false;

  const { data: redirectUrl } = useRedirectUrl();

  const navigate = useCallback(
    async (
      path: string = '',
      target: '_blank' | '_self' = '_blank',
      features = 'noopener,noreferrer',
    ) => {
      if (!shouldNavigateToUi) return;

      window.open(`${redirectUrl}/${path}`, target, features);
    },
    [redirectUrl, shouldNavigateToUi],
  );

  return {
    shouldNavigateToUi,
    navigate,
  };
};
