import { env } from "cloudflare:workers";
import { z } from "zod";
import { createRegistrationAccessToken, hashRegistrationAccessToken } from "./registration-access.server";

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  schoolCommunity: z.string().trim().min(2).max(140),
  learnerCategory: z.enum(["school_student", "college_student", "early_professional", "educator", "creator_builder", "other"]),
  ageBand: z.enum(["under_18", "18_or_over"]),
  learningInterest: z.string().trim().max(500).optional().default(""),
  guardianName: z.string().trim().max(100).optional().default(""),
  guardianEmail: z.string().trim().toLowerCase().max(254).optional().default(""),
  eventConsent: z.literal("on"),
  privacyAck: z.literal("on"),
  marketingConsent: z.string().optional(),
  idempotencyKey: z.string().uuid(),
  turnstileToken: z.string().optional().default(""),
  companyWebsite: z.string().max(0).optional().default(""),
}).superRefine((value, ctx) => {
  if (value.ageBand === "under_18") {
    if (value.guardianName.length < 2) ctx.addIssue({ code: "custom", path: ["guardianName"], message: "Guardian name is required for participants under 18." });
    if (!z.string().email().safeParse(value.guardianEmail).success) ctx.addIssue({ code: "custom", path: ["guardianEmail"], message: "A valid guardian email is required for participants under 18." });
  }
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
const encoder = new TextEncoder();
const hex = (data: ArrayBuffer) => [...new Uint8Array(data)].map(byte => byte.toString(16).padStart(2, "0")).join("");
async function sha256(value: string) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
export function publicId() { return `LUM-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`; }

export async function verifyTurnstile(token: string, request: Request) {
  const environment = String(env.ENVIRONMENT);
  const hostname = new URL(request.url).hostname;
  if (environment === "development" || environment === "test" || hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (!env.TURNSTILE_SECRET_KEY || !token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get("CF-Connecting-IP") || "" }), signal: AbortSignal.timeout(5000) });
  if (!response.ok) return false;
  const result = await response.json<{ success: boolean; action?: string; hostname?: string }>();
  const expectedHostname = env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
  return result.success && result.action === "register" && Boolean(expectedHostname && result.hostname === expectedHostname);
}

export async function enforceRateLimit(request: Request, scope = "register", maximum = 5) {
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const salt = env.RATE_LIMIT_SECRET || "local-development-only";
  const keyHash = await sha256(`${salt}:${ip}:${scope}`);
  const now = new Date();
  const bucket = now.toISOString().slice(0, 16);
  const expires = new Date(now.getTime() + 15 * 60_000).toISOString();
  const row = await env.DB.prepare(`
    INSERT INTO rate_limits (key_hash, bucket_start, request_count, expires_at)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(key_hash) DO UPDATE SET
      bucket_start = CASE WHEN rate_limits.bucket_start = excluded.bucket_start THEN rate_limits.bucket_start ELSE excluded.bucket_start END,
      request_count = CASE WHEN rate_limits.bucket_start = excluded.bucket_start THEN rate_limits.request_count + 1 ELSE 1 END,
      expires_at = excluded.expires_at
    RETURNING request_count
  `).bind(keyHash, bucket, expires).first<{ request_count: number }>();
  // Retain only active, salted rate-limit keys. This keeps transient abuse data from
  // becoming an indefinite record of visitor activity.
  await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(now.toISOString()).run();
  return Boolean(row && row.request_count <= maximum);
}

export async function createRegistration(input: RegistrationInput) {
  const now = new Date().toISOString(); const id = crypto.randomUUID(); const registrationId = publicId();
  const under18 = input.ageBand === "under_18"; const status = under18 ? "pending_guardian" : "confirmed";
  const guardianToken = under18 ? crypto.randomUUID() + crypto.randomUUID() : null;
  const statusToken = under18 ? null : createRegistrationAccessToken();
  const statusTokenHash = statusToken ? await hashRegistrationAccessToken(statusToken) : null;
  const statements = [env.DB.prepare(`INSERT INTO registrations (id, public_id, event_id, idempotency_key, full_name, email, school_community, learner_category, age_band, learning_interest, guardian_name, guardian_email, event_consent, privacy_ack, marketing_consent, status, status_token_hash, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,1,?,?,?,?,?)`).bind(id, registrationId, "evt_2026_11_25", input.idempotencyKey, input.fullName, input.email, input.schoolCommunity, input.learnerCategory, input.ageBand, input.learningInterest || null, input.guardianName || null, input.guardianEmail || null, input.marketingConsent === "on" ? 1 : 0, status, statusTokenHash, now, now)];
  if (guardianToken) statements.push(env.DB.prepare("INSERT INTO guardian_consents (id,registration_id,token_hash,guardian_email,status,expires_at,created_at) VALUES (?,?,?,?,?,?,?)").bind(crypto.randomUUID(),id,await sha256(guardianToken),input.guardianEmail,"pending",new Date(Date.now()+7*86400_000).toISOString(),now));
  const emailId = crypto.randomUUID(); const recipient = under18 ? input.guardianEmail : input.email;
  statements.push(env.DB.prepare("INSERT INTO email_messages (id,registration_id,message_type,recipient,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").bind(emailId,id,under18?"guardian_consent":"registration_confirmation",recipient,"queued",now,now));
  await env.DB.batch(statements);
  const message = { emailId, registrationId: id, publicId: registrationId, type: under18 ? "guardian_consent" : "registration_confirmation", recipient, participantName: input.fullName, guardianToken, statusToken };
  try { await env.EMAIL_QUEUE.send(message); } catch { await env.DB.prepare("UPDATE email_messages SET status='retry_pending', last_error='Queue unavailable', updated_at=? WHERE id=?").bind(new Date().toISOString(),emailId).run(); }
  return { publicId: registrationId, status };
}
