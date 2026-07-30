/* eslint-disable */
/**
 * One-off: promote "Certificates Management" to a full case study.
 *
 * Uploads the captured screens through the real /works/screens pipeline, then
 * PATCHes the existing work with kind=case-study, importance=glowing, a slug,
 * modules/flows/metrics/outcomes/architecture and a refreshed stack.
 *
 * Usage:
 *   node _seed_trust_certificates.cjs            # dry run — prints the payload
 *   node _seed_trust_certificates.cjs --apply    # uploads + patches
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
const SCRATCH = 'C:/Users/hassa/AppData/Local/Temp/claude/h--Works-My-Portfolio-v4-FE/f88a11ec-d722-4214-b9de-f278f7cc8cdd/scratchpad/shots';
const SCREENS_DIR = path.join(SCRATCH, 'certs-out');
const CARD_DIR = path.join(SCRATCH, 'out');
const CACHE = path.join(__dirname, '_trust_certificates_uploads.json');
const APPLY = process.argv.includes('--apply');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { JWT_SECRET, COOKIE_SECRET, MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;

const WORK_NAME = 'Certificates Management';

const S = {
  Vue: '63f3261361da25c7aa6a6e74',
  Firebase: '63f3261361da25c7aa6a6e4f',
  Tailwind: '63f3261361da25c7aa6a6e70',
  JavaScript: '63f3261361da25c7aa6a6e56',
};

// screen key -> filename in certs-out/
const FILES = [
  ['portal', 'portal.webp'],
  ['azhar_login', 'azhar-login.webp'],
  ['azhar_dashboard', 'azhar-dashboard.webp'],
  ['azhar_editor', 'azhar-editor.webp'],
  ['azhar_certificate', 'azhar-certificate.webp'],
  ['eng_dashboard', 'eng-dashboard.webp'],
  ['eng_editor', 'eng-editor.webp'],
  ['eng_certificate', 'eng-certificate.webp'],
  ['ara_dashboard', 'ara-dashboard.webp'],
  ['ara_certificate', 'ara-certificate.webp'],
  ['meshkat_login', 'meshkat-login.webp'],
  ['meshkat_dashboard', 'meshkat-dashboard.webp'],
  ['meshkat_editor', 'meshkat-editor.webp'],
  ['meshkat_form', 'meshkat-form.webp'],
  ['contracts_login', 'contracts-login.webp'],
  ['contracts_dashboard', 'contracts-dashboard.webp'],
  ['contracts_editor', 'contracts-editor.webp'],
  ['contracts_contract', 'contracts-contract.webp'],
];

async function mintCookie() {
  await mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`
  );
  const user = await mongoose.connection.db.collection('users').findOne({});
  if (!user) throw new Error('No user found in DB');
  const token = jwt.sign({ user: String(user._id) }, JWT_SECRET, { expiresIn: '2h' });
  const signed = 's:' + cookieSignature.sign(token, COOKIE_SECRET);
  return `portfolio-login-session=${encodeURIComponent(signed)}`;
}

async function uploadOne(fp, file, cookie) {
  const fd = new FormData();
  fd.append('screens', fs.createReadStream(fp), file);
  fd.append('folder', 'Trust Certificates');
  const res = await axios.post(`${API}/works/screens`, fd, {
    headers: { ...fd.getHeaders(), Cookie: cookie },
    maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 120000,
  });
  return res.data.data[0];
}

async function uploadAll(cookie) {
  const map = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  let fresh = 0;
  for (const [key, file] of FILES) {
    if (map[key]) continue;
    const fp = path.join(SCREENS_DIR, file);
    if (!fs.existsSync(fp)) { console.log(`  MISSING (skip): ${file}`); continue; }
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
        console.log(`  retry ${key} (${attempt}/5) — ${e?.response?.data?.message || e?.response?.status || e.code || e.message}`);
        await sleep(4000 * attempt);
      }
    }
    if (!map[key]) throw new Error(`Upload failed for ${key}: ${lastErr?.message}`);
    await sleep(800);
  }
  console.log(`  (${fresh} new, ${Object.keys(map).length} total cached)`);
  return map;
}

const ADMIN = 'Academy admin';
const VERIFIER = 'Student / verifier';

function buildPayload(u) {
  const screen = (key, caption) => (u[key] ? { image: u[key], caption } : null);

  return {
    slug: 'trust-certificates',
    kind: 'case-study',
    importance: 'glowing',
    stackType: 'front back',
    showInWebsite: true,
    showInCv: true,
    isTcgWork: false,
    // `domains` is deliberately not sent — the backfill already set it, and the
    // deployed API doesn't know the field yet so it would just be stripped.
    tagline:
      'One codebase, five certificate systems — a config-driven platform that issues and QR-verifies 2,078 certificates, student forms and contracts for Trust Academy.',
    timeline: { start: 'Oct 2019', end: 'present' },
    description: [
      '***Five certificate systems, one codebase.***',
      'Trust Academy issues certificates for very different bodies — Al-Azhar University food-safety courses, its own English and Arabic language programmes, the Meshkat Nour foundation, and student enrolment contracts. Each needs its own fields, its own institutional logos, its own signatories and its own database — but they are all the same product.',
      'So the platform is driven by one declarative **department config**: collection, auth user type, routes, logos, field schema, table columns, ID field and QR prefix. Adding a sixth system means adding one object, not a new app.',
      '**Highlights:**',
      '--A landing portal routing into 5 independent systems, each behind its own Firebase Auth account and user-type gate--',
      '--47 schema-driven fields across the five departments — forms, tables and public documents all generate from the same config--',
      '--Every issued document gets a QR code resolving to a public verification page, plus barcode display and print layouts--',
      '--Print-ready formal documents: institutional logos, CERTIFIED stamp and up to 4 signatory lines--',
      '--Meshkat Nour adds row selection, Excel export and bulk certificate download as a zip (1,193 records)--',
      '--Search across every field, autocomplete fed by 9 auto-collected value sets, and paginated load-more--',
      '--Arabic-first RTL interface with a dark/light theme toggle--',
      '--Rebuilt in April 2026 from the original legacy code onto Vue 3, Vite 6, Pinia and Tailwind 4 — same data, no downtime--',
    ].join('\n'),
    metrics: [
      { value: '5', label: 'systems, one codebase', icon: 'ph:squares-four-duotone' },
      { value: '2,078', label: 'documents issued', icon: 'ph:certificate-duotone' },
      { value: '47', label: 'schema-driven fields', icon: 'ph:list-checks-duotone' },
      { value: '1,193', label: 'in the largest system', icon: 'ph:database-duotone' },
      { value: 'QR', label: 'public verification', icon: 'ph:qr-code-duotone' },
    ],
    outcomes: [
      { value: 'One config', label: 'a new department is an object, not an app', icon: 'ph:sliders-duotone' },
      { value: '2,078', label: 'certificates, forms and contracts in production', icon: 'ph:certificate-duotone' },
      { value: '5 tenants', label: 'isolated by auth user type and collection', icon: 'ph:shield-check-duotone' },
      { value: 'Vue 3', label: 'legacy rebuild with the data left untouched', icon: 'ph:arrows-clockwise-duotone' },
    ],
    roles: [ADMIN, VERIFIER],
    modules: [
      {
        name: 'The portal',
        icon: 'ph:squares-four-duotone',
        blurb:
          'One front door for five systems. Each card routes into an independent department with its own login, database collection and document format.',
        roles: [ADMIN, VERIFIER],
        screens: [screen('portal', 'Landing portal — five systems, one entry point')].filter(Boolean),
      },
      {
        name: 'Al-Azhar certificates',
        icon: 'ph:graduation-cap-duotone',
        blurb:
          'The most formal system: 136 food-safety certificates (HACCP, GHPs, GMPs) carrying three institutional logos — Al-Azhar University, S.T.A.U. and Trust Academy — and four signatory lines from tutor up to university vice-president.',
        roles: [ADMIN, VERIFIER],
        screens: [
          screen('azhar_dashboard', 'Dashboard — 136 records, search and paginated load-more'),
          screen('azhar_certificate', 'The public certificate — 3 logos, CERTIFIED stamp, 4 signatories'),
          screen('azhar_editor', 'Record editor generated from the 10-field schema'),
        ].filter(Boolean),
      },
      {
        name: 'English & Arabic programmes',
        icon: 'ph:translate-duotone',
        blurb:
          'Twin language systems — 646 English and 100 Arabic certificates — sharing an identical 7-field schema but separate collections, logins and certificate layouts. The clearest proof the config approach works.',
        roles: [ADMIN, VERIFIER],
        screens: [
          screen('eng_dashboard', 'English dashboard — 646 certificates'),
          screen('eng_certificate', 'English certificate'),
          screen('ara_certificate', 'Arabic certificate — same engine, different department'),
          screen('ara_dashboard', 'Arabic dashboard — 100 certificates'),
        ].filter(Boolean),
      },
      {
        name: 'Meshkat Nour forms',
        icon: 'ph:identification-card-duotone',
        blurb:
          'The largest system at 1,193 student enrolment forms, and the only one with bulk tooling: row selection, Excel export via ExcelJS and multi-certificate download zipped with JSZip. Bilingual name capture, national ID, governorate and student photo.',
        roles: [ADMIN],
        screens: [
          screen('meshkat_dashboard', '1,193 forms — row select, Excel export, bulk download'),
          screen('meshkat_form', 'The public student form (إستمارة طالب)'),
          screen('meshkat_editor', 'Editor for the 11-field bilingual schema'),
        ].filter(Boolean),
      },
      {
        name: 'Student contracts',
        icon: 'ph:file-text-duotone',
        blurb:
          'Enrolment contracts between student and university — the widest schema at 12 fields, covering guardian details, passport and national ID, university, specialisation and fee, rendered as a long formal contract document.',
        roles: [ADMIN, VERIFIER],
        screens: [
          screen('contracts_dashboard', 'Contracts dashboard'),
          screen('contracts_contract', 'The generated contract document'),
          screen('contracts_editor', 'Contract editor — 12 fields'),
        ].filter(Boolean),
      },
      {
        name: 'Public verification',
        icon: 'ph:qr-code-duotone',
        blurb:
          'Every document carries a QR pointing at its own public URL, so anyone holding a printed certificate can confirm it against the source. Unknown IDs land on a dedicated not-found page per document type, and each view offers barcode display and a print layout.',
        roles: [VERIFIER],
        screens: [screen('azhar_certificate', 'Scan the QR, land on the record itself')].filter(Boolean),
      },
      {
        name: 'Auth & tenant isolation',
        icon: 'ph:shield-check-duotone',
        blurb:
          'Each department has its own Firebase Auth account. Signing in is not enough — a route guard reads the user record and rejects anyone whose `type` does not match the department, so an English admin cannot reach the contracts data.',
        roles: [ADMIN],
        screens: [
          screen('azhar_login', 'Per-department login'),
          screen('meshkat_login', 'Same screen, different department branding'),
          screen('contracts_login', 'Contracts login'),
        ].filter(Boolean),
      },
    ],
    flows: [
      {
        title: 'Issuing a certificate',
        description: 'What an academy admin does to turn a finished course into a verifiable certificate.',
        steps: [
          { caption: 'Sign in to the department — the guard checks your user type matches.', image: u.azhar_login },
          { caption: 'The dashboard lists every record in that collection, searchable across all fields.', image: u.azhar_dashboard },
          { caption: 'Fill the form generated from the department schema; autocomplete offers previously used courses, tutors and venues.', image: u.azhar_editor },
          { caption: 'The certificate is live at its own public URL, QR-verifiable and print-ready.', image: u.azhar_certificate },
        ].filter((s) => s.image),
      },
      {
        title: 'Verifying a printed document',
        description: 'The path a third party takes to confirm a certificate is genuine.',
        steps: [
          { caption: 'Scan the QR printed on the document.', image: u.azhar_certificate },
          { caption: 'It resolves to the record itself — no login, nothing to fill in.', image: u.meshkat_form },
          { caption: 'Barcode and print views are available for archival.', image: u.contracts_contract },
        ].filter((s) => s.image),
      },
    ],
    // Kept to three dependency levels (app -> services -> data) so the panel's
    // column layout doesn't stack an edge label on top of a node.
    architecture: {
      nodes: [
        { id: 'spa', label: 'Vue 3 SPA · Vite', kind: 'app' },
        { id: 'auth', label: 'Firebase Auth', kind: 'service' },
        { id: 'storage', label: 'Supabase Storage', kind: 'service' },
        { id: 'rtdb', label: 'Realtime Database', kind: 'db' },
      ],
      edges: [
        { from: 'spa', to: 'auth', label: 'sign-in' },
        { from: 'spa', to: 'storage', label: 'QR & photos' },
        { from: 'auth', to: 'rtdb', label: 'user-type gate' },
        { from: 'spa', to: 'rtdb', label: '5 collections' },
      ],
    },
    links: { demo: 'https://certs-website.web.app' },
    stack: [S.Vue, S.Firebase, S.Tailwind, S.JavaScript].map((id, i) => ({ stack: id, order: i + 1 })),
  };
}

function toFormData(obj, files) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    fd.append(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
  for (const [field, fp] of Object.entries(files)) {
    fd.append(field, fs.createReadStream(fp), path.basename(fp));
  }
  return fd;
}

(async () => {
  console.log(APPLY ? '=== TRUST CERTIFICATES CASE STUDY (APPLY) ===' : '=== TRUST CERTIFICATES CASE STUDY (DRY RUN) ===');
  const cookie = await mintCookie();
  console.log(`Target database: ${MONGO_DATABASE}`);

  const matches = await mongoose.connection.db
    .collection('works')
    .find({ name: WORK_NAME }, { projection: { name: 1, showInWebsite: 1, kind: 1, importance: 1 } })
    .toArray();

  if (!matches.length) throw new Error(`No work named "${WORK_NAME}"`);
  const work = matches.find((w) => w.showInWebsite) || matches[0];
  console.log(`Work: ${work._id}  (currently kind=${work.kind}, importance=${work.importance})\n`);

  if (!APPLY) {
    const stub = Object.fromEntries(FILES.map(([k]) => [k, `https://example/${k}`]));
    const payload = buildPayload(stub);
    console.log('Screens to upload:', FILES.length);
    console.log('Payload keys:', Object.keys(payload).join(', '));
    console.log(`  slug=${payload.slug}  kind=${payload.kind}  importance=${payload.importance}`);
    console.log(`  modules=${payload.modules.length}  flows=${payload.flows.length}  metrics=${payload.metrics.length}  outcomes=${payload.outcomes.length}`);
    console.log(`  module screens: ${payload.modules.map((m) => `${m.name}=${m.screens.length}`).join(', ')}`);
    console.log(`  arch nodes=${payload.architecture.nodes.length} edges=${payload.architecture.edges.length}`);
    console.log('\nDry run — nothing uploaded or patched. Re-run with --apply.');
    await mongoose.disconnect();
    return;
  }

  console.log('Uploading screens...');
  const u = await uploadAll(cookie);

  const payload = buildPayload(u);
  const cardDesktop = path.join(CARD_DIR, 'certs-desktop.webp');
  const cardMobile = path.join(CARD_DIR, 'certs-mobile.webp');
  const files = {};
  if (fs.existsSync(cardDesktop)) files.desktop = cardDesktop;
  if (fs.existsSync(cardMobile)) files.mobile = cardMobile;

  console.log('\nPatching work...');
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      // Build once per attempt: the boundary in the headers must match this exact
      // body, and a consumed stream can't be replayed on retry.
      const fd = toFormData(payload, files);
      const res = await axios.patch(`${API}/works/${work._id}`, fd, {
        headers: { ...fd.getHeaders(), Cookie: cookie },
        maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 180000,
      });
      const d = res.data.data;
      console.log(`  OK — kind=${d.kind} importance=${d.importance} slug=${d.slug}`);
      console.log(`  modules=${d.modules?.length} flows=${d.flows?.length} metrics=${d.metrics?.length} outcomes=${d.outcomes?.length}`);
      console.log(`  images.desktop=${d.images?.desktop}`);
      console.log(`  case study: https://hassanali.tk/projects/${d.slug}`);
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      console.log(`  attempt ${attempt}/4 failed — ${e?.response?.data?.message || e?.response?.status || e.message}`);
      if (e?.response?.data) console.log('   ', JSON.stringify(e.response.data).slice(0, 500));
      if (attempt < 4) await sleep(4000 * attempt);
    }
  }
  if (lastErr) throw lastErr;

  await mongoose.disconnect();
  console.log('\nDone.');
})().catch(async (e) => {
  console.error(e?.response?.data || e.message || e);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
