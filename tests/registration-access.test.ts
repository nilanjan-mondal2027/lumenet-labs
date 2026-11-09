import { describe, expect, it } from "vitest";
import { createRegistrationAccessToken, hashRegistrationAccessToken, matchesRegistrationAccessToken } from "../app/lib/registration-access.server";

describe("registration access tokens", () => {
  it("matches only the original token", async () => {
    const token = createRegistrationAccessToken();
    const hash = await hashRegistrationAccessToken(token);
    await expect(matchesRegistrationAccessToken(token, hash)).resolves.toBe(true);
    await expect(matchesRegistrationAccessToken(`${token}x`, hash)).resolves.toBe(false);
  });

  it("creates a high-entropy token without storing the raw value", async () => {
    const token = createRegistrationAccessToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(await hashRegistrationAccessToken(token)).not.toBe(token);
  });
});
