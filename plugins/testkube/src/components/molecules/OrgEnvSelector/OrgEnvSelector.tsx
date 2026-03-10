import { useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useOrgEnv } from '../../../context';
import {
  useConfig,
  useEnvironments,
  useOrganizations,
} from '../../../hooks/useMetadata';

export const OrgEnvSelector = () => {
  const { orgIndex, envSlug, setOrgIndex, setEnvSlug } = useOrgEnv();

  const { data: config, isLoading: configLoading } = useConfig();
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizations(
    { isEnterprise: config?.isEnterprise ?? false },
  );

  const { data: environments = [], isLoading: envsLoading } = useEnvironments({
    isEnterprise: config?.isEnterprise ?? false,
  });

  useEffect(() => {
    if (!orgsLoading && organizations.length > 0 && orgIndex === null) {
      setOrgIndex(organizations[0].index);
    }
  }, [orgsLoading, organizations, orgIndex, setOrgIndex]);

  useEffect(() => {
    if (
      !envsLoading &&
      environments.length > 0 &&
      envSlug === null &&
      orgIndex !== null
    ) {
      setEnvSlug(environments[0].slug);
    }
  }, [envsLoading, environments, envSlug, orgIndex, setEnvSlug]);

  if (configLoading || orgsLoading) {
    return <CircularProgress size={20} />;
  }

  if (!config?.isEnterprise) {
    return null;
  }

  const handleOrgChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    const newOrgIndex = typeof value === 'number' ? value : parseInt(value, 10);
    setOrgIndex(newOrgIndex);
    setEnvSlug(null);
  };

  const handleEnvChange = (event: SelectChangeEvent<string>) => {
    setEnvSlug(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="org-select-label">Organization</InputLabel>
        <Select
          labelId="org-select-label"
          value={orgIndex ?? ''}
          label="Organization"
          onChange={handleOrgChange}
          disabled={orgsLoading}
        >
          {organizations.map(org => (
            <MenuItem
              key={org.index}
              value={org.index}
              style={{ paddingLeft: '8px' }}
            >
              {org.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="env-select-label">Environment</InputLabel>
        <Select
          labelId="env-select-label"
          value={envSlug ?? ''}
          label="Environment"
          onChange={handleEnvChange}
          disabled={orgIndex === null || envsLoading}
        >
          {environments.map(env => (
            <MenuItem
              key={env.slug}
              value={env.slug}
              style={{ paddingLeft: '8px' }}
            >
              {env.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
