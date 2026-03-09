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
        logger: coreServices.logger,
      },
      async init({ http, httpAuth, config: backstageConfig, logger }) {
        logger.info('Initializing Testkube backend plugin');

        const configService = ConfigService();
        const config = configService.getFromBackstage(backstageConfig);

        const errors = configService.validate(config);
        if (errors.length > 0) {
          const message = errors.join('\n');
          logger.error(`Testkube configuration validation failed: ${message}`);
          throw new Error(message);
        }

        const cacheService = CacheService();
        const proxyService = ProxyService({ config, logger });
        const enterpriseService = EnterpriseService({
          config,
          cacheService,
          proxyService,
          logger,
        });
        const proxyController = ProxyController({
          proxyService,
          enterpriseService,
          logger,
        });
        const metadataController = MetadataController({
          config,
          enterpriseService,
          logger,
        });

        const router = Router({
          httpAuth,
          proxyController,
          metadataController,
          logger,
        });

        http.use(router.handle());
      },
    });
  },
});
