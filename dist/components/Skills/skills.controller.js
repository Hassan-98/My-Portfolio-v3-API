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
const skills_service_1 = __importDefault(require("./skills.service"));
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const skills_validation_1 = require("./skills.validation");
const Service = new skills_service_1.default();
let SkillController = class SkillController {
    getSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skills = yield Service.getSkills(req.query);
            res.status(200).json({ success: true, data: skills });
        });
    }
    ;
    getSkillById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skill = yield Service.getSkillById(req.params.id, req.query);
            res.status(200).json({ success: true, data: skill });
        });
    }
    ;
    addNewSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skill = yield Service.addNewSkill(req.body);
            res.status(201).json({ success: true, data: skill });
        });
    }
    ;
    updateSkillsByType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.updateSkillsByType(req.body.skills, req.body.type);
            res.status(200).json({ success: true, data: null });
        });
    }
    ;
    updateSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skill = yield Service.updateSkill(req.params.id, req.body);
            res.status(200).json({ success: true, data: skill });
        });
    }
    ;
    deleteSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.deleteASkill(req.params.id);
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
], SkillController.prototype, "getSkills", null);
__decorate([
    (0, decorators_1.Get)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "getSkillById", null);
__decorate([
    (0, decorators_1.Post)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(skills_validation_1.SkillSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "addNewSkill", null);
__decorate([
    (0, decorators_1.Patch)('/type'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(skills_validation_1.SkillsByTypeSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "updateSkillsByType", null);
__decorate([
    (0, decorators_1.Patch)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(skills_validation_1.IDSchema)),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(skills_validation_1.SkillSchema.partial())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "updateSkill", null);
__decorate([
    (0, decorators_1.Delete)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(skills_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "deleteSkill", null);
SkillController = __decorate([
    (0, decorators_1.Controller)('/skills')
], SkillController);
exports.default = SkillController;
//# sourceMappingURL=skills.controller.js.map