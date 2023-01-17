import mongoose from 'mongoose';
import validator from 'validator';
import { User } from './user.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    validate(username: string) {
      if (validator.isEmpty(username)) throw HttpError(400, errorMessages.EMPTY('username'))
    }
  },
  email: {
    type: String,
    required: [true, errorMessages.REQUIRED('email address')],
    unique: true,
    trim: true,
    validate(email: string) {
      if (validator.isEmpty(email)) throw HttpError(400, errorMessages.EMPTY('email address'))
      else if (!validator.isEmail(email)) throw HttpError(400, errorMessages.NOT_VALID('email address'))
    }
  },
  password: {
    type: String,
    required: [true, errorMessages.REQUIRED('password')],
    minlength: [6, errorMessages.TOO_SHORT('password', 6)],
    default: 'not-linked'
  },
  picture: {
    type: String,
    validate(pic: string) {
      if (validator.isEmpty(pic)) throw HttpError(400, errorMessages.EMPTY('picture'));
      else if (!validator.isURL(pic)) throw HttpError(400, errorMessages.NOT_VALID_URL('picture'));
    }
  },
  externalAuth: {
    userId: {
      type: String,
      default: "not-linked",
      index: true
    },
    linked: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });


const Model = mongoose.model<User>("User", UserSchema);

export type UserModel = typeof Model;

export default Model;
