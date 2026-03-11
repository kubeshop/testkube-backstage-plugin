import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
  type Entity,
} from '@backstage/catalog-model';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
  createSignInResolverFactory,
} from '@backstage/plugin-auth-node';
import {
  githubAuthenticator,
  githubSignInResolvers,
} from '@backstage/plugin-auth-backend-module-github-provider';
import { commonSignInResolvers } from '@backstage/plugin-auth-node';
import fs from 'fs/promises';
import path from 'path';

const ALLOWED_EMAIL_DOMAINS = new Set(['testkube.io', 'kubeshop.io']);
const PROVISIONED_USERS_DIR = '/tmp/backstage-github-users';

const sanitizeEntityName = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, '-')
    .replace(/^-+|-+$/g, '');

const extractEmail = (info: {
  profile: { email?: string };
  result: unknown;
}) => {
  if (info.profile.email) {
    return info.profile.email;
  }

  const fullProfile = (
    info.result as { fullProfile?: { emails?: Array<{ value?: string }> } }
  ).fullProfile;
  const primaryEmail = fullProfile?.emails?.find(email =>
    Boolean(email.value),
  )?.value;
  return primaryEmail;
};

const createUserEntityYaml = (entity: Entity): string => {
  const metadata = entity.metadata ?? {};
  const spec = (entity.spec ?? {}) as {
    profile?: { displayName?: string; email?: string; picture?: string };
  };

  const lines = [
    'apiVersion: backstage.io/v1alpha1',
    'kind: User',
    'metadata:',
    `  name: ${metadata.name}`,
  ];

  if (
    spec.profile?.displayName ||
    spec.profile?.email ||
    spec.profile?.picture
  ) {
    lines.push('spec:', '  profile:');
    if (spec.profile.displayName) {
      const escapedDisplayName = spec.profile.displayName
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
      lines.push(`    displayName: "${escapedDisplayName}"`);
    }
    if (spec.profile.email) {
      const escapedEmail = spec.profile.email
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
      lines.push(`    email: "${escapedEmail}"`);
    }
    if (spec.profile.picture) {
      const escapedPicture = spec.profile.picture
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
      lines.push(`    picture: "${escapedPicture}"`);
    }
  }

  return `${lines.join('\n')}\n`;
};

export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'github-domain-user-provisioning',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        auth: coreServices.auth,
        logger: coreServices.logger,
        catalog: catalogServiceRef,
      },
      async init({ providers, auth, logger, catalog }) {
        const domainUserProvisioning = createSignInResolverFactory({
          create() {
            return async (info, ctx) => {
              const email = extractEmail(info);
              if (!email) {
                throw new Error('GitHub profile does not contain an email');
              }

              const domain = email.split('@')[1]?.toLowerCase();
              if (!domain || !ALLOWED_EMAIL_DOMAINS.has(domain)) {
                throw new Error(
                  `Email domain "${
                    domain ?? 'unknown'
                  }" is not allowed to sign in`,
                );
              }

              const fullProfile = (
                info.result as {
                  fullProfile: {
                    username?: string;
                    displayName?: string;
                  };
                }
              ).fullProfile;
              const usernameCandidate =
                fullProfile.username ?? email.split('@')[0];
              const entityName = sanitizeEntityName(usernameCandidate);
              if (!entityName) {
                throw new Error(
                  'Unable to resolve a valid Backstage user entity name from GitHub profile',
                );
              }

              const userEntityRef = stringifyEntityRef({
                kind: 'User',
                namespace: DEFAULT_NAMESPACE,
                name: entityName,
              });

              const credentials = await auth.getOwnServiceCredentials();
              const existingUser = await catalog.getEntityByRef(userEntityRef, {
                credentials,
              });

              if (!existingUser) {
                const userEntity: Entity = {
                  apiVersion: 'backstage.io/v1alpha1',
                  kind: 'User',
                  metadata: {
                    name: entityName,
                  },
                  spec: {
                    profile: {
                      displayName:
                        info.profile.displayName ?? fullProfile.displayName,
                      email,
                      picture: info.profile.picture,
                    },
                  },
                };

                await fs.mkdir(PROVISIONED_USERS_DIR, { recursive: true });
                const locationTarget = path.join(
                  PROVISIONED_USERS_DIR,
                  `${entityName}.yaml`,
                );
                await fs.writeFile(
                  locationTarget,
                  createUserEntityYaml(userEntity),
                  {
                    encoding: 'utf8',
                  },
                );

                try {
                  await catalog.addLocation(
                    { type: 'file', target: locationTarget },
                    { credentials },
                  );
                } catch (error) {
                  logger.warn(
                    `Failed to register catalog location ${locationTarget}: ${error}`,
                  );
                }
              }

              return ctx.signInWithCatalogUser(
                { entityRef: userEntityRef },
                {
                  dangerousEntityRefFallback: {
                    entityRef: userEntityRef,
                  },
                },
              );
            };
          },
        });

        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            additionalScopes: ['user:email'],
            signInResolverFactories: {
              domainUserProvisioning,
              ...githubSignInResolvers,
              ...commonSignInResolvers,
            },
          }),
        });
      },
    });
  },
});
