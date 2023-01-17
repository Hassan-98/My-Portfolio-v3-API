import { Document } from 'mongoose';

export interface Book extends Document {
  title: string;
  pages: number;
}
