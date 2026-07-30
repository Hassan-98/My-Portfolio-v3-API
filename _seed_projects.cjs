/* eslint-disable */
// One-off: create two case-study works — "Lammah" and "Medium Creative Brief" —
// on the live portfolio, HIDDEN (showInWebsite:false) for private review.
// Mints an auth session from local secrets, uploads screenshots through the real
// /works/screens pipeline (resumable), then upserts each work via multipart /works.

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieSignature = require('cookie-signature');
const axios = require('axios');
const FormData = require('form-data');

const API = 'https://api.hassanali.tk';
const SHOTS_DIR = 'H:/Works/My Portfolio/v4/FE/.proj-shots';
const CACHE = path.join(__dirname, '_projects_uploads.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { JWT_SECRET, COOKIE_SECRET, MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;

const S = {
  React: '63f3261361da25c7aa6a6e68',
  TypeScript: '63f3261361da25c7aa6a6e71',
  Tailwind: '63f3261361da25c7aa6a6e70',
  Firebase: '63f3261361da25c7aa6a6e4f',
  Next: '63f3261361da25c7aa6a6e5f',
  Postgres: '63f3261361da25c7aa6a6e64',
  Node: '63f3261361da25c7aa6a6e60',
};

// key -> filename
const FILES = [
  ['lammah_onboarding', 'lammah-01-onboarding.jpg'],
  ['lammah_playmode', 'lammah-02-title.jpg'],
  ['lammah_games', 'lammah-03-games.jpg'],
  ['lammah_home', 'lammah-04-home.jpg'],
  ['lammah_profile', 'lammah-05-options.jpg'],
  ['lammah_themes', 'lammah-06-themes.jpg'],
  ['lammah_howto', 'lammah-07-howto.jpg'],
  ['brief_cover', 'brief-01-cover.jpg'],
  ['brief_business', 'brief-02-business.jpg'],
  ['brief_competitors', 'brief-03-competitors.jpg'],
  ['brief_logo', 'brief-04-logo.jpg'],
  ['brief_notes', 'brief-05-notes.jpg'],
  ['brief_cover_ar', 'brief-06-cover-ar.jpg'],
  ['brief_admin', 'brief-07-admin-login.jpg'],
];

async function mintCookie() {
  await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`);
  const user = await mongoose.connection.db.collection('users').findOne({});
  if (!user) throw new Error('No user found in DB');
  await mongoose.disconnect();
  const token = jwt.sign({ user: String(user._id) }, JWT_SECRET, { expiresIn: '1h' });
  const signed = 's:' + cookieSignature.sign(token, COOKIE_SECRET);
  return { cookie: `portfolio-login-session=${encodeURIComponent(signed)}`, email: user.email };
}

async function uploadOne(fp, file, cookie) {
  const fd = new FormData();
  fd.append('screens', fs.createReadStream(fp), file);
  fd.append('folder', 'Portfolio');
  const res = await axios.post(`${API}/works/screens`, fd, {
    headers: { ...fd.getHeaders(), Cookie: cookie },
    maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 90000,
  });
  return res.data.data[0];
}

async function uploadAll(cookie) {
  const map = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  let fresh = 0;
  for (const [key, file] of FILES) {
    if (map[key]) continue;
    const fp = path.join(SHOTS_DIR, file);
    if (!fs.existsSync(fp)) { console.log('  MISSING (skip):', file); continue; }
    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        map[key] = await uploadOne(fp, file, cookie);
        fs.writeFileSync(CACHE, JSON.stringify(map, null, 2));
        console.log(`  uploaded ${key}`);
        fresh++;
        break;
      } catch (e) {
        lastErr = e;
        console.log(`  retry ${key} (attempt ${attempt}/5) — ${e?.response?.status || e.code || e.message}`);
        await sleep(5000 * attempt);
      }
    }
    if (!map[key]) throw new Error(`Upload failed for ${key}: ${lastErr?.response?.status || lastErr?.message}`);
    await sleep(1000);
  }
  console.log(`  (${fresh} new, ${Object.keys(map).length} total cached)`);
  return map;
}

function toFormData(obj, files) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    fd.append(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
  for (const [field, fp] of Object.entries(files)) fd.append(field, fs.createReadStream(fp), path.basename(fp));
  return fd;
}

function buildLammah(u) {
  const screen = (key, caption) => (u[key] ? { image: u[key], caption } : null);
  return {
    name: 'Lammah',
    slug: 'lammah',
    kind: 'case-study',
    importance: 'glowing',
    stackType: 'front',
    showInWebsite: false,
    showInCv: true,
    isTcgWork: false,
    tagline: 'An Arabic party-game hub — 9 group games in one app, played online in a room, face-to-face, or pass-and-play. Web PWA + Android.',
    timeline: { start: '2024', end: 'present' },
    description: [
      '***لمّة (Lammah) — nine party games in one, for a room full of friends.***',
      'Lammah is an Arabic-first, right-to-left social game hub. Create a room and everyone plays on their own phone, gather around one device face-to-face, or pass-and-play — the classic “Who Am I / Guess Who” guessing game expanded into a suite of nine.',
      '**Highlights:**',
      '--9 games: Who Am I, Guess the Opponent, Spy, True/False, Most Likely, Draw & Guess, Chain, Letters and Heads-Up Race--',
      '--Real-time multiplayer over Supabase (broadcast + presence, host-authoritative) with a local fallback--',
      '--≈3,900 cards across 18 categories — footballers, flags, 2,095 cities with map pins, historical figures and more--',
      '--11 unlockable colour themes, 21 achievements, XP & levels, a daily trivia streak and a custom-deck builder--',
      '--Delivered as an offline-capable PWA and an installable Android app (Capacitor) with self-hosted OTA updates--',
      '--Arabic RTL UI, playful game-show visual identity, sound and haptics--',
    ].join('\n'),
    metrics: [
      { value: '9', label: 'games in one hub', icon: 'ph:game-controller-duotone' },
      { value: '18', label: 'card categories', icon: 'ph:cards-duotone' },
      { value: '3,900+', label: 'cards', icon: 'ph:stack-duotone' },
      { value: '11', label: 'colour themes', icon: 'ph:palette-duotone' },
      { value: '920', label: 'trivia facts', icon: 'ph:brain-duotone' },
    ],
    outcomes: [
      { value: '9', label: 'games in one download', icon: 'ph:game-controller-duotone' },
      { value: '3 ways', label: 'to play — online · face-to-face · pass-and-play', icon: 'ph:users-three-duotone' },
      { value: 'PWA + Android', label: 'one codebase, two platforms', icon: 'ph:device-mobile-duotone' },
      { value: 'Offline', label: 'ready, with self-hosted OTA updates', icon: 'ph:wifi-high-duotone' },
    ],
    modules: [
      { name: 'The 9 games', icon: 'ph:game-controller-duotone', blurb: 'One hub, nine games — Who Am I, Guess the Opponent, Spy, True/False, Most Likely, Draw & Guess, Chain, Letters and Heads-Up Race — each with its own rules, timers and scoring.', screens: [screen('lammah_games', 'Game picker — all nine games'), screen('lammah_howto', 'Every game explained in seconds')].filter(Boolean) },
      { name: 'Rooms & play modes', icon: 'ph:users-three-duotone', blurb: 'Play online in a shared-code room (everyone on their own phone), face-to-face, or pass-and-play on one device — Supabase realtime with a local fallback.', screens: [screen('lammah_home', 'Home hub'), screen('lammah_playmode', 'Choose how to play')].filter(Boolean) },
      { name: 'Player identity', icon: 'ph:user-circle-duotone', blurb: 'Pick an emoji avatar and colour and set your name; friends see it in the room. Accounts, friend requests and presence included.', screens: [screen('lammah_onboarding', 'Avatar & name picker')].filter(Boolean) },
      { name: 'Progression & vault', icon: 'ph:trophy-duotone', blurb: 'XP, levels and coins unlock 11 colour themes; 21 achievements, a daily trivia streak and a custom-deck builder keep it sticky.', screens: [screen('lammah_profile', 'Profile, XP & avatars'), screen('lammah_themes', '11 unlockable themes')].filter(Boolean) },
      { name: 'Card content', icon: 'ph:cards-duotone', blurb: '≈3,900 cards across 18 categories — 244 footballers, 196 flags, 2,095 cities with map pins, 103 historical figures — plus a 920-fact trivia bank.', screens: [] },
      { name: 'Built for mobile', icon: 'ph:device-mobile-duotone', blurb: 'An offline-capable PWA and an installable Android app (Capacitor) with self-hosted OTA live updates, haptics and a Web-Audio sound layer.', screens: [] },
    ],
    flows: [
      {
        title: 'From tap to game night',
        description: 'How a group gets from opening the app to playing.',
        steps: [
          { caption: 'Create your player — pick an emoji avatar, colour and name.', image: u.lammah_onboarding },
          { caption: 'Choose how to play: a room on everyone’s phone, face-to-face, or pass-and-play.', image: u.lammah_home },
          { caption: 'Pick from nine games.', image: u.lammah_games },
          { caption: 'Learn any game’s rules in seconds and start.', image: u.lammah_howto },
        ].filter((s) => s.image),
      },
    ],
    architecture: {
      nodes: [
        { id: 'pwa', label: 'Web PWA · React/Vite', kind: 'app' },
        { id: 'android', label: 'Android · Capacitor', kind: 'app' },
        { id: 'rt', label: 'Supabase Realtime', kind: 'service' },
        { id: 'db', label: 'Postgres + Auth (RLS)', kind: 'db' },
        { id: 'ota', label: 'Self-hosted OTA', kind: 'service' },
      ],
      edges: [
        { from: 'pwa', to: 'rt', label: 'broadcast / presence' },
        { from: 'android', to: 'rt', label: 'broadcast / presence' },
        { from: 'rt', to: 'db', label: 'secrets (RLS)' },
        { from: 'ota', to: 'android', label: 'live updates' },
      ],
    },
    links: { demo: 'https://who-am-i.hassanali.tk' },
    stack: [S.React, S.TypeScript, S.Postgres].map((id, i) => ({ stack: id, order: i + 1 })),
    order: 1,
  };
}

function buildBrief(u) {
  const screen = (key, caption) => (u[key] ? { image: u[key], caption } : null);
  return {
    name: 'Medium Creative Brief',
    slug: 'creative-brief',
    kind: 'case-study',
    importance: 'glowing',
    stackType: 'front back',
    showInWebsite: false,
    showInCv: true,
    isTcgWork: false,
    tagline: 'A bilingual (EN/AR) client-intake tool for a brand designer — a polished multi-step brief with autosave, plus a private admin inbox. Next.js 16 + Firebase.',
    timeline: { start: '2025', end: 'present' },
    description: [
      '***Medium Creative Brief — a designer’s bilingual client-intake tool.***',
      'Brand & logo designer **Mohamed Ali** sends this polished single-page brief to a prospective client instead of a generic form. The client answers ~29 questions about their business, audience, competitors and taste; every answer autosaves as a local draft; on submit it’s validated and stored, and Mohamed reads it in a private admin inbox.',
      '**Highlights:**',
      '--Bilingual English / Arabic with full right-to-left layout and a per-script typeface swap--',
      '--A 4-section brief (Business · Competitors · Logo · Notes) with a jumpable stepper and an inline review--',
      '--Editorial, print-inspired design — cover-as-lid, colophon, crop marks — in a warm paper-and-ink palette--',
      '--Draft autosave to the browser; deep-linkable steps resolved server-side (no flash)--',
      '--Private admin: read, search, archive and permanently delete submissions, behind hardened single-password auth--',
      '--Built on Next.js 16 · React 19 · Tailwind v4 · Motion · Firebase/Firestore · Zod--',
    ].join('\n'),
    metrics: [
      { value: '2', label: 'languages · EN/AR RTL', icon: 'ph:translate-duotone' },
      { value: '4', label: 'brief sections', icon: 'ph:list-checks-duotone' },
      { value: '29', label: 'questions', icon: 'ph:question-duotone' },
      { value: '9', label: 'logo-style options', icon: 'ph:shapes-duotone' },
    ],
    outcomes: [
      { value: 'EN · AR', label: 'fully bilingual, RTL-complete', icon: 'ph:translate-duotone' },
      { value: 'Autosave', label: 'drafts are never lost', icon: 'ph:floppy-disk-duotone' },
      { value: 'No template', label: 'the identity fits the client', icon: 'ph:sparkle-duotone' },
      { value: 'Hardened', label: 'PBKDF2 + HMAC admin auth', icon: 'ph:shield-check-duotone' },
    ],
    modules: [
      { name: 'The cover', icon: 'ph:book-open-duotone', blurb: 'A dark editorial hero that lifts like a lid to reveal the brief — masked title, fact chips (4 sections · 12–15 min · saves as you type) and a designer colophon.', screens: [screen('brief_cover', 'Editorial cover')].filter(Boolean) },
      { name: 'Business', icon: 'ph:buildings-duotone', blurb: 'Contact, timeline, what the business does, its story, goals (multi-select) and a full target-audience profile — the largest section.', screens: [screen('brief_business', 'Your business')].filter(Boolean) },
      { name: 'Competitors', icon: 'ph:users-duotone', blurb: 'Direct and indirect competitors and what makes the client different.', screens: [screen('brief_competitors', 'Competitors')].filter(Boolean) },
      { name: 'Logo & look', icon: 'ph:pen-nib-duotone', blurb: 'Palette, typography, tagline, keywords and a 9-option visual logo-style picker.', screens: [screen('brief_logo', 'Logo-style picker')].filter(Boolean) },
      { name: 'Notes & review', icon: 'ph:note-pencil-duotone', blurb: 'Free-text notes plus a “before you send” review that reads back every answer with jump-to-edit links.', screens: [screen('brief_notes', 'Notes & review')].filter(Boolean) },
      { name: 'Bilingual & RTL', icon: 'ph:translate-duotone', blurb: 'The entire brief in English or Arabic, fully right-to-left, with Manrope / Omnes Arabic typefaces swapped by script.', screens: [screen('brief_cover_ar', 'Arabic (RTL) cover')].filter(Boolean) },
      { name: 'Admin inbox', icon: 'ph:lock-key-duotone', blurb: 'A private, single-password area to read, search, archive and permanently delete briefs — PBKDF2 auth, HMAC sessions and brute-force lockout.', screens: [screen('brief_admin', 'Admin login')].filter(Boolean) },
    ],
    flows: [
      {
        title: 'Filling the brief',
        description: 'The client’s path from cover to send.',
        steps: [
          { caption: 'Open the cover and begin the brief.', image: u.brief_cover },
          { caption: 'Answer the Business section — who you are and who you sell to.', image: u.brief_business },
          { caption: 'Pick a logo direction from nine visual styles.', image: u.brief_logo },
          { caption: 'Review every answer, then send.', image: u.brief_notes },
        ].filter((s) => s.image),
      },
    ],
    architecture: {
      nodes: [
        { id: 'next', label: 'Next.js 16 · App Router', kind: 'app' },
        { id: 'actions', label: 'Server Actions', kind: 'api' },
        { id: 'firestore', label: 'Firestore', kind: 'db' },
        { id: 'smtp', label: 'Nodemailer / SMTP', kind: 'external' },
      ],
      edges: [
        { from: 'next', to: 'actions', label: 'submit brief' },
        { from: 'actions', to: 'firestore', label: 'store & read' },
        { from: 'actions', to: 'smtp', label: 'reset email' },
      ],
    },
    links: { demo: 'https://mo-medium-creative-brief.vercel.app/en' },
    stack: [S.Next, S.React, S.TypeScript, S.Tailwind, S.Firebase].map((id, i) => ({ stack: id, order: i + 1 })),
    order: 1,
  };
}

async function upsert(work, coverFiles, cookie) {
  const existing = await axios.get(`${API}/works?slug=${work.slug}&limit=1`, { validateStatus: () => true });
  const found = existing.data && existing.data.data && existing.data.data[0];
  const fd = toFormData(work, coverFiles);
  const url = found && found._id ? `${API}/works/${found._id}` : `${API}/works`;
  const method = found && found._id ? 'patch' : 'post';
  const res = await axios[method](url, fd, {
    headers: { ...fd.getHeaders(), Cookie: cookie }, maxContentLength: Infinity, maxBodyLength: Infinity, validateStatus: () => true,
  });
  console.log(`  ${work.slug} ${method} → ${res.status}`);
  if (res.status >= 400) { console.log('  ERROR:', JSON.stringify(res.data)); throw new Error(`${work.slug} failed`); }
  return res.data.data;
}

async function main() {
  console.log('Minting session…');
  const { cookie, email } = await mintCookie();
  console.log('  session for:', email);
  const verify = await axios.post(`${API}/auth/verify`, {}, { headers: { Cookie: cookie }, validateStatus: () => true });
  if (verify.status !== 200) throw new Error('Auth verify failed');

  console.log('Uploading screenshots…');
  const u = await uploadAll(cookie);

  console.log('Creating Lammah…');
  const lammah = buildLammah(u);
  delete lammah.images;
  await upsert(lammah, {
    desktop: path.join(SHOTS_DIR, 'lammah-03-games.jpg'),
    mobile: path.join(SHOTS_DIR, 'lammah-04-home.jpg'),
  }, cookie);

  console.log('Creating Medium Creative Brief…');
  const brief = buildBrief(u);
  delete brief.images;
  await upsert(brief, {
    desktop: path.join(SHOTS_DIR, 'brief-01-cover.jpg'),
    mobile: path.join(SHOTS_DIR, 'brief-02-business.jpg'),
  }, cookie);

  console.log('\nDONE (both hidden for review).');
  console.log('Preview: https://hassanali.tk/projects/lammah?preview=1');
  console.log('Preview: https://hassanali.tk/projects/creative-brief?preview=1');
}

main().then(() => process.exit(0)).catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
