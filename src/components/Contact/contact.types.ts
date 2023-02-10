import { Document } from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  message: string;
}

export interface IContactDocument extends IContact, Document { }