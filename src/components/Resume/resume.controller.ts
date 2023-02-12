//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import ResumeService from './resume.service';
//= Utils
import { multer } from '../../storage/storage.util';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { IDSchema, ResumeSchema } from './resume.validation';

const Service = new ResumeService();

@Controller('/resume')
class ResumeController {
  @Get('/')
  public async getResumePreferences(req: Request, res: Response) {
    const resumePreferences = await Service.getResumePreferences();
    res.status(200).json({ success: true, data: resumePreferences });
  };

  @Post('/template')
  @Use(Authenticated)
  @Use(multer.single('image'))
  @Use(bodyValidator(ResumeSchema.partial(), ['templates']))
  public async addTemplate(req: Request, res: Response) {
    const resumePreferences = await Service.addTemplate({ data: req.body, image: req.file });
    res.status(200).json({ success: true, data: resumePreferences });
  };

  @Patch('/template/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(multer.single('image'))
  @Use(bodyValidator(ResumeSchema.partial(), ['templates']))
  public async updateTemplate(req: Request, res: Response) {
    const resumePreferences = await Service.updateTemplate({ id: req.params.id, updates: req.body, image: req.file });
    res.status(200).json({ success: true, data: resumePreferences });
  };

  @Delete('/template/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteTemplate(req: Request, res: Response) {
    const resumePreferences = await Service.deleteTemplate(req.params.id);
    res.status(200).json({ success: true, data: resumePreferences });
  };

  @Patch('/')
  @Use(Authenticated)
  @Use(bodyValidator(ResumeSchema.partial().omit({ templates: true })))
  public async updatePreferences(req: Request, res: Response) {
    const resumePreferences = await Service.updatePreferences(req.body);
    res.status(200).json({ success: true, data: resumePreferences });
  };
}

export default ResumeController;

