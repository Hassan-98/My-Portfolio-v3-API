import mongoose from 'mongoose';
import validator from 'validator';
import { IWork, IWorkDocument, Importance } from './work.types';
import { StackType } from '../../types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const WorkSchema = new mongoose.Schema<IWorkDocument>({
  name: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('name')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('name'))
    }
  },
  description: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('description')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('description'))
    }
  },
  stackType: {
    type: String,
    trim: true,
    enum: [StackType.front, StackType.back, StackType.tools, StackType.full],
    required: [true, errorMessages.REQUIRED('stackType')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('stackType'))
    }
  },
  importance: {
    type: String,
    trim: true,
    enum: [Importance.Glowing, Importance.Legacy],
    required: [true, errorMessages.REQUIRED('importance')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('importance'))
    }
  },
  showInCv: {
    type: Boolean,
    default: true
  },
  links: {
    github: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.github'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.github'))
      }
    },
    demo: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.demo'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.demo'))
      }
    },
    apiRepo: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.apiRepo'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.apiRepo'))
      }
    },
    apiDocs: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.apiDocs'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.apiDocs'))
      }
    },
  },
  images: {
    desktop: {
      type: String,
      trim: true,
      required: [true, errorMessages.REQUIRED('images.desktop')],
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('images.desktop'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('images.desktop'))
      }
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, errorMessages.REQUIRED('images.mobile')],
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('images.mobile'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('images.mobile'))
      }
    },
  },
  stack: [
    {
      _id: false,
      name: {
        type: String,
        trim: true,
        required: [true, errorMessages.REQUIRED('stack.name')],
        validate(field: string) {
          if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('stack.name'))
        }
      },
      image: {
        type: String,
        trim: true,
        required: [true, errorMessages.REQUIRED('stack.image')],
        validate(field: string) {
          if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('stack.image'))
        }
      },
      type: {
        type: String,
        enum: [StackType.front, StackType.back, StackType.tools, StackType.full],
        required: [true, errorMessages.REQUIRED('stack.type')],
        validate(field: string) {
          if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('stack.type'))
        }
      },
      order: {
        type: Number,
        required: [true, errorMessages.REQUIRED('stack.order')],
        validate(field: number) {
          if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('stack.order'))
        }
      },
      isNotCompitable: {
        type: Boolean,
        default: false
      }
    }
  ],
  order: {
    type: Number,
    required: [true, errorMessages.REQUIRED('order')],
    default: 1,
    validate(field: number) {
      if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('order'))
    }
  }
});


const Model = mongoose.model<IWorkDocument>("Work", WorkSchema);

export type IWorkModel = typeof Model;

export default Model;
