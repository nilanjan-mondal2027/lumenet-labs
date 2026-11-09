const encoder = new TextEncoder();
const PBKDF2_ITERATIONS = 310_000;
const HASH_BYTES = 32;
const SALT_BYTES = 32;

function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] || 0) ^ (right[index] || 0);
  }
  return difference === 0;
}

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  // Copy into an ArrayBuffer so WebCrypto receives a non-shared buffer in every runtime.
  const saltBuffer = Uint8Array.from(salt).buffer;
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations }, material, HASH_BYTES * 8);
  return new Uint8Array(bits);
}

/**
 * Creates a portable, versioned PBKDF2-HMAC-SHA-256 password verifier.
 * Store the returned value only as a Worker secret, never in source control.
 */
export async function createOrganizerPasswordHash(password: string, salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))) {
  if (password.length < 20 || password.length > 1024) throw new Error("Use an organizer password between 20 and 1024 characters.");
  const digest = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(digest)}`;
}

/** Returns false for malformed or unsupported verifier formats. */
export async function verifyOrganizerPasswordHash(password: string, encoded: string) {
  if (!password || password.length > 1024) return false;
  const match = /^pbkdf2-sha256\$(\d{6,7})\$([A-Za-z0-9_-]{43})\$([A-Za-z0-9_-]{43})$/.exec(encoded.trim());
  if (!match) return false;

  const iterations = Number(match[1]);
  if (!Number.isSafeInteger(iterations) || iterations < PBKDF2_ITERATIONS || iterations > 1_000_000) return false;

  try {
    const actual = await derive(password, fromBase64Url(match[2]), iterations);
    return constantTimeEqual(actual, fromBase64Url(match[3]));
  } catch {
    return false;
  }
}
