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
const work_service_1 = __importDefault(require("./work.service"));
//= Middlewares
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../Auth/auth.middleware");
//= Utils
const storage_util_1 = require("./../../storage/storage.util");
//= Validations
const work_validation_1 = require("./work.validation");
const Service = new work_service_1.default();
let WorksController = class WorksController {
    getAllWorks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allWorks = yield Service.getAllWorks(req.query);
            res.status(200).json({ success: true, data: allWorks });
        });
    }
    ;
    getAWorkById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const work = yield Service.getWorkById(req.params.id, req.query);
            res.status(200).json({ success: true, data: work });
        });
    }
    ;
    addNewWork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploaded_images = req.files;
            let images;
            if (Object.keys(uploaded_images).length && uploaded_images.desktop && uploaded_images.mobile) {
                images = { desktop: uploaded_images.desktop[0], mobile: uploaded_images.mobile[0] };
            }
            const work = yield Service.addNewWork({ data: req.body, images });
            res.status(201).json({ success: true, data: work });
        });
    }
    ;
    updateWorkOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.updateWorksOrder(req.body);
            res.status(200).json({ success: true, data: null });
        });
    }
    ;
    updateWork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploaded_images = req.files;
            let images;
            if (Object.keys(uploaded_images).length) {
                images = Object.assign(Object.assign({}, (uploaded_images.desktop ? { desktop: uploaded_images.desktop[0] } : {})), (uploaded_images.mobile ? { mobile: uploaded_images.mobile[0] } : {}));
            }
            const work = yield Service.updateWork(req.params.id, req.body, images);
            res.status(200).json({ success: true, data: work });
        });
    }
    ;
    deleteWork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Service.deleteWork(req.params.id);
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
], WorksController.prototype, "getAllWorks", null);
__decorate([
    (0, decorators_1.Get)('/:id'),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(work_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorksController.prototype, "getAWorkById", null);
__decorate([
    (0, decorators_1.Post)('/'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)(storage_util_1.multer.fields([{ name: "desktop", maxCount: 1 }, { name: "mobile", maxCount: 1 }])),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(work_validation_1.WorkSchema, ['stack', 'links', 'order', 'showInCv', 'showInWebsite', 'isTcgWork'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorksController.prototype, "addNewWork", null);
__decorate([
    (0, decorators_1.Patch)('/order'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(work_validation_1.OrderSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorksController.prototype, "updateWorkOrder", null);
__decorate([
    (0, decorators_1.Patch)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(work_validation_1.IDSchema)),
    (0, decorators_1.Use)(storage_util_1.multer.fields([{ name: "desktop", maxCount: 1 }, { name: "mobile", maxCount: 1 }])),
    (0, decorators_1.Use)((0, validation_middleware_1.bodyValidator)(work_validation_1.WorkSchema.partial(), ['stack', 'links', 'order', 'showInCv', 'showInWebsite', 'isTcgWork'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorksController.prototype, "updateWork", null);
__decorate([
    (0, decorators_1.Delete)('/:id'),
    (0, decorators_1.Use)(auth_middleware_1.Authenticated),
    (0, decorators_1.Use)((0, validation_middleware_1.paramsValidator)(work_validation_1.IDSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorksController.prototype, "deleteWork", null);
WorksController = __decorate([
    (0, decorators_1.Controller)('/works')
], WorksController);
exports.default = WorksController;
//# sourceMappingURL=work.controller.js.map