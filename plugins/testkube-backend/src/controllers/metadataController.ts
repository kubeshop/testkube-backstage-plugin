import { Request, Response } from 'express';
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '../services/configService';
import EnterpriseService from '../services/enterpriseService';
import { ENV_HEADER, ORG_HEADER } from './proxyController';

type MetadataController = {
  getOrganizations(req: Request, res: Response): void;
  getEnvironments(req: Request, res: Response): Promise<void>;
  getConfig(req: Request, res: Response): void;
  getRedirectUrl(req: Request, res: Response): void;
};

type MetadataControllerParams = {
  config: Config;
  enterpriseService: EnterpriseService;
  logger: LoggerService;
};

const MetadataController = ({
  config,
  enterpriseService,
  logger,
}: MetadataControllerParams): MetadataController => ({
  async getOrganizations(_req, res) {
    const organizations = await enterpriseService.getOrganizationMetadataList();

    res.json({
      organizations: organizations.map((org, index) => ({
        index,
        id: org.name,
      })),
    });
  },

  async getEnvironments({ params: { index } }, res) {
    const orgIndex = parseInt(index, 10);

    if (
      isNaN(orgIndex) ||
      orgIndex < 0 ||
      orgIndex >= config.organizations.length
    ) {
      logger.warn('Invalid organization index for Testkube environments', {
        index,
      });
      res.status(400).json({ error: 'Invalid organization index' });
      return;
    }

    const org = enterpriseService.getOrganization({ orgIndex });
    if (!org) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    try {
      logger.debug('Fetching Testkube environments', {
        orgId: org.id,
      });
      const environments = await enterpriseService.getEnvironments({ org });
      res.json({
        environments: environments.map(env => ({
          id: env.slug,
          slug: env.slug,
          name: env.name,
        })),
      });
    } catch (error) {
      logger.error('Failed to fetch Testkube environments', {
        orgId: org.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch environments',
      });
    }
  },

  getConfig(_req: Request, res: Response) {
    logger.debug('Getting Testkube configuration summary', {
      isEnterprise: config.isEnterprise,
      organizationCount: config.organizations.length,
    });
    res.json({
      isEnterprise: config.isEnterprise,
      organizationCount: config.organizations.length,
    });
  },

  async getRedirectUrl({ headers }, res) {
    const orgIndex = Number(headers[ORG_HEADER]);
    const envSlug = headers[ENV_HEADER] as string;

    const org = enterpriseService.getOrganization({ orgIndex });
    if (!org) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const metadata = await enterpriseService.getOrganizationMetadata({
      orgId: org.id,
    });

    if (!metadata) {
      res.status(404).json({ error: 'Organization metadata not found' });
      return;
    }

    const environment = await enterpriseService.getEnvironment({
      org,
      envSlug,
    });
    if (!environment) {
      res.status(404).json({ error: 'Environment not found' });
      return;
    }

    const redirectUrl = `${config.uiUrl}/organization/${metadata.slug}/environment/${environment.slug}`;

    res.status(200).json({
      url: redirectUrl,
    });
  },
});

export default MetadataController;
