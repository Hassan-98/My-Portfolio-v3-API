import { Document } from 'mongoose';

export interface ICertificate {
  title: string;
  issuanceDate: Date;
  issuanceSource: string;
  sourceLink?: string;
  description: string;
  image: string;
  showInWebsite: boolean;
  showInCv: boolean;
  order: number;
}

export interface ICertificateDocument extends ICertificate, Document { }