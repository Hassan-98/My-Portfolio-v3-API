/* eslint-disable */
/**
 * One-off: replace the desktop/mobile screenshots on existing works with fresh
 * fullpage captures of the current live sites.
 *
 * Sends the files as multipart `desktop` / `mobile` fields — that is the only
 * path the API supports for images (`images` is not in the controller's
 * JSON_FIELDS allowlist, so posting it as JSON would fail validation).
 *
 * Usage:
 *   node _update_work_images.cjs              # dry run — lists what would change
 *   node _update_work_images.cjs --apply      # uploads and patches
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieSignature = require('cookie-signature');
const axios = require('axios');
const FormData = require('form-data');

const API = 'https://api.hassanali.tk';
const SHOTS = 'C:/Users/hassa/AppData/Local/Temp/claude/h--Works-My-Portfolio-v4-FE/f88a11ec-d722-4214-b9de-f278f7cc8cdd/scratchpad/shots/out';
const APPLY = process.argv.includes('--apply');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { JWT_SECRET, COOKIE_SECRET, MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;

// work name -> screenshot basename prefix in SHOTS
const TARGETS = [
  ['Imtyaz', 'imtyaz'],
  ['Fraudox', 'fraudox'],
  ['CoreX Store', 'corex'],
  ['FlutterCamp', 'fluttercamp'],
  // ['Certificates Management', 'certs'],  // handled with the case-study captures
];

async function mintCookie() {
  await mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`
  );
  const user = await mongoose.connection.db.collection('users').findOne({});
  if (!user) throw new Error('No user found in DB');
  const token = jwt.sign({ user: String(user._id) }, JWT_SECRET, { expiresIn: '1h' });
  const signed = 's:' + cookieSignature.sign(token, COOKIE_SECRET);
  return `portfolio-login-session=${encodeURIComponent(signed)}`;
}

async function findWorks() {
  const names = TARGETS.map(([name]) => name);
  return mongoose.connection.db
    .collection('works')
    .find({ name: { $in: names } }, { projection: { name: 1, images: 1, showInWebsite: 1 } })
    .toArray();
}

/** A consumed stream can't be replayed, so each attempt builds a fresh FormData. */
async function patchImages(id, desktopPath, mobilePath, cookie) {
  let lastErr;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const fd = new FormData();
    fd.append('desktop', fs.createReadStream(desktopPath), path.basename(desktopPath));
    fd.append('mobile', fs.createReadStream(mobilePath), path.basename(mobilePath));
    try {
      const res = await axios.patch(`${API}/works/${id}`, fd, {
        headers: { ...fd.getHeaders(), Cookie: cookie },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 180000,
      });
      return res.data.data.images;
    } catch (e) {
      lastErr = e;
      const why = e?.response?.data?.message || e?.response?.status || e.code || e.message;
      console.log(`    attempt ${attempt}/5 failed — ${why}`);
      if (attempt < 5) await sleep(4000 * attempt);
    }
  }
  throw lastErr;
}

(async () => {
  console.log(APPLY ? '=== UPDATE WORK IMAGES (APPLY) ===' : '=== UPDATE WORK IMAGES (DRY RUN) ===');
  const cookie = await mintCookie();
  console.log(`Target database: ${MONGO_DATABASE}\n`);

  const works = await findWorks();

  for (const [name, prefix] of TARGETS) {
    const matches = works.filter((w) => w.name === name);
    if (!matches.length) { console.log(`!! no work named "${name}"`); continue; }
    if (matches.length > 1) console.log(`!! ${matches.length} works named "${name}" — updating the visible one only`);
    const work = matches.find((w) => w.showInWebsite) || matches[0];

    const desktopPath = path.join(SHOTS, `${prefix}-desktop.webp`);
    const mobilePath = path.join(SHOTS, `${prefix}-mobile.webp`);

    if (!fs.existsSync(desktopPath) || !fs.existsSync(mobilePath)) {
      console.log(`!! missing captures for ${name} (${prefix}-*.webp)`);
      continue;
    }

    const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0) + 'kb';
    console.log(`### ${name}  [${work._id}]`);
    console.log(`    old desktop: ${work.images?.desktop}`);
    console.log(`    old mobile:  ${work.images?.mobile}`);
    console.log(`    new desktop: ${path.basename(desktopPath)} (${kb(desktopPath)})`);
    console.log(`    new mobile:  ${path.basename(mobilePath)} (${kb(mobilePath)})`);

    if (APPLY) {
      const images = await patchImages(work._id, desktopPath, mobilePath, cookie);
      console.log(`    -> desktop: ${images.desktop}`);
      console.log(`    -> mobile:  ${images.mobile}`);
      await sleep(1500);
    }
    console.log('');
  }

  await mongoose.disconnect();
  console.log(APPLY ? 'Done.' : 'Dry run — nothing uploaded. Re-run with --apply.');
})().catch(async (e) => {
  console.error(e?.response?.data || e);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
