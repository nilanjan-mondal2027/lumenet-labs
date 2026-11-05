# Privacy Checklist

## Public content

- [x] No private school correspondence, signatures, participant records, or confidential project material is published.
- [x] Unconfirmed workshop details are labelled as pending.
- [x] No invented achievement, testimonial, partner logo, or impact statistic is used.
- [x] Ekya is labelled as an in-progress project.

## Registration

- [x] Collect only administration fields.
- [x] Keep marketing consent separate and optional.
- [x] Require guardian approval for under 18 registrations.
- [x] Store guardian tokens as hashes.
- [x] Store no raw IP address.
- [x] Protect against repeated and duplicate submission.
- [x] Persist before sending email.
- [ ] Approve the final retention schedule before production.
- [ ] Approve the final contact channel for access, correction, and deletion requests.

## Organizer access

- [x] Authenticate organizer views and exports.
- [x] Use Secure, HttpOnly, SameSite Strict cookies.
- [x] Neutralise spreadsheet formulas.
- [x] Avoid personal data in client logs.
- [ ] Use a password manager and named access owners in production.
- [ ] Review organizer access after each event.

## Third parties

- [x] Turnstile receives only the challenge token and network information needed for verification.
- [x] Resend receives the recipient and required transactional message.
- [x] No analytics are loaded in the current build.
- [ ] Review analytics separately before enabling any tracking.
