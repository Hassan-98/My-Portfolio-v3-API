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
exports.deleteFileByPath = exports.deleteFileByURL = exports.uploadFileToStorage = exports.multer = void 0;
//= Modules
const multer_1 = __importDefault(require("multer"));
//= Filters
const filters_1 = require("./filters");
//= Constants
const constants_1 = require("./constants");
//= Config
const app_config_1 = __importDefault(require("../configs/app.config"));
//= Storage backends
const firebase_storage_1 = require("./firebase.storage");
const telegram_1 = require("./telegram");
const Config = (0, app_config_1.default)();
exports.multer = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
const uploadFileToStorage = ({ file, fileType = 'file', folder, covertToWebp = true }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let resolvedFileType = fileType;
        let Outputed_File;
        if (!resolvedFileType) {
            const type = file.mimetype.split('/')[0];
            switch (type) {
                case 'image':
                    resolvedFileType = 'image';
                    break;
                case 'video':
                    resolvedFileType = 'video';
                    break;
                case 'audio':
                    resolvedFileType = 'audio';
                    break;
                case 'application':
                    if (constants_1.documentWhitelistTypes.indexOf(file.mimetype.split('/')[1]) !== -1)
                        resolvedFileType = 'document';
                    else
                        resolvedFileType = 'file';
                    break;
                default:
                    resolvedFileType = 'file';
            }
        }
        switch (resolvedFileType) {
            case 'image':
                try {
                    Outputed_File = yield (0, filters_1.FilterAndCompressImages)({ file, covertToWebp });
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case 'video':
                try {
                    Outputed_File = yield (0, filters_1.FilterVideos)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case 'audio':
                try {
                    Outputed_File = yield (0, filters_1.FilterAudios)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case 'document':
                try {
                    Outputed_File = yield (0, filters_1.FilterDocs)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case 'file':
                try {
                    Outputed_File = yield (0, filters_1.FilterFiles)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            default:
                return reject('File is not supported');
        }
        const newFileName = `${resolvedFileType}_${Date.now()}`;
        const logicalPath = folder
            ? `${resolvedFileType}s/${folder}/${newFileName}`
            : `${resolvedFileType}s/${newFileName}`;
        const buffer = Outputed_File.buffer;
        try {
            if (Config.STORAGE_PROVIDER === 'telegram') {
                const { url, path } = yield (0, telegram_1.saveToTelegram)({
                    buffer,
                    mimetype: Outputed_File.mimetype,
                    size: Outputed_File.size,
                    newFileName,
                    logicalPath,
                });
                resolve({
                    name: newFileName,
                    url,
                    path,
                    size: Outputed_File.size,
                });
                return;
            }
            const url = yield (0, firebase_storage_1.saveToFirebaseBucket)(logicalPath, buffer, Outputed_File.mimetype);
            resolve({
                name: newFileName,
                url,
                path: logicalPath,
                size: Outputed_File.size,
            });
        }
        catch (e) {
            reject(e);
        }
    }));
};
exports.uploadFileToStorage = uploadFileToStorage;
function deleteFileByURL(fileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, firebase_storage_1.deleteFileByURL)(fileUrl);
    });
}
exports.deleteFileByURL = deleteFileByURL;
function deleteFileByPath(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, firebase_storage_1.deleteFileByPath)(filePath);
    });
}
exports.deleteFileByPath = deleteFileByPath;
//# sourceMappingURL=storage.util.js.map