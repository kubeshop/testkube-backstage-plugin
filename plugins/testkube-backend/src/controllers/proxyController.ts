import { Request, Response } from 'express';
import ProxyService from '../services/proxyService';
import EnterpriseService from '../services/enterpriseService';

type ProxyController = {
  handle(req: Request, res: Response): Promise<void>;
};

type ProxyControllerParams = {
  proxyService: ProxyService;
  enterpriseService: EnterpriseService;
};

export const ORG_HEADER = 'x-org-index';
export const ENV_HEADER = 'x-env-slug';

const ProxyController = ({
  proxyService,
  enterpriseService,
}: ProxyControllerParams): ProxyController => ({
  async handle({ method, body, url: path, headers }: Request, res: Response) {
    const requestData = await enterpriseService.getRequest({
      orgIndex: Number(headers[ORG_HEADER]),
      envSlug: headers[ENV_HEADER] as string,
    });

    const response = await proxyService.send({
      path,
      method,
      body,
      incomingHeaders: headers as Record<string, string | string[] | undefined>,

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
    res.status(response.status).set(headersToForward).send(Buffer.from(buffer));
  },
});

export default ProxyController;
