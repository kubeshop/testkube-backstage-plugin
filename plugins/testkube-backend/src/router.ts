import express, { Router as ExpressRouter } from 'express';

import type { HttpAuthService } from '@backstage/backend-plugin-api';
import { AuthMiddleware } from './middlewares/authMiddleware';
import ProxyController from './controllers/proxyController';
import MetadataController from './controllers/metadataController';

type RouterDeps = {
  httpAuth: HttpAuthService;
  proxyController: ProxyController;
  metadataController: MetadataController;
};

type Router = {
  handle(): ExpressRouter;
};

const Router = ({
  httpAuth,
  proxyController,
  metadataController,
}: RouterDeps): Router => ({
  handle() {
    const router = ExpressRouter();
    router.use(express.json());
    router.use(express.text({ type: ['text/*', 'application/json'] }));

    const authMiddleware = AuthMiddleware({ httpAuth });
    router.use(authMiddleware.inject);

    router.get('/redirect', metadataController.getRedirectUrl);
    router.get('/config', metadataController.getConfig);
    router.get('/organizations', metadataController.getOrganizations);
    router.get(
      '/organizations/:index/environments',
      metadataController.getEnvironments,
    );

    router.all(
      '*',
      router.all('*', (req, res, next) => {
        Promise.resolve(proxyController.handle(req, res)).catch(next);
      }),
    );

    return router;
  },
});

export default Router;
