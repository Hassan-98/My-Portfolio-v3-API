"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//= Decorators
const decorators_1 = require("../../decorators");
//= Service
const auth_service_1 = __importDefault(require("./auth.service"));
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("./auth.middleware");
//= Validators
const user_validation_1 = require("../User/user.validation");
//= Config
const app_config_1 = __importDefault(require("../../configs/app.config"));
const Config = (0, app_config_1.default)();
const Service = new auth_service_1.default();
let AuthController = class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, rememberMe } = req.body;
            let { token, userId } = yield Service.login({ email, password, rememberMe });
            const userData = yield Service.findUserById(userId);
            res.cookie('portfolio-login-session', token, Object.assign(Object.assign({ secure: Config.isProduction, httpOnly: true, signed: true }, (process.env.NODE_ENV === 'development' ? {} : { domain: ".hassanali.tk" })), { expires: new Date(new Date().getTime() + 60 * 60 * 1000) })).status(200).json({ success: true, data: userData });
        });
    }
    ;
    loginWithExternalProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { access_token } = req.body;
            const { user, status, token } = yield Service.loginWithProvider({ access_token });
            const userData = yield Service.findUserById(user._id);
            res.cookie('portfolio-login-session', token, Object.assign(Object.assign({ secure: Config.isProduction, httpOnly: true, signed: true }, (process.env.NODE_ENV === 'development' ? {} : { domain: ".hassanali.tk" })), { expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000) }))
                .status(status === 'login' ? 200 : 201)
                .json({ success: true, data: userData });
        });
    }
    verifyLoginToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.signedCookies['portfolio-login-session'];
            jsonwebtoken_1.default.verify(token, Config.JWT_SECRET);
            res.status(200).json({ success: true, data: null });
        });
    }
    logout(_, res) {
        res.clearCookie('portfolio-login-session', Object.assign({}, (process.env.NODE_ENV === 'development' ? {} : { domain: ".hassanali.tk" }))).status(200).json({ success: true, data: null });
    }
    ;
};
__decorate([
    (0, decorators_1.Post)('/login'),
    (0, decorators_1.Use)(auth_middleware_1.NotAuthenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(user_validation_1.LoginSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.Post)('/with-provider'),
    (0, decorators_1.Use)(auth_middleware_1.NotAuthenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(user_validation_1.ProviderLoginSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithExternalProvider", null);
__decorate([
    (0, decorators_1.Post)('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLoginToken", null);
__decorate([
    (0, decorators_1.Post)('/logout'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, decorators_1.Controller)('/auth')
], AuthController);
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map