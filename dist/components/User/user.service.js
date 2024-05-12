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
//= Models
const user_model_1 = __importDefault(require("./user.model"));
const crypto_js_1 = __importDefault(require("crypto-js"));
//= Utils
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
//= Config
const app_config_1 = __importDefault(require("../../configs/app.config"));
const Config = (0, app_config_1.default)();
class UserService {
    constructor() {
        this.MODEL = user_model_1.default;
    }
    getUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = params || {};
            const { filter, projection, population, sortition } = (0, queryBuilder_1.default)(params || {});
            let users = yield this.MODEL.find(filter, Object.assign({ password: 0 }, projection), Object.assign(Object.assign(Object.assign(Object.assign({}, population), sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            return users;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.MODEL.findById(id, { password: 0 }).lean();
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.MODEL.findOne({ email }, { password: 0 }).lean();
            return user;
        });
    }
    updateUserPassword({ currentPassword, newPassword }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.MODEL.findOne({}, { email: 1, password: 1 });
            if (!user)
                throw (0, error_handler_middleware_1.HttpError)(422, error_messages_1.default.INVALID_CREDENTIALS);
            if (user.password !== 'not-linked') {
                const decryptedPassword = crypto_js_1.default.AES.decrypt(user.password, Config.CRYPTO_SECRET).toString(crypto_js_1.default.enc.Utf8);
                if (decryptedPassword !== currentPassword)
                    throw (0, error_handler_middleware_1.HttpError)(422, error_messages_1.default.INVALID_CREDENTIALS);
            }
            user.password = crypto_js_1.default.AES.encrypt(newPassword, Config.CRYPTO_SECRET).toString();
            yield user.save();
            return user;
        });
    }
    updateUserData(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updates.password)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.CANNOT_BE_UPDATED('password'));
            const user = yield this.MODEL.findByIdAndUpdate(id, updates, { new: true, runValidators: true, select: { password: 0 } }).lean();
            return user;
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map