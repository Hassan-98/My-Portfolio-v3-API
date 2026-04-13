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
exports.deleteFileByPath = exports.deleteFileByURL = exports.saveToFirebaseBucket = void 0;
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
const app_config_1 = __importDefault(require("../configs/app.config"));
let firebaseReady = false;
function ensureFirebaseApp() {
    if (firebaseReady)
        return;
    const Config = (0, app_config_1.default)();
    if (Config.STORAGE_PROVIDER !== 'firebase') {
        throw new Error('Firebase storage is only available when STORAGE_PROVIDER=firebase');
    }
    const serviceAccount = {
        projectId: Config.ServiceAccount_project_id,
        privateKey: Config.ServiceAccount_private_key.replace(/\\n/g, '\n'),
        clientEmail: Config.ServiceAccount_client_email,
    };
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(serviceAccount),
            storageBucket: `${Config.ServiceAccount_project_id}.appspot.com`,
        });
    }
    firebaseReady = true;
}
function saveToFirebaseBucket(storagePath, buffer, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        ensureFirebaseApp();
        const bucket = (0, storage_1.getStorage)().bucket();
        const uploadedFile = bucket.file(storagePath);
        yield uploadedFile.save(buffer, {
            contentType,
            gzip: true,
        });
        const [fileUrl] = yield uploadedFile.getSignedUrl({
            action: 'read',
            expires: '01-01-2100',
        });
        return fileUrl;
    });
}
exports.saveToFirebaseBucket = saveToFirebaseBucket;
function deleteFileByURL(fileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fullPath = fileUrl.split('?')[0].split('/');
            if (!fullPath)
                throw new Error('Error occurred while extracting file path');
            const filePath = `${fullPath.at(-3)}/${decodeURI(fullPath.at(-2))}/${fullPath.at(-1)}`;
            ensureFirebaseApp();
            const bucket = (0, storage_1.getStorage)().bucket();
            yield bucket.file(filePath).delete();
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
            ensureFirebaseApp();
            const bucket = (0, storage_1.getStorage)().bucket();
            yield bucket.file(filePath).delete();
            return { success: true };
        }
        catch (e) {
            return { err: e.message };
        }
    });
}
exports.deleteFileByPath = deleteFileByPath;
//# sourceMappingURL=firebase.storage.js.map