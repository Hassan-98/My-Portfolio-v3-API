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
const contact_service_1 = __importDefault(require("./contact.service"));
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Validations
const contact_validation_1 = require("./contact.validation");
const Service = new contact_service_1.default();
let StackController = class StackController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield Service.getMessages(req.query);
            res.status(200).json({ success: true, data: messages });
        });
    }
    ;
    getOneById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield Service.getMessageById(req.params.id, req.query);
            res.status(200).json({ success: true, data: message });
        });
    }
    ;
    addNewOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield Service.addNewContactMessage(req.body);
            res.status(201).json({ success: true, data: message });
        });
    }
    ;
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.deleteAMessage(req.params.id);
            res.status(200).json({ success: true, data: null });
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
], StackController.prototype, "getAll", null);
__decorate([
    (0, decorators_1.Get)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(contact_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "getOneById", null);
__decorate([
    (0, decorators_1.Post)('/'),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(contact_validation_1.ContactSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "addNewOne", null);
__decorate([
    (0, decorators_1.Delete)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(contact_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StackController.prototype, "deleteOne", null);
StackController = __decorate([
    (0, decorators_1.Controller)('/contact')
], StackController);
exports.default = StackController;
//# sourceMappingURL=contact.controller.js.map