//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Patch, Use } from '../../decorators';
//= Service
import UserService from './user.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { UserSchema, IDSchema, EmailSchema, UpdatePasswordSchema } from './user.validation';
//= Types
import { User } from './user.types';

type ExtendedRequest = Request & { user: User };

const Service = new UserService();

@Controller('/user')
class UserController {
  @Get('/')
  @Use(Authenticated)
  public async getAllUsers(req: Request, res: Response) {
    let users = await Service.getUsers(req.query);

    res.status(200).json({ success: true, data: users });
  };

  @Get('/byId/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async getUserById(req: Request, res: Response) {
    let user = await Service.getUserById(req.params.id);

    res.status(200).json({ success: true, data: user });
  };

  @Get('/byEmail/:email')
  @Use(Authenticated)
  @Use(paramsValidator(EmailSchema))
  public async getUserByEmail(req: Request, res: Response) {
    let user = await Service.getUserByEmail(req.params.email);

    res.status(200).json({ success: true, data: user });
  };

  @Patch('/:id/password')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(bodyValidator(UpdatePasswordSchema))
  public async updateUserPassword(req: Request, res: Response) {
    const providedData = {
      id: req.params.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword
    };

    let user = await Service.updateUserPassword(providedData);

    res.status(200).json({ success: true, data: user });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(bodyValidator(UserSchema.partial()))
  public async updateUser(req: Request, res: Response) {
    let user = await Service.updateUserData(req.params.id, req.body);

    res.status(200).json({ success: true, data: user });
  };
}

export default UserController;

