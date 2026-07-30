/* eslint-disable */
/**
 * Rewrites nine works as full "Showcase" pages (kind=case-study) with fresh
 * descriptions, taglines, metrics, outcomes, module maps, flows and
 * architecture — plus a description-only rewrite for Fraudox.
 *
 * Screens were captured from the live sites (see the scratchpad capture script);
 * Hawas and Dorosak came from their local builds, which ship a self-declared
 * "portfolio demo / static placeholder data" mode because their backends are gone.
 *
 * Usage:
 *   node _seed_showcases.cjs                  # dry run
 *   node _seed_showcases.cjs --apply          # upload screens + patch works
 *   node _seed_showcases.cjs --apply imtyaz   # limit to one project
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
const SHOTS = 'C:/Users/hassa/AppData/Local/Temp/claude/h--Works-My-Portfolio-v4-FE/f88a11ec-d722-4214-b9de-f278f7cc8cdd/scratchpad/shots/modules-out';
const CACHE = path.join(__dirname, '_showcase_uploads.json');
const APPLY = process.argv.includes('--apply');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { JWT_SECRET, COOKIE_SECRET, MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;

/* ------------------------------------------------------------------ */
/*  Upload plumbing                                                    */
/* ------------------------------------------------------------------ */

async function mintCookie() {
  await mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`
  );
  const user = await mongoose.connection.db.collection('users').findOne({});
  if (!user) throw new Error('No user found in DB');
  const token = jwt.sign({ user: String(user._id) }, JWT_SECRET, { expiresIn: '4h' });
  return `portfolio-login-session=${encodeURIComponent('s:' + cookieSignature.sign(token, COOKIE_SECRET))}`;
}

async function uploadScreens(keys, cookie) {
  const map = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  let fresh = 0;
  for (const key of keys) {
    if (map[key]) continue;
    const fp = path.join(SHOTS, `${key}.webp`);
    if (!fs.existsSync(fp)) { console.log(`  MISSING: ${key}.webp`); continue; }
    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const fd = new FormData();
        fd.append('screens', fs.createReadStream(fp), `${key}.webp`);
        fd.append('folder', 'Showcases');
        const res = await axios.post(`${API}/works/screens`, fd, {
          headers: { ...fd.getHeaders(), Cookie: cookie },
          maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 120000,
        });
        map[key] = res.data.data[0];
        fs.writeFileSync(CACHE, JSON.stringify(map, null, 2));
        fresh++;
        break;
      } catch (e) {
        lastErr = e;
        const why = e?.response?.data?.message || e?.response?.status || e.code || e.message;
        console.log(`    retry ${key} (${attempt}/5) — ${why}`);
        // Honour "retry after N" when the limiter tells us; otherwise back off hard.
        const after = /retry after (\d+)/i.exec(String(why))?.[1];
        await sleep(after ? (Number(after) + 5) * 1000 : 20000 * attempt);
      }
    }
    if (!map[key]) throw new Error(`Upload failed for ${key}: ${lastErr?.message}`);
    // The API rate-limits uploads and escalates 429 -> 403 under pressure, so
    // pace them well apart. The cache above makes a resumed run cheap.
    await sleep(6000);
  }
  console.log(`  uploads: ${fresh} new, ${Object.keys(map).length} cached total`);
  return map;
}

function toFormData(obj) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    fd.append(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
  return fd;
}

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const desc = (...lines) => lines.join('\n');

const PROJECTS = {
  /* ============================== IMTYAZ ============================== */
  imtyaz: {
    workName: 'Imtyaz',
    screens: ['imtyaz-home', 'imtyaz-courses', 'imtyaz-course', 'imtyaz-instructors', 'imtyaz-articles', 'imtyaz-events', 'imtyaz-about', 'imtyaz-cart', 'imtyaz-login'],
    build: (s) => ({
      slug: 'imtyaz',
      kind: 'case-study',
      tagline: 'Palestine\'s largest online learning platform — a 75-page multilingual product where a public course marketplace and a 56-page teaching back office share one Next.js codebase.',
      description: desc(
        '***An education platform that is really two products in one.***',
        'Imtyaz teaches university and school students across every track in Palestine. The public side is a course marketplace — browse by track, preview an instructor, buy a course or a bundle, then learn inside a distraction-free player. Behind it sits a **56-page back office** where instructors build courses, set assignments, mark student work, run forums and get paid, and where admins watch the whole thing.',
        'I built the front end and wired every screen to the API.',
        '**Highlights:**',
        '--75 routes in one Next.js App Router codebase — 19 public, 56 in the panel--',
        '--Three distinct roles sharing one panel shell: student, instructor and admin--',
        '--Course, bundle and event catalogues with cart, checkout, subscriptions and purchase history--',
        '--Live sessions, recorded video and written lessons, plus an immersive full-screen learn mode--',
        '--Instructor tooling: course builder, assignments with per-student marking, statistics, payouts and sales--',
        '--Certificates of completion and achievement, issued and validated in-platform--',
        '--Student forums, comments, favourites, invitations and an in-panel assistant--',
        '--Multilingual with full right-to-left Arabic layout--',
      ),
      metrics: [
        { value: '75', label: 'routes', icon: 'ph:files-duotone' },
        { value: '56', label: 'panel pages', icon: 'ph:squares-four-duotone' },
        { value: '3', label: 'user roles', icon: 'ph:users-three-duotone' },
        { value: 'RTL', label: 'Arabic-first, multilingual', icon: 'ph:translate-duotone' },
      ],
      outcomes: [
        { value: 'One codebase', label: 'marketplace and back office together', icon: 'ph:stack-duotone' },
        { value: '56 pages', label: 'of instructor and admin tooling', icon: 'ph:squares-four-duotone' },
        { value: '3 formats', label: 'live, recorded and written lessons', icon: 'ph:play-circle-duotone' },
        { value: 'Largest', label: 'platform of its kind in Palestine', icon: 'ph:trophy-duotone' },
      ],
      roles: ['Student', 'Instructor', 'Admin'],
      modules: [
        { name: 'Course marketplace', icon: 'ph:storefront-duotone', roles: ['Student'], blurb: 'The public catalogue: browse and filter courses and bundles by track, level and price, with ratings and enrolment counts on every card.', screens: [s('imtyaz-courses', 'Course catalogue with track filters'), s('imtyaz-home', 'Landing page — tracks, featured courses, instructors and testimonials')] },
        { name: 'Course detail & enrolment', icon: 'ph:book-open-text-duotone', roles: ['Student'], blurb: 'Everything a student needs before paying: curriculum breakdown, instructor profile, what is included, reviews and the buy action.', screens: [s('imtyaz-course', 'Course page — curriculum, instructor and enrolment'), s('imtyaz-cart', 'Cart and checkout')] },
        { name: 'Instructors', icon: 'ph:chalkboard-teacher-duotone', roles: ['Student', 'Instructor'], blurb: 'Instructor directory and public profiles — credentials, courses taught, student counts and ratings, so a learner can pick a teacher rather than just a topic.', screens: [s('imtyaz-instructors', 'Instructor directory')] },
        { name: 'Articles & events', icon: 'ph:newspaper-duotone', roles: ['Student'], blurb: 'An editorial layer around the courses: articles with comments, plus a live events calendar for sessions and workshops students can join.', screens: [s('imtyaz-articles', 'Articles feed'), s('imtyaz-events', 'Events and live sessions')] },
        { name: 'Accounts & access', icon: 'ph:sign-in-duotone', roles: ['Student', 'Instructor', 'Admin'], blurb: 'Sign-up, sign-in and password recovery feeding a single panel shell that reshapes itself for students, instructors or admins.', screens: [s('imtyaz-login', 'Authentication')] },
        { name: 'About & brand', icon: 'ph:info-duotone', roles: ['Student'], blurb: 'The institutional story — mission, numbers, team and the trust signals a paid platform needs.', screens: [s('imtyaz-about', 'About the platform')] },
      ],
      flows: [
        {
          title: 'From browsing to learning',
          description: 'A student\'s path from the catalogue to an enrolled lesson.',
          steps: [
            { caption: 'Arrive on the landing page and pick a track.', key: 'imtyaz-home' },
            { caption: 'Filter the catalogue down to the right course.', key: 'imtyaz-courses' },
            { caption: 'Read the curriculum, check the instructor, then enrol.', key: 'imtyaz-course' },
            { caption: 'Pay through cart and checkout.', key: 'imtyaz-cart' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'web', label: 'Next.js App Router', kind: 'app' },
          { id: 'panel', label: '56-page panel', kind: 'app' },
          { id: 'api', label: 'REST API', kind: 'api' },
          { id: 'pay', label: 'Payments', kind: 'external' },
        ],
        edges: [
          { from: 'web', to: 'api', label: 'catalogue' },
          { from: 'panel', to: 'api', label: 'authoring' },
          { from: 'web', to: 'pay', label: 'checkout' },
        ],
      },
    }),
  },

  /* ============================ HNO UELZEN ============================ */
  'hno-uelzen': {
    workName: 'HNO Uelzen',
    screens: ['hno-home', 'hno-datenschutz', 'hno-terms', 'hno-adminlogin'],
    build: (s) => ({
      slug: 'hno-uelzen',
      kind: 'case-study',
      tagline: 'A German ENT practice site built for one job — get patients to the right information and onto the phone — with a Firebase back office so the practice can edit it themselves.',
      description: desc(
        '***A small site with a very specific job.***',
        '//HNO// is German for //Hals-Nasen-Ohren// — ear, nose and throat. This is the site for **Dr. Amr-Fareed Ali\'s** ENT practice in Uelzen, Lower Saxony. Patients arrive wanting three things: what the practice treats, when it is open, and how to reach it. Everything on the page serves one of those three.',
        'Rather than a heavyweight CMS, the practice gets a small Firebase-backed admin area to keep opening hours, services and notices current — so nothing goes stale without a developer.',
        '**Highlights:**',
        '--Seven routes total: three public pages and a four-page admin area--',
        '--Clinical services grouped the way patients think — hearing and balance analysis, endoscopic diagnostics, individual therapy plans--',
        '--Explicit opening hours plus open-consultation slots, the single most-looked-for fact on a practice site--',
        '--Firebase-backed admin with sign-in and password reset so the practice edits its own content--',
        '--German-language, GDPR-conscious: Datenschutzerklärung and Nutzungsbedingungen, and a deliberate "no medical advice by e-mail" notice--',
        '--Built for speed and calm: restrained motion, high performance, no dark patterns--',
      ),
      metrics: [
        { value: '7', label: 'routes', icon: 'ph:files-duotone' },
        { value: '3', label: 'service groups', icon: 'ph:stethoscope-duotone' },
        { value: 'DE', label: 'German-language', icon: 'ph:translate-duotone' },
        { value: 'Self-served', label: 'practice edits its own content', icon: 'ph:pencil-simple-duotone' },
      ],
      outcomes: [
        { value: '3 questions', label: 'answered above the fold', icon: 'ph:target-duotone' },
        { value: 'No CMS bill', label: 'a small Firebase admin instead', icon: 'ph:cloud-duotone' },
        { value: 'GDPR', label: 'privacy and terms handled properly', icon: 'ph:shield-check-duotone' },
      ],
      roles: ['Patient', 'Practice staff'],
      modules: [
        { name: 'Practice landing page', icon: 'ph:house-duotone', roles: ['Patient'], blurb: 'One page carrying the whole practice: the doctor, the address and phone number, the full service spectrum, opening hours, room photography and directions.', screens: [s('hno-home', 'The single-page practice site, top to bottom')] },
        { name: 'Content back office', icon: 'ph:lock-key-duotone', roles: ['Practice staff'], blurb: 'A small Firebase-authenticated admin area — sign in, reset a forgotten password, and update the content that changes most: hours, services and notices.', screens: [s('hno-adminlogin', 'Admin sign-in')] },
        { name: 'Legal & privacy', icon: 'ph:scales-duotone', roles: ['Patient'], blurb: 'German medical sites carry real legal obligations. Datenschutzerklärung and Nutzungsbedingungen are first-class pages, not footer afterthoughts.', screens: [s('hno-datenschutz', 'Datenschutzerklärung'), s('hno-terms', 'Nutzungsbedingungen')] },
      ],
      flows: [
        {
          title: 'Patient to appointment',
          description: 'The only journey that matters on a practice site.',
          steps: [
            { caption: 'Land on the page and confirm this is the right kind of specialist.', key: 'hno-home' },
            { caption: 'Check the service spectrum for the specific complaint.', key: 'hno-home' },
            { caption: 'Read the opening hours and call — appointments are by phone, deliberately.', key: 'hno-home' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'site', label: 'Next.js site', kind: 'app' },
          { id: 'admin', label: 'Admin area', kind: 'app' },
          { id: 'fb', label: 'Firebase Auth + data', kind: 'service' },
        ],
        edges: [
          { from: 'admin', to: 'fb', label: 'sign-in & edits' },
          { from: 'fb', to: 'site', label: 'content' },
        ],
      },
    }),
  },

  /* ============================= GRIDSAPPS ============================= */
  gridsapps: {
    workName: 'GridsApps',
    screens: ['gridsapps-home', 'gridsapps-services', 'gridsapps-portfolio', 'gridsapps-team', 'gridsapps-blog', 'gridsapps-about', 'gridsapps-contact'],
    build: (s) => ({
      slug: 'gridsapps',
      kind: 'case-study',
      tagline: 'The official site for a Palestinian software house — a multilingual eight-page shop window built to convert visitors into briefed leads, with service packages and payments built in.',
      description: desc(
        '***A software company\'s site has to sell the company, not just describe it.***',
        'GridsApps is a software house in Palestine. Their site has one job: turn a stranger into a qualified enquiry. So it is structured as an argument — what we do, proof we have done it, who does it, what it costs, then a way to start.',
        'I built the whole front end from the Figma designs and worked with their backend team to wire up the services and payments layer.',
        '**Highlights:**',
        '--Eight pages arranged as a sales funnel: home, services, portfolio, packages, team, blog, about, contact--',
        '--A services and payments system so a client can pick a package and commit on the spot--',
        '--Portfolio case pages that carry the credibility the rest of the site claims--',
        '--Team profiles — for an agency, the people are the product--',
        '--A blog for the long tail of search traffic--',
        '--Multilingual throughout, with right-to-left Arabic layout--',
        '--Built in Next.js/TypeScript from Figma, integrated against the team\'s API--',
      ),
      metrics: [
        { value: '8', label: 'pages', icon: 'ph:files-duotone' },
        { value: 'Packages', label: 'priced and purchasable', icon: 'ph:tag-duotone' },
        { value: 'Multilingual', label: 'with RTL support', icon: 'ph:translate-duotone' },
      ],
      outcomes: [
        { value: 'Funnel', label: 'not a brochure — every page has a next step', icon: 'ph:funnel-duotone' },
        { value: 'Self-serve', label: 'clients can buy a package directly', icon: 'ph:credit-card-duotone' },
        { value: 'Figma → live', label: 'built to the designers\' spec', icon: 'ph:pen-nib-duotone' },
      ],
      roles: ['Prospective client', 'Company'],
      modules: [
        { name: 'Home & positioning', icon: 'ph:house-duotone', roles: ['Prospective client'], blurb: 'The long-form landing page that makes the whole argument in one scroll — capabilities, proof, process and a call to action.', screens: [s('gridsapps-home', 'Landing page, full scroll')] },
        { name: 'Services', icon: 'ph:gear-duotone', roles: ['Prospective client'], blurb: 'What the company actually sells, broken into offerings a client can recognise their own problem in.', screens: [s('gridsapps-services', 'Services breakdown')] },
        { name: 'Portfolio', icon: 'ph:briefcase-duotone', roles: ['Prospective client'], blurb: 'Delivered work — the evidence behind the claims on every other page.', screens: [s('gridsapps-portfolio', 'Portfolio of delivered projects')] },
        { name: 'Team', icon: 'ph:users-three-duotone', roles: ['Prospective client'], blurb: 'Profiles of the people who would do the work. For a software house this is often the deciding page.', screens: [s('gridsapps-team', 'The team')] },
        { name: 'Blog', icon: 'ph:article-duotone', roles: ['Prospective client'], blurb: 'Editorial content earning search traffic and demonstrating expertise between sales pages.', screens: [s('gridsapps-blog', 'Blog index')] },
        { name: 'About & contact', icon: 'ph:envelope-duotone', roles: ['Prospective client', 'Company'], blurb: 'The company story, and the enquiry form the entire site funnels toward.', screens: [s('gridsapps-about', 'About the company'), s('gridsapps-contact', 'Contact and enquiry')] },
      ],
      flows: [
        {
          title: 'Stranger to qualified lead',
          description: 'The path the site is built to push visitors along.',
          steps: [
            { caption: 'Land and understand what the company does.', key: 'gridsapps-home' },
            { caption: 'Find the service that matches the problem.', key: 'gridsapps-services' },
            { caption: 'Check they have actually delivered work like it.', key: 'gridsapps-portfolio' },
            { caption: 'Send a brief through the contact form.', key: 'gridsapps-contact' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'site', label: 'Next.js site', kind: 'app' },
          { id: 'api', label: 'Company API', kind: 'api' },
          { id: 'pay', label: 'Payments', kind: 'external' },
        ],
        edges: [
          { from: 'site', to: 'api', label: 'content & packages' },
          { from: 'site', to: 'pay', label: 'package purchase' },
        ],
      },
    }),
  },

  /* ============================ COREX STORE ============================ */
  'corex-store': {
    workName: 'CoreX Store',
    screens: ['corex-home', 'corex-categories', 'corex-product', 'corex-cart', 'corex-topup', 'corex-wishlist', 'corex-contact', 'corex-login'],
    build: (s) => ({
      slug: 'corex-store',
      kind: 'case-study',
      tagline: 'A digital goods storefront where the product is a code, not a parcel — gift cards, game credits and top-ups delivered to your inbox in seconds.',
      description: desc(
        '***Selling digital codes is not the same as selling objects.***',
        'CoreX sells gift cards, game credits and coupons for 200+ brands. There is no shipping, no stock room and no delivery window — the entire value proposition is //instant//. So the storefront is built around immediacy: prices and delivery times on every card, a wallet you can pre-load, and a checkout that ends in a code rather than a tracking number.',
        'I built the whole front end in Next.js/TypeScript from the Figma designs.',
        '**Highlights:**',
        '--17 routes covering the full commerce path: browse, product, cart, checkout, account and support--',
        '--Eight product categories — game top-ups, gift cards, streaming, gaming wallets, mobile recharge, software, shopping and payment cards--',
        '--A wallet top-up flow so regulars pre-load credit and check out in one tap--',
        '--Wishlist, favourites and account area with order tracking--',
        '--Merchandising built for urgency: trending, flash deals with a countdown, new arrivals and per-item discounts--',
        '--Full auth set — sign-up, sign-in, e-mail verification, password reset and change--',
        '--Multi-currency pricing and a high-performance animated UI--',
      ),
      metrics: [
        { value: '17', label: 'routes', icon: 'ph:files-duotone' },
        { value: '8', label: 'product categories', icon: 'ph:squares-four-duotone' },
        { value: '200+', label: 'brands', icon: 'ph:storefront-duotone' },
        { value: 'Instant', label: 'digital delivery', icon: 'ph:lightning-duotone' },
      ],
      outcomes: [
        { value: 'Seconds', label: 'from payment to a usable code', icon: 'ph:lightning-duotone' },
        { value: 'Wallet', label: 'pre-loaded credit for repeat buyers', icon: 'ph:wallet-duotone' },
        { value: '8 categories', label: 'one checkout', icon: 'ph:shopping-cart-simple-duotone' },
      ],
      roles: ['Shopper', 'Account holder'],
      modules: [
        { name: 'Storefront', icon: 'ph:storefront-duotone', roles: ['Shopper'], blurb: 'The merchandising engine: hero offers, category grid, trending codes, a countdown flash-deal rail and new arrivals — all tuned to make buying feel immediate.', screens: [s('corex-home', 'Storefront, full scroll')] },
        { name: 'Catalogue & categories', icon: 'ph:squares-four-duotone', roles: ['Shopper'], blurb: 'Eight categories from game top-ups to payment cards, each with item counts, so shoppers who know what they want get there in one hop.', screens: [s('corex-categories', 'Category browse')] },
        { name: 'Product & purchase', icon: 'ph:tag-duotone', roles: ['Shopper'], blurb: 'The product page carries what matters for a digital code: denominations, region validity, delivery speed, rating and stock — then straight to cart.', screens: [s('corex-product', 'Product detail'), s('corex-cart', 'Cart and checkout')] },
        { name: 'Wallet top-up', icon: 'ph:wallet-duotone', roles: ['Account holder'], blurb: 'Load credit into a CoreX wallet once, then buy in a single tap and collect loyalty points — the mechanic that turns a one-off buyer into a regular.', screens: [s('corex-topup', 'Wallet top-up')] },
        { name: 'Wishlist & account', icon: 'ph:heart-duotone', roles: ['Account holder'], blurb: 'Saved items, order history and tracking, plus the full auth set: sign-up, verification, password reset and change.', screens: [s('corex-wishlist', 'Wishlist'), s('corex-login', 'Sign-in')] },
        { name: 'Support', icon: 'ph:headset-duotone', roles: ['Shopper'], blurb: 'Contact and policy pages — when a code fails, being reachable is the whole trust story for a digital store.', screens: [s('corex-contact', 'Contact and support')] },
      ],
      flows: [
        {
          title: 'Browse to code',
          description: 'The purchase path, which has to feel instant end to end.',
          steps: [
            { caption: 'Land on the storefront and see what is trending or discounted.', key: 'corex-home' },
            { caption: 'Narrow to a category — game top-ups, gift cards, streaming.', key: 'corex-categories' },
            { caption: 'Pick a denomination and check region validity.', key: 'corex-product' },
            { caption: 'Check out from wallet or card; the code lands in the inbox.', key: 'corex-cart' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'store', label: 'Next.js storefront', kind: 'app' },
          { id: 'api', label: 'Commerce API', kind: 'api' },
          { id: 'wallet', label: 'Wallet & ledger', kind: 'db' },
          { id: 'pay', label: 'Payment gateway', kind: 'external' },
        ],
        edges: [
          { from: 'store', to: 'api', label: 'catalogue & orders' },
          { from: 'api', to: 'wallet', label: 'credit balance' },
          { from: 'store', to: 'pay', label: 'checkout' },
        ],
      },
    }),
  },

  /* ============================== DOROSAK ============================== */
  dorosak: {
    workName: 'Dorosak - English Learning',
    screens: ['dorosak-home', 'dorosak-categories', 'dorosak-audiobooks', 'dorosak-about', 'dorosak-contact', 'dorosak-login'],
    build: (s) => ({
      slug: 'dorosak',
      kind: 'case-study',
      tagline: 'An English-learning platform for Arabic speakers — audio, written and translated lessons behind a subscription, in a bilingual interface that flips between LTR and RTL.',
      description: desc(
        '***Teaching English to Arabic speakers is a bilingual design problem.***',
        'Dorosak teaches English to all levels and ages. The catch is that the //interface// has to work in Arabic while the //content// is in English — so the whole app flips between right-to-left and left-to-right, and lessons pair audio, written text and translation side by side.',
        'I built the front end in Next.js/TypeScript from the Figma designs and integrated the API.',
        '**Highlights:**',
        '--25 routes covering catalogue, lessons, audio books, subscription and account--',
        '--Fully bilingual English/Arabic with a locale-aware layout that switches direction, not just strings--',
        '--Lessons in three parallel formats: audio, written and translated--',
        '--An audio-book library as a separate learning track--',
        '--Category → lesson hierarchy so learners follow a level rather than browsing at random--',
        '--Subscription and checkout with success, cancel and refund states handled explicitly--',
        '--Wishlist, my-courses, completed-course tracking and account settings--',
        '--Social sign-in via Google, Facebook and Apple alongside e-mail--',
      ),
      metrics: [
        { value: '25', label: 'routes', icon: 'ph:files-duotone' },
        { value: '2', label: 'languages, both directions', icon: 'ph:translate-duotone' },
        { value: '3', label: 'lesson formats', icon: 'ph:headphones-duotone' },
        { value: 'Subscription', label: 'based access', icon: 'ph:credit-card-duotone' },
      ],
      outcomes: [
        { value: 'LTR + RTL', label: 'one layout, both directions', icon: 'ph:arrows-left-right-duotone' },
        { value: '3 formats', label: 'audio, written and translated', icon: 'ph:headphones-duotone' },
        { value: 'Tracked', label: 'progress, wishlist and completions', icon: 'ph:check-circle-duotone' },
      ],
      roles: ['Learner', 'Subscriber'],
      modules: [
        { name: 'Landing & onboarding', icon: 'ph:house-duotone', roles: ['Learner'], blurb: 'The pitch to a prospective learner: how the method works, what levels exist, and what a subscription unlocks.', screens: [s('dorosak-home', 'Landing page, full scroll')] },
        { name: 'Categories & lessons', icon: 'ph:list-numbers-duotone', roles: ['Learner', 'Subscriber'], blurb: 'The learning spine — categories hold ordered lessons, each pairing audio with written text and an Arabic translation so a learner is never stuck.', screens: [s('dorosak-categories', 'Category browse')] },
        { name: 'Audio books', icon: 'ph:headphones-duotone', roles: ['Subscriber'], blurb: 'A parallel track of audio books for listening practice away from structured lessons, with its own library and player.', screens: [s('dorosak-audiobooks', 'Audio-book library')] },
        { name: 'Accounts & subscription', icon: 'ph:credit-card-duotone', roles: ['Subscriber'], blurb: 'E-mail or social sign-in, then subscription checkout with explicit success, cancel and refund paths — plus wishlist, my-courses and completion tracking.', screens: [s('dorosak-login', 'Sign-in with e-mail, Google, Facebook or Apple')] },
        { name: 'Bilingual interface', icon: 'ph:translate-duotone', roles: ['Learner'], blurb: 'Every screen exists in English and Arabic. Switching locale mirrors the layout rather than just swapping copy — navigation, cards and forms all flip.', screens: [s('dorosak-home', 'The same page, locale-aware layout')] },
        { name: 'About & support', icon: 'ph:info-duotone', roles: ['Learner'], blurb: 'The method and the people behind it, plus contact and the policy pages a paid subscription needs.', screens: [s('dorosak-about', 'About the platform'), s('dorosak-contact', 'Contact')] },
      ],
      flows: [
        {
          title: 'Learner to subscriber',
          description: 'From landing on the site to studying inside a lesson.',
          steps: [
            { caption: 'Land on the page and see how the method works.', key: 'dorosak-home' },
            { caption: 'Browse categories and find the right level.', key: 'dorosak-categories' },
            { caption: 'Create an account with e-mail or a social provider.', key: 'dorosak-login' },
            { caption: 'Subscribe, then study lessons and audio books.', key: 'dorosak-audiobooks' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'web', label: 'Next.js (i18n)', kind: 'app' },
          { id: 'api', label: 'Lessons API', kind: 'api' },
          { id: 'media', label: 'Audio delivery', kind: 'service' },
          { id: 'pay', label: 'Subscriptions', kind: 'external' },
        ],
        edges: [
          { from: 'web', to: 'api', label: 'catalogue & progress' },
          { from: 'web', to: 'media', label: 'lesson audio' },
          { from: 'web', to: 'pay', label: 'subscribe' },
        ],
      },
    }),
  },

  /* =============================== HAWAS =============================== */
  hawas: {
    workName: 'Hawas',
    screens: ['hawas-home', 'hawas-courses', 'hawas-library', 'hawas-films', 'hawas-plays', 'hawas-lectures', 'hawas-channel', 'hawas-gallery', 'hawas-services', 'hawas-blogs', 'hawas-about', 'hawas-login', 'hawas-teacherlogin'],
    build: (s) => ({
      slug: 'hawas',
      kind: 'case-study',
      tagline: 'A children\'s education platform in Palestine built around the five senses — interactive books, films, plays and lectures, with separate front doors for students, parents, teachers and whole schools.',
      description: desc(
        '***Four audiences, one platform.***',
        'Hawas (//حواس//, "senses") runs educational programmes for young students in Palestine. What makes it unusual is that it serves four different kinds of user with genuinely different needs: **students** who consume, **parents** who supervise, **teachers** who deliver, and **schools** that buy for everyone. Each gets its own sign-in and its own view of the same library.',
        'The content is broader than a normal course platform — interactive books and games sit alongside films, recorded plays and lectures.',
        'I built the front end and the interactive books system, and integrated the API.',
        '**Highlights:**',
        '--33 routes covering a library that spans books, courses, films, plays, lectures and a video channel--',
        '--Four distinct authentication paths — student, parent, teacher and school--',
        '--An interactive books system with per-page lessons and embedded games--',
        '--Films, recorded plays and lecture archives as first-class content types, not add-ons--',
        '--A teacher panel for delivering material and following student progress--',
        '--Media-rich extras: a channel, a photo gallery and a services catalogue for schools--',
        '--Arabic-first, right-to-left throughout, designed for young readers--',
      ),
      metrics: [
        { value: '33', label: 'routes', icon: 'ph:files-duotone' },
        { value: '4', label: 'sign-in roles', icon: 'ph:users-four-duotone' },
        { value: '6', label: 'content types', icon: 'ph:stack-duotone' },
        { value: 'RTL', label: 'Arabic-first for young readers', icon: 'ph:translate-duotone' },
      ],
      outcomes: [
        { value: '4 doors', label: 'student, parent, teacher, school', icon: 'ph:users-four-duotone' },
        { value: '6 formats', label: 'books, courses, films, plays, lectures, channel', icon: 'ph:stack-duotone' },
        { value: 'Interactive', label: 'books with embedded games', icon: 'ph:book-open-duotone' },
      ],
      roles: ['Student', 'Parent', 'Teacher', 'School'],
      modules: [
        { name: 'Home & programmes', icon: 'ph:house-duotone', roles: ['Student', 'Parent'], blurb: 'The landing page introducing the programmes and the main content sections, written for parents but styled for children.', screens: [s('hawas-home', 'Landing page, full scroll')] },
        { name: 'Interactive books', icon: 'ph:book-open-duotone', roles: ['Student', 'Teacher'], blurb: 'The centrepiece I built: books broken into pages, each page carrying its own lesson content and embedded games so reading and practice happen in the same place.', screens: [s('hawas-library', 'The library')] },
        { name: 'Courses', icon: 'ph:graduation-cap-duotone', roles: ['Student', 'Teacher'], blurb: 'Structured courses with advanced training methods, sitting alongside the book library rather than replacing it.', screens: [s('hawas-courses', 'Courses')] },
        { name: 'Films & plays', icon: 'ph:film-slate-duotone', roles: ['Student'], blurb: 'Educational films and recorded stage plays treated as real content types with their own browse and detail pages — unusual for a learning platform, and central to how Hawas teaches.', screens: [s('hawas-films', 'Films'), s('hawas-plays', 'Recorded plays')] },
        { name: 'Lectures & channel', icon: 'ph:video-duotone', roles: ['Student', 'Parent'], blurb: 'A lecture archive plus a video channel for ongoing material outside the structured tracks.', screens: [s('hawas-lectures', 'Lecture archive'), s('hawas-channel', 'Video channel')] },
        { name: 'Four sign-in roles', icon: 'ph:users-four-duotone', roles: ['Student', 'Parent', 'Teacher', 'School'], blurb: 'Separate authentication for students, parents, teachers and schools — each role sees a different slice of the same library, and schools can provision their pupils.', screens: [s('hawas-login', 'Student sign-in, with school and teacher paths'), s('hawas-teacherlogin', 'Teacher sign-in')] },
        { name: 'Services & gallery', icon: 'ph:buildings-duotone', roles: ['School', 'Parent'], blurb: 'The institutional layer: a services catalogue aimed at schools, a photo gallery, blog and the about pages that make the organisation credible to a buyer.', screens: [s('hawas-services', 'Services for schools'), s('hawas-gallery', 'Gallery'), s('hawas-blogs', 'Blog'), s('hawas-about', 'About')] },
      ],
      flows: [
        {
          title: 'A student\'s session',
          description: 'From landing to reading an interactive book.',
          steps: [
            { caption: 'Arrive on the home page and pick a section.', key: 'hawas-home' },
            { caption: 'Sign in — as a student, or via the parent, teacher or school door.', key: 'hawas-login' },
            { caption: 'Open the library and choose a book or course.', key: 'hawas-library' },
            { caption: 'Branch out into films, plays and lectures.', key: 'hawas-films' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'web', label: 'Next.js App Router', kind: 'app' },
          { id: 'books', label: 'Interactive books engine', kind: 'app' },
          { id: 'api', label: 'Content API', kind: 'api' },
          { id: 'media', label: 'Video & audio', kind: 'service' },
        ],
        edges: [
          { from: 'web', to: 'api', label: '4 role scopes' },
          { from: 'books', to: 'api', label: 'pages & games' },
          { from: 'web', to: 'media', label: 'films, plays, lectures' },
        ],
      },
    }),
  },

  /* ============================ FLUTTERCAMP ============================ */
  fluttercamp: {
    workName: 'FlutterCamp',
    screens: ['fluttercamp-home', 'fluttercamp-tracks', 'fluttercamp-track', 'fluttercamp-library', 'fluttercamp-blogs', 'fluttercamp-search', 'fluttercamp-about', 'fluttercamp-login'],
    build: (s) => ({
      slug: 'fluttercamp',
      kind: 'case-study',
      tagline: 'A Flutter and Dart learning platform organised around guided tracks rather than loose courses — 86 routes, with 61 of them a full teaching and earning back office.',
      description: desc(
        '***Courses are easy to sell and hard to finish. Tracks are the fix.***',
        'FlutterCamp teaches Flutter and Dart. Instead of a shelf of unrelated courses, the platform is built around **learning tracks** — an ordered path from first widget to a published app, with the courses as steps inside it. A learner always knows what comes next.',
        'Behind the public site sits a **61-page back office** where instructors build courses, mark assignments, run per-course forums, issue certificates and take payouts.',
        'I built the front end and integrated the API.',
        '**Highlights:**',
        '--86 routes in one Next.js codebase — 25 public, 61 in the panel--',
        '--Guided learning tracks that sequence courses into a route from beginner to production--',
        '--Per-course forums with threaded questions and answers, so learners unblock each other--',
        '--A learning player for recorded courses with progress tracking--',
        '--Instructor tooling: course builder, assignment marking per student, statistics, invoices and payouts--',
        '--Certificates of completion and achievement, plus certificate validation--',
        '--Cart, checkout, subscriptions and a full purchase-status flow--',
        '--Multilingual with right-to-left Arabic support--',
      ),
      metrics: [
        { value: '86', label: 'routes', icon: 'ph:files-duotone' },
        { value: '61', label: 'panel pages', icon: 'ph:squares-four-duotone' },
        { value: 'Tracks', label: 'not loose courses', icon: 'ph:path-duotone' },
        { value: 'Forums', label: 'per course', icon: 'ph:chats-circle-duotone' },
      ],
      outcomes: [
        { value: 'Tracks', label: 'a learner always knows what is next', icon: 'ph:path-duotone' },
        { value: '61 pages', label: 'of instructor and admin tooling', icon: 'ph:squares-four-duotone' },
        { value: 'Community', label: 'threaded forums inside each course', icon: 'ph:chats-circle-duotone' },
      ],
      roles: ['Learner', 'Instructor', 'Admin'],
      modules: [
        { name: 'Home & pitch', icon: 'ph:house-duotone', roles: ['Learner'], blurb: 'The landing page: the track concept up front, trust numbers, featured courses, instructors and testimonials.', screens: [s('fluttercamp-home', 'Landing page, full scroll')] },
        { name: 'Learning tracks', icon: 'ph:path-duotone', roles: ['Learner'], blurb: 'The idea the platform is built on — ordered paths from Dart basics through state management to shipping on the app stores, with courses as the steps.', screens: [s('fluttercamp-tracks', 'Track catalogue'), s('fluttercamp-track', 'Inside a track')] },
        { name: 'Library & courses', icon: 'ph:books-duotone', roles: ['Learner'], blurb: 'The full course library for learners who would rather pick a topic than follow a path, plus the player and progress tracking.', screens: [s('fluttercamp-library', 'Course library')] },
        { name: 'Search & discovery', icon: 'ph:magnifying-glass-duotone', roles: ['Learner'], blurb: 'Cross-content search over courses, tracks and articles — the shortest route in for someone with a specific question.', screens: [s('fluttercamp-search', 'Search results')] },
        { name: 'Blog', icon: 'ph:article-duotone', roles: ['Learner'], blurb: 'Articles that both teach and pull in search traffic, with comments feeding back into the community.', screens: [s('fluttercamp-blogs', 'Articles')] },
        { name: 'Accounts & panel', icon: 'ph:sign-in-duotone', roles: ['Learner', 'Instructor', 'Admin'], blurb: 'Auth into a 61-page panel that reshapes per role — learners track assignments and certificates, instructors build and mark, admins oversee sales and payouts.', screens: [s('fluttercamp-login', 'Authentication')] },
        { name: 'About', icon: 'ph:info-duotone', roles: ['Learner'], blurb: 'The platform story and the credibility layer a paid learning product needs.', screens: [s('fluttercamp-about', 'About')] },
      ],
      flows: [
        {
          title: 'Beginner to shipped app',
          description: 'The path the track system is designed to carry a learner along.',
          steps: [
            { caption: 'Land and see the track concept.', key: 'fluttercamp-home' },
            { caption: 'Pick a track matching your level.', key: 'fluttercamp-tracks' },
            { caption: 'Work through its ordered courses.', key: 'fluttercamp-track' },
            { caption: 'Dip into the wider library for specifics.', key: 'fluttercamp-library' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'web', label: 'Next.js App Router', kind: 'app' },
          { id: 'panel', label: '61-page panel', kind: 'app' },
          { id: 'api', label: 'REST API', kind: 'api' },
          { id: 'pay', label: 'Payments', kind: 'external' },
        ],
        edges: [
          { from: 'web', to: 'api', label: 'tracks & courses' },
          { from: 'panel', to: 'api', label: 'authoring & payouts' },
          { from: 'web', to: 'pay', label: 'checkout' },
        ],
      },
    }),
  },

  /* ============================== AFIYETCOM ============================== */
  afiyetcom: {
    workName: 'Afiyetcom',
    screens: ['afiyetcom-home', 'afiyetcom-blogs', 'afiyetcom-article', 'afiyetcom-categories', 'afiyetcom-category', 'afiyetcom-calc-calories', 'afiyetcom-calc-pregnancy', 'afiyetcom-calc-weight', 'afiyetcom-calc-heartrate', 'afiyetcom-advice', 'afiyetcom-about'],
    build: (s) => ({
      slug: 'afiyetcom',
      kind: 'case-study',
      tagline: 'An Arabic medical publication that does more than publish — four clinical calculators turn passive health reading into something a visitor can act on.',
      description: desc(
        '***Health content people can actually use.***',
        'Afiyetcom publishes Arabic medical and scientific articles. The problem with health content is that reading it rarely changes anything. So alongside the articles sit **four clinical calculators** — calories, healthy weight, target heart rate and pregnancy due date — that turn a general article into a personal number.',
        'I worked with the front-end team on the UI and built the site in Next.js, integrating the API.',
        '**Highlights:**',
        '--A full editorial stack: categorised articles, a category index, an advice section and article pages--',
        '--Four interactive medical calculators: calories, healthy weight, target heart rate and pregnancy due date--',
        '--Category taxonomy so readers move sideways into related conditions rather than bouncing--',
        '--Arabic-first, right-to-left layout throughout--',
        '--FAQ, policy and terms pages appropriate to publishing health information--',
        '--Built in Next.js with Material UI, integrated against the editorial API--',
      ),
      metrics: [
        { value: '4', label: 'medical calculators', icon: 'ph:calculator-duotone' },
        { value: 'Articles', label: 'across a category taxonomy', icon: 'ph:newspaper-duotone' },
        { value: 'RTL', label: 'Arabic-first', icon: 'ph:translate-duotone' },
      ],
      outcomes: [
        { value: 'Actionable', label: 'calculators turn reading into a number', icon: 'ph:calculator-duotone' },
        { value: 'Sideways', label: 'taxonomy keeps readers moving', icon: 'ph:tree-structure-duotone' },
        { value: 'Trustworthy', label: 'policy and FAQ layer for health content', icon: 'ph:shield-check-duotone' },
      ],
      roles: ['Reader'],
      modules: [
        { name: 'Home & discovery', icon: 'ph:house-duotone', roles: ['Reader'], blurb: 'The front page pulling together featured articles, categories and the calculators, so a visitor with a vague question finds a route quickly.', screens: [s('afiyetcom-home', 'Home page, full scroll')] },
        { name: 'Articles', icon: 'ph:newspaper-duotone', roles: ['Reader'], blurb: 'The editorial core — a browsable feed and article pages carrying the medical and scientific writing the site is built on.', screens: [s('afiyetcom-blogs', 'Article feed'), s('afiyetcom-article', 'An article page')] },
        { name: 'Category taxonomy', icon: 'ph:tree-structure-duotone', roles: ['Reader'], blurb: 'Conditions and topics organised so a reader who arrived for one symptom can move sideways into related material instead of leaving.', screens: [s('afiyetcom-categories', 'Category index'), s('afiyetcom-category', 'Inside a category')] },
        { name: 'Medical calculators', icon: 'ph:calculator-duotone', roles: ['Reader'], blurb: 'Four interactive tools that make the content personal: daily calorie needs, healthy weight range, target heart-rate zones and a pregnancy due-date estimator.', screens: [s('afiyetcom-calc-calories', 'Calorie calculator'), s('afiyetcom-calc-weight', 'Healthy-weight calculator'), s('afiyetcom-calc-heartrate', 'Target heart-rate calculator'), s('afiyetcom-calc-pregnancy', 'Pregnancy due-date calculator')] },
        { name: 'Advice & about', icon: 'ph:chat-circle-text-duotone', roles: ['Reader'], blurb: 'A dedicated advice section plus the about, FAQ and policy pages that a site publishing health information needs to be taken seriously.', screens: [s('afiyetcom-advice', 'Advice section'), s('afiyetcom-about', 'About')] },
      ],
      flows: [
        {
          title: 'From a vague worry to a number',
          description: 'The journey the calculators exist to complete.',
          steps: [
            { caption: 'Arrive with a general health question.', key: 'afiyetcom-home' },
            { caption: 'Find the relevant category.', key: 'afiyetcom-categories' },
            { caption: 'Read the article on the condition.', key: 'afiyetcom-article' },
            { caption: 'Run the matching calculator for a personal figure.', key: 'afiyetcom-calc-calories' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'web', label: 'Next.js + Material UI', kind: 'app' },
          { id: 'calc', label: 'Calculators (client-side)', kind: 'app' },
          { id: 'api', label: 'Editorial API', kind: 'api' },
        ],
        edges: [
          { from: 'web', to: 'api', label: 'articles & categories' },
          { from: 'web', to: 'calc', label: 'personal figures' },
        ],
      },
    }),
  },

  /* ============================= GENI CLASH ============================= */
  'geni-clash': {
    workName: 'Geni Clash',
    screens: ['geniclash-home', 'geniclash-matching', 'geniclash-lobby', 'geniclash-play1', 'geniclash-play2', 'geniclash-play3', 'geniclash-result', 'geniclash-cup', 'geniclash-rankings', 'geniclash-createroom', 'geniclash-profile', 'geniclash-redesign-welcome', 'geniclash-redesign-home'],
    build: (s) => ({
      slug: 'geni-clash',
      kind: 'case-study',
      tagline: 'صراع العباقرة — a realtime Arabic trivia game with 4,150 questions, four game systems, tournaments that fire every 20 minutes, and a Socket.io backend I built end to end.',
      description: desc(
        '***A realtime multiplayer game, front end and back end.***',
        'Geni Clash (//صراع العباقرة//, "Clash of the Geniuses") is an Arabic trivia game played against strangers or friends. Unlike the other projects here I built **both sides**: the Next.js client and the Node/Express/MongoDB/Socket.io server that runs matchmaking, live scoring, tournaments and presence.',
        'The whole thing is dressed as a cave painting — campfire, stick figures, rock walls — which gave the trivia format a personality it usually lacks.',
        '**Highlights:**',
        '--4,150 questions across 10 Arabic categories — geography (896), history (630), sports (485), science, religion and culture, languages and currencies, literature and arts, flags, mathematics and picture rounds--',
        '--Four game systems: Normal, Last Man Standing, Master Path and Cup--',
        '--Individual play or two-team group matches (A versus B)--',
        '--Matchmaking that fills empty slots with bots rather than leaving players waiting--',
        '--Scheduled tournaments: a cron fires a new cup every 20 minutes, with waiting, running and finished states--',
        '--Private rooms — invite friends by code, shuffle teams, kick players, start when ready--',
        '--Friends with live presence, friend requests and in-match invites--',
        '--In-game reactions, XP (timed or fixed), medals and weekly rankings that reset every Saturday night--',
        '--Socket.io over Redis for room state, MongoDB for persistence, Firebase Admin for notifications--',
      ),
      metrics: [
        { value: '4,150', label: 'questions', icon: 'ph:question-duotone' },
        { value: '10', label: 'categories', icon: 'ph:squares-four-duotone' },
        { value: '4', label: 'game systems', icon: 'ph:game-controller-duotone' },
        { value: '20 min', label: 'between tournaments', icon: 'ph:timer-duotone' },
        { value: 'Realtime', label: 'Socket.io, front and back', icon: 'ph:lightning-duotone' },
      ],
      outcomes: [
        { value: 'Full stack', label: 'client and realtime server both mine', icon: 'ph:stack-duotone' },
        { value: '4,150', label: 'questions across 10 categories', icon: 'ph:question-duotone' },
        { value: 'No dead lobbies', label: 'bots fill unmatched slots', icon: 'ph:robot-duotone' },
        { value: 'Every 20 min', label: 'a new cup starts on a cron', icon: 'ph:trophy-duotone' },
      ],
      roles: ['Player', 'Room host'],
      modules: [
        { name: 'Home & game modes', icon: 'ph:house-duotone', roles: ['Player'], blurb: 'The hub, painted on a cave wall. Banners lead into the four game systems — Normal, Last Man Standing, Master Path and Cup — with the campfire scene tying it together.', screens: [s('geniclash-home', 'The hub — four game systems and quick actions')] },
        { name: 'Matchmaking', icon: 'ph:users-three-duotone', roles: ['Player'], blurb: 'Queue for a random match and watch the lobby fill 1/4, 2/4, 3/4. If real players do not arrive, the server adds bots so nobody sits waiting.', screens: [s('geniclash-matching', 'Searching for opponents — 1/4'), s('geniclash-lobby', 'Lobby once the match is full')] },
        { name: 'Live gameplay', icon: 'ph:lightning-duotone', roles: ['Player'], blurb: 'The match itself: a question, a countdown, answers locking in, and every opponent\'s score updating live down the side. Right and wrong answers resolve instantly for everyone.', screens: [s('geniclash-play1', 'A question mid-match with live scores'), s('geniclash-play2', 'An answer resolving — wrong pick highlighted'), s('geniclash-play3', 'Later round, scores diverging')] },
        { name: 'Results & XP', icon: 'ph:medal-duotone', roles: ['Player'], blurb: 'Final standings, XP awarded either on a timer or fixed per correct answer, and the medals that feed the leaderboards.', screens: [s('geniclash-result', 'Final standings and XP')] },
        { name: 'Tournaments (Cups)', icon: 'ph:trophy-duotone', roles: ['Player'], blurb: 'The most involved system: a cron starts a new cup every 20 minutes, players join the waiting room, then progress through a bracket while the server tracks waiting, running and finished states separately.', screens: [s('geniclash-cup', 'Cup bracket')] },
        { name: 'Private rooms', icon: 'ph:door-open-duotone', roles: ['Room host', 'Player'], blurb: 'Play with people you know: create a room, share the code, shuffle players between teams A and B, kick anyone who should not be there, and start when the group is ready.', screens: [s('geniclash-createroom', 'Creating a private match with friends')] },
        { name: 'Profile, friends & rankings', icon: 'ph:user-circle-duotone', roles: ['Player'], blurb: 'Identity and competition: profile with XP and medals, friends with live online/offline presence and match invites, and weekly plus all-time leaderboards that reset every Saturday at midnight.', screens: [s('geniclash-profile', 'Player profile — XP, medals and stats'), s('geniclash-rankings', 'Hall of Champions leaderboard')] },
        { name: 'The redesign', icon: 'ph:paint-brush-duotone', roles: ['Player'], blurb: 'A newer direction currently in development — a warmer wooden-board look with a Supabase backend and a Capacitor Android build alongside the web app. Not yet the live version.', screens: [s('geniclash-redesign-welcome', 'Redesign — welcome screen (in development)'), s('geniclash-redesign-home', 'Redesign — hub (in development)')] },
      ],
      flows: [
        {
          title: 'Queue to victory',
          description: 'A full random match from tapping play to the final standings.',
          steps: [
            { caption: 'Pick a game system from the hub.', key: 'geniclash-home' },
            { caption: 'Queue up — the lobby fills, bots top it off if needed.', key: 'geniclash-matching' },
            { caption: 'Answer against the clock while scores update live.', key: 'geniclash-play1' },
            { caption: 'Take the final standings and the XP.', key: 'geniclash-result' },
          ],
        },
        {
          title: 'Playing with friends',
          description: 'The private-room path, host side.',
          steps: [
            { caption: 'Create a room and set the rules.', key: 'geniclash-createroom' },
            { caption: 'Friends join by code; shuffle teams and start.', key: 'geniclash-lobby' },
            { caption: 'Climb the weekly leaderboard together.', key: 'geniclash-rankings' },
          ],
        },
      ],
      architecture: {
        nodes: [
          { id: 'client', label: 'Next.js client', kind: 'app' },
          { id: 'socket', label: 'Socket.io gateway', kind: 'service' },
          { id: 'api', label: 'Express REST API', kind: 'api' },
          { id: 'redis', label: 'Redis (room state)', kind: 'service' },
          { id: 'mongo', label: 'MongoDB', kind: 'db' },
        ],
        edges: [
          { from: 'client', to: 'socket', label: 'live match events' },
          { from: 'client', to: 'api', label: 'auth & profile' },
          { from: 'socket', to: 'redis', label: 'rooms & presence' },
          { from: 'api', to: 'mongo', label: 'questions & scores' },
          { from: 'socket', to: 'mongo', label: 'results' },
        ],
      },
    }),
  },
};

/* Fraudox: description rewrite only — it stays a standard card. */
const FRAUDOX = {
  workName: 'Fraudox',
  patch: {
    tagline: 'A brand-protection platform that takes malicious lookalikes down — submit a phishing site, fake app or impersonation account, and pay only when it is actually removed.',
    description: desc(
      '***Detection is the easy half. Removal is the product.***',
      'Fraudox removes phishing sites, fake social accounts, counterfeit apps and impersonation pages on a brand\'s behalf. Plenty of tools will //tell// a company it is being impersonated; Fraudox files the paperwork, chases the registrar and host, and gets the content pulled — charging on outcome rather than retainer.',
      'I designed and built the marketing site in Vue/Nuxt and the customer dashboard in React/Next, then integrated both against a Python backend.',
      '**Highlights:**',
      '--A four-step takedown workflow — submit the target, upload evidence, Fraudox files and pursues, you pay on success--',
      '--Free URL scanning that returns an instant risk report and can be escalated into a takedown--',
      '--Coverage across domains and hosting, social platforms, mobile app stores, marketplaces, messaging and paste/code sites--',
      '--A case timeline logging every filing, platform response and escalation, so nothing silently stalls--',
      '--Customer dashboard with light and dark themes, built in React while the marketing site is Vue/Nuxt--',
      '--Payments and subscriptions, plus an API for teams that already run their own detection stack--',
      '--Designed to sit alongside existing SIEM/SOC tooling rather than replace it--',
    ),
  },
};

/* ------------------------------------------------------------------ */
/*  Runner                                                             */
/* ------------------------------------------------------------------ */

function resolveScreens(project, uploads) {
  const s = (key, caption) => (uploads[key] ? { image: uploads[key], caption } : null);
  const payload = project.build(s);

  payload.modules = payload.modules
    .map((m) => ({ ...m, screens: (m.screens || []).filter(Boolean) }))
    .filter((m) => m.screens.length || m.blurb);

  payload.flows = (payload.flows || [])
    .map((f) => ({
      title: f.title,
      description: f.description,
      steps: f.steps
        .map((st) => (uploads[st.key] ? { caption: st.caption, image: uploads[st.key] } : null))
        .filter(Boolean),
    }))
    .filter((f) => f.steps.length);

  return payload;
}

(async () => {
  console.log(APPLY ? '=== SHOWCASES (APPLY) ===' : '=== SHOWCASES (DRY RUN) ===');
  const cookie = await mintCookie();
  console.log(`Target database: ${MONGO_DATABASE}\n`);

  const keys = ONLY.length ? ONLY : Object.keys(PROJECTS);
  const allScreenKeys = [...new Set(keys.flatMap((k) => PROJECTS[k]?.screens || []))];

  let uploads = {};
  if (APPLY) {
    console.log('Uploading screens...');
    uploads = await uploadScreens(allScreenKeys, cookie);
  } else {
    for (const k of allScreenKeys) {
      uploads[k] = fs.existsSync(path.join(SHOTS, `${k}.webp`)) ? `https://example/${k}` : undefined;
    }
  }

  const works = mongoose.connection.db.collection('works');

  for (const key of keys) {
    const project = PROJECTS[key];
    if (!project) { console.log(`unknown project: ${key}`); continue; }

    const matches = await works.find({ name: project.workName }, { projection: { name: 1, showInWebsite: 1 } }).toArray();
    if (!matches.length) { console.log(`!! no work named "${project.workName}"`); continue; }
    const work = matches.find((w) => w.showInWebsite) || matches[0];

    const payload = resolveScreens(project, uploads);
    const missing = project.screens.filter((k) => !uploads[k]);

    console.log(`### ${project.workName}  [${work._id}]`);
    console.log(`    slug=${payload.slug} kind=${payload.kind}`);
    console.log(`    modules=${payload.modules.length} (screens ${payload.modules.reduce((n, m) => n + m.screens.length, 0)})  flows=${payload.flows.length}  metrics=${payload.metrics.length}  outcomes=${payload.outcomes.length}  roles=${payload.roles.length}`);
    if (missing.length) console.log(`    !! missing screens: ${missing.join(', ')}`);

    if (APPLY) {
      const fd = toFormData(payload);
      const res = await axios.patch(`${API}/works/${work._id}`, fd, {
        headers: { ...fd.getHeaders(), Cookie: cookie },
        maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 180000,
      });
      const d = res.data.data;
      console.log(`    -> OK  kind=${d.kind} slug=${d.slug} modules=${d.modules?.length} flows=${d.flows?.length}`);
      console.log(`    -> https://hassanali.tk/projects/${d.slug}`);
      await sleep(900);
    }
    console.log('');
  }

  // Fraudox — copy only
  if (!ONLY.length || ONLY.includes('fraudox')) {
    const matches = await works.find({ name: FRAUDOX.workName }, { projection: { name: 1, showInWebsite: 1 } }).toArray();
    const work = matches.find((w) => w.showInWebsite) || matches[0];
    if (work) {
      console.log(`### ${FRAUDOX.workName}  [${work._id}]  (description + tagline only, stays a standard card)`);
      if (APPLY) {
        const fd = toFormData(FRAUDOX.patch);
        await axios.patch(`${API}/works/${work._id}`, fd, {
          headers: { ...fd.getHeaders(), Cookie: cookie },
          maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 120000,
        });
        console.log('    -> OK');
      }
      console.log('');
    }
  }

  await mongoose.disconnect();
  console.log(APPLY ? 'Done.' : 'Dry run — nothing uploaded or patched. Re-run with --apply.');
})().catch(async (e) => {
  console.error(e?.response?.data || e.message || e);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
