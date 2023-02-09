import { Document } from 'mongoose';

export interface IStack {
  name: string;
  image: string;
  type: StackType;
  order: number;
  isNotCompitable?: boolean;
}

export enum StackType {
  front = 'front',
  back = 'back',
  tools = 'tools',
  full = 'front back'
}

export interface IStackSchema extends IStack, Document { }