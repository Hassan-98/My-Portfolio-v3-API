import { Document } from 'mongoose';
//= Types
import { StackType, Stack } from './../../types';

export interface IGeneral {
  header: {
    jobTitle: string;
    descriptionText: string;
    pictureUrl: string;
  };
  intro: {
    experienceYears: number;
    jobTitle: string;
    aboutMe: string;
  };
  links: {
    emailAddress: string;
    phoneNumber: string;
    github: string;
    linkedin: string;
    twitter: string;
  };
  recentStack: Stack[];
}

export interface IGeneralSchema extends IGeneral, Document { }