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
const experience_service_1 = __importDefault(require("./experience.service"));
//= Utils
const storage_util_1 = require("../../storage/storage.util");
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const experience_validation_1 = require("./experience.validation");
const Service = new experience_service_1.default();
let ExperienceController = class ExperienceController {
    getExperiences(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const experiences = yield Service.getExperiences(req.query);
            res.status(200).json({ success: true, data: experiences });
        });
    }
    ;
    getExperienceByIdOrName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const experience = yield Service.getExperienceByIdOrName(req.params.idOrTitle, req.query);
            res.status(200).json({ success: true, data: experience });
        });
    }
    ;
    addNewWork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const experience = yield Service.addNewExperience(req.body);
            res.status(201).json({ success: true, data: experience });
        });
    }
    ;
    updateExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const experience = yield Service.updateExperience(req.params.id, req.body);
            res.status(200).json({ success: true, data: experience });
        });
    }
    ;
    deleteExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.deleteAExperience(req.params.id);
            res.status(200).json({ success: true, data: null });
        });
    }
    ;
};
__decorate([
    (0, decorators_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "getExperiences", null);
__decorate([
    (0, decorators_1.Get)('/:idOrTitle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "getExperienceByIdOrName", null);
__decorate([
    (0, decorators_1.Post)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(experience_validation_1.ExperienceSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "addNewWork", null);
__decorate([
    (0, decorators_1.Patch)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(experience_validation_1.IDSchema)),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(experience_validation_1.ExperienceSchema.partial())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "updateExperience", null);
__decorate([
    (0, decorators_1.Delete)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(experience_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "deleteExperience", null);
ExperienceController = __decorate([
    (0, decorators_1.Controller)('/experience')
], ExperienceController);
exports.default = ExperienceController;
//# sourceMappingURL=experience.controller.js.map