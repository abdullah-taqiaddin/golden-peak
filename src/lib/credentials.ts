import crypto from "crypto";

const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function generateRandomPassword(length = 8) {
  let password = "";
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i += 1) {
    password += PASSWORD_CHARS[bytes[i] % PASSWORD_CHARS.length];
  }

  return password;
}
