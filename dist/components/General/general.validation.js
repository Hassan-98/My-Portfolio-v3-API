"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
exports.GeneralSchema = zod_1.z.object({
    header: zod_1.z.object({
        jobTitle: zod_1.z.string(),
        descriptionText: zod_1.z.string().min(10),
        pictureUrl: zod_1.z.string().url().optional(),
    }),
    intro: zod_1.z.object({
        experienceYears: zod_1.z.number().gt(0),
        jobTitle: zod_1.z.string(),
        aboutMe: zod_1.z.string().min(10),
    }),
    links: zod_1.z.object({
        github: zod_1.z.string().url().optional(),
        demo: zod_1.z.string().url().optional(),
        apiRepo: zod_1.z.string().url().optional(),
        apiDocs: zod_1.z.string().url().optional(),
    }),
    recentStack: zod_1.z.array(zod_1.z.object({
        stack: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
        order: zod_1.z.number().gt(0),
    }))
});
//# sourceMappingURL=general.validation.js.map