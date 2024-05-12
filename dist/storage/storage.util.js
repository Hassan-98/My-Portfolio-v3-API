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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileByPath = exports.deleteFileByURL = exports.uploadFileToStorage = exports.bucket = exports.multer = void 0;
//= Modules
const multer_1 = __importDefault(require("multer"));
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
//= Filters
const filters_1 = require("./filters");
//= Constants
const constants_1 = require("./constants");
//= Config
const app_config_1 = __importDefault(require("../configs/app.config"));
const Config = (0, app_config_1.default)();
exports.multer = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage()
});
const serviceAccount = {
    projectId: Config.ServiceAccount_project_id,
    privateKey: (_a = Config.ServiceAccount_private_key) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    clientEmail: Config.ServiceAccount_client_email,
};
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
    storageBucket: `${Config.ServiceAccount_project_id}.appspot.com`
});
exports.bucket = (0, storage_1.getStorage)().bucket();
// Upload Function
const uploadFileToStorage = ({ file, fileType = 'file', folder, covertToWebp = true }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let Outputed_File;
        // Auto-Detect File Type
        if (!fileType) {
            let type = file.mimetype.split("/")[0];
            switch (type) {
                case "image":
                    fileType = "image";
                    break;
                case "video":
                    fileType = "video";
                    break;
                case "audio":
                    fileType = "audio";
                    break;
                case "application":
                    if (constants_1.documentWhitelistTypes.indexOf(file.mimetype.split("/")[1]) !== -1)
                        fileType = "document";
                    else
                        fileType = "file";
                    break;
                default:
                    fileType = "file";
            }
        }
        // Filter & Compress Based on File Type
        switch (fileType) {
            case "image":
                try {
                    Outputed_File = yield (0, filters_1.FilterAndCompressImages)({ file, covertToWebp });
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case "video":
                try {
                    Outputed_File = yield (0, filters_1.FilterVideos)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case "audio":
                try {
                    Outputed_File = yield (0, filters_1.FilterAudios)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case "document":
                try {
                    Outputed_File = yield (0, filters_1.FilterDocs)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            case "file":
                try {
                    Outputed_File = yield (0, filters_1.FilterFiles)(file);
                }
                catch (e) {
                    return reject(e);
                }
                break;
            default:
                return reject("File is not supported");
        }
        let newFileName = `${fileType}_${Date.now()}`;
        const uploadedFile = exports.bucket.file(folder ? `${fileType}s/${folder}/${newFileName}` : `${fileType}s/${newFileName}`);
        let buffer = Outputed_File.buffer;
        yield uploadedFile.save(buffer, {
            contentType: Outputed_File.mimetype,
            gzip: true
        });
        const [File_URL] = yield uploadedFile.getSignedUrl({
            action: "read",
            expires: "01-01-2100"
        });
        resolve({
            name: newFileName,
            url: File_URL,
            path: `${fileType}s/${folder}/${newFileName}`,
            size: Outputed_File.size
        });
    }));
};
exports.uploadFileToStorage = uploadFileToStorage;
function deleteFileByURL(fileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fullPath = fileUrl.split("?")[0].split("/");
            if (!fullPath)
                throw new Error('Error occurred while extracting file path');
            const filePath = `${fullPath.at(-3)}/${decodeURI(fullPath.at(-2))}/${fullPath.at(-1)}`;
            yield exports.bucket.file(filePath).delete();
            return { success: true };
        }
        catch (e) {
            return { err: e.message };
        }
    });
}
exports.deleteFileByURL = deleteFileByURL;
function deleteFileByPath(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.bucket.file(filePath).delete();
            return { success: true };
        }
        catch (e) {
            return { err: e.message };
        }
    });
}
exports.deleteFileByPath = deleteFileByPath;
//# sourceMappingURL=storage.util.js.map