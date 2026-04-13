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
exports.getTelegramClient = void 0;
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const app_config_1 = __importDefault(require("../configs/app.config"));
const telegram_session_util_1 = require("./telegram-session.util");
let client = null;
let connectPromise = null;
function getTelegramClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const Config = (0, app_config_1.default)();
        if (Config.STORAGE_PROVIDER !== 'telegram') {
            throw new Error('Telegram client is only used when STORAGE_PROVIDER=telegram');
        }
        const apiId = Number(Config.TELEGRAM_API_ID);
        if (!client) {
            const sessionRaw = (0, telegram_session_util_1.sanitizeTelegramSessionString)(Config.TELEGRAM_SESSION_STRING);
            const stringSession = new sessions_1.StringSession(sessionRaw);
            (0, telegram_session_util_1.patchStringSessionDataCenter)(stringSession);
            client = new telegram_1.TelegramClient(stringSession, apiId, Config.TELEGRAM_API_HASH, {
                connectionRetries: 5,
            });
        }
        if (!connectPromise) {
            connectPromise = (() => __awaiter(this, void 0, void 0, function* () {
                yield client.connect();
                const authorized = yield client.checkAuthorization();
                if (!authorized) {
                    throw new Error('Telegram session is not authorized. Run npm run telegram:auth and set TELEGRAM_SESSION_STRING.');
                }
                return client;
            }))();
        }
        try {
            return yield connectPromise;
        }
        catch (e) {
            connectPromise = null;
            client = null;
            throw e;
        }
    });
}
exports.getTelegramClient = getTelegramClient;
//# sourceMappingURL=telegram.client.js.map