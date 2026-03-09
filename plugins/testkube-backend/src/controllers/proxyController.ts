import { Request, Response } from 'express';
import type { LoggerService } from '@backstage/backend-plugin-api';
import ProxyService from '../services/proxyService';
import EnterpriseService from '../services/enterpriseService';

type ProxyController = {
  handle(req: Request, res: Response): Promise<void>;
};

type ProxyControllerParams = {
  proxyService: ProxyService;
  enterpriseService: EnterpriseService;
  logger: LoggerService;
};

export const ORG_HEADER = 'x-org-index';
export const ENV_HEADER = 'x-env-slug';

const ProxyController = ({
  proxyService,
  enterpriseService,
  logger,
}: ProxyControllerParams): ProxyController => ({
  async handle({ method, body, url: path, headers }: Request, res: Response) {
    const orgIndexHeader = headers[ORG_HEADER];
    const envSlugHeader = headers[ENV_HEADER] as string | undefined;

    logger.debug('Proxying Testkube request', {
      method,
      path,
      orgIndexHeader,
      envSlugHeader,
    });

    try {
      const requestData = await enterpriseService.getRequest({
        orgIndex: Number(orgIndexHeader),
        envSlug: envSlugHeader ?? '',
      });

      const response = await proxyService.send({
        path,
        method,
        body,
        incomingHeaders: headers as Record<
          string,
          string | string[] | undefined
        >,

        ...requestData,
      });

      const headersToForward: Record<string, string> = {};
      const skipHeaders = new Set([
        'content-encoding',
        'content-length',
        'transfer-encoding',
        'connection',
      ]);

      response.headers.forEach((value, key) => {
        if (!skipHeaders.has(key.toLowerCase())) {
          headersToForward[key] = value;
        }
      });

      const buffer = await response.arrayBuffer();
      res
        .status(response.status)
        .set(headersToForward)
        .send(Buffer.from(buffer));

      logger.info('Proxied Testkube request', {
        method,
        path,
        status: response.status,
      });
    } catch (error) {
      logger.error('Failed to proxy Testkube request', {
        method,
        path,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
});

export default ProxyController;
