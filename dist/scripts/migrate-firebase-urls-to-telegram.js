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
 * Rewrites string fields containing Firebase / GCS file URLs to Telegram /media/:id URLs.
 * Matches strings that include `firebasestorage.googleapis.com`, `firebasestorage.app`, or `storage.googleapis.com`
 * (signed GCS URLs like storage.googleapis.com/bucket.appspot.com/...).
 * Prerequisites: STORAGE_PROVIDER=telegram, TELEGRAM_BOT_TOKEN + TELEGRAM_STORAGE_PEER + Mongo env, API logic via imports.
 * Run: yarn migrate:firebase-urls
 *
 * Optional: MIGRATE_TELEGRAM_DELAY_MS — ms to wait after each successful Telegram upload (default 10000).
 * Helps avoid Bot API "Too Many Requests"; on 429 the script waits for "retry after N" when present.
 *
 * Back up your database first.
 */
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const app_config_1 = __importDefault(require("../configs/app.config"));
const storage_util_1 = require("../storage/storage.util");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/** Default 10s between Telegram uploads to reduce rate limits. */
function telegramSpacingMs() {
    const raw = process.env.MIGRATE_TELEGRAM_DELAY_MS;
    if (raw === undefined || raw.trim() === '')
        return 5000;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 5000;
}
/** Parses "retry after 38" from Telegram / Bot API error text (seconds). */
function parseRetryAfterSeconds(message) {
    const m = /retry\s+after\s+(\d+)/i.exec(message);
    if (!m)
        return undefined;
    const sec = Number(m[1]);
    return Number.isFinite(sec) && sec >= 0 ? sec : undefined;
}
function isTelegramRateLimitError(e) {
    const msg = e instanceof Error ? e.message : String(e);
    return /too many requests|429|retry\s+after/i.test(msg);
}
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor === Object;
}
/** Already migrated to this API’s proxy path (skip). */
function looksLikeOurMediaUrl(s) {
    return /\/media\/[a-f\d]{24}/i.test(s);
}
function needsMigration(value) {
    if (typeof value !== 'string' || value.length < 16)
        return false;
    if (looksLikeOurMediaUrl(value))
        return false;
    const s = value.toLowerCase();
    return (s.includes('firebasestorage.googleapis.com') ||
        s.includes('firebasestorage.app') ||
        s.includes('storage.googleapis.com'));
}
function migrateString(url) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const trimmed = url.trim();
        const res = yield axios_1.default.get(trimmed, { responseType: 'arraybuffer', maxRedirects: 5 });
        const buffer = Buffer.from(res.data);
        const ct = res.headers['content-type'] || 'application/octet-stream';
        const file = {
            fieldname: 'file',
            // Extension unused when fileType is "file"; avoids FilterAndCompressImages ("Image type is not supported" with originalname "migrated").
            originalname: 'migrated.bin',
            encoding: '7bit',
            mimetype: ct,
            size: buffer.length,
            buffer,
            destination: '',
            filename: '',
            path: '',
        };
        const spacingMs = telegramSpacingMs();
        const maxUploadAttempts = 20;
        for (let attempt = 1; attempt <= maxUploadAttempts; attempt++) {
            try {
                const uploaded = yield (0, storage_util_1.uploadFileToStorage)({
                    file,
                    // Always "file" so filters do not require a whitelisted image extension on originalname (migration has no real filename).
                    fileType: 'file',
                    folder: 'firebase-migration',
                });
                if (spacingMs > 0) {
                    yield sleep(spacingMs);
                }
                return uploaded.url;
            }
            catch (e) {
                if (!isTelegramRateLimitError(e) || attempt === maxUploadAttempts) {
                    throw e;
                }
                const msg = e instanceof Error ? e.message : String(e);
                const retrySec = (_a = parseRetryAfterSeconds(msg)) !== null && _a !== void 0 ? _a : Math.max(1, Math.ceil(spacingMs / 1000));
                console.warn(`Telegram rate limit (${attempt}/${maxUploadAttempts}), waiting ${retrySec}s then retrying…`);
                yield sleep(retrySec * 1000);
            }
        }
        throw new Error('migrateString: upload retries exhausted');
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
        yield mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`);
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
        const spacing = telegramSpacingMs();
        console.log(`MIGRATE_TELEGRAM_DELAY_MS=${spacing} (pause after each successful Telegram upload)`);
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