//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';

export const ContactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string().min(10)
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});