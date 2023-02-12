//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import { StackType } from '../../types';
import { Importance } from './work.types';

export const WorkSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().min(15),
  stackType: z.nativeEnum(StackType),
  importance: z.nativeEnum(Importance),
  showInCv: z.boolean(),
  links: z.object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    apiRepo: z.string().url().optional(),
    apiDocs: z.string().url().optional(),
  }),
  images: z.object({
    desktop: z.string().url(),
    mobile: z.string().url(),
  }).optional(),
  stack: z.array(z.object({
    stack: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
    order: z.number().gt(0),
  })),
  order: z.number().gt(0),
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});

export const OrderSchema = z.array(z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
  order: z.number().gt(0)
}))