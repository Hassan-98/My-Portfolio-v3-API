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

export interface IResume {
  templates: Template[];
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
    limit?: number;
  };
}

export interface IResumeDocument extends IResume, Document { }