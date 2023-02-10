//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Delete, Use } from '../../decorators';
//= Service
import ContactService from './contact.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { IDSchema, ContactSchema } from './contact.validation';

const Service = new ContactService();

@Controller('/contact')
class StackController {
  @Get('/')
  @Use(Authenticated)
  public async getAll(req: Request, res: Response) {
    const messages = await Service.getMessages(req.query);
    res.status(200).json({ success: true, data: messages });
  };

  @Get('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async getOneById(req: Request, res: Response) {
    const message = await Service.getMessageById(req.params.id, req.query);
    res.status(200).json({ success: true, data: message });
  };

  @Post('/')
  @Use(bodyValidator(ContactSchema))
  public async addNewOne(req: Request, res: Response) {
    const message = await Service.addNewContactMessage(req.body);
    res.status(201).json({ success: true, data: message });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteOne(req: Request, res: Response) {
    await Service.deleteAMessage(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default StackController;

