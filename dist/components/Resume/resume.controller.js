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
const resume_service_1 = __importDefault(require("./resume.service"));
//= Utils
const storage_util_1 = require("../../storage/storage.util");
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const resume_validation_1 = require("./resume.validation");
const Service = new resume_service_1.default();
let ResumeController = class ResumeController {
    getResumePreferences(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resumePreferences = yield Service.getResumePreferences();
            res.status(200).json({ success: true, data: resumePreferences });
        });
    }
    ;
    addTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resumePreferences = yield Service.addTemplate({ data: req.body, image: req.file });
            res.status(200).json({ success: true, data: resumePreferences });
        });
    }
    ;
    updateTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resumePreferences = yield Service.updateTemplate({ id: req.params.id, updates: req.body, image: req.file });
            res.status(200).json({ success: true, data: resumePreferences });
        });
    }
    ;
    deleteTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resumePreferences = yield Service.deleteTemplate(req.params.id);
            res.status(200).json({ success: true, data: resumePreferences });
        });
    }
    ;
    updatePreferences(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resumePreferences = yield Service.updatePreferences(req.body);
            res.status(200).json({ success: true, data: resumePreferences });
        });
    }
    ;
};
__decorate([
    (0, decorators_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "getResumePreferences", null);
__decorate([
    (0, decorators_1.Post)('/template'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(resume_validation_1.ResumeSchema.partial(), ['templates'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "addTemplate", null);
__decorate([
    (0, decorators_1.Patch)('/template/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(resume_validation_1.IDSchema)),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(resume_validation_1.ResumeSchema.partial(), ['templates'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "updateTemplate", null);
__decorate([
    (0, decorators_1.Delete)('/template/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(resume_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "deleteTemplate", null);
__decorate([
    (0, decorators_1.Patch)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(resume_validation_1.ResumeSchema.partial().omit({ templates: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "updatePreferences", null);
ResumeController = __decorate([
    (0, decorators_1.Controller)('/resume')
], ResumeController);
exports.default = ResumeController;
//# sourceMappingURL=resume.controller.js.map