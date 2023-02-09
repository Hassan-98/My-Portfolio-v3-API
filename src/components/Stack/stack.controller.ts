//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import StackService from './stack.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
// import { StackSchema } from './stack.validation';
//= Types
import { IStack } from './stack.types';

const Service = new StackService();

@Controller('/stack')
class StackController {
  @Get('/')
  public async getStacks(req: Request, res: Response) {
    const stacks = await Service.getStacks(req.query);
    res.status(200).json({ success: true, data: stacks });
  };
}

export default StackController;

