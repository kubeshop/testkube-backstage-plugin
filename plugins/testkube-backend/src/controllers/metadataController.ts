import { Request, Response } from 'express';
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '../services/configService';
import EnterpriseService from '../services/enterpriseService';

type MetadataController = {
  getOrganizations(req: Request, res: Response): void;
  getEnvironments(req: Request, res: Response): Promise<void>;
  getConfig(req: Request, res: Response): void;
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
  getOrganizations(_req: Request, res: Response) {
    logger.debug('Listing Testkube organizations metadata', {
      organizationCount: config.organizations.length,
    });

    const organizations = config.organizations.map((org, index) => ({
      index,
      id: org.id,
    }));

    res.json({ organizations });
  },

  async getEnvironments({ params: { index } }: Request, res: Response) {
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

    const org = config.organizations[orgIndex];

    try {
      logger.debug('Fetching Testkube environments', {
        orgId: org.id,
      });
      const environments = await enterpriseService.getEnvironments({ org });
      res.json({ environments });
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
});

export default MetadataController;
