export type ResendEmailEvent = "email.delivered" | "email.delivery_delayed" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.sent";

export function emailStatusFromResendEvent(type: string) {
  const statuses: Record<ResendEmailEvent, string> = {
    "email.sent": "provider_accepted",
    "email.delivered": "delivered",
    "email.delivery_delayed": "delivery_delayed",
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.failed": "failed",
    "email.suppressed": "suppressed",
  };
  return statuses[type as ResendEmailEvent] || null;
}
