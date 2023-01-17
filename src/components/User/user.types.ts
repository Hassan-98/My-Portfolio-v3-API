import { Document } from 'mongoose';

export type ProviderProfile = {
  username: string,
  email: string,
  imageUrl: string,
  id: string
}

export type ExternalProvider = {
  userId: string;
  linked: boolean
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  picture: string;
  externalAuth: ExternalProvider;
  createdAt: string;
  updatedAt: string;
}