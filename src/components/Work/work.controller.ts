//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import WorkService from './work.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Utils
import { multer } from './../../storage/storage.util';
//= Validations
import { IDSchema, OrderSchema, WorkSchema } from './work.validation';

const Service = new WorkService();

@Controller('/works')
class WorksController {
  @Get('/')
  public async getAllWorks(req: Request, res: Response) {
    const allWorks = await Service.getAllWorks(req.query);
    res.status(200).json({ success: true, data: allWorks });
  };

  @Get('/:id')
  @Use(paramsValidator(IDSchema))
  public async getAWorkById(req: Request, res: Response) {
    const work = await Service.getWorkById(req.params.id, req.query);
    res.status(200).json({ success: true, data: work });
  };

  @Post('/')
  @Use(Authenticated)
  @Use(multer.fields([{ name: "desktop", maxCount: 1 }, { name: "mobile", maxCount: 1 }]))
  @Use(bodyValidator(WorkSchema, ['stack', 'links', 'order', 'showInCv']))
  public async addNewWork(req: Request, res: Response) {
    const uploaded_images = req.files as { [fieldname: string]: Express.Multer.File[] };

    let images;
    if (Object.keys(uploaded_images).length && uploaded_images.desktop && uploaded_images.mobile) {
      images = { desktop: uploaded_images.desktop[0], mobile: uploaded_images.mobile[0] }
    }

    const work = await Service.addNewWork({ data: req.body, images });
    res.status(201).json({ success: true, data: work });
  };

  @Patch('/order')
  @Use(Authenticated)
  @Use(bodyValidator(OrderSchema))
  public async updateWorkOrder(req: Request, res: Response) {
    await Service.updateWorksOrder(req.body);
    res.status(200).json({ success: true, data: null });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(multer.fields([{ name: "desktop", maxCount: 1 }, { name: "mobile", maxCount: 1 }]))
  @Use(bodyValidator(WorkSchema.partial(), ['stack', 'links', 'order', 'showInCv']))
  public async updateWork(req: Request, res: Response) {
    const uploaded_images = req.files as { [fieldname: string]: Express.Multer.File[] };
    let images;

    if (Object.keys(uploaded_images).length) {
      images = {
        ...(uploaded_images.desktop ? { desktop: uploaded_images.desktop[0] } : {}),
        ...(uploaded_images.mobile ? { mobile: uploaded_images.mobile[0] } : {})
      }
    }

    const work = await Service.updateWork(req.params.id, req.body, images);
    res.status(200).json({ success: true, data: work });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteWork(req: Request, res: Response) {
    await Service.deleteWork(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default WorksController;

