//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import GeneralService from './general.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
// import { GeneralSchema } from './general.validation';
//= Types
import { IGeneral } from './general.types';

const Service = new GeneralService();

@Controller('/general')
class GeneralController {
  @Get('/')
  public async getGeneralSettings(req: Request, res: Response) {
    const generalSettings = await Service.getGeneralSettings();
    res.status(200).json({ success: true, data: generalSettings });
  };
}

export default GeneralController;

