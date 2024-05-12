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
//= Decorators
const decorators_1 = require("../../decorators");
//= Service
const user_service_1 = __importDefault(require("./user.service"));
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const user_validation_1 = require("./user.validation");
const Service = new user_service_1.default();
let UserController = class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield Service.getUsers(req.query);
            res.status(200).json({ success: true, data: users });
        });
    }
    ;
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield Service.getUserById(req.params.id);
            res.status(200).json({ success: true, data: user });
        });
    }
    ;
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield Service.getUserByEmail(req.params.email);
            res.status(200).json({ success: true, data: user });
        });
    }
    ;
    updateUserPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const providedData = {
                currentPassword: req.body.currentPassword,
                newPassword: req.body.newPassword
            };
            let user = yield Service.updateUserPassword(providedData);
            res.status(200).json({ success: true, data: user });
        });
    }
    ;
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield Service.updateUserData(req.params.id, req.body);
            res.status(200).json({ success: true, data: user });
        });
    }
    ;
};
__decorate([
    (0, decorators_1.Get)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, decorators_1.Get)('/byId/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(user_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, decorators_1.Get)('/byEmail/:email'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(user_validation_1.EmailSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByEmail", null);
__decorate([
    (0, decorators_1.Patch)('/password'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(user_validation_1.UpdatePasswordSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserPassword", null);
__decorate([
    (0, decorators_1.Patch)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(user_validation_1.IDSchema)),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(user_validation_1.UserSchema.partial())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
UserController = __decorate([
    (0, decorators_1.Controller)('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map