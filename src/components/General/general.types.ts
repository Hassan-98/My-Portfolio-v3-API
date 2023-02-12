import { Document, ObjectId } from 'mongoose';

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
  recentStack: { stack: ObjectId; order: number }[];
}

export interface IGeneralDocument extends IGeneral, Document { }