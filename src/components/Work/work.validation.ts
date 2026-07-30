//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';
//= Types
import { StackType } from '../../types';
import { Importance, WorkKind, WorkDomain } from './work.types';

const AnnotationSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  note: z.string(),
});

const ScreenSchema = z.object({
  image: z.string().url(),
  caption: z.string().optional(),
  roles: z.array(z.string()).optional(),
  annotations: z.array(AnnotationSchema).optional(),
});

const MetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
});

export const WorkSchema = z.object({
  name: z.string(),
  description: z.string().min(15),
  stackType: z.nativeEnum(StackType),
  importance: z.nativeEnum(Importance),
  showInCv: z.boolean(),
  showInWebsite: z.boolean(),
  isTcgWork: z.boolean(),
  kind: z.nativeEnum(WorkKind).optional(),
  domains: z.array(z.nativeEnum(WorkDomain)).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "must be a kebab-case slug" }).optional().or(z.literal('')),
  tagline: z.string().optional(),
  timeline: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  metrics: z.array(MetricSchema).optional(),
  roles: z.array(z.string()).optional(),
  modules: z.array(z.object({
    name: z.string(),
    icon: z.string().optional(),
    blurb: z.string().optional(),
    roles: z.array(z.string()).optional(),
    screens: z.array(ScreenSchema),
  })).optional(),
  flows: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    steps: z.array(z.object({
      image: z.string().url().optional(),
      caption: z.string(),
      app: z.string().optional(),
    })),
  })).optional(),
  outcomes: z.array(MetricSchema).optional(),
  apps: z.array(z.object({
    name: z.string(),
    audience: z.string().optional(),
    platform: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    blurb: z.string().optional(),
    screens: z.array(ScreenSchema).optional(),
    links: z.object({
      demo: z.string().url().optional(),
      github: z.string().url().optional(),
    }).optional(),
  })).optional(),
  architecture: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      label: z.string(),
      icon: z.string().optional(),
      kind: z.string().optional(),
    })),
    edges: z.array(z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    })),
  }).optional(),
  templateMeta: z.object({
    sales: z.number().min(0).optional(),
    rating: z.number().min(0).max(5).optional(),
    category: z.string().optional(),
    envatoUrl: z.string().url().optional(),
    previewUrl: z.string().url().optional(),
  }).optional(),
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