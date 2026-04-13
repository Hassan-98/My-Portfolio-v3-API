"use strict";
/**
 * Telegram Bot API (HTTPS) — https://core.telegram.org/bots/api
 * sendDocument (multipart), getFile, file download URL.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = exports.sendDocument = exports.botFileDownloadUrl = void 0;
const DEFAULT_API_BASE = 'https://api.telegram.org';
function normalizedBase(raw) {
    const s = (raw || DEFAULT_API_BASE).trim().replace(/\/$/, '');
    return s || DEFAULT_API_BASE;
}
function methodUrl(token, method, apiBase) {
    return `${normalizedBase(apiBase)}/bot${token}/${method}`;
}
function botFileDownloadUrl(token, filePath, apiBase) {
    const pathSeg = filePath.replace(/^\//, '');
    return `${normalizedBase(apiBase)}/file/bot${token}/${pathSeg}`;
}
exports.botFileDownloadUrl = botFileDownloadUrl;
function fileIdFromSentMessage(msg) {
    var _a, _b, _c;
    if ((_a = msg.document) === null || _a === void 0 ? void 0 : _a.file_id)
        return msg.document.file_id;
    if ((_b = msg.sticker) === null || _b === void 0 ? void 0 : _b.file_id)
        return msg.sticker.file_id;
    const photos = msg.photo;
    if (photos === null || photos === void 0 ? void 0 : photos.length)
        return (_c = photos[photos.length - 1]) === null || _c === void 0 ? void 0 : _c.file_id;
    return undefined;
}
function parseJson(res) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield res.json());
    });
}
function sendDocument(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = methodUrl(params.token, 'sendDocument', params.apiBase);
        const form = new FormData();
        form.append('chat_id', params.chatId);
        const blob = new Blob([new Uint8Array(params.buffer)], { type: params.mimeType || 'application/octet-stream' });
        form.append('document', blob, params.fileName);
        const res = yield fetch(url, { method: 'POST', body: form });
        const json = yield parseJson(res);
        if (!json.ok) {
            throw new Error(json.description || `sendDocument failed (HTTP ${res.status})`);
        }
        const fileId = fileIdFromSentMessage(json.result);
        if (!fileId) {
            throw new Error('sendDocument: could not read file_id from Telegram response (expected document, sticker, or photo on Message)');
        }
        return fileId;
    });
}
exports.sendDocument = sendDocument;
function getFilePath(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(methodUrl(params.token, 'getFile', params.apiBase));
        url.searchParams.set('file_id', params.fileId);
        const res = yield fetch(url.toString(), { method: 'GET' });
        const json = yield parseJson(res);
        if (!json.ok) {
            throw new Error(json.description || `getFile failed (HTTP ${res.status})`);
        }
        const filePath = json.result.file_path;
        if (!filePath) {
            throw new Error('getFile: result had no file_path');
        }
        return filePath;
    });
}
exports.getFilePath = getFilePath;
//# sourceMappingURL=bot-api.js.map