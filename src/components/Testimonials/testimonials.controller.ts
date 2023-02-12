//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import TestimonialService from './testimonials.service';
//= Utils
import { multer } from '../../storage/storage.util';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Validations
import { IDSchema, TestimonialSchema } from './testimonials.validation';

const Service = new TestimonialService();

@Controller('/testimonials')
class TestimonialController {
  @Get('/')
  public async getTestimonials(req: Request, res: Response) {
    const testimonials = await Service.getTestimonials(req.query);
    res.status(200).json({ success: true, data: testimonials });
  };

  @Get('/:id')
  public async getTestimonialByIdOrName(req: Request, res: Response) {
    const testimonial = await Service.getTestimonialById(req.params.id, req.query);
    res.status(200).json({ success: true, data: testimonial });
  };

  @Post('/')
  @Use(Authenticated)
  @Use(multer.single('image'))
  @Use(bodyValidator(TestimonialSchema))
  public async addNewWork(req: Request, res: Response) {
    const testimonial = await Service.addNewTestimonial(req.body);
    res.status(201).json({ success: true, data: testimonial });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(multer.single('image'))
  @Use(bodyValidator(TestimonialSchema.partial()))
  public async updateTestimonial(req: Request, res: Response) {
    const testimonial = await Service.updateTestimonial(req.params.id, req.body);
    res.status(200).json({ success: true, data: testimonial });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteTestimonial(req: Request, res: Response) {
    await Service.deleteATestimonial(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default TestimonialController;

