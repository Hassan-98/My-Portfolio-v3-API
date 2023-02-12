//= Models
import TESTIMONIAL, { ITestimonialModel } from './testimonials.model';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { ITestimonial, ITestimonialDocument } from './testimonials.types';
import type { QueryParams } from '../../utils/queryBuilder';

class TestimonialService {
  public MODEL: ITestimonialModel = TESTIMONIAL;

  public async getTestimonials(queryOptions: QueryParams): Promise<ITestimonial[]> {
    const { limit, skip } = queryOptions || {};
    const { filter, projection, sortition } = queryBuilder(queryOptions || {});

    let testimonials: ITestimonial[] = await this.MODEL.find(filter, projection, { ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!testimonials.length) throw HttpError(400, errorMessages.NOT_EXIST("testimonials"));

    return testimonials;
  }

  public async getTestimonialById(id: string, queryOptions: QueryParams): Promise<ITestimonial> {
    const { projection } = queryBuilder(queryOptions || {});

    let testimonial: ITestimonial = await this.MODEL.findById(id, projection).lean();

    if (!testimonial) throw HttpError(400, errorMessages.NOT_EXIST("testimonial", id));

    return testimonial;
  }

  public async addNewTestimonial(data: ITestimonial): Promise<ITestimonialDocument> {
    const testimonial = await this.MODEL.create(data);
    return testimonial;
  }

  public async updateTestimonial(id: string, updates: Partial<ITestimonial>): Promise<ITestimonialDocument> {
    let testimonial: ITestimonialDocument | null = await this.MODEL.findById(id);

    if (!testimonial) throw HttpError(400, errorMessages.NOT_EXIST("testimonial", id));

    Object.keys(updates).forEach((key) => {
      if (testimonial) testimonial.set(key, updates[key as keyof ITestimonial]);
    });

    await testimonial.save();

    return testimonial;
  }

  public async deleteATestimonial(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("testimonial", id));
    return true;
  }
}

export default TestimonialService;
