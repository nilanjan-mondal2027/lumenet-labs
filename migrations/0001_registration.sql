PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT,
  venue TEXT,
  delivery_format TEXT,
  capacity INTEGER,
  participation_fee TEXT,
  details_note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registration_open',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  event_id TEXT NOT NULL REFERENCES events(id),
  idempotency_key TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  school_community TEXT NOT NULL,
  learner_category TEXT NOT NULL,
  age_band TEXT NOT NULL,
  learning_interest TEXT,
  guardian_name TEXT,
  guardian_email TEXT,
  event_consent INTEGER NOT NULL DEFAULT 0,
  privacy_ack INTEGER NOT NULL DEFAULT 0,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  attendance_status TEXT NOT NULL DEFAULT 'not_recorded',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  cancelled_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS registrations_active_email_event ON registrations(event_id, lower(email)) WHERE cancelled_at IS NULL;
CREATE INDEX IF NOT EXISTS registrations_event_status ON registrations(event_id, status, created_at);
CREATE TABLE IF NOT EXISTS guardian_consents (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  guardian_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TEXT NOT NULL,
  responded_at TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS email_messages (
  id TEXT PRIMARY KEY,
  registration_id TEXT REFERENCES registrations(id) ON DELETE SET NULL,
  message_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  provider_id TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
  key_hash TEXT PRIMARY KEY,
  bucket_start TEXT NOT NULL,
  request_count INTEGER NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
