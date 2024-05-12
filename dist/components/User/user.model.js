"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        trim: true,
        validate(username) {
            if (validator_1.default.isEmpty(username))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('username'));
        }
    },
    email: {
        type: String,
        required: [true, error_messages_1.default.REQUIRED('email address')],
        unique: true,
        trim: true,
        validate(email) {
            if (validator_1.default.isEmpty(email))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('email address'));
            else if (!validator_1.default.isEmail(email))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('email address'));
        }
    },
    password: {
        type: String,
        required: [true, error_messages_1.default.REQUIRED('password')],
        minlength: [6, error_messages_1.default.TOO_SHORT('password', 6)],
        default: 'not-linked'
    },
    picture: {
        type: String,
        validate(pic) {
            if (validator_1.default.isEmpty(pic))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('picture'));
            else if (!validator_1.default.isURL(pic))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID_URL('picture'));
        }
    },
    externalAuth: {
        userId: {
            type: String,
            default: "not-linked",
            index: true
        },
        linked: {
            type: Boolean,
            default: false
        }
    }
}, { timestamps: true });
const Model = mongoose_1.default.model("User", UserSchema);
exports.default = Model;
//# sourceMappingURL=user.model.js.map