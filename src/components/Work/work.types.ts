import { Document } from 'mongoose';
//= Types
import { StackType, Stack } from '../../types';

export enum Importance {
  Glowing = "glowing",
  Legacy = "legacy"
}

export interface IWork {
  name: string;
  description: string;
  stackType: StackType;
  importance: Importance;
  showInCv: boolean;
  links: {
    github?: string;
    demo?: string;
    apiRepo?: string;
    apiDocs?: string;
  };
  images: {
    desktop: string;
    mobile: string;
  };
  stack: Stack[];
  order: number;
}

export interface IWorkDocument extends IWork, Document { }