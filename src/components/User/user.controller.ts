//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import UserService from './user.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { UserSchema, IDSchema } from './user.validation';
//= Types
import { User } from './user.types';

type ExtendedRequest = Request & { user: User }

const Service = new UserService();

@Controller('/users')
class UserController {
  @Get('/')
  @Use(Authenticated)
  public async getAllUsers(req: Request, res: Response) {
    let users = await Service.getUsers(req.query);

    res.status(200).json({ success: true, data: users });
  };

  @Get('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async getUserById(req: Request, res: Response) {
    let user = await Service.getUserById(req.params.id);

    res.status(200).json({ success: true, data: user });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(bodyValidator(UserSchema.partial()))
  public async updateUser(req: ExtendedRequest, res: Response) {
    let user = await Service.updateUserData(req.params.id, req.body, req.user);

    res.status(200).json({ success: true, data: user });
  };
}

export default UserController;

