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
const general_model_1 = __importDefault(require("./general.model"));
//= Utils
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const storage_util_1 = require("../../storage/storage.util");
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class GeneralService {
    constructor() {
        this.MODEL = general_model_1.default;
    }
    getGeneralSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let generalSettings = yield this.MODEL.findOne({}, {}, { populate: 'recentStack.stack' }).lean();
            return generalSettings;
        });
    }
    updateSettings(updates, picture) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this.MODEL.findOne({});
            if (!settings)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("general settings"));
            const oldImage = settings.header.pictureUrl;
            Object.keys(updates).forEach((key) => {
                if (settings)
                    settings.set(key, updates[key]);
            });
            if (picture) {
                let uploadedImage = yield (0, storage_util_1.uploadFileToStorage)({ file: picture, fileType: 'image', folder: 'general settings' });
                settings.header.pictureUrl = uploadedImage.url;
            }
            else if (updates.header) {
                settings.header.pictureUrl = oldImage;
            }
            yield settings.save();
            return settings;
        });
    }
}
exports.default = GeneralService;
//# sourceMappingURL=general.service.js.map