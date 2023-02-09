//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';

export const GeneralSchema = z.object({
  header: z.object({
    jobTitle: z.string().trim(),
    descriptionText: z.string().min(10),
    pictureUrl: z.string().url(),
  }),
  intro: z.object({
    experienceYears: z.number().gt(0),
    jobTitle: z.string().trim(),
    aboutMe: z.string().min(10),
  }),
  links: z.object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    apiRepo: z.string().url().optional(),
    apiDocs: z.string().url().optional(),
  }),
  recentStack: z.array(z.object({
    stack: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
    order: z.number().gt(0),
  }))
});
