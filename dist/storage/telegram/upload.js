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
const app_config_1 = __importDefault(require("../../configs/app.config"));
const bot_api_1 = require("./bot-api");
const stored_file_model_1 = __importDefault(require("./stored-file.model"));
function saveToTelegram(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const Config = (0, app_config_1.default)();
        const token = Config.TELEGRAM_BOT_TOKEN.trim();
        const chatId = Config.TELEGRAM_STORAGE_PEER.trim();
        if (!token || !chatId) {
            throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_STORAGE_PEER are required for Telegram storage');
        }
        const mimeSub = (params.mimetype.split('/')[1] || 'bin').split('+')[0];
        const ext = params.newFileName.includes('.') ? '' : `.${mimeSub}`;
        const fileName = params.newFileName.includes('.') ? params.newFileName : `${params.newFileName}${ext}`;
        const telegramFileId = yield (0, bot_api_1.sendDocument)({
            token,
            chatId,
            fileName,
            mimeType: params.mimetype,
            buffer: params.buffer,
            apiBase: Config.TELEGRAM_BOT_API_BASE,
        });
        const doc = yield stored_file_model_1.default.create({
            telegramFileId,
            storageChatId: chatId,
            mimeType: params.mimetype,
            size: params.size,
            logicalPath: params.logicalPath,
            fileName,
        });
        const base = Config.API_PUBLIC_URL.replace(/\/$/, '');
        return { url: `${base}/media/${doc._id.toString()}`, path: params.logicalPath };
    });
}
exports.saveToTelegram = saveToTelegram;
//# sourceMappingURL=upload.js.map