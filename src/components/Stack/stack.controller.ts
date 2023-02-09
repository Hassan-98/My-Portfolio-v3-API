//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import StackService from './stack.service';
//= Utils
import { multer } from '../../storage/storage.util';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { IDSchema, StackSchema } from './stack.validation';
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

  @Get('/:idOrName')
  public async getStackByIdOrName(req: Request, res: Response) {
    const stack = await Service.getStackByIdOrName(req.params.idOrName, req.query);
    res.status(200).json({ success: true, data: stack });
  };

  @Post('/')
  @Use(Authenticated)
  @Use(multer.single('image'))
  @Use(bodyValidator(StackSchema, ['isNotCompitable', 'order']))
  public async addNewWork(req: Request, res: Response) {
    const stack = await Service.addNewStack({ data: req.body, image: req.file });
    res.status(201).json({ success: true, data: stack });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(multer.single('image'))
  @Use(bodyValidator(StackSchema.partial(), ['isNotCompitable', 'order']))
  public async updateStack(req: Request, res: Response) {
    const stack = await Service.updateStack(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, data: stack });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteStack(req: Request, res: Response) {
    await Service.deleteAStack(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default StackController;

