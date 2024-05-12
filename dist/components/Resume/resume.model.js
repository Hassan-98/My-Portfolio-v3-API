"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const resume_types_1 = require("./resume.types");
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const ResumeSchema = new mongoose_1.default.Schema({
    templates: [{
            name: {
                type: String,
                validate(field) {
                    if (validator_1.default.isEmpty(field))
                        throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('templates.name'));
                }
            },
            image: {
                type: String,
                validate(field) {
                    if (validator_1.default.isEmpty(field))
                        throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('templates.image'));
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
        enableCustomSummary: {
            type: Boolean,
            default: false
        },
        customSummary: {
            type: String,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('summary.customSummary'));
            }
        },
        enableCustomTitle: {
            type: Boolean,
            default: false
        },
        customTitle: {
            type: String,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('summary.customTitle'));
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
            enum: [resume_types_1.CvSkillsPeriority.front, resume_types_1.CvSkillsPeriority.back]
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
            validate(field) {
                if (field <= 0)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('experiences.limit'));
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
            validate(field) {
                if (field <= 0)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('education.limit'));
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
        showTcgWorks: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            validate(field) {
                if (field <= 0)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('projects.limit'));
            }
        }
    }
});
const Model = mongoose_1.default.model("Resume", ResumeSchema);
exports.default = Model;
//# sourceMappingURL=resume.model.js.map