"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDSchema = exports.StackSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
//= Types
const types_1 = require("../../types");
exports.StackSchema = zod_1.z.object({
    name: zod_1.z.string(),
    image: zod_1.z.string().url().optional(),
    type: zod_1.z.nativeEnum(types_1.StackType),
    isNotCompitable: zod_1.z.boolean().optional()
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
//# sourceMappingURL=stack.validation.js.map