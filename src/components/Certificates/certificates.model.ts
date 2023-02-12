import mongoose from 'mongoose';
import validator from 'validator';
import { ICertificate, ICertificateDocument } from './certificates.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const CertificateSchema = new mongoose.Schema<ICertificateDocument>({
  title: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('title')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('title'))
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
  issuanceDate: {
    type: Date,
    required: [true, errorMessages.REQUIRED('issuanceDate')]
  },
  image: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('image')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('image'));
      else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('image'))
    }
  },
  showInCv: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: [true, errorMessages.REQUIRED('order')],
    default: 1,
    validate(field: number) {
      if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('order'))
    }
  }
}, { timestamps: true });


const Model = mongoose.model<ICertificateDocument>("Certificate", CertificateSchema);

export type ICertificateModel = typeof Model;

export default Model;
