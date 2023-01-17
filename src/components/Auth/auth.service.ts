import { HttpError } from '../../middlewares/error.handler.middleware';
//= Modules
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
//= Models
import USER, { UserModel } from '../User/user.model';
//= Utils
import { verifyGoogleAuth } from './auth.utils';
import errorMessages from '../../utils/error-messages';
import uploadFromUrl from '../../storage/uploadFromUrl';
//= Config
import ConfigVars from '../../configs/app.config';
//= Types
import { User, ProviderProfile } from '../User/user.types';
import { ProviderLoginParams } from '../User/user.validation';

const Config = ConfigVars();

class AuthService {
  public USER_MODEL: UserModel = USER;

  public async findUserById(id: string): Promise<User> {
    let user: User = await this.USER_MODEL.findById(id, { password: 0 }).lean();
    return user;
  }

  public async login(credentials: { email: string, password: string, rememberMe: boolean }): Promise<{ token: string, userId: string }> {
    let user: User = await this.USER_MODEL.findOne({ email: credentials.email }, { email: 1, password: 1, accountStatus: 1, password_linked: 1, role: 1 }).lean();

    if (!user) throw HttpError(422, errorMessages.INVALID_CREDENTIALS);

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, Config.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);

    if (credentials.password !== decryptedPassword) throw HttpError(422, errorMessages.INVALID_CREDENTIALS);

    let token = jwt.sign({ user: user._id }, Config.JWT_SECRET, { expiresIn: credentials.rememberMe ? '365d' : '1d' });

    return { token, userId: user._id };
  }

  public async create(credentials: { username: string, email: string, password: string, rememberMe: boolean }): Promise<{ token: string, userId: string }> {
    let user: User = await this.USER_MODEL.create({
      username: credentials.username,
      email: credentials.email,
      password: CryptoJS.AES.encrypt(credentials.password, Config.CRYPTO_SECRET).toString()
    });

    let token = jwt.sign({ user: user._id }, Config.JWT_SECRET, { expiresIn: credentials.rememberMe ? '365d' : '1d' });

    return { token, userId: user._id };
  }

  public async loginWithProvider({ externalToken, externalId }: ProviderLoginParams): Promise<{ user: User, status: string }> {
    let userProfile: ProviderProfile;
    let status: string = 'login';

    let verifyResponse = await verifyGoogleAuth(externalToken);

    if (!verifyResponse) throw HttpError(500, errorMessages.AUTH_ERROR);

    userProfile = {
      username: verifyResponse.name || "",
      email: verifyResponse.email || "",
      imageUrl: verifyResponse.picture || "",
      id: verifyResponse.sub
    }

    let user = await this.USER_MODEL.findOne({ 'externalAuth.userId': externalId });

    // Perform sign up operation
    if (!user) {
      if (!userProfile) throw HttpError(417, errorMessages.PROVIDER_ERROR);

      let userFound: User | null = await this.USER_MODEL.findOne({ email: userProfile.email }, { email: 1 });

      if (userFound) throw HttpError(403, errorMessages.AUTH_LINKED);

      user = await this.USER_MODEL.create({
        username: userProfile.username,
        email: userProfile.email,
        email_confirmed: true,
        externalAuth: {
          userId: userProfile.id,
          linked: true
        }
      });

      status = 'signup';

      const uploadedPicture = await uploadFromUrl(userProfile.imageUrl, user._id, 'image');

      user.picture = uploadedPicture.url;

      await user.save();
    }

    return { user, status };
  }
}

export default AuthService;
