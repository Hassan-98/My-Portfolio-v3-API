//= Modules
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
//= Decorators
import { Controller, Post, Use } from '../../decorators';
//= Service
import AuthService from './auth.service';
//= Middlewares
import { bodyValidator } from '../../middlewares/validation.middleware';
import { Authenticated, NotAuthenticated } from './auth.middleware';
//= Validators
import { LoginSchema, ProviderLoginSchema, VerifyTokenSchema } from '../User/user.validation';
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
      ...(process.env.NODE_ENV === 'development' ? {} : { domain: ".hassanali.tk" }),
      expires: new Date(new Date().getTime() + 60 * 60 * 1000)
    }).status(200).json({ success: true, data: userData });
  };


  @Post('/with-provider')
  @Use(NotAuthenticated)
  @Use(bodyValidator(ProviderLoginSchema))
  public async loginWithExternalProvider(req: Request, res: Response) {
    const { access_token } = req.body;
    const { user, status, token } = await Service.loginWithProvider({ access_token });

    const userData = await Service.findUserById(user._id);

    res.cookie('login-session', token, {
      secure: Config.isProduction,
      httpOnly: true,
      signed: true,
      ...(process.env.NODE_ENV === 'development' ? {} : { domain: ".hassanali.tk" }),
      expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
    })
      .status(status === 'login' ? 200 : 201)
      .json({ success: true, data: userData });
  }


  @Post('/verify')
  public async verifyLoginToken(req: Request, res: Response) {
    const token = req.signedCookies['login-session'];
    jwt.verify(token, Config.JWT_SECRET);
    res.status(200).json({ success: true, data: null });
  }


  @Post('/logout')
  @Use(Authenticated)
  public logout(_: Request, res: Response) {
    res.clearCookie('login-session', {
      ...(process.env.NODE_ENV === 'development' ? {} : { domain: ".hassanali.tk" }),
    }).status(200).json({ success: true, data: null });
  };
}

export default AuthController;

