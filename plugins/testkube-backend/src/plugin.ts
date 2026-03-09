import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import Router from './router';
import ConfigService from './services/configService';
import ProxyService from './services/proxyService';
import EnterpriseService from './services/enterpriseService';
import CacheService from './services/cacheService';
import ProxyController from './controllers/proxyController';
import MetadataController from './controllers/metadataController';

export const testkubePlugin = createBackendPlugin({
  pluginId: 'testkube',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        config: coreServices.rootConfig,
      },
      async init({ http, httpAuth, config: backstageConfig }) {
        const configService = ConfigService();
        const config = configService.getFromBackstage(backstageConfig);

        const errors = configService.validate(config);
        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }

        const cacheService = CacheService();
        const proxyService = ProxyService({ config });
        const enterpriseService = EnterpriseService({
          config,
          cacheService,
          proxyService,
        });
        const proxyController = ProxyController({
          proxyService,
          enterpriseService,
        });
        const metadataController = MetadataController({
          config,
          enterpriseService,
        });

        const router = Router({
          httpAuth,
          proxyController,
          metadataController,
        });

        http.use(router.handle());
      },
    });
  },
});
