import mongoose from 'mongoose';
import validator from 'validator';
import { CvSkillsPeriority, IResumeDocument } from './resume.types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const ResumeSchema = new mongoose.Schema<IResumeDocument>({
  templates: [{
    name: {
      type: String,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('templates.name'))
      }
    },
    image: {
      type: String,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('templates.image'))
      }
    },
    selected: {
      type: Boolean,
      default: false
    }
  }],
  links: {
    showEmail: {
      type: Boolean,
      default: true
    },
    showPhone: {
      type: Boolean,
      default: true
    },
    showLinkedin: {
      type: Boolean,
      default: true
    },
    showGithub: {
      type: Boolean,
      default: true
    },
    showTwitter: {
      type: Boolean,
      default: false
    },
  },
  summary: {
    showSection: {
      type: Boolean,
      default: true
    },
    showPicture: {
      type: Boolean,
      default: true
    },
    enableCustomTitle: {
      type: Boolean,
      default: true
    },
    customTitle: {
      type: String,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('summary.customTitle'))
      }
    }
  },
  skills: {
    showSection: {
      type: Boolean,
      default: true
    },
    showFrontendSkills: {
      type: Boolean,
      default: true
    },
    showBackendSkills: {
      type: Boolean,
      default: true
    },
    showToolsSkills: {
      type: Boolean,
      default: true
    },
    skillsPeriority: {
      type: String,
      enum: [CvSkillsPeriority.front, CvSkillsPeriority.back]
    },
  },
  experiences: {
    showSection: {
      type: Boolean,
      default: true
    },
    isLimited: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      validate(field: number) {
        if (field <= 0) throw HttpError(400, errorMessages.NOT_VALID('experiences.limit'))
      }
    }
  },
  education: {
    showSection: {
      type: Boolean,
      default: true
    },
    isLimited: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      validate(field: number) {
        if (field <= 0) throw HttpError(400, errorMessages.NOT_VALID('education.limit'))
      }
    }
  },
  projects: {
    showSection: {
      type: Boolean,
      default: true
    },
    isLimited: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      validate(field: number) {
        if (field <= 0) throw HttpError(400, errorMessages.NOT_VALID('projects.limit'))
      }
    }
  }
});


const Model = mongoose.model<IResumeDocument>("Resume", ResumeSchema);

export type IResumeModel = typeof Model;

export default Model;
