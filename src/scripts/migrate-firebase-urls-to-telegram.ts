/**
 * Rewrites string fields containing Firebase / GCS file URLs to Telegram /media/:id URLs.
 * Matches strings that include `firebasestorage.googleapis.com`, `firebasestorage.app`, or `storage.googleapis.com`
 * (signed GCS URLs like storage.googleapis.com/bucket.appspot.com/...).
 * Prerequisites: STORAGE_PROVIDER=telegram, TELEGRAM_BOT_TOKEN + TELEGRAM_STORAGE_PEER + Mongo env, API logic via imports.
 * Run: yarn migrate:firebase-urls
 *
 * Optional: MIGRATE_TELEGRAM_DELAY_MS — ms to wait after each successful Telegram upload (default 3000).
 * Helps avoid Bot API "Too Many Requests"; on 429 the script waits for "retry after N" when present.
 *
 * Back up your database first.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import validateConfigVars from '../configs/app.config';
import { uploadFileToStorage } from '../storage/storage.util';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Default 3s between Telegram uploads to reduce rate limits. */
function telegramSpacingMs(): number {
  const raw = process.env.MIGRATE_TELEGRAM_DELAY_MS;
  if (raw === undefined || raw.trim() === '') return 3_000;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 3_000;
}

/** Parses "retry after 38" from Telegram / Bot API error text (seconds). */
function parseRetryAfterSeconds(message: string): number | undefined {
  const m = /retry\s+after\s+(\d+)/i.exec(message);
  if (!m) return undefined;
  const sec = Number(m[1]);
  return Number.isFinite(sec) && sec >= 0 ? sec : undefined;
}

function isTelegramRateLimitError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /too many requests|429|retry\s+after/i.test(msg);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor === Object;
}

/** Already migrated to this API’s proxy path (skip). */
function looksLikeOurMediaUrl(s: string): boolean {
  return /\/media\/[a-f\d]{24}/i.test(s);
}

function needsMigration(value: unknown): boolean {
  if (typeof value !== 'string' || value.length < 16) return false;
  if (looksLikeOurMediaUrl(value)) return false;
  const s = value.toLowerCase();
  return (
    s.includes('firebasestorage.googleapis.com') ||
    s.includes('firebasestorage.app') ||
    s.includes('storage.googleapis.com')
  );
}

async function migrateString(url: string): Promise<string> {
  const trimmed = url.trim();
  const res = await axios.get<ArrayBuffer>(trimmed, { responseType: 'arraybuffer', maxRedirects: 5 });
  const buffer = Buffer.from(res.data);
  const ct = (res.headers['content-type'] as string) || 'application/octet-stream';
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
  } as Express.Multer.File;

  const spacingMs = telegramSpacingMs();
  const maxUploadAttempts = 20;

  for (let attempt = 1; attempt <= maxUploadAttempts; attempt++) {
    try {
      const uploaded = await uploadFileToStorage({
        file,
        // Always "file" so filters do not require a whitelisted image extension on originalname (migration has no real filename).
        fileType: 'file',
        folder: 'firebase-migration',
      });
      if (spacingMs > 0) {
        await sleep(spacingMs);
      }
      return uploaded.url;
    } catch (e: unknown) {
      if (!isTelegramRateLimitError(e) || attempt === maxUploadAttempts) {
        throw e;
      }
      const msg = e instanceof Error ? e.message : String(e);
      const retrySec = parseRetryAfterSeconds(msg) ?? Math.max(1, Math.ceil(spacingMs / 1000));
      console.warn(`Telegram rate limit (${attempt}/${maxUploadAttempts}), waiting ${retrySec}s then retrying…`);
      await sleep(retrySec * 1000);
    }
  }

  throw new Error('migrateString: upload retries exhausted');
}

async function transformValue(value: unknown): Promise<{ next: unknown; changed: boolean }> {
  if (needsMigration(value)) {
    const next = await migrateString(value as string);
    return { next, changed: true };
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next: unknown[] = [];
    for (const item of value) {
      const r = await transformValue(item);
      changed = changed || r.changed;
      next.push(r.next);
    }
    return { next, changed };
  }
  if (isPlainObject(value)) {
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      const r = await transformValue(value[key]);
      changed = changed || r.changed;
      next[key] = r.next;
    }
    return { next, changed };
  }
  return { next: value, changed: false };
}

async function connectMongo(): Promise<void> {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE, MONGO_DEV_DATABASE, NODE_ENV } = process.env;
  await mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`
  );
}

async function main() {
  validateConfigVars();
  if (process.env.STORAGE_PROVIDER !== 'telegram') {
    console.error('Set STORAGE_PROVIDER=telegram before running this migration.');
    process.exit(1);
  }

  const spacing = telegramSpacingMs();
  console.log(`MIGRATE_TELEGRAM_DELAY_MS=${spacing} (pause after each successful Telegram upload)`);

  await connectMongo();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('No database connection');
  }

  const collections = await db.listCollections().toArray();
  let totalDocs = 0;

  for (const col of collections) {
    const name = col.name;
    if (name.startsWith('system.')) continue;

    const collection = db.collection(name);
    const cursor = collection.find({});
    // eslint-disable-next-line no-await-in-loop
    for await (const doc of cursor) {
      // eslint-disable-next-line no-await-in-loop
      const { next, changed } = await transformValue(doc);
      if (changed) {
        // eslint-disable-next-line no-await-in-loop
        await collection.replaceOne({ _id: doc._id }, next as typeof doc);
        totalDocs += 1;
        console.log(`Updated ${name} ${_idToString(doc._id)}`);
      }
    }
  }

  console.log(`Done. Modified ${totalDocs} document(s).`);
  await mongoose.disconnect();
}

function _idToString(id: unknown): string {
  if (id && typeof id === 'object' && 'toString' in id) return String((id as { toString: () => string }).toString());
  return String(id);
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
