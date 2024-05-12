"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const work_types_1 = require("./work.types");
const types_1 = require("../../types");
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const WorkSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('name')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('name'));
        }
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
    stackType: {
        type: String,
        trim: true,
        enum: [types_1.StackType.front, types_1.StackType.back, types_1.StackType.tools, types_1.StackType.full],
        required: [true, error_messages_1.default.REQUIRED('stackType')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('stackType'));
        }
    },
    importance: {
        type: String,
        trim: true,
        enum: [work_types_1.Importance.Glowing, work_types_1.Importance.Legacy],
        required: [true, error_messages_1.default.REQUIRED('importance')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('importance'));
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
    links: {
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
        demo: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.demo'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.demo'));
            }
        },
        apiRepo: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.apiRepo'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.apiRepo'));
            }
        },
        apiDocs: {
            type: String,
            trim: true,
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('links.apiDocs'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('links.apiDocs'));
            }
        },
    },
    images: {
        desktop: {
            type: String,
            trim: true,
            required: [true, error_messages_1.default.REQUIRED('images.desktop')],
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('images.desktop'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('images.desktop'));
            }
        },
        mobile: {
            type: String,
            trim: true,
            required: [true, error_messages_1.default.REQUIRED('images.mobile')],
            validate(field) {
                if (validator_1.default.isEmpty(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('images.mobile'));
                else if (!validator_1.default.isURL(field))
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('images.mobile'));
            }
        },
    },
    stack: [
        {
            stack: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Stack"
            },
            order: {
                type: Number,
                required: [true, error_messages_1.default.REQUIRED('stack.order')],
                validate(field) {
                    if (field < 0)
                        throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('stack.order'));
                }
            }
        }
    ],
    order: {
        type: Number,
        required: [true, error_messages_1.default.REQUIRED('order')],
        default: 1,
        validate(field) {
            if (field < 0)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('order'));
        }
    }
}, { timestamps: true });
const Model = mongoose_1.default.model("Work", WorkSchema);
exports.default = Model;
//# sourceMappingURL=work.model.js.map