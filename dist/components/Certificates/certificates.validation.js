"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.IDSchema = exports.CertificateSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
exports.CertificateSchema = zod_1.z.object({
    title: zod_1.z.string(),
    issuanceDate: zod_1.z.coerce.date(),
    issuanceSource: zod_1.z.string(),
    sourceLink: zod_1.z.string().url().optional(),
    description: zod_1.z.string().min(15),
    image: zod_1.z.string().url().optional(),
    showInWebsite: zod_1.z.boolean().optional(),
    showInCv: zod_1.z.boolean(),
    order: zod_1.z.number().gt(0),
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
exports.OrderSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
    order: zod_1.z.number().gt(0)
}));
//# sourceMappingURL=certificates.validation.js.map