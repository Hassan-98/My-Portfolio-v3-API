"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const ExperienceSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('title')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('title'));
        }
    },
    company: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('company')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('company'));
        }
    },
    companyLink: {
        type: String,
        trim: true,
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('companyLink'));
            else if (!validator_1.default.isURL(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('companyLink'));
        }
    },
    startedAt: {
        type: Date,
        required: [true, error_messages_1.default.REQUIRED('startedAt')]
    },
    endedAt: {
        type: Date
    },
    description: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('description')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('description'));
        }
    },
    showInCv: {
        type: Boolean,
        required: [true, error_messages_1.default.REQUIRED('showInCv')],
        default: false
    }
});
const Model = mongoose_1.default.model("Experience", ExperienceSchema);
exports.default = Model;
//# sourceMappingURL=experience.model.js.map