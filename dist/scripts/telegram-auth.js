"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * One-time interactive login. Set TELEGRAM_API_ID and TELEGRAM_API_HASH in .env first.
 * Run: npm run telegram:auth
 * Then copy TELEGRAM_SESSION_STRING into .env and set STORAGE_PROVIDER=telegram.
 */
require("dotenv/config");
const readline = __importStar(require("readline"));
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiIdRaw = process.env.TELEGRAM_API_ID;
        const apiHash = process.env.TELEGRAM_API_HASH;
        if (!(apiIdRaw === null || apiIdRaw === void 0 ? void 0 : apiIdRaw.trim()) || !(apiHash === null || apiHash === void 0 ? void 0 : apiHash.trim())) {
            console.error('Set TELEGRAM_API_ID and TELEGRAM_API_HASH in .env (from https://my.telegram.org).');
            process.exit(1);
        }
        const apiId = Number(apiIdRaw);
        if (!Number.isFinite(apiId)) {
            console.error('TELEGRAM_API_ID must be a number.');
            process.exit(1);
        }
        const stringSession = new sessions_1.StringSession('');
        const client = new telegram_1.TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
        yield client.start({
            phoneNumber: () => __awaiter(this, void 0, void 0, function* () { return yield question('Phone (international, e.g. +1234567890): '); }),
            password: () => __awaiter(this, void 0, void 0, function* () { return yield question('Cloud password / 2FA (empty if none): '); }),
            phoneCode: () => __awaiter(this, void 0, void 0, function* () { return yield question('Code from Telegram: '); }),
            onError: (err) => console.error(err),
        });
        const sessionString = stringSession.save();
        if (!sessionString) {
            console.error('Session was empty; login may have failed.');
            process.exit(1);
        }
        console.log('\n--- Add to your .env ---\n');
        console.log(`TELEGRAM_SESSION_STRING=${sessionString}`);
        console.log('\nThen set STORAGE_PROVIDER=telegram, API_PUBLIC_URL, and restart the API.\n');
        rl.close();
        yield client.disconnect();
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=telegram-auth.js.map