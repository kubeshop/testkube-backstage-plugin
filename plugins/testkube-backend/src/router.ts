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
    router.use(express.text({ type: '*/*' }));

    const authMiddleware = AuthMiddleware({ httpAuth });
    router.use(authMiddleware.inject);

    // router.get('/environments', )

    router.all('*', proxyController.handle);

    return router;
  },
});

export default Router;
