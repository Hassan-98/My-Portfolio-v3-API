"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramStoredFile = exports.streamTelegramFileToResponse = exports.saveToTelegram = void 0;
var upload_1 = require("./upload");
Object.defineProperty(exports, "saveToTelegram", { enumerable: true, get: function () { return upload_1.saveToTelegram; } });
var stream_1 = require("./stream");
Object.defineProperty(exports, "streamTelegramFileToResponse", { enumerable: true, get: function () { return stream_1.streamTelegramFileToResponse; } });
var stored_file_model_1 = require("./stored-file.model");
Object.defineProperty(exports, "TelegramStoredFile", { enumerable: true, get: function () { return __importDefault(stored_file_model_1).default; } });
//# sourceMappingURL=index.js.map