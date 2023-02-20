//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Patch, Use } from '../../decorators';
//= Service
import GeneralService from './general.service';
//= Utils
import { multer } from '../../storage/storage.util';
//= Middlewares
import { bodyValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { GeneralSchema } from './general.validation';

const Service = new GeneralService();

@Controller('/general')
class GeneralController {
  @Get('/')
  public async getGeneralSettings(req: Request, res: Response) {
    const generalSettings = await Service.getGeneralSettings();
    res.status(200).json({ success: true, data: generalSettings });
  };

  @Patch('/')
  @Use(Authenticated)
  @Use(multer.single('picture'))
  @Use(bodyValidator(GeneralSchema.partial(), ['header']))
  public async updateSettings(req: Request, res: Response) {
    const settings = await Service.updateSettings(req.body, req.file);
    res.status(200).json({ success: true, data: settings });
  };
}

export default GeneralController;

