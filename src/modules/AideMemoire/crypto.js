/**
 * crypto.js — Aide-Mémoire
 * Chiffrement AES-256-GCM via Web Crypto API (natif Capacitor/navigateur)
 * PIN → PBKDF2 (100 000 itérations) → clé AES-256
 * Aucune donnée patient lisible en clair dans le localStorage
 */

const SALT_KEY  = 'am_salt';   // Sel PBKDF2 (non secret, stocké en clair)
const CHECK_KEY = 'am_check';  // Sentinel chiffré pour vérification PIN

// ─── Utilitaires binaire ↔ hex ───────────────────────────────────────────────

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return arr;
}

// ─── Sel PBKDF2 ──────────────────────────────────────────────────────────────

function getSalt() {
  let saltHex = localStorage.getItem(SALT_KEY);
  if (!saltHex) {
    const raw = crypto.getRandomValues(new Uint8Array(16));
    saltHex   = bytesToHex(raw);
    localStorage.setItem(SALT_KEY, saltHex);
  }
  return hexToBytes(saltHex);
}

// ─── Dérivation de clé ───────────────────────────────────────────────────────

async function deriveKey(pin, salt) {
  const enc         = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(String(pin)), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// ─── Chiffrement / Déchiffrement ─────────────────────────────────────────────

async function encrypt(cryptoKey, plaintext) {
  const enc        = new TextEncoder();
  const iv         = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, cryptoKey, enc.encode(plaintext)
  );
  return bytesToHex(iv) + ':' + bytesToHex(new Uint8Array(ciphertext));
}

async function decrypt(cryptoKey, stored) {
  const colonIdx = stored.indexOf(':');
  const iv = hexToBytes(stored.slice(0, colonIdx));
  const ct = hexToBytes(stored.slice(colonIdx + 1));
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ct);
  return new TextDecoder().decode(plain);
}

// ─── API publique ─────────────────────────────────────────────────────────────

export function isPinSet() {
  return Promise.resolve(!!localStorage.getItem(CHECK_KEY));
}

export async function createPin(pin) {
  const salt  = getSalt();
  const key   = await deriveKey(pin, salt);
  const check = await encrypt(key, 'AM_SECRET_OK');
  localStorage.setItem(CHECK_KEY, check);
  return key;
}

export async function verifyPin(pin) {
  const stored = localStorage.getItem(CHECK_KEY);
  if (!stored) return null;
  try {
    const salt  = getSalt();
    const key   = await deriveKey(pin, salt);
    const plain = await decrypt(key, stored);
    return plain === 'AM_SECRET_OK' ? key : null;
  } catch {
    return null;
  }
}

export async function secureGet(key, cryptoKey) {
  const stored = localStorage.getItem('am_' + key);
  if (!stored) return null;
  try {
    const plain = await decrypt(cryptoKey, stored);
    return JSON.parse(plain);
  } catch {
    return null;
  }
}

export async function secureSet(key, value, cryptoKey) {
  const encrypted = await encrypt(cryptoKey, JSON.stringify(value));
  localStorage.setItem('am_' + key, encrypted);
}

export function secureRemove(key) {
  localStorage.removeItem('am_' + key);
}

export function resetAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('am_'))
    .forEach(k => localStorage.removeItem(k));
  localStorage.removeItem(SALT_KEY);
  localStorage.removeItem(CHECK_KEY);
}
