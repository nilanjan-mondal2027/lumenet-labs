import { createHash, pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.env.LUMENET_ORGANIZER_PASSWORD;
if (!password || password.length < 20 || password.length > 1024) {
  console.error("Set LUMENET_ORGANIZER_PASSWORD to a unique password between 20 and 1024 characters before running this script.");
  process.exit(1);
}

const salt = randomBytes(32);
const digest = pbkdf2Sync(password, salt, 310_000, 32, "sha256");
const base64Url = (value) => value.toString("base64url");

console.log(`pbkdf2-sha256$310000$${base64Url(salt)}$${base64Url(digest)}`);
