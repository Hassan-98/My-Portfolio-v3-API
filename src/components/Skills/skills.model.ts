import mongoose from 'mongoose';
import validator from 'validator';
import { ISkillDocument, SkillMastery } from './skills.types';
import { StackType } from '../Stack/stack.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const SkillSchema = new mongoose.Schema<ISkillDocument>({
  skill: {
    type: mongoose.Types.ObjectId,
    required: [true, errorMessages.REQUIRED('skill')],
    ref: "Stack"
  },
  mastery: {
    type: String,
    enum: [SkillMastery.Proficient, SkillMastery.Moderate],
    required: [true, errorMessages.REQUIRED('mastery')]
  },
  type: {
    type: String,
    enum: [StackType.front, StackType.back, StackType.tools, StackType.full],
    required: [true, errorMessages.REQUIRED('type')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('type'))
    }
  },
  order: {
    type: Number,
    required: [true, errorMessages.REQUIRED('order')],
    default: 1,
    validate(field: number) {
      if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('order'))
    }
  }
});

const Model = mongoose.model<ISkillDocument>("Skill", SkillSchema);

export type ISkillModel = typeof Model;

export default Model;
