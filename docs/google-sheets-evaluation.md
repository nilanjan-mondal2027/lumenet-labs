# Registration Export and Google Sheets Evaluation

## Decision

Cloudflare D1 remains the registration system of record. The authenticated Excel and CSV exports are the approved organizer workflow for launch.

## Why Google Sheets sync is deferred

Automatic Sheets sync would require a Google service account or OAuth credentials, private spreadsheet sharing, a new outbound integration, retry handling, conflict rules, and additional access reviews. It would create another copy of participant records without improving the primary registration flow.

## Safe organizer workflow

1. Organizers sign in to the private Lumenet organizer route.
2. Download the Excel or CSV export over the authenticated `no-store` endpoint.
3. Upload or import it into a private Google Sheet owned by the authorized organizer.
4. Share the Sheet only with named organizers. Do not publish it, enable link access, or paste participant records into public tools.

## Revisit conditions

Consider automatic sync only after appointing a data owner, approving a retention policy, using a dedicated Google Workspace account or service account, and documenting failure and deletion handling.
