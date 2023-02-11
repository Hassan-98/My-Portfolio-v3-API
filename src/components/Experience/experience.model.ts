import mongoose from 'mongoose';
import validator from 'validator';
import { IExperience, IExperienceDocument } from './experience.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const ExperienceSchema = new mongoose.Schema<IExperienceDocument>({
  title: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('title')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('title'))
    }
  },
  company: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('company')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('company'))
    }
  },
  companyLink: {
    type: String,
    trim: true,
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('companyLink'))
      else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('companyLink'))
    }
  },
  startedAt: {
    type: Date,
    required: [true, errorMessages.REQUIRED('startedAt')]
  },
  endedAt: {
    type: Date
  },
  description: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('description')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('description'))
    }
  },
  showInCv: {
    type: Boolean,
    required: [true, errorMessages.REQUIRED('showInCv')],
    default: false
  }
});

const Model = mongoose.model<IExperience>("Experience", ExperienceSchema);

export type IExperienceModel = typeof Model;

export default Model;
