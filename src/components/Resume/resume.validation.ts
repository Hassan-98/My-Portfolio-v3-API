//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import {
  CvSkillsPeriority,
  ResumeDensity,
  ResumeFontFamily,
  ResumeSectionKey,
  ResumeTemplateId
} from './resume.types';

/**
 * Every field optional — a PATCH may carry just the one setting that changed,
 * and anything omitted falls back to the frontend's per-design defaults.
 */
export const CustomizationSchema = z.object({
  fullName: z.string().max(120).optional(),
  accentColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: "must be a hex colour"
  }).optional(),
  fontFamily: z.nativeEnum(ResumeFontFamily).optional(),
  fontScale: z.number().min(0.85).max(1.15).optional(),
  density: z.nativeEnum(ResumeDensity).optional(),
  uppercaseHeadings: z.boolean().optional(),
  showSectionIcons: z.boolean().optional(),
  sectionOrder: z.array(z.nativeEnum(ResumeSectionKey)).optional(),
  hiddenSections: z.array(z.nativeEnum(ResumeSectionKey)).optional(),
  sectionTitles: z.record(z.nativeEnum(ResumeSectionKey), z.string().max(60)).optional()
});

export const ResumeSchema = z.object({
  templates: z.array(z.object({
    name: z.string(),
    image: z.string().url().optional(),
    selected: z.boolean().optional()
  })),
  activeTemplate: z.nativeEnum(ResumeTemplateId),
  customizations: z.record(z.nativeEnum(ResumeTemplateId), CustomizationSchema),
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