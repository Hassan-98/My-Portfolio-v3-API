import { Document } from 'mongoose';

export interface ITestimonial {
  authorName: string;
  authorPosition: string;
  content: string;
  rating: number;
}

export interface ITestimonialDocument extends ITestimonial, Document { }