"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TelegramStoredFileSchema = new mongoose_1.default.Schema({
    telegramFileId: { type: String, required: true },
    storageChatId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    logicalPath: { type: String, required: true },
    fileName: { type: String, required: true },
}, { timestamps: true });
const TelegramStoredFile = mongoose_1.default.models.TelegramStoredFile || mongoose_1.default.model('TelegramStoredFile', TelegramStoredFileSchema);
exports.default = TelegramStoredFile;
//# sourceMappingURL=stored-file.model.js.map