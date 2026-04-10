import {
  Agent,
  fetch as undiciFetch,
  type Response as UndiciResponse,
} from 'undici';

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from './configService';

type IncomingHeaders = Record<string, string | string[] | undefined>;

type ProxyService = {
  send(params: {
    path: string;
    method: RequestInit['method'] | string;
    body?: object;
    incomingHeaders?: IncomingHeaders;

    // only available for enterprise mode
    orgId?: string;
    envId?: string;
    apiKey?: string;
  }): Promise<UndiciResponse>;
};

type ProxyServiceParams = {
  config: Config;
  logger: LoggerService;
};

const getTargetUrl = (
  baseUrl: string,
  path: string,
  orgId?: string,
  envId?: string,
) => {
  const parts: string[] = [baseUrl];
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (orgId) {
    parts.push(`/organizations/${orgId}`);
  }

  if (envId) {
    parts.push(`/environments/${envId}/agent`);
  }

  return `${parts.join('')}${
    orgId || envId ? normalizedPath.replace('/v1', '') : normalizedPath
  }`;
};

const skipHeaders = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-length',
  'authorization',
  'cookie',
  'x-org-index',
  'x-env-slug',
]);

const buildHeaders = (
  incomingHeaders?: IncomingHeaders,
  apiKey?: string,
): Record<string, string> => {
  const headers: Record<string, string> = {
    'User-Agent': 'backstage-testkube-backend',
  };

  if (incomingHeaders) {
    for (const [key, value] of Object.entries(incomingHeaders)) {
      if (value && !skipHeaders.has(key.toLowerCase())) {
        headers[key] = Array.isArray(value) ? value.join(', ') : value;
      }
    }
  }

  if (!headers.Accept) {
    headers.Accept = 'application/json';
  }

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
};

const ProxyService = ({
  config,
  logger,
}: ProxyServiceParams): ProxyService => ({
  async send({ path, method, body, incomingHeaders, orgId, envId, apiKey }) {
    const targetUrl = getTargetUrl(config.url, path, orgId, envId);
    const headers = buildHeaders(incomingHeaders, apiKey);

    logger.debug('Sending request to Testkube API', {
      method,
      path,
      targetUrl,
      hasOrgId: !!orgId,
      hasEnvId: !!envId,
    });

    try {
      const response = await undiciFetch(targetUrl, {
        method,
        headers,
        body:
          body && !['GET', 'DELETE'].includes(method as string)
            ? JSON.stringify(body)
            : undefined,
        ...(config.skipTlsVerify
          ? {
              dispatcher: new Agent({ connect: { rejectUnauthorized: false } }),
            }
          : {}),
      });

      logger.info('Received response from Testkube API', {
        method,
        path,
        status: response.status,
      });

      return response;
    } catch (error) {
      const cause =
        error instanceof Error && 'cause' in error
          ? (error.cause as Error)?.message ?? error.cause
          : undefined;
      logger.error('Network error while calling Testkube API', {
        method,
        path,
        targetUrl,
        error: error instanceof Error ? error.message : 'Unknown network error',
        cause,
      });
      throw error;
    }
  },
});

export default ProxyService;
