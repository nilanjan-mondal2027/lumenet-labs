import { describe, expect, it } from "vitest";
import { verifyResendWebhook } from "../workers/resend-webhook";

const encoder = new TextEncoder();

async function signature(secret: string, eventId: string, timestamp: string, body: string) {
  const bytes = Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (character) => character.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`${eventId}.${timestamp}.${body}`)));
  return `v1,${btoa(String.fromCharCode(...digest))}`;
}

describe("Resend webhook verification", () => {
  it("accepts a correctly signed fresh event and rejects tampering", async () => {
    const secret = `whsec_${btoa("synthetic-test-webhook-secret")}`;
    const eventId = "msg_test_123";
    const timestamp = String(Math.floor(Date.now() / 1000));
    const body = JSON.stringify({ type: "email.delivered", data: { email_id: "provider-123" } });
    const signed = await signature(secret, eventId, timestamp, body);

    await expect(verifyResendWebhook(body, eventId, timestamp, signed, secret)).resolves.toBe(true);
    await expect(verifyResendWebhook(`${body}x`, eventId, timestamp, signed, secret)).resolves.toBe(false);
  });
});
