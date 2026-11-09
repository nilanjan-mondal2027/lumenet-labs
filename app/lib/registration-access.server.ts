const encoder = new TextEncoder();

const toHex = (value: ArrayBuffer) =>
  [...new Uint8Array(value)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

export function createRegistrationAccessToken() {
  return `${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().replaceAll("-", "")}`;
}

export async function hashRegistrationAccessToken(token: string) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(token)));
}

export async function matchesRegistrationAccessToken(token: string, storedHash: string | null) {
  if (!token || !storedHash || token.length > 256) return false;
  const candidate = await hashRegistrationAccessToken(token);
  if (candidate.length !== storedHash.length) return false;

  let difference = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate.charCodeAt(index) ^ storedHash.charCodeAt(index);
  }
  return difference === 0;
}
