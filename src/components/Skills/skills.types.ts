import { Document, ObjectId } from 'mongoose';
import { StackType } from '../Stack/stack.types';

export interface ISkill {
  skill: ObjectId;
  mastery: SkillMastery;
  type: StackType;
  order: number;
}

export enum SkillMastery {
  Proficient = "Proficient",
  Moderate = "Moderate"
}

export interface ISkillDocument extends ISkill, Document { }