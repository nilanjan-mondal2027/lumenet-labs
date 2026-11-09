import { emailStatusFromResendEvent } from "./email-delivery";

const encoder = new TextEncoder();
const MAX_WEBHOOK_AGE_SECONDS = 5 * 60;

function fromBase64(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  let difference = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) difference |= (left[index] || 0) ^ (right[index] || 0);
  return difference === 0;
}

export async function verifyResendWebhook(rawBody: string, eventId: string | null, timestamp: string | null, signature: string | null, secret: string | undefined) {
  if (!secret || !eventId || !timestamp || !signature) return false;
  const timestampSeconds = Number(timestamp);
  if (!Number.isSafeInteger(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > MAX_WEBHOOK_AGE_SECONDS) return false;

  try {
    const key = await crypto.subtle.importKey("raw", fromBase64(secret.replace(/^whsec_/, "")), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`${eventId}.${timestamp}.${rawBody}`)));
    return signature.split(" ").some((part) => {
      const [version, value] = part.split(",", 2);
      return version === "v1" && Boolean(value) && constantTimeEqual(expected, fromBase64(value));
    });
  } catch {
    return false;
  }
}

export async function handleResendWebhook(request: Request, db: D1Database, secret: string | undefined) {
  const rawBody = await request.text();
  const eventId = request.headers.get("svix-id");
  const verified = await verifyResendWebhook(rawBody, eventId, request.headers.get("svix-timestamp"), request.headers.get("svix-signature"), secret);
  if (!verified) return new Response("Unauthorized", { status: 401 });

  try {
    const event = JSON.parse(rawBody) as { type?: string; data?: { email_id?: string; bounce?: { message?: string } } };
    const status = emailStatusFromResendEvent(event.type || "");
    const providerId = event.data?.email_id;
    if (!status || !providerId || !eventId) return new Response(null, { status: 204 });

    const inserted = await db.prepare("INSERT OR IGNORE INTO email_delivery_events (event_id, provider_id, event_type, received_at) VALUES (?, ?, ?, ?)")
      .bind(eventId.slice(0, 255), providerId.slice(0, 255), event.type, new Date().toISOString())
      .run();
    if (!inserted.meta.changes) return new Response(null, { status: 204 });

    const message = status === "bounced" || status === "failed" || status === "suppressed" ? (event.data?.bounce?.message || status) : null;
    await db.prepare("UPDATE email_messages SET status=?, last_error=?, updated_at=? WHERE provider_id=?")
      .bind(status, message?.slice(0, 200) || null, new Date().toISOString(), providerId)
      .run();
    return new Response(null, { status: 204 });
  } catch {
    return new Response("Bad request", { status: 400 });
  }
}
