ALTER TABLE registrations ADD COLUMN status_token_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS registrations_status_token_hash ON registrations(status_token_hash) WHERE status_token_hash IS NOT NULL;
