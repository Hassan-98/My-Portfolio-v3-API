/**
 * Backfills the `domains` field on existing works.
 *
 * Domains are the industry a project belongs to (e-learning, gaming, healthcare…) —
 * the axis visitors filter by on the portfolio. This script assigns them to the
 * works that predate the field, matching on the work's exact `name`.
 *
 * Run:
 *   yarn backfill:domains            # DRY RUN — prints the plan, writes nothing
 *   yarn backfill:domains --apply    # writes to the database
 *   yarn backfill:domains --apply --force   # also overwrites works that already have domains
 *
 * Notes:
 *   - Targets MONGO_DATABASE (production), same as the other one-off scripts.
 *     The DB name is printed before anything happens — check it.
 *   - Idempotent: works that already have domains are skipped unless --force.
 *   - Writes go through the Mongoose model, so invalid domain values are rejected
 *     by the schema enum rather than silently stored.
 *   - Envato/TCG templates are intentionally NOT tagged: they are filtered as
 *     their own category on the portfolio and use `templateMeta.category` instead.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import WORK from '../components/Work/work.model';
import { WorkDomain } from '../components/Work/work.types';

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');

const D = WorkDomain;

/**
 * name (exact, as stored) -> domains
 * Derived from each work's description. A project can span domains: CoreX is a
 * gaming storefront, Markety ships a driver/delivery app alongside the store.
 */
const PLAN: Record<string, WorkDomain[]> = {
  'Markety': [D.ECommerce, D.Logistics],
  'Lammah': [D.Gaming],
  'Imtyaz': [D.ELearning],
  'HNO Uelzen': [D.Healthcare],
  'GridsApps': [D.Corporate],
  'Fraudox': [D.Fintech, D.Security],
  'Medium Creative Brief': [D.Creative],
  'CoreX Store': [D.ECommerce, D.Gaming],
  'Hawas': [D.ELearning],
  'Dorosak - English Learning': [D.ELearning],
  'FlutterCamp': [D.ELearning],
  'Afiyetcom': [D.Healthcare, D.Media],
  'Geni Clash': [D.Gaming],
  'Ajel corp.': [D.Fintech],
  'Varma': [D.Healthcare, D.Corporate],
  'Edu. EMS System': [D.ELearning],
  'Good Health': [D.NonProfit, D.Healthcare],
  'Golden Plate': [D.Food],
  'ROPT - Sports': [D.Sports, D.Media],
  'Super Eventawy': [D.ELearning],
  'Fireworkjs': [D.DevTools],
  'ICAEST Conference': [D.Events],
  'Certificates Management': [D.ELearning],
  'Construction': [D.Corporate],
  'Personal Portfolio': [D.DevTools],

  // Currently hidden (showInWebsite: false) — tagged anyway so they are correct
  // if they are ever brought back.
  'Markety - Ecommerce': [D.ECommerce],
  'Markety - Dashboard': [D.ECommerce],
  'Markety Delivery': [D.Logistics],
  'LaravelCamp': [D.ELearning],
  'DarkMon TIP': [D.Security]
};

async function connectMongo(): Promise<void> {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;
  if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_PATH || !MONGO_DATABASE) {
    throw new Error('Missing Mongo env vars (MONGO_USER / MONGO_PASSWORD / MONGO_PATH / MONGO_DATABASE)');
  }
  console.log(`Target database: ${MONGO_DATABASE}  (host: ${MONGO_PATH})`);
  await mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`
  );
}

function sameDomains(a: WorkDomain[] = [], b: WorkDomain[] = []): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
}

async function main() {
  console.log(APPLY ? '=== BACKFILL DOMAINS (APPLY) ===' : '=== BACKFILL DOMAINS (DRY RUN) ===');
  if (FORCE) console.log('--force: works that already have domains WILL be overwritten.');

  await connectMongo();

  const works = await WORK.find({}, 'name domains isTcgWork showInWebsite').lean();

  // Names are NOT unique — e.g. three works are called "Personal Portfolio"
  // (one visible, two hidden). Every match gets tagged, not just the first.
  const byName = new Map<string, typeof works>();
  for (const work of works) {
    const matches = byName.get(work.name) ?? [];
    matches.push(work);
    byName.set(work.name, matches);
  }

  const planned: string[] = [];
  const skipped: string[] = [];
  const unmatched: string[] = [];
  let written = 0;

  for (const [name, domains] of Object.entries(PLAN)) {
    const matches = byName.get(name);

    if (!matches?.length) {
      unmatched.push(name);
      continue;
    }

    for (const work of matches) {
      // Disambiguate in the log when a name maps to more than one work.
      const tag = matches.length > 1
        ? `${name} (${work._id}${work.showInWebsite ? '' : ', hidden'})`
        : name;

      const current = (work.domains as WorkDomain[] | undefined) ?? [];

      if (current.length && !FORCE) {
        const note = sameDomains(current, domains) ? 'already correct' : `already set to [${current.join(', ')}]`;
        skipped.push(`${tag} — ${note}`);
        continue;
      }

      planned.push(`${tag.padEnd(28)} -> [${domains.join(', ')}]`);

      if (APPLY) {
        // Through the model (not the raw collection) so the schema enum validates.
        const doc = await WORK.findById(work._id);
        if (!doc) continue;
        doc.set('domains', domains);
        await doc.save({ validateModifiedOnly: true });
        written += 1;
      }
    }
  }

  // Works in the DB with no entry in PLAN — new projects added since this script
  // was written, or TCG templates (which are deliberately left untagged).
  const untouched = works.filter(
    (work) => !PLAN[work.name] && !work.isTcgWork && !(work.domains as WorkDomain[] | undefined)?.length
  );

  console.log(`\n--- ${APPLY ? 'Written' : 'Would write'} (${planned.length}) ---`);
  planned.forEach((line) => console.log('  ' + line));

  if (skipped.length) {
    console.log(`\n--- Skipped, already tagged (${skipped.length}) — re-run with --force to overwrite ---`);
    skipped.forEach((line) => console.log('  ' + line));
  }

  if (unmatched.length) {
    console.log(`\n--- !! No work found with these names (${unmatched.length}) — renamed or deleted? ---`);
    unmatched.forEach((name) => console.log('  ' + name));
  }

  if (untouched.length) {
    console.log(`\n--- Non-template works still without domains (${untouched.length}) — tag these in the Admin ---`);
    untouched.forEach((work) => console.log('  ' + work.name));
  }

  console.log(
    APPLY
      ? `\nDone. ${written} work(s) updated.`
      : '\nDry run complete — nothing was written. Re-run with --apply to commit.'
  );

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
