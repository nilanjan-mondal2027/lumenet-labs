import { describe, expect, it } from "vitest";
import { buildEmailContent } from "../workers/email-content";

const settings = {
  siteUrl: "https://preview.example.test",
  workshopWhatsAppGroupUrl: "https://example.test/private-invite",
};

describe("registration email content", () => {
  it("keeps the group invitation out of guardian approval emails", () => {
    const email = buildEmailContent({
      emailId: "email-1", registrationId: "registration-1", publicId: "LUM-TEST00000001", type: "guardian_consent",
      recipient: "guardian@example.test", participantName: "Synthetic Minor", guardianToken: "guardian-token", statusToken: null,
    }, settings);
    expect(email.html).toContain("Review consent");
    expect(email.html).not.toContain("Join the Workshop WhatsApp Group");
    expect(email.html).not.toContain(settings.workshopWhatsAppGroupUrl);
  });

  it("adds the private group invitation only to confirmed participant emails", () => {
    const email = buildEmailContent({
      emailId: "email-2", registrationId: "registration-2", publicId: "LUM-TEST00000002", type: "registration_confirmation",
      recipient: "adult@example.test", participantName: "Synthetic Adult", guardianToken: null, statusToken: "status-token",
    }, settings);
    expect(email.html).toContain("Join the Workshop WhatsApp Group");
    expect(email.text).toContain("Joining the workshop WhatsApp group is optional.");
    expect(email.html).toContain("access=status-token");
  });
});
