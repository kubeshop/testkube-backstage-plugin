import {
  Environment,
  ListEnvironmentsResponse,
  Organization as OrganizationApi,
} from '../types/api';
import { replaceStringVariables } from '../utils/common';
import CacheService from './cacheService';
import type { Config } from './configService';
import ProxyService from './proxyService';

type EnvironmentMetadata = {
  id: Environment['id'];
  slug: Environment['slug'];
  name: Environment['name'];
};

type Organization = Config['organizations'][number];

type RequestData =
  | {
      orgId: string;
      envId: string;
      apiKey: string;
    }
  | undefined;

type EnterpriseService = {
  getRequest(params: {
    orgIndex: number;
    envSlug: string;
  }): Promise<RequestData>;
  getEnvironments(params: {
    org: Organization;
  }): Promise<EnvironmentMetadata[]>;
  getEnvironment(params: {
    org: Organization;
    envSlug: string;
  }): Promise<EnvironmentMetadata | undefined>;
  getOrganization(params: { orgIndex: number }): Organization | undefined;
  getOrganizationMetadata(params: {
    orgId: string;
  }): Promise<OrganizationApi | undefined>;
  getOrganizationMetadataList(): Promise<OrganizationApi[]>;
};

const CACHE_KEY_ENVIRONMENTS = 'environments-{orgId}';
const CACHE_KEY_REQUEST = 'request-{orgId}-{envSlug}';
const CACHE_KEY_ORGANIZATIONS = 'organizations';
const CACHE_EXPIRATION_ORGANIZATIONS = 60 * 60 * 24; // 24 hours

type EnterpriseServiceParams = {
  config: Config;
  cacheService: CacheService;
  proxyService: ProxyService;
};

const EnterpriseService = ({
  config: { isEnterprise, organizations },
  proxyService,
  cacheService,
}: EnterpriseServiceParams): EnterpriseService => ({
  async getRequest({ orgIndex, envSlug }) {
    if (!isEnterprise) return undefined;

    const org = this.getOrganization({ orgIndex });
    if (!org) throw new Error(`Organization not found at index ${orgIndex}`);
    const { id: orgId, apiKey } = org;

    const cacheKey = replaceStringVariables(CACHE_KEY_REQUEST, {
      orgId,
      envSlug,
    });
    const cacheData = cacheService.get<RequestData>(cacheKey);

    // if has cache, return it
    if (cacheData) return cacheData;

    const environments = await this.getEnvironments({ org });
    const envId = environments.find(env => env.slug === envSlug)?.id;

    if (!!envSlug && !envId)
      throw new Error(`Environment not found with slug ${envSlug}`);

    if (!orgId || !envId || !apiKey) return undefined;

    const requestData: RequestData = { orgId, envId, apiKey };
    cacheService.set(cacheKey, requestData);

    return requestData;
  },
  async getEnvironments({ org: { id: orgId, apiKey } }) {
    const cacheKey = replaceStringVariables(CACHE_KEY_ENVIRONMENTS, {
      orgId,
    });
    const cached = cacheService.get<EnvironmentMetadata[]>(cacheKey);
    if (cached) return cached;

    const response = await proxyService.send({
      path: `/organizations/${orgId}/environments`,
      method: 'GET',
      apiKey,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch environments for organization ${orgId}`);
    }

    const { elements = [] }: ListEnvironmentsResponse = await response.json();

    const environments: EnvironmentMetadata[] = elements.map(
      ({ id, slug, name }) => ({
        id,
        slug,
        name,
      }),
    );

    cacheService.set(cacheKey, environments);

    return environments;
  },
  async getEnvironment({ org: { id: orgId, apiKey }, envSlug }) {
    const environments = await this.getEnvironments({
      org: { id: orgId, apiKey },
    });

    return environments.find(env => env.slug === envSlug);
  },

  getOrganization({ orgIndex }) {
    return organizations[orgIndex];
  },

  async getOrganizationMetadata({ orgId }) {
    const organizationList = await this.getOrganizationMetadataList();

    return organizationList.find(org => org.id === orgId);
  },

  async getOrganizationMetadataList() {
    const cached = cacheService.get<OrganizationApi[]>(CACHE_KEY_ORGANIZATIONS);
    if (cached) return cached;

    const organizationList = await Promise.all(
      organizations.map(async ({ id, apiKey }) => {
        const organization = await proxyService.send({
          path: `/organizations/${id}`,
          method: 'GET',
          apiKey: apiKey,
        });

        if (!organization.ok) {
          throw new Error(`Failed to fetch organization ${id}`);
        }

        const organizationApi: OrganizationApi = await organization.json();

        return organizationApi;
      }),
    );

    cacheService.set(
      CACHE_KEY_ORGANIZATIONS,
      organizationList,
      CACHE_EXPIRATION_ORGANIZATIONS,
    );
    return organizationList;
  },
});

export default EnterpriseService;
