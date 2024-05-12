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
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
//= Modules
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//= Models
const user_model_1 = __importDefault(require("../User/user.model"));
//= Utils
const auth_utils_1 = require("./auth.utils");
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const uploadFromUrl_1 = __importDefault(require("../../storage/uploadFromUrl"));
//= Config
const app_config_1 = __importDefault(require("../../configs/app.config"));
const Config = (0, app_config_1.default)();
class AuthService {
    constructor() {
        this.USER_MODEL = user_model_1.default;
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.USER_MODEL.findById(id, { password: 0 }).lean();
            return user;
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.USER_MODEL.findOne({ email: credentials.email }, { email: 1, password: 1, accountStatus: 1, password_linked: 1, role: 1 }).lean();
            if (!user)
                throw (0, error_handler_middleware_1.HttpError)(422, error_messages_1.default.INVALID_CREDENTIALS);
            const decryptedPassword = crypto_js_1.default.AES.decrypt(user.password, Config.CRYPTO_SECRET).toString(crypto_js_1.default.enc.Utf8);
            if (credentials.password !== decryptedPassword)
                throw (0, error_handler_middleware_1.HttpError)(422, error_messages_1.default.INVALID_CREDENTIALS);
            let token = jsonwebtoken_1.default.sign({ user: user._id }, Config.JWT_SECRET, { expiresIn: credentials.rememberMe ? '365d' : '1d' });
            return { token, userId: user._id };
        });
    }
    create(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.USER_MODEL.create({
                username: credentials.username,
                email: credentials.email,
                password: crypto_js_1.default.AES.encrypt(credentials.password, Config.CRYPTO_SECRET).toString()
            });
            let token = jsonwebtoken_1.default.sign({ user: user._id }, Config.JWT_SECRET, { expiresIn: credentials.rememberMe ? '365d' : '1d' });
            return { token, userId: user._id };
        });
    }
    loginWithProvider({ access_token }) {
        return __awaiter(this, void 0, void 0, function* () {
            let userProfile;
            let status = 'login';
            const verifyResponse = yield (0, auth_utils_1.verifyGoogleAuth)(access_token);
            if (!verifyResponse)
                throw (0, error_handler_middleware_1.HttpError)(500, error_messages_1.default.AUTH_ERROR);
            if (verifyResponse.email !== Config.GOOGLE_LOGIN_EMAIL)
                throw (0, error_handler_middleware_1.HttpError)(403, error_messages_1.default.INVALID_CREDENTIALS);
            userProfile = {
                username: verifyResponse.name || "",
                email: verifyResponse.email || "",
                imageUrl: verifyResponse.picture || "",
                id: verifyResponse.sub
            };
            let user = yield this.USER_MODEL.findOne({ 'externalAuth.userId': userProfile.id });
            // Perform sign up operation
            if (!user) {
                if (!userProfile)
                    throw (0, error_handler_middleware_1.HttpError)(417, error_messages_1.default.PROVIDER_ERROR);
                let userFound = yield this.USER_MODEL.findOne({ email: userProfile.email }, { email: 1 });
                if (userFound)
                    throw (0, error_handler_middleware_1.HttpError)(403, error_messages_1.default.AUTH_LINKED);
                user = yield this.USER_MODEL.create({
                    username: userProfile.username,
                    email: userProfile.email,
                    email_confirmed: true,
                    externalAuth: {
                        userId: userProfile.id,
                        linked: true
                    }
                });
                status = 'signup';
                const uploadedPicture = yield (0, uploadFromUrl_1.default)(userProfile.imageUrl, user._id, 'image');
                user.picture = uploadedPicture.url;
                yield user.save();
            }
            const token = jsonwebtoken_1.default.sign({ user: user._id }, Config.JWT_SECRET, { expiresIn: '1h' });
            return { user, status, token };
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map