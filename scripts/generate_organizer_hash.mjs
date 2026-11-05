import { pbkdf2Sync, randomBytes } from "node:crypto";

const iterations = 310_000;
const base64url = (value) => value.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

async function readSecret(prompt) {
  if (!process.stdin.isTTY) throw new Error("Run this command in an interactive terminal.");
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve) => {
    let value = "";
    const onData = (chunk) => {
      const character = chunk.toString("utf8");
      if (character === "\r" || character === "\n") {
        process.stdin.off("data", onData);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (character === "\u0003") process.exit(1);
      if (character === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += character;
    };
    process.stdin.on("data", onData);
  });
}

const password = await readSecret("Choose an organizer password: ");
if (password.length < 16) throw new Error("Choose a password with at least 16 characters.");

const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
console.log(`ORGANIZER_PASSWORD_HASH=${iterations}:${base64url(salt)}:${base64url(hash)}`);
console.log("Store this value only as a Cloudflare Worker secret. Do not commit it or save the password in the repository.");
