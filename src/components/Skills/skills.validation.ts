//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import { SkillMastery } from './skills.types';
import { StackType } from '../Stack/stack.types';

export const SkillSchema = z.object({
  skill: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
  mastery: z.nativeEnum(SkillMastery),
  type: z.nativeEnum(StackType),
  order: z.number().gt(0)
});

export const SkillsByTypeSchema = z.object({
  skills: z.array(z.object({
    skill: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
    mastery: z.nativeEnum(SkillMastery),
    type: z.nativeEnum(StackType),
    order: z.number().gt(0)
  })),
  type: z.nativeEnum(StackType)
})

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});

export const OrderSchema = z.array(z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
  order: z.number().gt(0)
}))