"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const stack_types_1 = require("./stack.types");
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const StackSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('name'));
        }
    },
    image: {
        type: String,
        trim: true,
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('image'));
            else if (!validator_1.default.isURL(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_VALID('image'));
        }
    },
    type: {
        type: String,
        enum: [stack_types_1.StackType.front, stack_types_1.StackType.back, stack_types_1.StackType.tools, stack_types_1.StackType.full],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('type'));
        }
    },
    isNotCompitable: {
        type: Boolean,
        default: false
    }
});
const Model = mongoose_1.default.model("Stack", StackSchema);
exports.default = Model;
//# sourceMappingURL=stack.model.js.map