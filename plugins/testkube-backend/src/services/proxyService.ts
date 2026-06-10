import { readFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { Agent, request as httpsRequest } from 'node:https';

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
  }): Promise<Response>;
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

const getCertBuffer = (
  caFilePath: string | undefined,
  logger: LoggerService,
): Buffer | undefined => {
  if (!caFilePath) return undefined;

  try {
    const caCert = readFileSync(caFilePath);
    logger.info('Loaded custom CA certificate', { path: caFilePath });
    return caCert;
  } catch (error) {
    throw new Error(`Failed to read CA certificate file at '${caFilePath}'`, {
      cause: error,
    });
  }
};

const getDispatcher = (
  config: Config,
  caCert: Buffer | undefined,
  logger: LoggerService,
): Agent | undefined => {
  if (config.skipTlsVerify) {
    logger.info('TLS verification disabled (skipTlsVerify)');
    return new Agent({ connect: { rejectUnauthorized: false } });
  }

  if (caCert) {
    logger.info('Using custom CA certificate for TLS', {
      path: config.caFilePath,
    });

    return new Agent({ connect: { ca: caCert } });
  }

  return undefined;
};

const sendWithAgent = async ({
  targetUrl,
  method,
  headers,
  body,
  agent,
}: {
  targetUrl: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  agent: Agent;
}): Promise<Response> => {
  const url = new URL(targetUrl);
  const requestFn = url.protocol === 'https:' ? httpsRequest : httpRequest;

  return new Promise((resolve, reject) => {
    const request = requestFn(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method,
        headers,
        ...(url.protocol === 'https:' ? { agent } : {}),
      },
      response => {
        const chunks: Buffer[] = [];

        response.on('data', chunk => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on('error', reject);
        response.on('end', () => {
          const responseHeaders = new Headers();

          for (const [key, value] of Object.entries(response.headers)) {
            if (value !== undefined) {
              responseHeaders.set(
                key,
                Array.isArray(value) ? value.join(', ') : String(value),
              );
            }
          }

          resolve(
            new Response(Buffer.concat(chunks), {
              status: response.statusCode ?? 500,
              statusText: response.statusMessage ?? '',
              headers: responseHeaders,
            }),
          );
        });
      },
    );

    request.on('error', reject);
    if (body) {
      request.write(body);
    }
    request.end();
  });
};

const ProxyService = ({ config, logger }: ProxyServiceParams): ProxyService => {
  const caCert = config.skipTlsVerify
    ? undefined
    : getCertBuffer(config.caFilePath, logger);

  logger.debug('Initializing ProxyService with configuration', {
    apiUrl: config.url,
    uiUrl: config.uiUrl,
    isEnterprise: config.isEnterprise,
    skipTlsVerify: config.skipTlsVerify,
    caFilePath: config.caFilePath,
    organizationsCount: config.organizations.length,
  });

  const dispatcher = getDispatcher(config, caCert, logger);

  return {
    async send({ path, method, body, incomingHeaders, orgId, envId, apiKey }) {
      const targetUrl = getTargetUrl(config.url, path, orgId, envId);
      const headers = buildHeaders(incomingHeaders, apiKey);
      const methodValue = String(method);
      const normalizedMethod = methodValue.toUpperCase();
      const requestBody =
        body && !['GET', 'DELETE'].includes(normalizedMethod)
          ? JSON.stringify(body)
          : undefined;

      logger.debug('Sending request to Testkube API', {
        method,
        path,
        targetUrl,
        hasOrgId: !!orgId,
        hasEnvId: !!envId,
      });

      try {
        const response = dispatcher
          ? await sendWithAgent({
              targetUrl,
              method: methodValue,
              headers,
              body: requestBody,
              agent: dispatcher,
            })
          : await fetch(targetUrl, {
              method,
              headers,
              body: requestBody,
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
          error:
            error instanceof Error ? error.message : 'Unknown network error',
          cause,
        });
        throw error;
      }
    },
  };
};

export default ProxyService;
