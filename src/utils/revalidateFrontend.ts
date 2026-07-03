import axios from 'axios';

// API route prefixes whose mutations change public site content.
// (Auth, contact and media are intentionally excluded — they don't.)
const CONTENT_PREFIXES = [
  '/works',
  '/experience',
  '/certificates',
  '/skills',
  '/testimonials',
  '/general',
  '/resume',
];

const MUTATING_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

let pendingPing = false;

/** True when a finished request should trigger a frontend revalidation. */
export function shouldRevalidate(method: string, path: string): boolean {
  if (!MUTATING_METHODS.includes(method.toUpperCase())) return false;
  return CONTENT_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Fire-and-forget ping to the frontend's on-demand revalidation webhook.
 * Debounced so a burst of writes (e.g. reordering) collapses into one call.
 * No-ops when FE_REVALIDATE_URL / REVALIDATE_SECRET aren't configured.
 */
export function pingFrontendRevalidate(): void {
  const url = process.env.FE_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  if (pendingPing) return;
  pendingPing = true;

  setTimeout(async () => {
    pendingPing = false;
    try {
      await axios.post(url, {}, { headers: { 'x-revalidate-secret': secret }, timeout: 8000 });
    } catch (err: any) {
      // Best-effort: never let revalidation failures affect the API.
      console.log('\x1b[33m%s\x1b[0m', '⚠️  [Revalidate] frontend ping failed: ' + (err?.message || err));
    }
  }, 1500);
}
