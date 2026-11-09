# Privacy Ownership and Retention Approval Checklist

Owners: Nilanjan Mondal and Shreyas Bhardwaj

Complete this checklist before production registration opens.

- [ ] Name the adult or organisation responsible for workshop participant records.
- [ ] Name the private email address used for correction and deletion requests.
- [ ] Confirm D1 is the registration system of record and Excel or CSV exports remain accessible only to named organizers.
- [ ] Confirm no organizer will place an export in a public Google Drive folder, open link, or public spreadsheet.
- [ ] Confirm registrations without an active workshop, safeguarding, or legal need are deleted or minimised within 90 days after the event.
- [ ] Confirm under-18 participants require guardian approval before confirmation and WhatsApp invitation access.
- [ ] Confirm WhatsApp join requests require administrator approval. Joining is optional and participant phone numbers may be visible to other members.
- [ ] Confirm the privacy notice accurately identifies what is collected, why it is needed, and how to request correction or deletion.
- [ ] Confirm the Resend sender domain, API key, and webhook secret are encrypted Cloudflare secrets.
- [ ] Confirm synthetic test registrations are deleted after email and export verification.

## Corrections and deletion requests

1. Verify the requester using the email on the registration or an approved guardian channel.
2. Record only the request date, type, responsible organizer, and completion date in the private audit process.
3. Use the authenticated organizer view to locate the record. Do not email full CSV or XLSX exports.
4. Correct or delete the registration and related guardian and queued-email metadata after organizer approval.
5. Retain only records with a documented active safeguarding, legal, or workshop-administration reason, then set a review date.
