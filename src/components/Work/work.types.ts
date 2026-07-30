import { Document, ObjectId } from 'mongoose';
//= Types
import { StackType } from '../../types';

export enum Importance {
  Glowing = "glowing",
  Legacy = "legacy"
}

export enum WorkKind {
  Standard = "standard",
  CaseStudy = "case-study",
  Ecosystem = "ecosystem",
  Template = "template"
}

/**
 * Industry domain a work belongs to — the axis visitors filter by on the
 * portfolio ("has this person built an LMS before?"). A work can span
 * several domains (a gaming store is both `gaming` and `e-commerce`).
 *
 * This enum is the source of truth; the Admin picker and the portfolio's
 * label/icon map mirror it. Adding a value here is safe — the portfolio
 * only renders chips for domains that actually have works.
 */
export enum WorkDomain {
  ELearning = "e-learning",
  ECommerce = "e-commerce",
  Gaming = "gaming",
  Healthcare = "healthcare",
  Fintech = "fintech",
  Security = "security",
  Corporate = "corporate",
  DevTools = "dev-tools",
  Creative = "creative",
  Media = "media",
  Sports = "sports",
  Food = "food",
  Events = "events",
  RealEstate = "real-estate",
  Logistics = "logistics",
  NonProfit = "non-profit"
}

export interface IScreenAnnotation {
  x: number; // 0-100 (% of image width)
  y: number; // 0-100 (% of image height)
  note: string;
}

export interface IScreen {
  image: string;
  caption?: string;
  roles?: string[];
  annotations?: IScreenAnnotation[];
}

export interface IWorkModule {
  name: string;
  icon?: string;
  blurb?: string;
  roles?: string[];
  screens: IScreen[];
}

export interface IFlowStep {
  image?: string;
  caption: string;
  app?: string;
}

export interface IWorkFlow {
  title: string;
  description?: string;
  steps: IFlowStep[];
}

export interface IWorkMetric {
  label: string;
  value: string;
  icon?: string;
}

export interface IWorkApp {
  name: string;
  audience?: string;
  platform?: string;
  icon?: string;
  color?: string;
  blurb?: string;
  screens?: IScreen[];
  links?: {
    demo?: string;
    github?: string;
  };
}

export interface IArchNode {
  id: string;
  label: string;
  icon?: string;
  kind?: string; // app | api | db | service | external
}

export interface IArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ITemplateMeta {
  sales?: number;
  rating?: number;
  category?: string;
  envatoUrl?: string;
  previewUrl?: string;
}

export interface IWork {
  name: string;
  description: string;
  stackType: StackType;
  importance: Importance;
  showInCv: boolean;
  showInWebsite: boolean;
  isTcgWork: boolean;
  kind?: WorkKind;
  domains?: WorkDomain[];
  slug?: string;
  tagline?: string;
  timeline?: {
    start?: string;
    end?: string;
  };
  metrics?: IWorkMetric[];
  roles?: string[];
  modules?: IWorkModule[];
  flows?: IWorkFlow[];
  outcomes?: IWorkMetric[];
  apps?: IWorkApp[];
  architecture?: {
    nodes: IArchNode[];
    edges: IArchEdge[];
  };
  templateMeta?: ITemplateMeta;
  links: {
    github?: string;
    demo?: string;
    apiRepo?: string;
    apiDocs?: string;
  };
  images: {
    desktop: string;
    mobile: string;
  };
  stack: { stack: ObjectId; order: number }[];
  order: number;
}

export interface IWorkDocument extends IWork, Document { }
