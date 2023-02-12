//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import SkillService from './skills.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { IDSchema, SkillSchema, OrderSchema } from './skills.validation';

const Service = new SkillService();

@Controller('/skills')
class SkillController {
  @Get('/')
  public async getSkills(req: Request, res: Response) {
    const skills = await Service.getSkills(req.query);
    res.status(200).json({ success: true, data: skills });
  };

  @Get('/:id')
  public async getSkillById(req: Request, res: Response) {
    const skill = await Service.getSkillById(req.params.id, req.query);
    res.status(200).json({ success: true, data: skill });
  };

  @Post('/')
  @Use(Authenticated)
  @Use(bodyValidator(SkillSchema))
  public async addNewWork(req: Request, res: Response) {
    const skill = await Service.addNewSkill(req.body);
    res.status(201).json({ success: true, data: skill });
  };

  @Patch('/order')
  @Use(Authenticated)
  @Use(bodyValidator(OrderSchema))
  public async updateWorkOrder(req: Request, res: Response) {
    await Service.updateSkillsOrder(req.body);
    res.status(200).json({ success: true, data: null });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(bodyValidator(SkillSchema.partial()))
  public async updateSkill(req: Request, res: Response) {
    const skill = await Service.updateSkill(req.params.id, req.body);
    res.status(200).json({ success: true, data: skill });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteSkill(req: Request, res: Response) {
    await Service.deleteASkill(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default SkillController;

