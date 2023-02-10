import mongoose from 'mongoose';
import validator from 'validator';
import { IContact, IContactDocument } from './contact.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const ContactSchema = new mongoose.Schema<IContactDocument>({
  name: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('order')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('name'))
    }
  },
  email: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('order')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('email'))
      else if (!validator.isEmail(field)) throw HttpError(400, errorMessages.NOT_VALID('email'))
    }
  },
  message: {
    type: String,
    trim: true,
    minlength: [10, errorMessages.TOO_SHORT('message', 10)],
    required: [true, errorMessages.REQUIRED('message')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('message'))
    }
  }
}, { timestamps: true });

const Model = mongoose.model<IContact>("Contact", ContactSchema);

export type IContactModel = typeof Model;

export default Model;
