//= Models
import USER, { UserModel } from './user.model';
import CryptoJS from 'crypto-js';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Config
import ConfigVars from '../../configs/app.config';
//= Types
import { User } from './user.types';
import type { QueryParams } from '../../utils/queryBuilder';

const Config = ConfigVars();
class UserService {
  public MODEL: UserModel = USER;

  public async getUsers(params?: QueryParams): Promise<User[]> {
    const { limit, skip } = params || {};
    const { filter, projection, population, sortition } = queryBuilder(params || {});

    let users: User[] = await this.MODEL.find(filter, { password: 0, ...projection }, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();
    return users;
  }

  public async getUserById(id: string): Promise<User> {
    let user: User = await this.MODEL.findById(id, { password: 0 }).lean();
    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    let user: User = await this.MODEL.findOne({ email }, { password: 0 }).lean();
    return user;
  }

  public async updateUserPassword({ id, currentPassword, newPassword }: { id: string, currentPassword: string, newPassword: string }): Promise<User | null> {
    const user: User | null = await this.MODEL.findById(id, { email: 1, password: 1 });
    if (!user) throw HttpError(422, errorMessages.INVALID_CREDENTIALS);

    if (user.password !== 'not-linked') {
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, Config.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
      if (decryptedPassword !== currentPassword) throw HttpError(422, errorMessages.INVALID_CREDENTIALS);
    }

    user.password = CryptoJS.AES.encrypt(newPassword, Config.CRYPTO_SECRET).toString();
    await user.save();

    return user;
  }

  public async updateUserData(id: string, updates: Partial<Exclude<User, 'password'>>): Promise<User | null> {
    if (updates.password) throw HttpError(400, errorMessages.CANNOT_BE_UPDATED('password'));
    const user: User = await this.MODEL.findByIdAndUpdate(id, updates, { new: true, runValidators: true, select: { password: 0 } }).lean();
    return user;
  }
}

export default UserService;
