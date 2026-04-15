import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs';

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from './configService';

// Mock undici so we can inspect the dispatcher passed to fetch
const mockFetch = jest.fn().mockResolvedValue({
  status: 200,
  ok: true,
  json: async () => ({}),
});

jest.mock('undici', () => {
  const { Agent } = jest.requireActual('undici');
  return {
    Agent,
    fetch: (...args: unknown[]) => mockFetch(...args),
  };
});

import ProxyService from './proxyService';
import { Agent } from 'undici';

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

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'proxyService-test-'));
    validCaPath = join(tmpDir, 'ca.pem');
    writeFileSync(
      validCaPath,
      '-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----\n',
    );
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    mockFetch.mockClear();
    (mockLogger.info as jest.Mock).mockClear();
    (mockLogger.debug as jest.Mock).mockClear();
  });

  it('passes no dispatcher when neither skipTlsVerify nor caFilePath is set', async () => {
    const proxy = ProxyService({ config: baseConfig(), logger: mockLogger });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    const fetchOptions = mockFetch.mock.calls[0][1];
    expect(fetchOptions.dispatcher).toBeUndefined();
  });

  it('passes an Agent with rejectUnauthorized=false when skipTlsVerify is true', async () => {
    const proxy = ProxyService({
      config: baseConfig({ skipTlsVerify: true }),
      logger: mockLogger,
    });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    const fetchOptions = mockFetch.mock.calls[0][1];
    expect(fetchOptions.dispatcher).toBeInstanceOf(Agent);
  });

  it('passes an Agent with ca when caFilePath is set', async () => {
    const proxy = ProxyService({
      config: baseConfig({ caFilePath: validCaPath }),
      logger: mockLogger,
    });
    await proxy.send({ path: '/v1/test', method: 'GET' });

    const fetchOptions = mockFetch.mock.calls[0][1];
    expect(fetchOptions.dispatcher).toBeInstanceOf(Agent);
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

    const fetchOptions = mockFetch.mock.calls[0][1];
    expect(fetchOptions.dispatcher).toBeInstanceOf(Agent);
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
