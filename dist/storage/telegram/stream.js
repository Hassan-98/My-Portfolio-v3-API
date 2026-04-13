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
exports.streamTelegramFileToResponse = void 0;
const axios_1 = __importDefault(require("axios"));
const promises_1 = require("stream/promises");
const bot_api_1 = require("./bot-api");
/**
 * Proxies a Telegram file to the HTTP response (getFile + CDN stream).
 */
function streamTelegramFileToResponse(req, res, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = yield (0, bot_api_1.getFilePath)({
            token: opts.token,
            fileId: opts.fileId,
            apiBase: opts.apiBase,
        });
        const downloadUrl = (0, bot_api_1.botFileDownloadUrl)(opts.token, filePath, opts.apiBase);
        const upstream = yield axios_1.default.get(downloadUrl, {
            responseType: 'stream',
            maxRedirects: 5,
            validateStatus: (s) => s >= 200 && s < 400,
        });
        res.setHeader('Content-Type', opts.mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        const destroyUpstream = () => {
            const s = upstream.data;
            if (typeof s.destroy === 'function')
                s.destroy();
        };
        req.on('aborted', destroyUpstream);
        req.on('close', () => {
            if (!res.writableEnded)
                destroyUpstream();
        });
        try {
            yield (0, promises_1.pipeline)(upstream.data, res);
        }
        catch (pipeErr) {
            destroyUpstream();
            if (!res.headersSent) {
                const msg = pipeErr && typeof pipeErr === 'object' && 'message' in pipeErr
                    ? String(pipeErr.message)
                    : 'Download stream failed';
                res.status(500).send(msg);
            }
            else if (!res.writableEnded) {
                res.destroy(pipeErr instanceof Error ? pipeErr : undefined);
            }
        }
    });
}
exports.streamTelegramFileToResponse = streamTelegramFileToResponse;
//# sourceMappingURL=stream.js.map