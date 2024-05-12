"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const TestimonialSchema = new mongoose_1.default.Schema({
    authorName: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('title')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('authorName'));
        }
    },
    authorPosition: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('company')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('authorPosition'));
        }
    },
    content: {
        type: String,
        trim: true,
        required: [true, error_messages_1.default.REQUIRED('description')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('content'));
        }
    },
    rating: {
        type: Number,
        required: [true, error_messages_1.default.REQUIRED('showInCv')],
        default: 5,
        validate(field) {
            if (field < 1 || field > 5)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('rating'));
        }
    }
});
const Model = mongoose_1.default.model("Testimonial", TestimonialSchema);
exports.default = Model;
//# sourceMappingURL=testimonials.model.js.map