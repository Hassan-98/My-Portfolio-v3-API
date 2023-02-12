//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';

export const TestimonialSchema = z.object({
  authorName: z.string(),
  authorPosition: z.string(),
  content: z.string(),
  rating: z.number().gte(1).lte(5)
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});