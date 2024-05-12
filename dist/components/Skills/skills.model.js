"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const skills_types_1 = require("./skills.types");
const stack_types_1 = require("../Stack/stack.types");
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const SkillSchema = new mongoose_1.default.Schema({
    skill: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, error_messages_1.default.REQUIRED('skill')],
        ref: "Stack"
    },
    mastery: {
        type: String,
        enum: [skills_types_1.SkillMastery.Proficient, skills_types_1.SkillMastery.Moderate],
        required: [true, error_messages_1.default.REQUIRED('mastery')]
    },
    type: {
        type: String,
        enum: [stack_types_1.StackType.front, stack_types_1.StackType.back, stack_types_1.StackType.tools, stack_types_1.StackType.full],
        required: [true, error_messages_1.default.REQUIRED('type')],
        validate(field) {
            if (validator_1.default.isEmpty(field))
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.EMPTY('type'));
        }
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
});
const Model = mongoose_1.default.model("Skill", SkillSchema);
exports.default = Model;
//# sourceMappingURL=skills.model.js.map