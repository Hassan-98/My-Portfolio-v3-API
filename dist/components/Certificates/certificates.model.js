"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const CertificateSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('title')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('title'));
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
    issuanceDate: {
        type: Date,
        required: [true, error_messages_1.default.REQUIRED('issuanceDate')]
    },
    issuanceSource: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('issuanceSource')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('issuanceSource'));
        }
    },
    sourceLink: {
        type: String,
        trim: true,
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('sourceLink'));
            else if (!validator_1.default.isURL(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('sourceLink'));
        }
    },
    image: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('image')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('image'));
            else if (!validator_1.default.isURL(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('image'));
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
const Model = mongoose_1.default.model("Certificate", CertificateSchema);
exports.default = Model;
//# sourceMappingURL=certificates.model.js.map