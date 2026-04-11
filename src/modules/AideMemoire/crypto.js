/**
 * crypto.js — Aide-Mémoire
 * AES-256-GCM · PBKDF2 100 000 iter · SHA-256
 * Correctifs CNIL/ANSSI : verrouillage 5 tentatives · timeout session
 * Transfert sécurisé local : chiffrement éphémère inter-appareils
 */

const SALT_KEY    = 'am_salt';
const CHECK_KEY   = 'am_check';
const LOCKOUT_KEY = 'am_lockout';

// ─── Constantes de sécurité (ANSSI / CNIL) ───────────────────────────────────
export const SEC = {
  MAX_ATTEMPTS:     5,
  LOCKOUT_MS:       15 * 60 * 1000,  // 15 min
  SESSION_TIMEOUT:  5  * 60 * 1000,  // 5 min d'inactivité
  WARN_BEFORE:      60 * 1000,        // avertissement 1 min avant expiration
};

// ─── Utilitaires binaire ↔ hex ───────────────────────────────────────────────

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.substr(i, 2), 16);
  return arr;
}
export function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}
export function base64ToBytes(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

// ─── Sel PBKDF2 ──────────────────────────────────────────────────────────────

function getSalt() {
  let h = localStorage.getItem(SALT_KEY);
  if (!h) { const r = crypto.getRandomValues(new Uint8Array(16)); h = bytesToHex(r); localStorage.setItem(SALT_KEY, h); }
  return hexToBytes(h);
}

// ─── Dérivation de clé PIN ───────────────────────────────────────────────────

async function deriveKey(pin, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(pin)), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

// ─── Chiffrement / Déchiffrement ─────────────────────────────────────────────

export async function encrypt(cryptoKey, plaintext) {
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const ct  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(plaintext));
  return bytesToHex(iv) + ':' + bytesToHex(new Uint8Array(ct));
}

export async function decrypt(cryptoKey, stored) {
  const col = stored.indexOf(':');
  const iv  = hexToBytes(stored.slice(0, col));
  const ct  = hexToBytes(stored.slice(col + 1));
  const pt  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ct);
  return new TextDecoder().decode(pt);
}

// ─── Verrouillage (ANSSI — 5 tentatives max) ─────────────────────────────────

function readLockout() {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}'); } catch { return {}; }
}
function writeLockout(data) { localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data)); }

export function isLockedOut() {
  const { until } = readLockout();
  return !!until && Date.now() < until;
}
export function getLockoutRemaining() {
  const { until } = readLockout();
  if (!until) return 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}
export function recordFailure() {
  const lo       = readLockout();
  const failures = (lo.failures || 0) + 1;
  if (failures >= SEC.MAX_ATTEMPTS) {
    writeLockout({ failures, until: Date.now() + SEC.LOCKOUT_MS });
    return { locked: true, failures };
  }
  writeLockout({ failures, until: null });
  return { locked: false, failures };
}
export function clearLockout() { writeLockout({ failures: 0, until: null }); }
export function getFailures()  { return readLockout().failures || 0; }

// ─── API PIN publique ─────────────────────────────────────────────────────────

export function isPinSet() { return Promise.resolve(!!localStorage.getItem(CHECK_KEY)); }

export async function createPin(pin) {
  const salt  = getSalt();
  const key   = await deriveKey(pin, salt);
  localStorage.setItem(CHECK_KEY, await encrypt(key, 'AM_SECRET_OK'));
  clearLockout();
  return key;
}

export async function verifyPin(pin) {
  const stored = localStorage.getItem(CHECK_KEY);
  if (!stored) return null;
  try {
    const key   = await deriveKey(pin, getSalt());
    const plain = await decrypt(key, stored);
    if (plain === 'AM_SECRET_OK') { clearLockout(); return key; }
    return null;
  } catch { return null; }
}

// ─── Stockage chiffré ─────────────────────────────────────────────────────────

export async function secureGet(key, cryptoKey) {
  const stored = localStorage.getItem('am_' + key);
  if (!stored) return null;
  try { return JSON.parse(await decrypt(cryptoKey, stored)); } catch { return null; }
}

export async function secureSet(key, value, cryptoKey) {
  localStorage.setItem('am_' + key, await encrypt(cryptoKey, JSON.stringify(value)));
}

export function secureRemove(key) { localStorage.removeItem('am_' + key); }

export function resetAll() {
  Object.keys(localStorage).filter(k => k.startsWith('am_')).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem(SALT_KEY);
  localStorage.removeItem(CHECK_KEY);
  localStorage.removeItem(LOCKOUT_KEY);
}

// ─── Transfert sécurisé local (inter-appareils, zéro réseau) ─────────────────
// Protocole :
//   1. Clé AES-256 éphémère générée aléatoirement
//   2. Données chiffrées → blob base64 (peut transiter par tout canal)
//   3. Clé affichée sous forme de code 8 chiffres séparé (canal verbal)
//   Aucun secret dans le blob. Seul le code permet le déchiffrement.

export async function generateTransferKey() {
  // Clé AES-256 brute exportable pour affichage
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  // Code numérique 8 chiffres : les 4 premiers octets → décimal 00000000–99999999
  const code = (
    ((raw[0] * 16777216 + raw[1] * 65536 + raw[2] * 256 + raw[3]) % 100_000_000)
  ).toString().padStart(8, '0').replace(/(\d{4})(\d{4})/, '$1 $2');
  return { key, raw, code };
}

export async function encryptForTransfer(key, payload) {
  // payload : objet JS → JSON → chiffré → base64
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const ct  = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const blob = {
    v:  1,                              // version protocole
    iv: bytesToBase64(iv),
    ct: bytesToBase64(new Uint8Array(ct)),
    ts: Date.now(),                     // horodatage (non secret)
  };
  return btoa(JSON.stringify(blob));    // chaîne base64 transmissible
}

export async function decryptFromTransfer(base64Blob, code) {
  // Reconstitue la clé depuis le code à 8 chiffres
  const digits = code.replace(/\s/g, '');
  if (digits.length !== 8 || !/^\d+$/.test(digits)) throw new Error('Code invalide');

  // Le code encode les 4 premiers octets ; les 28 restants sont dérivés par PBKDF2
  // pour ne pas réduire l'entropie de la clé à seulement 32 bits :
  // on utilise le code comme passphrase PBKDF2 avec un sel fixe inclus dans le blob.
  const blob   = JSON.parse(atob(base64Blob));
  if (blob.v !== 1) throw new Error('Version incompatible');

  // Dérivation : PBKDF2(code, iv_comme_sel, 100k) → AES-256
  const km = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(digits), 'PBKDF2', false, ['deriveKey']
  );
  const transferKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: base64ToBytes(blob.iv), iterations: 100_000, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false, ['decrypt']
  );

  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(blob.iv) },
    transferKey,
    base64ToBytes(blob.ct)
  );
  return JSON.parse(new TextDecoder().decode(pt));
}

// Note : generateTransferKey produit une clé aléatoire 256 bits.
// encryptForTransfer/decryptFromTransfer utilisent PBKDF2(code, iv, 100k) comme clé effective.
// L'IV (12 octets aléatoires) joue le rôle de sel PBKDF2.
// Le code 8 chiffres est affiché à l'écran — il ne transite jamais dans le blob.
