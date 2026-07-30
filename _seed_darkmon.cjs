/* eslint-disable */
// One-off: create the "DarkMon TIP" product-ecosystem work on the live portfolio,
// HIDDEN (showInWebsite:false) for private review. Mirrors the Markety seed:
// mints an auth session from local secrets, uploads screenshots through the real
// /works/screens pipeline, then creates the work via multipart /works.
// Safe to re-run: uploads cached to json; work upserted by slug.

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieSignature = require('cookie-signature');
const axios = require('axios');
const FormData = require('form-data');

const API = 'https://api.hassanali.tk';
const SHOTS_DIR = 'H:/Works/My Portfolio/v4/FE/.darkmon-shots';
const CACHE = path.join(__dirname, '_darkmon_uploads.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { JWT_SECRET, COOKIE_SECRET, MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;

// key -> filename (in SHOTS_DIR). Pruned to whatever actually captured well.
const FILES = [
  // TIP (demo)
  ['tip_dashboard', 'tip-01-dashboard.jpg'],
  ['tip_brand', 'tip-02-brand-protection.jpg'],
  ['tip_ct', 'tip-03-ct-monitoring.jpg'],
  ['tip_assets', 'tip-04-compromised-assets.jpg'],
  ['tip_machines', 'tip-05-compromised-machines.jpg'],
  ['tip_darkweb', 'tip-06-dark-web.jpg'],
  ['tip_cards', 'tip-07-bank-cards.jpg'],
  ['tip_vuln', 'tip-08-vulnerability.jpg'],
  ['tip_ransomware', 'tip-09-ransomware.jpg'],
  ['tip_actors', 'tip-10-threat-actors.jpg'],
  ['tip_iocs', 'tip-11-iocs.jpg'],
  ['tip_malware', 'tip-12-malware.jpg'],
  ['tip_news', 'tip-13-landscape-news.jpg'],
  ['tip_reports', 'tip-14-reports.jpg'],
  ['tip_graphs', 'tip-15-graphs.jpg'],
  ['tip_board', 'tip-16-board-protection.jpg'],
  // Management
  ['mgmt_company', 'mgmt-01-company-management.jpg'],
  ['mgmt_users', 'mgmt-02-user-management.jpg'],
  ['mgmt_approvals', 'mgmt-03-approval-requests.jpg'],
  ['mgmt_misp', 'mgmt-04-misp-config.jpg'],
  ['mgmt_rss', 'mgmt-05-rss-feeds.jpg'],
  ['mgmt_ractors', 'mgmt-06-ransomware-actors.jpg'],
  ['mgmt_logs', 'mgmt-07-logs.jpg'],
  // Portal (portal-01-home is a duplicate of /products — skipped)
  ['portal_products', 'portal-02-products.jpg'],
  ['portal_login', 'portal-03-login.jpg'],
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
  fd.append('folder', 'DarkMon');
  const res = await axios.post(`${API}/works/screens`, fd, {
    headers: { ...fd.getHeaders(), Cookie: cookie },
    maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 90000,
  });
  return res.data.data[0];
}

async function uploadAll(cookie) {
  // Resume from a partial cache: each URL is persisted the moment it lands, so a
  // mid-run failure (e.g. a transient storage flood limit) never loses progress.
  const map = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  let fresh = 0;

  for (const [key, file] of FILES) {
    if (map[key]) continue; // already uploaded on a previous run
    const fp = path.join(SHOTS_DIR, file);
    if (!fs.existsSync(fp)) {
      console.log('  MISSING (skip):', file);
      continue;
    }

    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        map[key] = await uploadOne(fp, file, cookie);
        fs.writeFileSync(CACHE, JSON.stringify(map, null, 2)); // persist immediately
        console.log(`  uploaded ${key}`);
        fresh++;
        break;
      } catch (e) {
        lastErr = e;
        const status = e?.response?.status || e.code || e.message;
        console.log(`  retry ${key} (attempt ${attempt}/5) — ${status}`);
        await sleep(5000 * attempt); // backoff (5s,10s,15s,20s) — rides out storage flood-waits
      }
    }
    if (!map[key]) throw new Error(`Upload failed for ${key}: ${lastErr?.response?.status || lastErr?.message}`);
    await sleep(1000); // gentle pacing so the storage backend doesn't flood-limit
  }

  console.log(`  (${fresh} new, ${Object.keys(map).length} total cached)`);
  return map;
}

function buildPayload(u) {
  const s = (key, caption) => (u[key] ? [{ image: u[key], caption }] : []);
  const screen = (key, caption) => (u[key] ? { image: u[key], caption } : null);

  const stackIds = [
    '63f3261361da25c7aa6a6e68', // React
    '63f3261361da25c7aa6a6e71', // TypeScript
    '63f3261361da25c7aa6a6e70', // Tailwindcss
  ];

  const modules = [
    ['Dashboard', 'ph:gauge-duotone', 'A configurable board of 32 widget types — leaked-credential counts, top victim countries, vulnerability trends and a live threat map — for at-a-glance exposure posture.', 'tip_dashboard'],
    ['Brand Protection', 'ph:shield-star-duotone', 'Typosquatting, Certificate-Transparency monitoring, code-leak and paste-leak detection — catching brand impersonation and accidental exposure across GitHub, GitLab, NPM and more.', 'tip_brand'],
    ['CT Monitoring', 'ph:certificate-duotone', 'Certificate Transparency log monitoring — alerts on newly issued or soon-to-expire certificates for the customer’s domains.', 'tip_ct'],
    ['Compromised Assets', 'ph:key-duotone', 'Stealer-log and breach monitoring for compromised employee accounts, combo-list exposure and appearances in public breach databases.', 'tip_assets'],
    ['Compromised Machines', 'ph:desktop-tower-duotone', 'Infostealer-infected endpoints tied to the organization — surfaced before their stolen sessions can be abused.', 'tip_machines'],
    ['Dark Web Mentions', 'ph:chats-circle-duotone', 'Telegram and dark-forum monitoring for mentions of the organization — early warning on planned or ongoing targeting.', 'tip_darkweb'],
    ['Bank Cards', 'ph:credit-card-duotone', 'Leaked payment-card monitoring across seven card brands — a banking-industry-gated exposure module.', 'tip_cards'],
    ['Vulnerability', 'ph:bug-beetle-duotone', 'CVEs, zero-day and CVE news with CVSS v2–v4 scoring, mapped to the customer’s own assets to prioritise patching by real exposure.', 'tip_vuln'],
    ['Ransomware', 'ph:lock-key-duotone', 'Tracks ransomware groups, victims and activity across the threat landscape.', 'tip_ransomware'],
    ['Threat Actors', 'ph:user-focus-duotone', 'Adversary profiles with a full MITRE ATT&CK matrix (tactics → techniques → sub-techniques), tools, linked IOCs, motivation and classification.', 'tip_actors'],
    ['IOCs', 'ph:crosshair-duotone', 'Nine indicator feeds — C2, Tor nodes, open proxies, VPN IPs, phishing URLs, brute-force sources, newly-registered domains and a blocklist — for detection and blocking.', 'tip_iocs'],
    ['Malware', 'ph:virus-duotone', 'Malware and malware-family intelligence (files and URLs).', 'tip_malware'],
    ['Landscape News', 'ph:newspaper-duotone', 'A curated threat-landscape news feed drawn from RSS sources managed in the Management console.', 'tip_news'],
    ['Reports', 'ph:file-text-duotone', 'Generated intelligence reports with export.', 'tip_reports'],
    ['Graphs', 'ph:graph-duotone', 'Relationship / link-analysis graphs connecting entities across the platform.', 'tip_graphs'],
    ['Board Protection', 'ph:crown-simple-duotone', 'VIP / executive digital-footprint protection — monitors board members’ personal identities across breaches and combo-lists, with password-protected exports.', 'tip_board'],
  ].map(([name, icon, blurb, key]) => ({ name, icon, blurb, screens: s(key, name) }));

  const apps = [
    {
      name: 'TIP — Analyst Platform',
      audience: 'CISOs & analysts',
      platform: 'Web · React 19',
      icon: 'ph:shield-check-duotone',
      color: '#47b9cd',
      blurb: 'The customer-facing threat-intelligence platform: a CISO’s team monitors their external attack surface — brand abuse, leaked credentials, dark-web chatter, vulnerabilities, threat actors and IOCs — in real time, across a multi-tenant parent/child company model.',
      screens: [
        screen('tip_dashboard', 'Dashboard — live exposure posture (32 widget types + threat map)'),
        screen('tip_actors', 'Threat Actors — full MITRE ATT&CK profile'),
        screen('tip_assets', 'Compromised Assets — leaked-credential monitoring'),
        screen('tip_vuln', 'Vulnerability — CVEs mapped to the customer’s assets'),
        screen('tip_darkweb', 'Dark Web Mentions — Telegram & forums'),
        screen('tip_graphs', 'Graphs — entity link analysis'),
      ].filter(Boolean),
    },
    {
      name: 'Management — Ops Console',
      audience: 'DarkMon staff',
      platform: 'Web · React 19',
      icon: 'ph:gear-six-duotone',
      color: '#c88a38',
      blurb: 'The internal operations console — staff approve customer onboarding, provision companies and users, and configure the intelligence pipelines (MISP feeds, RSS sources, ransomware actors, vulnerability-vendor normalization) plus system health and logs.',
      screens: [
        screen('mgmt_misp', 'Operations — MISP feed configuration'),
        screen('mgmt_approvals', 'Approval Requests — multi-stage approval workflow'),
        screen('mgmt_company', 'Company Management — provisioning & contracts'),
        screen('mgmt_rss', 'Operations — RSS news sources'),
        screen('mgmt_ractors', 'Operations — ransomware threat actors'),
        screen('mgmt_logs', 'Logs — audit trail & logger control'),
      ].filter(Boolean),
    },
    {
      name: 'Portal — SSO Gateway',
      audience: 'All users',
      platform: 'Web · React 19',
      icon: 'ph:sign-in-duotone',
      color: '#6366f1',
      blurb: 'The single sign-on gateway for the whole suite — one hardened login and onboarding flow (password policy, TOTP/SMS/WhatsApp MFA, SAML) that authenticates a user, then routes them to the products they’re licensed for.',
      screens: [
        screen('portal_products', 'Product catalog — routes to licensed apps'),
        screen('portal_login', 'Hardened login + MFA'),
      ].filter(Boolean),
    },
  ];

  const flowSteps = [
    ['Management', 'DarkMon analysts curate the threat feeds — MISP sources, RSS news and ransomware actors — in the internal Operations console.', u.mgmt_misp],
    ['Portal', 'A customer signs in once through the hardened SSO portal (MFA) and is routed to the products they’re licensed for.', u.portal_login],
    ['TIP', 'In TIP, their CISO sees exposure at a glance on a live dashboard — leaked accounts, brand abuse and vulnerabilities mapped to their assets.', u.tip_dashboard],
    ['TIP', 'An analyst drills into a threat actor’s full MITRE ATT&CK profile and the IOCs linked to it.', u.tip_actors],
    ['TIP', 'New MISP classifications and fresh compromised-credential hits push to the team in real time over websockets.', u.tip_assets],
  ].filter(([, , img]) => img).map(([app, caption, image]) => ({ app, caption, image }));

  return {
    name: 'DarkMon TIP',
    slug: 'darkmon-tip',
    kind: 'ecosystem',
    importance: 'glowing',
    stackType: 'front',
    showInWebsite: false, // HIDDEN for review
    showInCv: true,
    isTcgWork: false,
    tagline: 'A Swiss threat-intelligence platform — an analyst SaaS, an internal ops console and an SSO portal — built as one React monorepo with a shared design system, real-time alerting and multi-tenant access.',
    timeline: { start: 'Aug 2024', end: 'present' },
    description: [
      '***DarkMon TIP — See The Unseen. An enterprise Threat Intelligence Platform: three apps, one codebase.***',
      'Built for Swiss firm **DarkMon AG**, TIP lets a CISO’s team watch their organization’s external attack surface — leaked credentials, brand abuse, dark-web chatter, vulnerabilities, threat actors and IOCs — in real time, across a multi-tenant (parent/child company) model.',
      'It’s built as a set of **React 19** apps sharing one symlinked component library — an **analyst platform (TIP)**, an **internal operations console (Management)** and an **SSO portal** — with **2,400+ commits over ~2 years**.',
      '**Highlights:**',
      '--28 licensable features across ~16 modules: brand protection, compromised assets, dark web, vulnerabilities, threat actors, IOCs, malware, ransomware and board protection--',
      '--Real-time alerting over SockJS/STOMP websockets — live MISP classifications and Certificate-Transparency events--',
      '--Full MITRE ATT&CK matrix, CVSS v2–v4 scoring, 9 IOC feed types and 32 configurable dashboard widgets including a live threat map--',
      '--Multi-tenant / MSSP model — Central-CISO and Global-SOC personas drill into managed child companies--',
      '--5 languages including full RTL Arabic; SSO across .darkmon.com subdomains; forward-looking device-bound sessions (DPoP)--',
    ].join('\n'),
    metrics: [
      { value: '3', label: 'connected apps', icon: 'ph:circles-three-duotone' },
      { value: '28', label: 'product features', icon: 'ph:squares-four-duotone' },
      { value: '9', label: 'IOC feed types', icon: 'ph:crosshair-duotone' },
      { value: '32', label: 'dashboard widgets', icon: 'ph:squares-four-duotone' },
      { value: '5', label: 'languages · RTL', icon: 'ph:translate-duotone' },
    ],
    outcomes: [
      { value: '3 apps', label: 'from one shared React monorepo', icon: 'ph:package-duotone' },
      { value: 'Realtime', label: 'live MISP + CT-cert alerts (websockets)', icon: 'ph:broadcast-duotone' },
      { value: 'Multi-tenant', label: 'parent/child (MSSP) access model', icon: 'ph:buildings-duotone' },
      { value: '5 languages', label: 'i18n incl. RTL Arabic', icon: 'ph:translate-duotone' },
    ],
    apps,
    flows: [
      {
        title: 'Follow a threat across the platform',
        description: 'From feed curation to a CISO’s live alert — the same intelligence moving through all three apps.',
        steps: flowSteps,
      },
    ],
    modules,
    roles: ['CISO', 'Analyst', 'Central CISO', 'Global SOC', 'Admin'],
    architecture: {
      nodes: [
        { id: 'portal', label: 'SSO Portal · React', kind: 'app' },
        { id: 'tip', label: 'TIP · Analyst Platform', kind: 'app' },
        { id: 'mgmt', label: 'Management · Ops Console', kind: 'app' },
        { id: 'common', label: 'frontend-common · shared lib', kind: 'service' },
        { id: 'api', label: 'Platform API', kind: 'api' },
        { id: 'ws', label: 'Realtime · SockJS/STOMP', kind: 'service' },
        { id: 'misp', label: 'MISP / RSS feeds', kind: 'external' },
      ],
      edges: [
        { from: 'portal', to: 'tip', label: 'SSO · darkmon-token' },
        { from: 'portal', to: 'mgmt', label: 'SSO' },
        { from: 'common', to: 'tip', label: 'features / UI' },
        { from: 'common', to: 'mgmt', label: 'features / UI' },
        { from: 'misp', to: 'mgmt', label: 'threat feeds' },
        { from: 'mgmt', to: 'api', label: 'curate' },
        { from: 'tip', to: 'api', label: 'query' },
        { from: 'ws', to: 'tip', label: 'live alerts' },
      ],
    },
    links: {},
    images: {
      desktop: u.tip_dashboard || u.tip_actors,
      mobile: u.tip_actors || u.tip_dashboard,
    },
    stack: stackIds.map((id, i) => ({ stack: id, order: i + 1 })),
    order: 1,
  };
}

async function main() {
  console.log('Minting session…');
  const { cookie, email } = await mintCookie();
  console.log('  session for:', email);
  const verify = await axios.post(`${API}/auth/verify`, {}, { headers: { Cookie: cookie }, validateStatus: () => true });
  console.log('  /auth/verify →', verify.status);
  if (verify.status !== 200) throw new Error('Auth verify failed');

  console.log('Uploading screenshots…');
  const uploads = await uploadAll(cookie);

  const payload = buildPayload(uploads);
  delete payload.images.__none;

  const coverFiles = {};
  // reuse two captured shots as the required cover images (multipart)
  const desktopFile = path.join(SHOTS_DIR, 'tip-01-dashboard.jpg');
  const mobileFile = path.join(SHOTS_DIR, 'tip-10-threat-actors.jpg');
  if (fs.existsSync(desktopFile)) coverFiles.desktop = desktopFile;
  if (fs.existsSync(mobileFile)) coverFiles.mobile = mobileFile;
  delete payload.images; // send as files instead

  function toFormData(obj, files) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;
      fd.append(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
    for (const [field, fp] of Object.entries(files)) fd.append(field, fs.createReadStream(fp), path.basename(fp));
    return fd;
  }

  const existing = await axios.get(`${API}/works?slug=darkmon-tip&limit=1`, { validateStatus: () => true });
  const found = existing.data && existing.data.data && existing.data.data[0];

  let result;
  const fd = toFormData(payload, coverFiles);
  if (found && found._id) {
    console.log('Existing "darkmon-tip" work → updating', found._id);
    result = await axios.patch(`${API}/works/${found._id}`, fd, {
      headers: { ...fd.getHeaders(), Cookie: cookie }, maxContentLength: Infinity, maxBodyLength: Infinity, validateStatus: () => true,
    });
  } else {
    console.log('Creating new "darkmon-tip" ecosystem work (HIDDEN)…');
    result = await axios.post(`${API}/works`, fd, {
      headers: { ...fd.getHeaders(), Cookie: cookie }, maxContentLength: Infinity, maxBodyLength: Infinity, validateStatus: () => true,
    });
  }
  console.log('  create/update →', result.status);
  if (result.status >= 400) {
    console.log('  ERROR body:', JSON.stringify(result.data));
    throw new Error('Create/update failed');
  }
  const w = result.data.data;
  console.log('  work id:', w && w._id, 'slug:', w && w.slug, 'showInWebsite:', w && w.showInWebsite);
  console.log('\nDONE. Review at https://hassanali.tk/projects/darkmon-tip (create hidden — set showInWebsite=true in the admin to publish).');
}

main().then(() => process.exit(0)).catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
