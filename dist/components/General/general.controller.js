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
const general_service_1 = __importDefault(require("./general.service"));
//= Utils
const storage_util_1 = require("../../storage/storage.util");
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const general_validation_1 = require("./general.validation");
const Service = new general_service_1.default();
let GeneralController = class GeneralController {
    getGeneralSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const generalSettings = yield Service.getGeneralSettings();
            res.status(200).json({ success: true, data: generalSettings });
        });
    }
    ;
    updateSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield Service.updateSettings(req.body, req.file);
            res.status(200).json({ success: true, data: settings });
        });
    }
    ;
};
__decorate([
    (0, decorators_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneralController.prototype, "getGeneralSettings", null);
__decorate([
    (0, decorators_1.Patch)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)(storage_util_1.multer.single('picture')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(general_validation_1.GeneralSchema.partial(), ['header'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneralController.prototype, "updateSettings", null);
GeneralController = __decorate([
    (0, decorators_1.Controller)('/general')
], GeneralController);
exports.default = GeneralController;
//# sourceMappingURL=general.controller.js.map