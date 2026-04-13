"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const mongoose_1 = __importDefault(require("mongoose"));
//= Decorators
const decorators_1 = require("../../decorators");
const app_config_1 = __importDefault(require("../../configs/app.config"));
const telegram_1 = require("../../storage/telegram");
let MediaController = class MediaController {
    getMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Config = (0, app_config_1.default)();
            if (Config.STORAGE_PROVIDER !== 'telegram') {
                res.status(503).send('Telegram storage is not active');
                return;
            }
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).send('Invalid id');
                return;
            }
            const doc = yield telegram_1.TelegramStoredFile.findById(id).lean();
            if (!doc) {
                res.status(404).send('Not found');
                return;
            }
            const token = Config.TELEGRAM_BOT_TOKEN.trim();
            if (!token) {
                res.status(500).send('TELEGRAM_BOT_TOKEN is not configured');
                return;
            }
            const fileId = doc.telegramFileId;
            if (!fileId) {
                res
                    .status(410)
                    .send('This file was stored with a legacy Telegram client and cannot be served. Re-upload the asset or run a data migration.');
                return;
            }
            try {
                yield (0, telegram_1.streamTelegramFileToResponse)(req, res, {
                    token,
                    apiBase: Config.TELEGRAM_BOT_API_BASE,
                    fileId,
                    mimeType: doc.mimeType,
                });
            }
            catch (e) {
                const msg = e && typeof e === 'object' && 'message' in e ? String(e.message) : String(e);
                if (!res.headersSent) {
                    res.status(500).send(msg || 'Telegram download failed');
                }
            }
        });
    }
};
__decorate([
    (0, decorators_1.Get)('/media/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getMedia", null);
MediaController = __decorate([
    (0, decorators_1.Controller)('')
], MediaController);
exports.default = MediaController;
//# sourceMappingURL=media.controller.js.map