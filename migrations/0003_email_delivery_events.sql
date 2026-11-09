CREATE TABLE IF NOT EXISTS email_delivery_events (
  event_id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  received_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS email_delivery_events_provider_id ON email_delivery_events(provider_id);
