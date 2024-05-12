"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassUser = exports.NotAuthenticated = exports.Authenticated = void 0;
//= Modules
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//= Models
const user_model_1 = __importDefault(require("../User/user.model"));
//= Config
const app_config_1 = __importDefault(require("../../configs/app.config"));
//= Error Messages
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const Config = (0, app_config_1.default)();
const Authenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const JWT_Token = req.signedCookies['portfolio-login-session'];
        if (!JWT_Token)
            return res.status(403).json({ success: false, data: null, message: error_messages_1.default.AUTH_REQUIRED });
        const { user: userId } = jsonwebtoken_1.default.verify(JWT_Token, Config.JWT_SECRET);
        if (!userId)
            return res.status(403).json({ success: false, data: null, message: error_messages_1.default.AUTH_REQUIRED });
        const user = yield user_model_1.default.findById(userId).select({ username: 1, email: true, external_auth: 1 }).lean();
        req.user = user;
        next();
    }
    catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
});
exports.Authenticated = Authenticated;
const NotAuthenticated = (req, res, next) => {
    try {
        const JWT_Token = req.signedCookies['portfolio-login-session'];
        if (!JWT_Token)
            return next();
        jsonwebtoken_1.default.verify(JWT_Token, Config.JWT_SECRET);
        return res.status(400).json({ success: false, data: null, message: error_messages_1.default.ALREADY_AUTHENTICATED });
    }
    catch (_a) {
        next();
    }
};
exports.NotAuthenticated = NotAuthenticated;
const PassUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const JWT_Token = req.signedCookies['portfolio-login-session'];
        if (!JWT_Token)
            return next();
        const { user: userId } = jsonwebtoken_1.default.verify(JWT_Token, Config.JWT_SECRET);
        if (!userId)
            return next();
        const user = yield user_model_1.default.findById(userId).select({ username: 1, email: true, external_auth: 1 }).lean();
        req.user = user;
        next();
    }
    catch (e) {
        res.status(500).json({ err: e.message });
    }
});
exports.PassUser = PassUser;
//# sourceMappingURL=auth.middleware.js.map