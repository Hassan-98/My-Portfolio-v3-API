import { Document } from 'mongoose';

export type Template = {
  name: string;
  image: string;
  selected: boolean;
}

export enum CvSkillsPeriority {
  front = "front",
  back = "back"
}

/** The built-in resume designs shipped by the frontend. */
export enum ResumeTemplateId {
  classic = "classic",
  sidebar = "sidebar",
  timeline = "timeline",
  compact = "compact",
  elegant = "elegant"
}

/** Re-orderable / hideable blocks of the resume body. */
export enum ResumeSectionKey {
  summary = "summary",
  skills = "skills",
  experiences = "experiences",
  education = "education",
  projects = "projects"
}

export enum ResumeFontFamily {
  sans = "sans",
  serif = "serif",
  mono = "mono"
}

export enum ResumeDensity {
  compact = "compact",
  normal = "normal",
  relaxed = "relaxed"
}

/**
 * Per-design look & feel. Every field is optional — the frontend merges what is
 * stored onto that template's own defaults, so an absent key means "inherit"
 * rather than "empty".
 */
export interface ResumeCustomization {
  fullName?: string;
  accentColor?: string;
  fontFamily?: ResumeFontFamily;
  fontScale?: number;
  density?: ResumeDensity;
  uppercaseHeadings?: boolean;
  showSectionIcons?: boolean;
  sectionOrder?: ResumeSectionKey[];
  hiddenSections?: ResumeSectionKey[];
  sectionTitles?: Partial<Record<ResumeSectionKey, string>>;
}

export interface IResume {
  templates: Template[];
  /** Which built-in design the public resume page renders. */
  activeTemplate?: ResumeTemplateId;
  /** Look & feel keyed by design, so tuning one never clobbers another. */
  customizations?: Partial<Record<ResumeTemplateId, ResumeCustomization>>;
  links: {
    showEmail: boolean;
    showPhone: boolean;
    showLinkedin: boolean;
    showGithub: boolean;
    showTwitter: boolean;
  };
  summary: {
    showSection: boolean;
    showPicture: boolean;
    enableCustomSummary: boolean;
    customSummary?: string;
    enableCustomTitle: boolean;
    customTitle?: string;
  };
  skills: {
    showSection: boolean;
    showFrontendSkills: boolean;
    showBackendSkills: boolean;
    showToolsSkills: boolean;
    skillsPeriority: CvSkillsPeriority;
  };
  experiences: {
    showSection: boolean;
    isLimited: boolean;
    limit?: number;
  };
  education: {
    showSection: boolean;
    isLimited: boolean;
    limit?: number;
  };
  projects: {
    showSection: boolean;
    isLimited: boolean;
    showTcgWorks: boolean;
    limit?: number;
  };
}

export interface IResumeDocument extends IResume, Document { }