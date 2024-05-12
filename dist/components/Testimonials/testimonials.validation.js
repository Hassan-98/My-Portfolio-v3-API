"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDSchema = exports.TestimonialSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
exports.TestimonialSchema = zod_1.z.object({
    authorName: zod_1.z.string(),
    authorPosition: zod_1.z.string(),
    content: zod_1.z.string(),
    rating: zod_1.z.number().gte(1).lte(5)
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
//# sourceMappingURL=testimonials.validation.js.map