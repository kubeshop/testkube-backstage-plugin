import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { EventEmitter } from 'node:events';

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from './configService';

const mockHttpsRequest = jest.fn();

jest.mock('node:https', () => {
  const actual = jest.requireActual('node:https');
  return {
    ...actual,
    request: (...args: unknown[]) => mockHttpsRequest(...args),
  };
});

import ProxyService from './proxyService';
import { Agent } from 'node:https';

const mockLogger: LoggerService = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  child: jest.fn().mockReturnThis(),
};

const baseConfig = (overrides: Partial<Config> = {}): Config => ({
  url: 'https://api.testkube.io',
  isEnterprise: false,
  skipTlsVerify: false,
  organizations: [],
  ...overrides,
});

describe('ProxyService TLS configuration', () => {
  let tmpDir: string;
  let validCaPath: string;
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'proxyService-test-'));
    validCaPath = join(tmpDir, 'ca.pem');
    writeFileSync(
      validCaPath,
      '-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----\n',
    );

    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response('{}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    fetchSpy.mockRestore();
  });

  beforeEach(() => {
    fetchSpy.mockClear();
    mockHttpsRequest.mockReset();
    (mockLogger.info as jest.Mock).mockClear();
    (mockLogger.debug as jest.Mock).mockClear();

    mockHttpsRequest.mockImplementation(
      (_options: unknown, callback: (response: EventEmitter) => void) => {
        const response = new EventEmitter() as EventEmitter & {
          statusCode?: number;
          statusMessage?: string;
          headers: Record<string, string>;
        };
        response.statusCode = 200;
        response.statusMessage = 'OK';
        response.headers = { 'content-type': 'application/json' };

        const request = new EventEmitter() as EventEmitter & {
          write: jest.Mock;
          end: jest.Mock;
        };
        request.write = jest.fn();
        request.end = jest.fn(() => {
          callback(response);
          response.emit('data', Buffer.from('{}'));
          response.emit('end');
        });

        return request;
      },
    );
  });

  it('uses global fetch when neither skipTlsVerify nor caFilePath is set', async () => {
    const proxy = ProxyService({ config: baseConfig(), logger: mockLogger });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(mockHttpsRequest).not.toHaveBeenCalled();
  });

  it('uses HTTPS request with custom Agent when skipTlsVerify is true', async () => {
    const proxy = ProxyService({
      config: baseConfig({ skipTlsVerify: true }),
      logger: mockLogger,
    });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mockHttpsRequest).toHaveBeenCalledTimes(1);

    const httpsOptions = mockHttpsRequest.mock.calls[0][0];
    expect(httpsOptions.agent).toBeInstanceOf(Agent);
  });

  it('uses HTTPS request with custom Agent when caFilePath is set', async () => {
    const proxy = ProxyService({
      config: baseConfig({ caFilePath: validCaPath }),
      logger: mockLogger,
    });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mockHttpsRequest).toHaveBeenCalledTimes(1);

    const httpsOptions = mockHttpsRequest.mock.calls[0][0];
    expect(httpsOptions.agent).toBeInstanceOf(Agent);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Using custom CA certificate for TLS',
      expect.objectContaining({ path: validCaPath }),
    );
  });

  it('skipTlsVerify takes precedence over caFilePath', async () => {
    const proxy = ProxyService({
      config: baseConfig({ skipTlsVerify: true, caFilePath: validCaPath }),
      logger: mockLogger,
    });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mockHttpsRequest).toHaveBeenCalledTimes(1);

    const httpsOptions = mockHttpsRequest.mock.calls[0][0];
    expect(httpsOptions.agent).toBeInstanceOf(Agent);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'TLS verification disabled (skipTlsVerify)',
    );
    expect(mockLogger.info).not.toHaveBeenCalledWith(
      'Loaded custom CA certificate',
      expect.anything(),
    );
  });

  it('does not read caFilePath when skipTlsVerify is true (bad path does not throw)', () => {
    expect(() =>
      ProxyService({
        config: baseConfig({
          skipTlsVerify: true,
          caFilePath: '/nonexistent/bad.pem',
        }),
        logger: mockLogger,
      }),
    ).not.toThrow();
  });

  it('throws with cause when caFilePath is unreadable and skipTlsVerify is false', () => {
    expect(() =>
      ProxyService({
        config: baseConfig({ caFilePath: '/nonexistent/bad.pem' }),
        logger: mockLogger,
      }),
    ).toThrow("Failed to read CA certificate file at '/nonexistent/bad.pem'");
  });
});
