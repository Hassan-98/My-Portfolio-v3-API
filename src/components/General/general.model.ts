import mongoose from 'mongoose';
import validator from 'validator';
import { IGeneral, IGeneralSchema } from './general.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const GeneralSchema = new mongoose.Schema<IGeneralSchema>({
  header: {
    jobTitle: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('header.jobTitle'))
      }
    },
    descriptionText: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('header.descriptionText'))
      }
    },
    pictureUrl: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('header.pictureUrl'))
      }
    }
  },
  intro: {
    experienceYears: {
      type: Number,
      validate(field: number) {
        if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('intro.experienceYears'))
      }
    },
    jobTitle: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('intro.jobTitle'))
      }
    },
    aboutMe: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('intro.aboutMe'))
      }
    }
  },
  links: {
    emailAddress: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.emailAddress'))
        else if (!validator.isEmail(field)) throw HttpError(400, errorMessages.NOT_VALID('links.emailAddress'))
      }
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.phoneNumber'))
      }
    },
    github: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.github'))
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.github'))
      }
    },
    linkedin: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.linkedin'))
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.linkedin'))
      }
    },
    twitter: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.twitter'))
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.twitter'))
      }
    }
  },
  recentStack: [
    {
      stack: {
        type: mongoose.Types.ObjectId,
        ref: "Stack"
      },
      order: {
        type: Number,
        validate(field: number) {
          if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('recentStack.order'))
        }
      }
    }
  ]
});


const Model = mongoose.model<IGeneral>("General", GeneralSchema);

export type IGeneralModel = typeof Model;

export default Model;
