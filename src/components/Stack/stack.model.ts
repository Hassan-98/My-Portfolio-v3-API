import mongoose from 'mongoose';
import validator from 'validator';
import { IStack, IStackDocument } from './stack.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const StackSchema = new mongoose.Schema<IStackDocument>({
  name: {
    type: String,
    trim: true,
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('name'))
    }
  },
  image: {
    type: String,
    trim: true,
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('image'))
      else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('image'))
    }
  },
  type: {
    type: String,
    enum: ['front', 'back', 'tools', 'front back'],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('type'))
    }
  },
  isNotCompitable: {
    type: Boolean,
    default: false
  }
});

const Model = mongoose.model<IStack>("Stack", StackSchema);

export type IStackModel = typeof Model;

export default Model;
