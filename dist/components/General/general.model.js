"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const GeneralSchema = new mongoose_1.default.Schema({
    header: {
        jobTitle: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('header.jobTitle'));
            }
        },
        descriptionText: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('header.descriptionText'));
            }
        },
        pictureUrl: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('header.pictureUrl'));
            }
        }
    },
    intro: {
        experienceYears: {
            type: Number,
            validate(field) {
                if (field < 0)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('intro.experienceYears'));
            }
        },
        jobTitle: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('intro.jobTitle'));
            }
        },
        aboutMe: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('intro.aboutMe'));
            }
        }
    },
    links: {
        emailAddress: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.emailAddress'));
                else if (!validator_1.default.isEmail(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.emailAddress'));
            }
        },
        phoneNumber: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.phoneNumber'));
            }
        },
        github: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.github'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.github'));
            }
        },
        linkedin: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.linkedin'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.linkedin'));
            }
        },
        twitter: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.twitter'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.twitter'));
            }
        }
    },
    recentStack: [
        {
            stack: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Stack"
            },
            order: {
                type: Number,
                validate(field) {
                    if (field < 0)
                        throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('recentStack.order'));
                }
            }
        }
    ]
});
const Model = mongoose_1.default.model("General", GeneralSchema);
exports.default = Model;
//# sourceMappingURL=general.model.js.map