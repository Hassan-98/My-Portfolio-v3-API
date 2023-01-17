//= Models
import USER, { UserModel } from './user.model';
//= Utils
import queryBuilder, { QueryParams } from '../../utils/queryBuilder';
//= Types
import { User } from './user.types';

class UserService {
  public MODEL: UserModel = USER;

  public async getUsers(params?: QueryParams): Promise<User[]> {
    const { limit, skip } = params || {};
    const { filter, projection, population, sortition } = queryBuilder(params || {});

    let users: User[] = await this.MODEL.find(filter, projection, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();
    return users;
  }

  public async getUserById(id: string): Promise<User> {
    let user: User = await this.MODEL.findById(id).lean();
    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    let user: User = await this.MODEL.findOne({ email }).lean();
    return user;
  }

  public async updateUserData(id: string, updates: Partial<User>, currentUser: User): Promise<User | null> {
    const user: User = await this.MODEL.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
    return user;
  }
}

export default UserService;
