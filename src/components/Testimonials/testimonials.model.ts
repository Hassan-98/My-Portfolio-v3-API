import mongoose from 'mongoose';
import validator from 'validator';
import { ITestimonialDocument } from './testimonials.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const TestimonialSchema = new mongoose.Schema<ITestimonialDocument>({
  authorName: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('title')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('authorName'))
    }
  },
  authorPosition: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('company')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('authorPosition'))
    }
  },
  content: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('description')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('content'))
    }
  },
  rating: {
    type: Number,
    required: [true, errorMessages.REQUIRED('showInCv')],
    default: 5,
    validate(field: number) {
      if (field < 1 || field > 5) throw HttpError(400, errorMessages.NOT_VALID('rating'))
    }
  }
});

const Model = mongoose.model<ITestimonialDocument>("Testimonial", TestimonialSchema);

export type ITestimonialModel = typeof Model;

export default Model;
