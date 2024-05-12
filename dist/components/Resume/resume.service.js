"use strict";
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
//= Models
const resume_model_1 = __importDefault(require("./resume.model"));
//= Utils
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const storage_util_1 = require("../../storage/storage.util");
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class ResumeService {
    constructor() {
        this.MODEL = resume_model_1.default;
    }
    getResumePreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            let resumePreferences = yield this.MODEL.findOne({}).lean();
            return resumePreferences;
        });
    }
    addTemplate({ data, image }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!image)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.REQUIRED("template image"));
            let uploadedImage = yield (0, storage_util_1.uploadFileToStorage)({ file: image, fileType: 'image', folder: `resume-template[${data.name}]` });
            const tempate = {
                name: data.name,
                image: uploadedImage.url
            };
            let resumePreferences = yield this.MODEL.findOneAndUpdate({}, {
                $push: {
                    templates: tempate
                }
            }, { new: true, runValidators: true }).lean();
            if (!resumePreferences)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("resume preferences"));
            return resumePreferences;
        });
    }
    updateTemplate({ id, updates, image }) {
        return __awaiter(this, void 0, void 0, function* () {
            let uploadedImage;
            if (image) {
                uploadedImage = yield (0, storage_util_1.uploadFileToStorage)({ file: image, fileType: 'image', folder: `resume-template[${updates.name}]` });
            }
            let resumePreferences = yield this.MODEL.findOneAndUpdate({ 'templates._id': id }, Object.assign(Object.assign({}, (updates.name ? { 'templates.$.name': updates.name } : {})), (uploadedImage ? { 'templates.$.image': uploadedImage.url } : {})), { new: true, runValidators: true }).lean();
            if (!resumePreferences)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("resume preferences"));
            return resumePreferences;
        });
    }
    deleteTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let resumePreferences = yield this.MODEL.findOneAndUpdate({}, {
                $pull: {
                    templates: {
                        _id: id
                    }
                }
            }, { new: true, runValidators: true }).lean();
            if (!resumePreferences)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("resume preferences"));
            return resumePreferences;
        });
    }
    updatePreferences(updates) {
        return __awaiter(this, void 0, void 0, function* () {
            let resumePreferences = yield this.MODEL.findOne({});
            if (!resumePreferences)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("resume preferences"));
            Object.keys(updates).forEach((key) => {
                if (resumePreferences)
                    resumePreferences.set(key, updates[key]);
            });
            yield resumePreferences.save();
            return resumePreferences;
        });
    }
}
exports.default = ResumeService;
//# sourceMappingURL=resume.service.js.map