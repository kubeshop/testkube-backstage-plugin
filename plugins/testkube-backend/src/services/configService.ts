import type { Config as BackstageConfig } from '@backstage/config';

export type Config = {
  url: string;
  isEnterprise: boolean;
  uiUrl?: string;

  organizations: {
    id: string;
    apiKey: string;
  }[];
};

type ConfigService = {
  getFromBackstage(backstageConfig: BackstageConfig): Config;
  validate(config: Config): string[];
};

const DEFAULT_API_URL = 'http://localhost:8088';

const ConfigService = (): ConfigService => ({
  getFromBackstage(backstageConfig) {
    const baseUrl =
      backstageConfig.getOptionalString('testkube.apiUrl') ?? DEFAULT_API_URL;
    const uiUrl =
      backstageConfig.getOptionalString('testkube.uiUrl') ?? undefined;

    const isEnterprise =
      backstageConfig.getOptionalBoolean('testkube.enterprise') ?? false;

    const organizations = (
      backstageConfig.getOptionalConfigArray('testkube.organizations') ?? []
    ).map(config => ({
      id: config.getString('id') ?? '',
      apiKey: config.getString('apiKey') ?? '',
    }));

    return {
      url: baseUrl.replace(/\/$/, ''),
      uiUrl: uiUrl?.replace(/\/$/, ''),
      isEnterprise,
      organizations,
    };
  },

  validate(config: Config) {
    const errors: string[] = [];
    if (!config.url) {
      errors.push('Testkube API URL is required');
    }

    if (config.isEnterprise && config.organizations.length === 0) {
      errors.push('Testkube organizations are required for enterprise mode');
    }

    if (config.isEnterprise && !config.uiUrl) {
      errors.push('Testkube UI URL is required for enterprise mode');
    }

    return errors;
  },
});

export default ConfigService;
