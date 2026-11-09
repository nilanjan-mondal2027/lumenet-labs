import { env } from "cloudflare:workers";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const fromB64 = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
};

async function sha256Hex(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function sessionSecret() {
  return env.SESSION_SECRET?.trim() || null;
}

async function hmac(value: string) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Organizer session configuration is unavailable.");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

async function verifyHmac(value: string, signature: string) {
  const secret = sessionSecret();
  if (!secret) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  try {
    return await crypto.subtle.verify("HMAC", key, fromB64(signature), encoder.encode(value));
  } catch {
    return false;
  }
}

export async function verifyPassword(password: string) {
  try {
    if (!password || password.length > 1024) return false;
    const candidateHash = await sha256Hex(password);
    const configuredHash = env.ORGANIZER_PASSWORD_HASH?.trim().toLowerCase().replace(/^sha256:/, "");

    // Prefer a stored SHA-256 digest so the organizer password is never a Worker secret value.
    if (configuredHash) {
      return /^[a-f0-9]{64}$/.test(configuredHash) && constantTimeEqual(candidateHash, configuredHash);
    }

    const configuredPassword = env.ORGANIZER_PASSWORD?.trim();
    return configuredPassword ? constantTimeEqual(candidateHash, await sha256Hex(configuredPassword)) : false;
  } catch {
    return false;
  }
}

export async function createSession() {
  const payload = b64url(encoder.encode(JSON.stringify({ exp: Date.now() + 8 * 60 * 60_000, csrf: crypto.randomUUID() })));
  return `${payload}.${await hmac(payload)}`;
}

export async function requireOrganizer(request: Request) {
  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.match(/(?:^|; )lumenet_session=([^;]+)/)?.[1];
  if (!token) throw new Response(null, { status: 302, headers: { Location: "/organizer/login" } });
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !(await verifyHmac(payload, signature))) throw new Response("Unauthorized", { status: 401 });
  try {
    const session = JSON.parse(decoder.decode(fromB64(payload))) as { exp: number; csrf: string };
    if (session.exp < Date.now()) throw new Response("Session expired", { status: 401 });
    return session;
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response("Unauthorized", { status: 401 });
  }
}

export function sessionCookie(token: string) {
  return `lumenet_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`;
}
