import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync, unlinkSync, mkdtempSync } from 'node:fs';

import ConfigService, { type Config } from './configService';

const baseConfig = (overrides: Partial<Config> = {}): Config => ({
  url: 'https://api.testkube.io',
  isEnterprise: false,
  skipTlsVerify: false,
  organizations: [],
  ...overrides,
});

describe('ConfigService.validate', () => {
  const configService = ConfigService();

  it('returns no errors for a valid minimal config', () => {
    const errors = configService.validate(baseConfig());
    expect(errors).toEqual([]);
  });

  it('returns an error when url is empty', () => {
    const errors = configService.validate(baseConfig({ url: '' }));
    expect(errors).toContain('Testkube API URL is required');
  });

  describe('caFilePath validation', () => {
    let tmpDir: string;
    let validCaPath: string;

    beforeAll(() => {
      tmpDir = mkdtempSync(join(tmpdir(), 'configService-test-'));
      validCaPath = join(tmpDir, 'ca.pem');
      writeFileSync(
        validCaPath,
        '-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----\n',
      );
    });

    afterAll(() => {
      try {
        unlinkSync(validCaPath);
      } catch {
        // ignore
      }
    });

    it('returns no errors when caFilePath points to a readable file', () => {
      const errors = configService.validate(
        baseConfig({ caFilePath: validCaPath }),
      );
      expect(errors).toEqual([]);
    });

    it('returns an error when caFilePath points to a non-existent file', () => {
      const errors = configService.validate(
        baseConfig({ caFilePath: '/tmp/does-not-exist-ca.pem' }),
      );
      expect(errors).toContain(
        "CA certificate file is not readable at '/tmp/does-not-exist-ca.pem'",
      );
    });

    it('skips caFilePath validation when skipTlsVerify is true', () => {
      const errors = configService.validate(
        baseConfig({
          caFilePath: '/tmp/does-not-exist-ca.pem',
          skipTlsVerify: true,
        }),
      );
      expect(errors).toEqual([]);
    });

    it('returns no errors when caFilePath is undefined', () => {
      const errors = configService.validate(
        baseConfig({ caFilePath: undefined }),
      );
      expect(errors).toEqual([]);
    });
  });
});
