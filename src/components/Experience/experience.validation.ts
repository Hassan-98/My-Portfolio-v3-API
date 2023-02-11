//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';

export const ExperienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  companyLink: z.string().url().optional(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),
  description: z.string(),
  showInCv: z.boolean()
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});