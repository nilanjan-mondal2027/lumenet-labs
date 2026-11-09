declare namespace Cloudflare {
  interface Env {
    TURNSTILE_SECRET_KEY?: string;
    TURNSTILE_EXPECTED_HOSTNAME?: string;
    RATE_LIMIT_SECRET?: string;
    SESSION_SECRET: string;
    ORGANIZER_PASSWORD?: string;
    ORGANIZER_PASSWORD_HASH?: string;
    RESEND_API_KEY?: string;
    RESEND_WEBHOOK_SECRET?: string;
    PREVIEW_ACCESS_PASSWORD?: string;
    WORKSHOP_WHATSAPP_GROUP_URL?: string;
  }
}
interface Env {
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_EXPECTED_HOSTNAME?: string;
  RATE_LIMIT_SECRET?: string;
  SESSION_SECRET: string;
  ORGANIZER_PASSWORD?: string;
  ORGANIZER_PASSWORD_HASH?: string;
  RESEND_API_KEY?: string;
  RESEND_WEBHOOK_SECRET?: string;
  PREVIEW_ACCESS_PASSWORD?: string;
  WORKSHOP_WHATSAPP_GROUP_URL?: string;
}
