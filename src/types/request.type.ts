import { Request, Response, NextFunction } from 'express';
import { User } from '../components/User/user.types';

export type ExtendedRequest = Request & {
  user: User;
  ipAddress?: string | string[] | undefined;
}

export type RequestHandler = (req: ExtendedRequest, res: Response, next: NextFunction) => void;