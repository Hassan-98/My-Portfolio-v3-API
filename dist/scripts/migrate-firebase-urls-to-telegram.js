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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Rewrites string fields containing firebasestorage.googleapis.com URLs to new Telegram /media/:id URLs.
 * Prerequisites: STORAGE_PROVIDER=telegram, TELEGRAM_BOT_TOKEN + TELEGRAM_STORAGE_PEER + Mongo env, API logic via imports.
 * Run: npm run migrate:firebase-urls
 *
 * Back up your database first.
 */
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const app_config_1 = __importDefault(require("../configs/app.config"));
const storage_util_1 = require("../storage/storage.util");
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor === Object;
}
function needsMigration(value) {
    return typeof value === 'string' && value.includes('firebasestorage.googleapis.com');
}
function migrateString(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default.get(url, { responseType: 'arraybuffer', maxRedirects: 5 });
        const buffer = Buffer.from(res.data);
        const ct = res.headers['content-type'] || 'application/octet-stream';
        const isSvg = ct.includes('svg') || url.toLowerCase().includes('.svg');
        const file = {
            fieldname: 'file',
            originalname: 'migrated',
            encoding: '7bit',
            mimetype: ct,
            size: buffer.length,
            buffer,
            destination: '',
            filename: '',
            path: '',
        };
        const uploaded = yield (0, storage_util_1.uploadFileToStorage)({
            file,
            fileType: isSvg ? 'file' : 'image',
            folder: 'firebase-migration',
        });
        return uploaded.url;
    });
}
function transformValue(value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (needsMigration(value)) {
            const next = yield migrateString(value);
            return { next, changed: true };
        }
        if (Array.isArray(value)) {
            let changed = false;
            const next = [];
            for (const item of value) {
                const r = yield transformValue(item);
                changed = changed || r.changed;
                next.push(r.next);
            }
            return { next, changed };
        }
        if (isPlainObject(value)) {
            let changed = false;
            const next = {};
            for (const key of Object.keys(value)) {
                const r = yield transformValue(value[key]);
                changed = changed || r.changed;
                next[key] = r.next;
            }
            return { next, changed };
        }
        return { next: value, changed: false };
    });
}
function connectMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE, MONGO_DEV_DATABASE, NODE_ENV } = process.env;
        const isProduction = NODE_ENV === 'production';
        const isTesting = NODE_ENV === 'testing';
        if (isProduction && !isTesting) {
            yield mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`);
        }
        else if (isTesting && isProduction) {
            yield mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}-testing`);
        }
        else if (isTesting && !isProduction) {
            yield mongoose_1.default.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}-testing`);
        }
        else {
            yield mongoose_1.default.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}`);
        }
    });
}
function main() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        (0, app_config_1.default)();
        if (process.env.STORAGE_PROVIDER !== 'telegram') {
            console.error('Set STORAGE_PROVIDER=telegram before running this migration.');
            process.exit(1);
        }
        yield connectMongo();
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('No database connection');
        }
        const collections = yield db.listCollections().toArray();
        let totalDocs = 0;
        for (const col of collections) {
            const name = col.name;
            if (name.startsWith('system.'))
                continue;
            const collection = db.collection(name);
            const cursor = collection.find({});
            try {
                // eslint-disable-next-line no-await-in-loop
                for (var _d = true, cursor_1 = (e_1 = void 0, __asyncValues(cursor)), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a;) {
                    _c = cursor_1_1.value;
                    _d = false;
                    try {
                        const doc = _c;
                        // eslint-disable-next-line no-await-in-loop
                        const { next, changed } = yield transformValue(doc);
                        if (changed) {
                            // eslint-disable-next-line no-await-in-loop
                            yield collection.replaceOne({ _id: doc._id }, next);
                            totalDocs += 1;
                            console.log(`Updated ${name} ${_idToString(doc._id)}`);
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        console.log(`Done. Modified ${totalDocs} document(s).`);
        yield mongoose_1.default.disconnect();
    });
}
function _idToString(id) {
    if (id && typeof id === 'object' && 'toString' in id)
        return String(id.toString());
    return String(id);
}
main().catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield mongoose_1.default.disconnect().catch(() => undefined);
    process.exit(1);
}));
//# sourceMappingURL=migrate-firebase-urls-to-telegram.js.map