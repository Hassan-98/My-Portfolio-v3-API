"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.IDSchema = exports.WorkSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
//= Types
const types_1 = require("../../types");
const work_types_1 = require("./work.types");
exports.WorkSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().min(15),
    stackType: zod_1.z.nativeEnum(types_1.StackType),
    importance: zod_1.z.nativeEnum(work_types_1.Importance),
    showInCv: zod_1.z.boolean(),
    showInWebsite: zod_1.z.boolean(),
    isTcgWork: zod_1.z.boolean(),
    links: zod_1.z.object({
        github: zod_1.z.string().url().optional(),
        demo: zod_1.z.string().url().optional(),
        apiRepo: zod_1.z.string().url().optional(),
        apiDocs: zod_1.z.string().url().optional(),
    }),
    images: zod_1.z.object({
        desktop: zod_1.z.string().url(),
        mobile: zod_1.z.string().url(),
    }).optional(),
    stack: zod_1.z.array(zod_1.z.object({
        stack: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
        order: zod_1.z.number().gt(0),
    })),
    order: zod_1.z.number().gt(0),
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
exports.OrderSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
    order: zod_1.z.number().gt(0)
}));
//# sourceMappingURL=work.validation.js.map