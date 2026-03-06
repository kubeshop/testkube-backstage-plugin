import { useQuery } from '@tanstack/react-query';
import { useApi } from '@backstage/core-plugin-api';

import { testkubeApiRef } from '../api';
import { useOrgEnv } from '../context';

export const useConfig = () => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testkube', 'config'],
    queryFn: () => TestkubeAPI.getConfig(),
  });
};

type UseOrganizationsProps = {
  isEnterprise: boolean;
};

export const useOrganizations = ({ isEnterprise }: UseOrganizationsProps) => {
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testkube', 'organizations'],
    queryFn: () => TestkubeAPI.getOrganizations(),
    enabled: isEnterprise ?? false,
  });
};

type UseEnvironmentsProps = {
  isEnterprise: boolean;
};

export const useEnvironments = ({ isEnterprise }: UseEnvironmentsProps) => {
  const { orgIndex } = useOrgEnv();
  const TestkubeAPI = useApi(testkubeApiRef);

  return useQuery({
    queryKey: ['testkube', 'environments', orgIndex],
    queryFn: () => TestkubeAPI.getEnvironments(orgIndex!),
    enabled: orgIndex !== null && isEnterprise,
  });
};
