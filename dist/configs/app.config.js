"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const ENV = () => (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, envalid_1.port)(),
    NODE_ENV: (0, envalid_1.str)(),
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
    GOOGLE_CLIENT_ID: (0, envalid_1.str)(),
    GOOGLE_CLIENT_SECERT: (0, envalid_1.str)(),
    GOOGLE_LOGIN_EMAIL: (0, envalid_1.str)(),
    ServiceAccount_project_id: (0, envalid_1.str)(),
    ServiceAccount_private_key: (0, envalid_1.str)(),
    ServiceAccount_client_email: (0, envalid_1.str)(),
});
exports.default = ENV;
//# sourceMappingURL=app.config.js.map