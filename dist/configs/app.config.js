"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
/** Map legacy .env key names to the ones cleanEnv reads. */
function normalizeEnvAliases() {
    var _a, _b, _c, _d, _e, _f;
    const e = process.env;
    if (!((_a = e.TELEGRAM_BOT_TOKEN) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = e.TELEGRAM_bot_token) === null || _b === void 0 ? void 0 : _b.trim())) {
        e.TELEGRAM_BOT_TOKEN = e.TELEGRAM_bot_token;
    }
    if (!((_c = e.TELEGRAM_APP_NAME) === null || _c === void 0 ? void 0 : _c.trim()) && ((_d = e.TELEGRAM_app_name) === null || _d === void 0 ? void 0 : _d.trim())) {
        e.TELEGRAM_APP_NAME = e.TELEGRAM_app_name;
    }
    if (!((_e = e.TELEGRAM_BOT_USERNAME) === null || _e === void 0 ? void 0 : _e.trim()) && ((_f = e.TELEGRAM_bot_username) === null || _f === void 0 ? void 0 : _f.trim())) {
        e.TELEGRAM_BOT_USERNAME = e.TELEGRAM_bot_username;
    }
}
function deriveApiPublicUrl(host, portNum) {
    const trimmed = host.replace(/\/$/, '').trim();
    if (!trimmed)
        return '';
    try {
        const u = new URL(trimmed.includes('://') ? trimmed : `http://${trimmed}`);
        const p = u.port || String(portNum);
        return `${u.protocol}//${u.hostname}:${p}`;
    }
    catch (_a) {
        return `${trimmed}:${portNum}`;
    }
}
function validateStorageConfig(env) {
    var _a, _b, _c, _d, _e;
    if (env.STORAGE_PROVIDER !== 'telegram' && env.STORAGE_PROVIDER !== 'firebase') {
        throw new Error(`STORAGE_PROVIDER must be "telegram" or "firebase", got: ${env.STORAGE_PROVIDER}`);
    }
    if (env.STORAGE_PROVIDER === 'firebase') {
        if (!((_a = env.ServiceAccount_project_id) === null || _a === void 0 ? void 0 : _a.trim())) {
            throw new Error('STORAGE_PROVIDER=firebase requires ServiceAccount_project_id');
        }
        if (!((_b = env.ServiceAccount_private_key) === null || _b === void 0 ? void 0 : _b.trim())) {
            throw new Error('STORAGE_PROVIDER=firebase requires ServiceAccount_private_key');
        }
        if (!((_c = env.ServiceAccount_client_email) === null || _c === void 0 ? void 0 : _c.trim())) {
            throw new Error('STORAGE_PROVIDER=firebase requires ServiceAccount_client_email');
        }
    }
    if (env.STORAGE_PROVIDER === 'telegram') {
        if (!((_d = env.TELEGRAM_BOT_TOKEN) === null || _d === void 0 ? void 0 : _d.trim())) {
            throw new Error('STORAGE_PROVIDER=telegram requires TELEGRAM_BOT_TOKEN from @BotFather');
        }
        const peer = env.TELEGRAM_STORAGE_PEER.trim();
        if (!peer) {
            throw new Error('STORAGE_PROVIDER=telegram requires TELEGRAM_STORAGE_PEER (Bot API chat_id: numeric id, @channelusername, or -100… for channels)');
        }
        if (peer.toLowerCase() === 'me') {
            throw new Error('TELEGRAM_STORAGE_PEER cannot be "me" with the Bot API. Use a chat the bot can post to, e.g. a private channel where the bot is admin (id often -100…), or your user id in private chat after /start.');
        }
        if (!((_e = env.API_PUBLIC_URL) === null || _e === void 0 ? void 0 : _e.trim())) {
            throw new Error('STORAGE_PROVIDER=telegram requires API_PUBLIC_URL, or set HOST (and PORT) so the API base URL can be derived');
        }
        try {
            // eslint-disable-next-line no-new
            new URL(env.API_PUBLIC_URL);
        }
        catch (_f) {
            throw new Error('API_PUBLIC_URL must be a valid URL');
        }
    }
}
const ENV = () => {
    normalizeEnvAliases();
    const env = (0, envalid_1.cleanEnv)(process.env, {
        PORT: (0, envalid_1.port)(),
        NODE_ENV: (0, envalid_1.str)(),
        HOST: (0, envalid_1.str)({ default: '' }),
        MONGO_USER: (0, envalid_1.str)(),
        MONGO_PASSWORD: (0, envalid_1.str)(),
        MONGO_PATH: (0, envalid_1.str)(),
        MONGO_DATABASE: (0, envalid_1.str)(),
        MONGO_DEV_DATABASE: (0, envalid_1.str)(),
        WHITELISTED_DOMAINS: (0, envalid_1.str)(),
        CLIENT_URL: (0, envalid_1.str)(),
        JWT_SECRET: (0, envalid_1.str)(),
        COOKIE_SECRET: (0, envalid_1.str)(),
        CRYPTO_SECRET: (0, envalid_1.str)(),
        MAILGUN_USERNAME: (0, envalid_1.str)({ default: '' }),
        MAILGUN_PASSWORD: (0, envalid_1.str)({ default: '' }),
        GOOGLE_CLIENT_ID: (0, envalid_1.str)(),
        GOOGLE_CLIENT_SECERT: (0, envalid_1.str)(),
        GOOGLE_LOGIN_EMAIL: (0, envalid_1.str)(),
        ServiceAccount_project_id: (0, envalid_1.str)({ default: '' }),
        ServiceAccount_private_key: (0, envalid_1.str)({ default: '' }),
        ServiceAccount_client_email: (0, envalid_1.str)({ default: '' }),
        STORAGE_PROVIDER: (0, envalid_1.str)({ default: 'telegram' }),
        TELEGRAM_BOT_TOKEN: (0, envalid_1.str)({ default: '' }),
        TELEGRAM_STORAGE_PEER: (0, envalid_1.str)({ default: '' }),
        TELEGRAM_BOT_API_BASE: (0, envalid_1.str)({ default: 'https://api.telegram.org' }),
        API_PUBLIC_URL: (0, envalid_1.str)({ default: '' }),
        TELEGRAM_APP_NAME: (0, envalid_1.str)({ default: '' }),
        TELEGRAM_BOT_USERNAME: (0, envalid_1.str)({ default: '' }),
    });
    const apiPublicUrl = env.API_PUBLIC_URL.trim() || (env.HOST.trim() ? deriveApiPublicUrl(env.HOST, env.PORT) : '');
    validateStorageConfig(Object.assign(Object.assign({}, env), { API_PUBLIC_URL: apiPublicUrl }));
    const botBase = env.TELEGRAM_BOT_API_BASE.trim().replace(/\/$/, '') || 'https://api.telegram.org';
    return {
        PORT: env.PORT,
        NODE_ENV: env.NODE_ENV,
        HOST: env.HOST,
        MONGO_USER: env.MONGO_USER,
        MONGO_PASSWORD: env.MONGO_PASSWORD,
        MONGO_PATH: env.MONGO_PATH,
        MONGO_DATABASE: env.MONGO_DATABASE,
        MONGO_DEV_DATABASE: env.MONGO_DEV_DATABASE,
        WHITELISTED_DOMAINS: env.WHITELISTED_DOMAINS,
        JWT_SECRET: env.JWT_SECRET,
        COOKIE_SECRET: env.COOKIE_SECRET,
        CRYPTO_SECRET: env.CRYPTO_SECRET,
        CLIENT_URL: env.CLIENT_URL,
        MAILGUN_USERNAME: env.MAILGUN_USERNAME,
        MAILGUN_PASSWORD: env.MAILGUN_PASSWORD,
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECERT: env.GOOGLE_CLIENT_SECERT,
        ServiceAccount_project_id: env.ServiceAccount_project_id,
        ServiceAccount_private_key: env.ServiceAccount_private_key,
        ServiceAccount_client_email: env.ServiceAccount_client_email,
        GOOGLE_LOGIN_EMAIL: env.GOOGLE_LOGIN_EMAIL,
        STORAGE_PROVIDER: env.STORAGE_PROVIDER,
        TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_STORAGE_PEER: env.TELEGRAM_STORAGE_PEER,
        TELEGRAM_BOT_API_BASE: botBase,
        API_PUBLIC_URL: apiPublicUrl,
        TELEGRAM_APP_NAME: env.TELEGRAM_APP_NAME,
        TELEGRAM_BOT_USERNAME: env.TELEGRAM_BOT_USERNAME,
        isProduction: process.env.NODE_ENV === 'production',
    };
};
exports.default = ENV;
//# sourceMappingURL=app.config.js.map