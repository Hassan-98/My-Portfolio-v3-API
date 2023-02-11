//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import ExperienceService from './experience.service';
//= Utils
import { multer } from '../../storage/storage.util';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { IDSchema, ExperienceSchema } from './experience.validation';

const Service = new ExperienceService();

@Controller('/experience')
class ExperienceController {
  @Get('/')
  public async getExperiences(req: Request, res: Response) {
    const experiences = await Service.getExperiences(req.query);
    res.status(200).json({ success: true, data: experiences });
  };

  @Get('/:idOrTitle')
  public async getExperienceByIdOrName(req: Request, res: Response) {
    const experience = await Service.getExperienceByIdOrName(req.params.idOrTitle, req.query);
    res.status(200).json({ success: true, data: experience });
  };

  @Post('/')
  @Use(Authenticated)
  @Use(multer.single('image'))
  @Use(bodyValidator(ExperienceSchema))
  public async addNewWork(req: Request, res: Response) {
    const experience = await Service.addNewExperience(req.body);
    res.status(201).json({ success: true, data: experience });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(multer.single('image'))
  @Use(bodyValidator(ExperienceSchema.partial()))
  public async updateExperience(req: Request, res: Response) {
    const experience = await Service.updateExperience(req.params.id, req.body);
    res.status(200).json({ success: true, data: experience });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteExperience(req: Request, res: Response) {
    await Service.deleteAExperience(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default ExperienceController;

