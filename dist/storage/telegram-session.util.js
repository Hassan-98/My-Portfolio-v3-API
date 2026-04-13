"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchStringSessionDataCenter = exports.sanitizeTelegramSessionString = void 0;
/** Production MTProto DC IPv4 endpoints (see Telegram MTProto docs / GramJS defaults). */
const TELEGRAM_DC_IPV4 = {
    1: '149.154.175.58',
    2: '149.154.167.41',
    3: '149.154.175.53',
    4: '149.154.167.91',
    5: '91.108.56.181',
};
function sanitizeTelegramSessionString(raw) {
    let s = raw.trim().replace(/^\uFEFF/, '');
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1);
    }
    return s.replace(/\s+/g, '');
}
exports.sanitizeTelegramSessionString = sanitizeTelegramSessionString;
function isValidIpv4(host) {
    if (!host || /[^\d.]/.test(host))
        return false;
    const parts = host.split('.');
    if (parts.length !== 4)
        return false;
    return parts.every((p) => {
        if (p === '' || p.length > 3)
            return false;
        const n = Number(p);
        return n >= 0 && n <= 255;
    });
}
/** Host must be ASCII-only; mojibake in .env/session breaks Node DNS. */
function isValidDcHost(host) {
    if (!host)
        return false;
    if (/[^\u0000-\u007f]/.test(host))
        return false;
    if (host.includes(':'))
        return true;
    return isValidIpv4(host);
}
/**
 * StringSession decodes DC IP from binary; a corrupted session string yields an invalid hostname
 * (e.g. 149.154.x.x → 149.7\uFFFD4.x.x) and Node throws getaddrinfo EINVAL. Replace with known DC IP for dcId.
 */
function patchStringSessionDataCenter(session) {
    var _a;
    const host = session.serverAddress;
    const dcId = session.dcId;
    const port = (_a = session.port) !== null && _a !== void 0 ? _a : 80;
    if (!dcId)
        return;
    if (isValidDcHost(host))
        return;
    const fixed = TELEGRAM_DC_IPV4[dcId];
    if (!fixed)
        return;
    session.setDC(dcId, fixed, port);
}
exports.patchStringSessionDataCenter = patchStringSessionDataCenter;
//# sourceMappingURL=telegram-session.util.js.map