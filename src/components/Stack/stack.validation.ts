//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import { StackType } from '../../types';

export const StackSchema = z.object({
  name: z.string().trim(),
  image: z.string().url().trim(),
  type: z.nativeEnum(StackType),
  order: z.number().gt(0),
  isNotCompitable: z.boolean().optional()
});
