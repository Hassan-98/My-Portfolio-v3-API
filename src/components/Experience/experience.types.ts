import { Document } from 'mongoose';

export interface IExperience {
  title: string;
  company: string;
  companyLink?: string;
  startedAt: Date;
  endedAt?: Date;
  description: string;
  showInCv: boolean;
}

export interface IExperienceDocument extends IExperience, Document { }