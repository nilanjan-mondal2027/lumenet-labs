import { describe, expect, it } from "vitest";
import { createOrganizerPasswordHash, verifyOrganizerPasswordHash } from "../app/lib/password-hash";

describe("organizer password verifier", () => {
  it("accepts only the matching password for a versioned PBKDF2 hash", async () => {
    const hash = await createOrganizerPasswordHash("this is a synthetic organizer password only");
    await expect(verifyOrganizerPasswordHash("this is a synthetic organizer password only", hash)).resolves.toBe(true);
    await expect(verifyOrganizerPasswordHash("not the organizer password", hash)).resolves.toBe(false);
  });

  it("rejects legacy SHA-256 and malformed values", async () => {
    await expect(verifyOrganizerPasswordHash("password", "a".repeat(64))).resolves.toBe(false);
    await expect(verifyOrganizerPasswordHash("password", "pbkdf2-sha256$1$bad$bad")).resolves.toBe(false);
  });
});
