"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordSchema = exports.EmailSchema = exports.IDSchema = exports.VerifyTokenSchema = exports.ProviderLoginSchema = exports.LoginSchema = exports.UserSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
exports.UserSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email({ message: "Email Address is invalid" }),
    password: zod_1.z.string().min(6, { message: "Password must be 6 or more characters long" }),
    picture: zod_1.z.string().url().optional(),
    externalAuth: zod_1.z.object({
        userId: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
        linked: zod_1.z.boolean()
    }).optional()
});
exports.LoginSchema = exports.UserSchema.pick({ email: true, password: true });
exports.ProviderLoginSchema = zod_1.z.object({
    access_token: zod_1.z.string(),
    rememberMe: zod_1.z.boolean().optional()
});
exports.VerifyTokenSchema = zod_1.z.object({
    token: zod_1.z.string()
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
exports.EmailSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.UpdatePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6).optional(),
    newPassword: zod_1.z.string().min(6, { message: "Password must be 6 or more characters long" })
});
//# sourceMappingURL=user.validation.js.map