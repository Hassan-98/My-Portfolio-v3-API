import { User } from './components/User/user.types';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}