"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE, MONGO_DEV_DATABASE } = process.env;
exports.databaseConfig = {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_PATH,
    MONGO_DATABASE,
    MONGO_DEV_DATABASE
};
//# sourceMappingURL=db.config.js.map