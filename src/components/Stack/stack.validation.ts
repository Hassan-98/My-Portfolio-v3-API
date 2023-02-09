//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import { StackType } from '../../types';

export const StackSchema = z.object({
  name: z.string(),
  image: z.string().url().optional(),
  type: z.nativeEnum(StackType),
  isNotCompitable: z.boolean().optional()
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});