import { describe, expect, it } from "vitest";
import { emailStatusFromResendEvent } from "../workers/email-delivery";

describe("Resend delivery state mapping", () => {
  it("keeps provider acceptance distinct from recipient-server delivery", () => {
    expect(emailStatusFromResendEvent("email.sent")).toBe("provider_accepted");
    expect(emailStatusFromResendEvent("email.delivered")).toBe("delivered");
    expect(emailStatusFromResendEvent("email.bounced")).toBe("bounced");
  });
});
