//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import { CvSkillsPeriority } from './resume.types';

export const ResumeSchema = z.object({
  templates: z.array(z.object({
    name: z.string(),
    image: z.string().url().optional(),
    selected: z.boolean().optional()
  })),
  links: z.object({
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    showLinkedin: z.boolean(),
    showGithub: z.boolean(),
    showTwitter: z.boolean(),
  }),
  summary: z.object({
    showSection: z.boolean(),
    showPicture: z.boolean(),
    enableCustomSummary: z.boolean(),
    customSummary: z.string().optional(),
    enableCustomTitle: z.boolean(),
    customTitle: z.string().optional()
  }),
  skills: z.object({
    showSection: z.boolean(),
    showFrontendSkills: z.boolean(),
    showBackendSkills: z.boolean(),
    showToolsSkills: z.boolean(),
    skillsPeriority: z.nativeEnum(CvSkillsPeriority)
  }),
  experiences: z.object({
    showSection: z.boolean(),
    isLimited: z.boolean(),
    limit: z.number().gt(0).optional()
  }),
  education: z.object({
    showSection: z.boolean(),
    isLimited: z.boolean(),
    limit: z.number().gt(0).optional()
  }),
  projects: z.object({
    showSection: z.boolean(),
    isLimited: z.boolean(),
    showTcgWorks: z.boolean(),
    limit: z.number().gt(0).optional()
  })
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});