//= Modules
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
//= Decorators
import { Controller, Post, Use } from '../../decorators';
//= Service
import AuthService from './auth.service';
//= Middlewares
import { bodyValidator } from '../../middlewares/validation.middleware';
import { Authenticated, NotAuthenticated } from './auth.middleware';
//= Validators
import { LoginSchema, ProviderLoginSchema } from '../User/user.validation';
//= Config
import ConfigVars from '../../configs/app.config';

const Config = ConfigVars();
const Service = new AuthService();

@Controller('/auth')
class AuthController {
  @Post('/login')
  @Use(NotAuthenticated)
  @Use(bodyValidator(LoginSchema))
  public async login(req: Request, res: Response) {
    const { email, password, rememberMe } = req.body;

    let { token, userId } = await Service.login({ email, password, rememberMe });

    const userData = await Service.findUserById(userId);

    res.cookie('login-session', token, {
      secure: Config.isProduction,
      httpOnly: true,
      signed: true,
      expires: new Date(new Date().getTime() + (rememberMe ? 365 : 1) * 24 * 60 * 60 * 1000)
    }).status(200).json({ success: true, data: userData });
  };


  @Post('/with-provider')
  @Use(NotAuthenticated)
  @Use(bodyValidator(ProviderLoginSchema))
  public async loginWithExternalProvider(req: Request, res: Response) {
    const { externalId, externalToken, rememberMe } = req.body;
    let { user, status } = await Service.loginWithProvider({ externalId, externalToken });

    let token = jwt.sign({ user: user._id }, Config.JWT_SECRET, { expiresIn: '365d' });

    const userData = await Service.findUserById(user._id);

    res.cookie('login-session', token, {
      secure: Config.isProduction,
      httpOnly: true,
      signed: true,
      expires: new Date(new Date().getTime() + (rememberMe ? 365 : 1) * 24 * 60 * 60 * 1000)
    })
      .status(status === 'login' ? 200 : 201)
      .json({ success: true, data: userData });
  }


  @Post('/logout')
  @Use(Authenticated)
  public logout(_: Request, res: Response) {
    res.clearCookie('login-session');
    res.status(200).json({ success: true, data: null });
  };
}

export default AuthController;

