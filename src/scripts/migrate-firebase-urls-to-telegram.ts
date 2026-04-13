/**
 * Rewrites string fields containing firebasestorage.googleapis.com URLs to new Telegram /media/:id URLs.
 * Prerequisites: STORAGE_PROVIDER=telegram, TELEGRAM_BOT_TOKEN + TELEGRAM_STORAGE_PEER + Mongo env, API logic via imports.
 * Run: npm run migrate:firebase-urls
 *
 * Back up your database first.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import type { Express } from 'express';
import validateConfigVars from '../configs/app.config';
import { uploadFileToStorage } from '../storage/storage.util';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor === Object;
}

function needsMigration(value: unknown): boolean {
  return typeof value === 'string' && value.includes('firebasestorage.googleapis.com');
}

async function migrateString(url: string): Promise<string> {
  const res = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer', maxRedirects: 5 });
  const buffer = Buffer.from(res.data);
  const ct = (res.headers['content-type'] as string) || 'application/octet-stream';
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
  } as Express.Multer.File;

  const uploaded = await uploadFileToStorage({
    file,
    fileType: isSvg ? 'file' : 'image',
    folder: 'firebase-migration',
  });
  return uploaded.url;
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
  const isProduction = NODE_ENV === 'production';
  const isTesting = NODE_ENV === 'testing';

  if (isProduction && !isTesting) {
    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`
    );
  } else if (isTesting && isProduction) {
    await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}-testing`);
  } else if (isTesting && !isProduction) {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}-testing`);
  } else {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}`);
  }
}

async function main() {
  validateConfigVars();
  if (process.env.STORAGE_PROVIDER !== 'telegram') {
    console.error('Set STORAGE_PROVIDER=telegram before running this migration.');
    process.exit(1);
  }

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
