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
const stack_service_1 = __importDefault(require("./stack.service"));
//= Utils
const storage_util_1 = require("../../storage/storage.util");
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const stack_validation_1 = require("./stack.validation");
const Service = new stack_service_1.default();
let StackController = class StackController {
    getStacks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stacks = yield Service.getStacks(req.query);
            res.status(200).json({ success: true, data: stacks });
        });
    }
    ;
    getStackByIdOrName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = yield Service.getStackByIdOrName(req.params.idOrName, req.query);
            res.status(200).json({ success: true, data: stack });
        });
    }
    ;
    addNewWork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = yield Service.addNewStack({ data: req.body, image: req.file });
            res.status(201).json({ success: true, data: stack });
        });
    }
    ;
    updateStack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = yield Service.updateStack(req.params.id, req.body, req.file);
            res.status(200).json({ success: true, data: stack });
        });
    }
    ;
    deleteStack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.deleteAStack(req.params.id);
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
], StackController.prototype, "getStacks", null);
__decorate([
    (0, decorators_1.Get)('/:idOrName'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "getStackByIdOrName", null);
__decorate([
    (0, decorators_1.Post)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(stack_validation_1.StackSchema, ['isNotCompitable', 'order'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "addNewWork", null);
__decorate([
    (0, decorators_1.Patch)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(stack_validation_1.IDSchema)),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(stack_validation_1.StackSchema.partial(), ['isNotCompitable', 'order'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "updateStack", null);
__decorate([
    (0, decorators_1.Delete)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(stack_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "deleteStack", null);
StackController = __decorate([
    (0, decorators_1.Controller)('/stack')
], StackController);
exports.default = StackController;
//# sourceMappingURL=stack.controller.js.map