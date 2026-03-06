import express, { Router as ExpressRouter } from 'express';

import type { HttpAuthService } from '@backstage/backend-plugin-api';
import { AuthMiddleware } from './middlewares/authMiddleware';
import ProxyController from './controllers/proxyController';

type RouterDeps = {
  httpAuth: HttpAuthService;
  proxyController: ProxyController;
};

type Router = {
  handle(): ExpressRouter;
};

const Router = ({ httpAuth, proxyController }: RouterDeps): Router => ({
  handle() {
    const router = ExpressRouter();
    router.use(express.json());
    router.use(express.text({ type: ['text/*', 'application/json'] }));

    const authMiddleware = AuthMiddleware({ httpAuth });
    router.use(authMiddleware.inject);

    // router.get('/environments', )

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
