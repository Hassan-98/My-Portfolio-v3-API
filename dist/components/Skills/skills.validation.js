"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.IDSchema = exports.SkillsByTypeSchema = exports.SkillSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
//= Types
const skills_types_1 = require("./skills.types");
const stack_types_1 = require("../Stack/stack.types");
exports.SkillSchema = zod_1.z.object({
    skill: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
    mastery: zod_1.z.nativeEnum(skills_types_1.SkillMastery),
    type: zod_1.z.nativeEnum(stack_types_1.StackType),
    order: zod_1.z.number().gt(0)
});
exports.SkillsByTypeSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.object({
        skill: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
        mastery: zod_1.z.nativeEnum(skills_types_1.SkillMastery),
        type: zod_1.z.nativeEnum(stack_types_1.StackType),
        order: zod_1.z.number().gt(0)
    })),
    type: zod_1.z.nativeEnum(stack_types_1.StackType)
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
exports.OrderSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
    order: zod_1.z.number().gt(0)
}));
//# sourceMappingURL=skills.validation.js.map