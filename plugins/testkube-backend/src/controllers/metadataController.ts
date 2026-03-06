import { Request, Response } from 'express';
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
};

const MetadataController = ({
  config,
  enterpriseService,
}: MetadataControllerParams): MetadataController => ({
  getOrganizations(_req: Request, res: Response) {
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
      res.status(400).json({ error: 'Invalid organization index' });
      return;
    }

    const org = config.organizations[orgIndex];

    try {
      const environments = await enterpriseService.getEnvironments({ org });
      res.json({ environments });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch environments',
      });
    }
  },

  getConfig(_req: Request, res: Response) {
    res.json({
      isEnterprise: config.isEnterprise,
      organizationCount: config.organizations.length,
    });
  },
});

export default MetadataController;
