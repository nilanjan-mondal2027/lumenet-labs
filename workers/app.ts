import { createRequestHandler } from "react-router";
import { env } from "cloudflare:workers";
import { buildEmailContent, type EmailJob } from "./email-content";
import { handleResendWebhook } from "./resend-webhook";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

function unauthorized() {
  return new Response("Preview authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm=\"Lumenet Labs preview\", charset=\"UTF-8\"",
      "Cache-Control": "no-store",
    },
  });
}

async function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  let difference = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    difference |= (a[index] || 0) ^ (b[index] || 0);
  }
  return difference === 0;
}

async function validPreviewCredentials(request: Request) {
  if (String(env.PREVIEW_AUTH_REQUIRED) !== "true") return true;
  const hostname = new URL(request.url).hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;

  const username = env.PREVIEW_ACCESS_USERNAME;
  const password = env.PREVIEW_ACCESS_PASSWORD;
  const header = request.headers.get("Authorization");
  if (!username || !password || !header?.startsWith("Basic ")) return false;

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    const providedUsername = decoded.slice(0, separator);
    const providedPassword = decoded.slice(separator + 1);
    return await constantTimeEqual(providedUsername, username) && await constantTimeEqual(providedPassword, password);
  } catch {
    return false;
  }
}

async function sendEmail(job: EmailJob) {
  if (!env.RESEND_API_KEY) {
    await env.DB.prepare("UPDATE email_messages SET status='preview_suppressed',last_error='No provider key in preview',updated_at=? WHERE id=?")
      .bind(new Date().toISOString(), job.emailId)
      .run();
    return;
  }

  const message = buildEmailContent(job, {
    siteUrl: env.SITE_URL,
    workshopWhatsAppGroupUrl: env.WORKSHOP_WHATSAPP_GROUP_URL,
  });
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.RESEND_FROM, to: [job.recipient], subject: message.subject, text: message.text, html: message.html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);

  const data = await response.json<{ id: string }>();
  // A successful API call means Resend accepted the message. Delivery is recorded
  // only after a verified email.delivered webhook reaches this Worker.
  await env.DB.prepare("UPDATE email_messages SET status='provider_accepted',provider_id=?,attempts=attempts+1,last_error=NULL,updated_at=? WHERE id=?")
    .bind(data.id, new Date().toISOString(), job.emailId)
    .run();
}

export default {
  async fetch(request: Request) {
    if (new URL(request.url).pathname === "/webhooks/resend") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      return handleResendWebhook(request, env.DB, env.RESEND_WEBHOOK_SECRET);
    }
    if (!await validPreviewCredentials(request)) return unauthorized();
    const original = await requestHandler(request);
    const response = new Response(original.body, original);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
    if (String(env.ENVIRONMENT) !== "production") response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  },
  async queue(batch: MessageBatch<EmailJob>) {
    for (const message of batch.messages) {
      try {
        await sendEmail(message.body);
        message.ack();
      } catch (error) {
        await env.DB.prepare("UPDATE email_messages SET status='retry_pending',attempts=attempts+1,last_error=?,updated_at=? WHERE id=?")
          .bind(error instanceof Error ? error.message.slice(0, 200) : "Email error", new Date().toISOString(), message.body.emailId)
          .run();
        message.retry({ delaySeconds: 300 });
      }
    }
  },
} satisfies ExportedHandler<Env, EmailJob>;
