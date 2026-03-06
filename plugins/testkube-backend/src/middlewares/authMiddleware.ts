import type { HttpAuthService } from '@backstage/backend-plugin-api';
import { NextFunction, Request, Response } from 'express';

type Deps = {
  httpAuth: HttpAuthService;
};

export const AuthMiddleware = ({ httpAuth }: Deps) => ({
  async inject(req: Request, res: Response, next: NextFunction) {
    let credentials;
    try {
      credentials = await httpAuth.credentials(req);
    } catch {
      res.status(401).json({ error: 'Missing Backstage credentials' });
      return;
    }
    if (!credentials) {
      res.status(401).json({ error: 'Missing Backstage credentials' });
      return;
    }

    next();
  },
});
