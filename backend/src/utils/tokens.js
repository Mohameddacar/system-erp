import crypto from "crypto";

export function generateRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(String(rawToken)).digest("hex");
}

export function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
