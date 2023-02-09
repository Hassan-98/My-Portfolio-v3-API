import mongoose from 'mongoose';
import validator from 'validator';
import { IStack, IStackSchema } from './stack.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const StackSchema = new mongoose.Schema<IStackSchema>({
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
  order: {
    type: Number,
    validate(field: number) {
      if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('order'))
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
