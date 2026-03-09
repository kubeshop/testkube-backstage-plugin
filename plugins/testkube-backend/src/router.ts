import express, {
  Router as ExpressRouter,
  NextFunction,
  Request,
  Response,
} from 'express';

import type {
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { AuthMiddleware } from './middlewares/authMiddleware';
import ProxyController from './controllers/proxyController';
import MetadataController from './controllers/metadataController';

type RouterDeps = {
  httpAuth: HttpAuthService;
  proxyController: ProxyController;
  metadataController: MetadataController;
  logger: LoggerService;
};

type Router = {
  handle(): ExpressRouter;
};

const Router = ({
  httpAuth,
  proxyController,
  metadataController,
  logger,
}: RouterDeps): Router => ({
  handle() {
    const router = ExpressRouter();
    router.use(express.json());
    router.use(express.text({ type: ['text/*', 'application/json'] }));

    router.use((req, _res, next) => {
      logger.debug('Handling Testkube request', {
        method: req.method,
        path: req.originalUrl ?? req.url,
      });
      next();
    });

    const authMiddleware = AuthMiddleware({ httpAuth, logger });
    router.use(authMiddleware.inject);

    router.get('/config', metadataController.getConfig);
    router.get('/organizations', metadataController.getOrganizations);
    router.get(
      '/organizations/:index/environments',
      metadataController.getEnvironments,
    );

    router.all('*', (req, res, next) => {
      Promise.resolve(proxyController.handle(req, res)).catch(next);
    });

    router.use(
      (err: Error, req: Request, _res: Response, next: NextFunction): void => {
        logger.error('Unhandled error in Testkube router', {
          method: req.method,
          path: req.originalUrl ?? req.url,
          error: err.message,
        });
        next(err);
      },
    );

    return router;
  },
});

export default Router;
