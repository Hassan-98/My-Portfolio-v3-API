"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDSchema = exports.ResumeSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
//= Types
const resume_types_1 = require("./resume.types");
exports.ResumeSchema = zod_1.z.object({
    templates: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        image: zod_1.z.string().url().optional(),
        selected: zod_1.z.boolean().optional()
    })),
    links: zod_1.z.object({
        showEmail: zod_1.z.boolean(),
        showPhone: zod_1.z.boolean(),
        showLinkedin: zod_1.z.boolean(),
        showGithub: zod_1.z.boolean(),
        showTwitter: zod_1.z.boolean(),
    }),
    summary: zod_1.z.object({
        showSection: zod_1.z.boolean(),
        showPicture: zod_1.z.boolean(),
        enableCustomSummary: zod_1.z.boolean(),
        customSummary: zod_1.z.string().optional(),
        enableCustomTitle: zod_1.z.boolean(),
        customTitle: zod_1.z.string().optional()
    }),
    skills: zod_1.z.object({
        showSection: zod_1.z.boolean(),
        showFrontendSkills: zod_1.z.boolean(),
        showBackendSkills: zod_1.z.boolean(),
        showToolsSkills: zod_1.z.boolean(),
        skillsPeriority: zod_1.z.nativeEnum(resume_types_1.CvSkillsPeriority)
    }),
    experiences: zod_1.z.object({
        showSection: zod_1.z.boolean(),
        isLimited: zod_1.z.boolean(),
        limit: zod_1.z.number().gt(0).optional()
    }),
    education: zod_1.z.object({
        showSection: zod_1.z.boolean(),
        isLimited: zod_1.z.boolean(),
        limit: zod_1.z.number().gt(0).optional()
    }),
    projects: zod_1.z.object({
        showSection: zod_1.z.boolean(),
        isLimited: zod_1.z.boolean(),
        showTcgWorks: zod_1.z.boolean(),
        limit: zod_1.z.number().gt(0).optional()
    })
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
//# sourceMappingURL=resume.validation.js.map