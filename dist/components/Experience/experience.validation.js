"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDSchema = exports.ExperienceSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
exports.ExperienceSchema = zod_1.z.object({
    title: zod_1.z.string(),
    company: zod_1.z.string(),
    companyLink: zod_1.z.string().url().optional(),
    startedAt: zod_1.z.coerce.date(),
    endedAt: zod_1.z.coerce.date().optional(),
    description: zod_1.z.string(),
    showInCv: zod_1.z.boolean()
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
//# sourceMappingURL=experience.validation.js.map