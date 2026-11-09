# Transactional Email Setup

Status: Requires account-owner action. Do not paste API keys, passwords, webhook secrets, or test-recipient addresses into chat, source control, or issue comments.

## 1. Verify a Resend sending domain

1. Sign in to [Resend Domains](https://resend.com/domains).
2. Add a domain that Lumenet controls, such as `lumenetlabs.org` or a dedicated subdomain such as `mail.lumenetlabs.org`.
3. Add the DNS records Resend shows exactly as provided. Do not replace existing SPF records. Merge them only if the DNS provider requires a single SPF record.
4. Wait until Resend reports the domain as verified. Add or review DMARC before public launch.
5. Choose a recognisable sender such as `Lumenet Labs <workshops@your-verified-domain>`.

## 2. Set Worker secrets without committing them

In the Cloudflare dashboard, open the preview Worker, then **Settings**, **Variables and Secrets**, **Add**. Mark every value below as encrypted:

- `RESEND_API_KEY`: a Resend API key limited to transactional email sending.
- `RESEND_WEBHOOK_SECRET`: the Resend webhook signing secret beginning with `whsec_`.
- `ORGANIZER_PASSWORD_HASH`: the PBKDF2 verifier described below.
- `WORKSHOP_WHATSAPP_GROUP_URL`: already configured for preview. Keep it secret.

Set the public preview variable `RESEND_FROM` to the verified sender address. Do not put any of these values in `wrangler.jsonc`, `.env.example`, or GitHub.

## 3. Configure delivery webhooks

1. In Resend, create a webhook endpoint for `https://lumenet-labs-platform-preview.nilanjanmondal2025.workers.dev/webhooks/resend`.
2. Select these events: `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.failed`, and `email.suppressed`.
3. Copy the webhook signing secret only into the encrypted `RESEND_WEBHOOK_SECRET` Worker secret.
4. Confirm Resend shows a successful test delivery to the endpoint. The endpoint intentionally returns no participant data.

## 4. Secure organizer password migration

Run this locally from the repository. The password is not echoed and is not written to Git:

```sh
read -rsp "New organizer password: " LUMENET_ORGANIZER_PASSWORD; echo
export LUMENET_ORGANIZER_PASSWORD
node scripts/generate-organizer-password-hash.mjs
unset LUMENET_ORGANIZER_PASSWORD
```

Copy the single generated verifier into the encrypted `ORGANIZER_PASSWORD_HASH` Worker secret. Confirm organizer login in a private browser session. Only after that test succeeds, remove the legacy `ORGANIZER_PASSWORD` secret from the preview Worker.

## 5. Test and interpret email delivery

Use two authorized, real inboxes controlled by organizers: one adult participant inbox and one guardian inbox. Do not test with fabricated recipient addresses.

1. Submit an adult synthetic registration and verify the record is `provider_accepted` after Resend accepts it.
2. Verify Resend shows `delivered`, not just accepted or sent. `delivered` means the recipient mail server accepted it, not that it reached the inbox rather than spam or quarantine.
3. Confirm the adult email includes the registration ID, November 25 workshop details, private status link, optional WhatsApp invitation, and phone-number visibility notice.
4. Submit an under-18 synthetic registration. Verify the guardian email contains only the consent link and no WhatsApp invitation.
5. Approve consent, then verify the participant confirmation includes the private WhatsApp invitation and the same eligibility notice.
6. Test duplicate registration, status link, organizer CSV and XLSX exports, then delete both synthetic records through the approved organizer process.

## Current limitation

Until a verified sender, `RESEND_API_KEY`, and `RESEND_WEBHOOK_SECRET` are configured, the preview intentionally records messages as `preview_suppressed`. It cannot prove delivery.
