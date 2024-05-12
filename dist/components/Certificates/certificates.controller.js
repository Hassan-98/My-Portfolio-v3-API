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
const certificates_service_1 = __importDefault(require("./certificates.service"));
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Utils
const storage_util_1 = require("../../storage/storage.util");
//= Validations
const certificates_validation_1 = require("./certificates.validation");
const Service = new certificates_service_1.default();
let CertificatesController = class CertificatesController {
    getAllCertificates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allCertificates = yield Service.getAllCertificates(req.query);
            res.status(200).json({ success: true, data: allCertificates });
        });
    }
    ;
    getACertificateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = yield Service.getCertificateById(req.params.id, req.query);
            res.status(200).json({ success: true, data: certificate });
        });
    }
    ;
    addNewCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploaded_image = req.file;
            const certificate = yield Service.addNewCertificate({ data: req.body, image: uploaded_image });
            res.status(201).json({ success: true, data: certificate });
        });
    }
    ;
    updateCertificateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.updateCertificatesOrder(req.body);
            res.status(200).json({ success: true, data: null });
        });
    }
    ;
    updateCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploaded_image = req.file;
            const certificate = yield Service.updateCertificate(req.params.id, req.body, uploaded_image);
            res.status(200).json({ success: true, data: certificate });
        });
    }
    ;
    deleteCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.deleteCertificate(req.params.id);
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
], CertificatesController.prototype, "getAllCertificates", null);
__decorate([
    (0, decorators_1.Get)('/:id'),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(certificates_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "getACertificateById", null);
__decorate([
    (0, decorators_1.Post)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(certificates_validation_1.CertificateSchema, ['showInCv', 'showInWebsite', 'order'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "addNewCertificate", null);
__decorate([
    (0, decorators_1.Patch)('/order'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(certificates_validation_1.OrderSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "updateCertificateOrder", null);
__decorate([
    (0, decorators_1.Patch)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(certificates_validation_1.IDSchema)),
    (0, decorators_1.Use)(storage_util_1.multer.single('image')),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(certificates_validation_1.CertificateSchema.partial(), ['showInCv', 'showInWebsite', 'order'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "updateCertificate", null);
__decorate([
    (0, decorators_1.Delete)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(certificates_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "deleteCertificate", null);
CertificatesController = __decorate([
    (0, decorators_1.Controller)('/certificates')
], CertificatesController);
exports.default = CertificatesController;
//# sourceMappingURL=certificates.controller.js.map