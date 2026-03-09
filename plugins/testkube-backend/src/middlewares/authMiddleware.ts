import type {
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { NextFunction, Request, Response } from 'express';

type Deps = {
  httpAuth: HttpAuthService;
  logger: LoggerService;
};

export const AuthMiddleware = ({ httpAuth, logger }: Deps) => ({
  async inject(req: Request, res: Response, next: NextFunction) {
    let credentials;
    try {
      credentials = await httpAuth.credentials(req);
      logger.debug('Backstage credentials resolved for Testkube request', {
        method: req.method,
        path: req.originalUrl ?? req.url,
      });
    } catch (error) {
      logger.warn('Failed to resolve Backstage credentials for Testkube', {
        method: req.method,
        path: req.originalUrl ?? req.url,
        error:
          error instanceof Error ? error.message : 'Unknown credentials error',
      });
      res.status(401).json({ error: 'Missing Backstage credentials' });
      return;
    }
    if (!credentials) {
      logger.warn('Missing Backstage credentials for Testkube request', {
        method: req.method,
        path: req.originalUrl ?? req.url,
      });
      res.status(401).json({ error: 'Missing Backstage credentials' });
      return;
    }

    logger.debug('Authenticated Backstage request for Testkube', {
      method: req.method,
      path: req.originalUrl ?? req.url,
    });
    next();
  },
});
