import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import LinkIcon from '@mui/icons-material/Link';

import { Progress, Select, SelectedItems } from '@backstage/core-components';

import { useOrgEnv } from '../../../context';
import {
  useConfig,
  useEnvironments,
  useOrganizations,
} from '../../../hooks/useMetadata';
import { useEnterpriseNavigation } from '../../../hooks/useEnterpriseNavigation';

const links = [
  {
    label: 'Dashboard',
    path: 'dashboard/home',
  },
  {
    label: 'Executions',
    path: 'dashboard/executions',
  },
  {
    label: 'Test Workflows',
    path: 'dashboard/test-workflows',
  },
] as const;

export const OrgEnvSelector = () => {
  const { orgIndex, envSlug, setOrgIndex, setEnvSlug } = useOrgEnv();
  const { navigate } = useEnterpriseNavigation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    return <Progress />;
  }

  if (!config?.isEnterprise) {
    return null;
  }

  const handleOrgChange = (selected: SelectedItems) => {
    const newOrgIndex = parseInt(String(selected), 10);
    setOrgIndex(newOrgIndex);
    setEnvSlug(null);
  };

  const handleEnvChange = (selected: SelectedItems) => {
    setEnvSlug(String(selected));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const orgItems = organizations.map(org => ({
    label: org.id,
    value: String(org.index),
  }));

  const envItems = environments.map(env => ({
    label: env.name,
    value: env.slug,
  }));

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Select
        label="Organization"
        items={orgItems}
        selected={orgIndex !== null ? String(orgIndex) : ''}
        onChange={handleOrgChange}
        disabled={orgsLoading}
        margin="dense"
      />
      <Select
        label="Environment"
        items={envItems}
        selected={envSlug ?? ''}
        onChange={handleEnvChange}
        disabled={orgIndex === null || envsLoading}
        margin="dense"
      />
      <Box sx={{ marginLeft: 'auto' }}>
        <IconButton
          aria-label="links"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <LinkIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {links.map(({ path, label }) => (
            <MenuItem
              key={path}
              onClick={() => {
                navigate(path);
                setAnchorEl(null);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};
