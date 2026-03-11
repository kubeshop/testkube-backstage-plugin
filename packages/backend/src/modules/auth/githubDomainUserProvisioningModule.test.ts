import { ConfigReader } from '@backstage/config';
import {
  assertGithubAccessPolicyConfigured,
  isEmailAllowed,
  normalizeAccessEntry,
  readGithubAccessPolicy,
} from './githubDomainUserProvisioningModule';

describe('githubDomainUserProvisioningModule access policy', () => {
  it('normalizes entries by trimming and lowercasing', () => {
    expect(normalizeAccessEntry('  OLE@LENSMAR.COM  ')).toBe('ole@lensmar.com');
  });

  it('allows a user by allowed domain', () => {
    const config = new ConfigReader({
      auth: {
        githubAccess: {
          allowedDomains: ['testkube.io', 'kubeshop.io'],
        },
      },
    });
    const policy = readGithubAccessPolicy(config);

    expect(isEmailAllowed('user@testkube.io', policy)).toBe(true);
  });

  it('allows a user by explicit whitelisted email', () => {
    const config = new ConfigReader({
      auth: {
        githubAccess: {
          allowedDomains: ['testkube.io', 'kubeshop.io'],
          whitelistedEmails: ['user@example.com'],
        },
      },
    });
    const policy = readGithubAccessPolicy(config);

    expect(isEmailAllowed('user@example.com', policy)).toBe(true);
    expect(isEmailAllowed('USER@EXAMPLE.COM', policy)).toBe(true);
  });

  it('denies users that match neither domain nor email whitelist', () => {
    const config = new ConfigReader({
      auth: {
        githubAccess: {
          allowedDomains: ['testkube.io', 'kubeshop.io'],
          whitelistedEmails: ['user@example.com'],
        },
      },
    });
    const policy = readGithubAccessPolicy(config);

    expect(isEmailAllowed('user@unknown.com', policy)).toBe(false);
  });

  it('fails closed when github access config is missing or empty', () => {
    const missingConfig = readGithubAccessPolicy(new ConfigReader({}));
    const emptyConfig = readGithubAccessPolicy(
      new ConfigReader({
        auth: {
          githubAccess: {
            allowedDomains: [],
            whitelistedEmails: [],
          },
        },
      }),
    );

    expect(() => assertGithubAccessPolicyConfigured(missingConfig)).toThrow(
      'GitHub access policy is not configured',
    );
    expect(() => isEmailAllowed('user@testkube.io', missingConfig)).toThrow(
      'GitHub access policy is not configured',
    );
    expect(() => assertGithubAccessPolicyConfigured(emptyConfig)).toThrow(
      'GitHub access policy is not configured',
    );
  });
});
