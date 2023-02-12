import { Document } from 'mongoose';

export interface ICertificate {
  title: string;
  issuanceDate: Date;
  description: string;
  image: string;
  showInCv: boolean;
  order: number;
}

export interface ICertificateDocument extends ICertificate, Document { }