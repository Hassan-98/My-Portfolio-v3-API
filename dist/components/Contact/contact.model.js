"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const ContactSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('order')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('name'));
        }
    },
    email: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('order')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('email'));
            else if (!validator_1.default.isEmail(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('email'));
        }
    },
    message: {
        type: String,
        trim: true,
        minlength: [10, error_messages_1.default.TOO_SHORT('message', 10)],
        required: [true, error_messages_1.default.REQUIRED('message')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('message'));
        }
    }
}, { timestamps: true });
const Model = mongoose_1.default.model("Contact", ContactSchema);
exports.default = Model;
//# sourceMappingURL=contact.model.js.map