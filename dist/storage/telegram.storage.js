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
exports.saveToTelegram = void 0;
const uploads_1 = require("telegram/client/uploads");
const app_config_1 = __importDefault(require("../configs/app.config"));
const telegram_file_model_1 = __importDefault(require("./telegram-file.model"));
const telegram_client_1 = require("./telegram.client");
function saveToTelegram(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const Config = (0, app_config_1.default)();
        const client = yield (0, telegram_client_1.getTelegramClient)();
        const peer = Config.TELEGRAM_STORAGE_PEER || 'me';
        const mimeSub = (params.mimetype.split('/')[1] || 'bin').split('+')[0];
        const ext = params.newFileName.includes('.') ? '' : `.${mimeSub}`;
        const fileName = params.newFileName.includes('.') ? params.newFileName : `${params.newFileName}${ext}`;
        const customFile = new uploads_1.CustomFile(fileName, params.buffer.length, '', params.buffer);
        const message = yield (0, uploads_1.sendFile)(client, peer, {
            file: customFile,
            forceDocument: true,
            fileSize: params.buffer.length,
        });
        const doc = yield telegram_file_model_1.default.create({
            storagePeer: peer,
            messageId: message.id,
            mimeType: params.mimetype,
            size: params.size,
            logicalPath: params.logicalPath,
            fileName,
        });
        const base = Config.API_PUBLIC_URL.replace(/\/$/, '');
        const url = `${base}/media/${doc._id.toString()}`;
        return { url, path: params.logicalPath };
    });
}
exports.saveToTelegram = saveToTelegram;
//# sourceMappingURL=telegram.storage.js.map