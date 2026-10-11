import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';

import CacheService from '../services/cacheService';
import ConfigService from '../services/configService';
import EnterpriseService from '../services/enterpriseService';
import ProxyService from '../services/proxyService';
import { createRunTestWorkflowsAction } from './action';

export const testkubeScaffolderModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'testkube',
  register(env) {
    env.registerInit({
      deps: {
        actions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
      },
      async init({ actions, config: backstageConfig, logger }) {
        const configService = ConfigService();
        const config = configService.getFromBackstage(backstageConfig);
        const errors = configService.validate(config);
        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }

        const proxyService = ProxyService({ config, logger });
        const enterpriseService = EnterpriseService({
          config,
          proxyService,
          cacheService: CacheService(),
          logger,
        });

        actions.addActions(
          createRunTestWorkflowsAction({
            config,
            proxyService,
            enterpriseService,
          }),
        );
      },
    });
  },
});

export default testkubeScaffolderModule;
