import mongoose from 'mongoose';
import validator from 'validator';
import { IWork, IWorkDocument, Importance, WorkKind, WorkDomain } from './work.types';
import { StackType } from '../../types';
import { HttpError } from '../../middlewares/error.handler.middleware';
import errorMessages from '../../utils/error-messages';

const emptyToUndefined = (value: string) => (typeof value === 'string' && value.trim() === '' ? undefined : value);

const AnnotationSchema = new mongoose.Schema({
  x: { type: Number, min: 0, max: 100 },
  y: { type: Number, min: 0, max: 100 },
  note: { type: String, trim: true }
}, { _id: false });

const ScreenSchema = new mongoose.Schema({
  image: { type: String, trim: true, required: true },
  caption: { type: String, trim: true },
  roles: { type: [String], default: undefined },
  annotations: { type: [AnnotationSchema], default: undefined }
}, { _id: false });

const ModuleSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  icon: { type: String, trim: true },
  blurb: { type: String, trim: true },
  roles: { type: [String], default: undefined },
  screens: { type: [ScreenSchema], default: [] }
}, { _id: false });

const FlowStepSchema = new mongoose.Schema({
  image: { type: String, trim: true },
  caption: { type: String, trim: true, required: true },
  app: { type: String, trim: true }
}, { _id: false });

const FlowSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  steps: { type: [FlowStepSchema], default: [] }
}, { _id: false });

const MetricSchema = new mongoose.Schema({
  label: { type: String, trim: true, required: true },
  value: { type: String, trim: true, required: true },
  icon: { type: String, trim: true }
}, { _id: false });

const AppSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  audience: { type: String, trim: true },
  platform: { type: String, trim: true },
  icon: { type: String, trim: true },
  color: { type: String, trim: true },
  blurb: { type: String, trim: true },
  screens: { type: [ScreenSchema], default: undefined },
  links: {
    type: new mongoose.Schema({
      demo: { type: String, trim: true },
      github: { type: String, trim: true }
    }, { _id: false }),
    default: undefined
  }
}, { _id: false });

const ArchitectureSchema = new mongoose.Schema({
  nodes: {
    type: [new mongoose.Schema({
      id: { type: String, trim: true, required: true },
      label: { type: String, trim: true, required: true },
      icon: { type: String, trim: true },
      kind: { type: String, trim: true }
    }, { _id: false })],
    default: []
  },
  edges: {
    type: [new mongoose.Schema({
      from: { type: String, trim: true, required: true },
      to: { type: String, trim: true, required: true },
      label: { type: String, trim: true }
    }, { _id: false })],
    default: []
  }
}, { _id: false });

const WorkSchema = new mongoose.Schema<IWorkDocument>({
  name: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('name')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('name'))
    }
  },
  description: {
    type: String,
    trim: true,
    required: [true, errorMessages.REQUIRED('description')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('description'))
    }
  },
  stackType: {
    type: String,
    trim: true,
    enum: [StackType.front, StackType.back, StackType.tools, StackType.full],
    required: [true, errorMessages.REQUIRED('stackType')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('stackType'))
    }
  },
  importance: {
    type: String,
    trim: true,
    enum: [Importance.Glowing, Importance.Legacy],
    required: [true, errorMessages.REQUIRED('importance')],
    validate(field: string) {
      if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('importance'))
    }
  },
  showInWebsite: {
    type: Boolean,
    default: true
  },
  showInCv: {
    type: Boolean,
    default: true
  },
  isTcgWork: {
    type: Boolean,
    default: false
  },
  kind: {
    type: String,
    trim: true,
    enum: [WorkKind.Standard, WorkKind.CaseStudy, WorkKind.Ecosystem, WorkKind.Template],
    default: WorkKind.Standard
  },
  domains: {
    type: [{
      type: String,
      trim: true,
      lowercase: true,
      enum: Object.values(WorkDomain)
    }],
    default: undefined,
    index: true
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    set: emptyToUndefined,
    index: {
      unique: true,
      sparse: true
    }
  },
  tagline: {
    type: String,
    trim: true,
    set: emptyToUndefined
  },
  timeline: {
    type: new mongoose.Schema({
      start: { type: String, trim: true },
      end: { type: String, trim: true }
    }, { _id: false }),
    default: undefined
  },
  metrics: {
    type: [MetricSchema],
    default: undefined
  },
  roles: {
    type: [String],
    default: undefined
  },
  modules: {
    type: [ModuleSchema],
    default: undefined
  },
  flows: {
    type: [FlowSchema],
    default: undefined
  },
  outcomes: {
    type: [MetricSchema],
    default: undefined
  },
  apps: {
    type: [AppSchema],
    default: undefined
  },
  architecture: {
    type: ArchitectureSchema,
    default: undefined
  },
  templateMeta: {
    type: new mongoose.Schema({
      sales: { type: Number, min: 0 },
      rating: { type: Number, min: 0, max: 5 },
      category: { type: String, trim: true },
      envatoUrl: { type: String, trim: true },
      previewUrl: { type: String, trim: true }
    }, { _id: false }),
    default: undefined
  },
  links: {
    github: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.github'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.github'))
      }
    },
    demo: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.demo'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.demo'))
      }
    },
    apiRepo: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.apiRepo'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.apiRepo'))
      }
    },
    apiDocs: {
      type: String,
      trim: true,
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('links.apiDocs'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('links.apiDocs'))
      }
    },
  },
  images: {
    desktop: {
      type: String,
      trim: true,
      required: [true, errorMessages.REQUIRED('images.desktop')],
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('images.desktop'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('images.desktop'))
      }
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, errorMessages.REQUIRED('images.mobile')],
      validate(field: string) {
        if (validator.isEmpty(field)) throw HttpError(400, errorMessages.EMPTY('images.mobile'));
        else if (!validator.isURL(field)) throw HttpError(400, errorMessages.NOT_VALID('images.mobile'))
      }
    },
  },
  stack: [
    {
      stack: {
        type: mongoose.Types.ObjectId,
        ref: "Stack"
      },
      order: {
        type: Number,
        required: [true, errorMessages.REQUIRED('stack.order')],
        validate(field: number) {
          if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('stack.order'))
        }
      }
    }
  ],
  order: {
    type: Number,
    required: [true, errorMessages.REQUIRED('order')],
    default: 1,
    validate(field: number) {
      if (field < 0) throw HttpError(400, errorMessages.NOT_VALID('order'))
    }
  }
}, { timestamps: true });


const Model = mongoose.model<IWorkDocument>("Work", WorkSchema);

export type IWorkModel = typeof Model;

export default Model;
