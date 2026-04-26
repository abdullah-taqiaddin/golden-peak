function toBool(value: string | undefined, fallback = false) {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

export type EmailProvider = "smtp" | "ses";

function toEmailProvider(value: string | undefined): EmailProvider {
  const normalized = value?.toLowerCase();
  return normalized === "ses" ? "ses" : "smtp";
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  APP_BASE_URL: process.env.APP_BASE_URL ?? "http://localhost:3000",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "admin@goldenpeakacademy.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "ChangeMe123!",
  SUPPORT_EMAIL_API_URL:
    process.env.SUPPORT_EMAIL_API_URL ??
    "https://us-central1-golden-peak-8bb04.cloudfunctions.net/sendSupportEmailApi",
  EMAIL_API_KEY: process.env.EMAIL_API_KEY ?? process.env.NEXT_PUBLIC_EMAIL_API_KEY,
  EMAIL_PROVIDER: toEmailProvider(process.env.EMAIL_PROVIDER),
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_SECURE: toBool(process.env.SMTP_SECURE, false),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SES_REGION: process.env.SES_REGION ?? "us-east-1",
  SES_SMTP_HOST: process.env.SES_SMTP_HOST,
  SES_SMTP_PORT: Number(process.env.SES_SMTP_PORT ?? 587),
  SES_SMTP_SECURE: toBool(process.env.SES_SMTP_SECURE, false),
  SES_SMTP_USER: process.env.SES_SMTP_USER,
  SES_SMTP_PASS: process.env.SES_SMTP_PASS,
  SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID,
  SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY,
  SES_SESSION_TOKEN: process.env.SES_SESSION_TOKEN,
  SMTP_FROM: process.env.SMTP_FROM ?? "Golden Peak Trading Academy <no-reply@goldenpeakacademy.com>",
  COURSE_IFRAME_URL: process.env.COURSE_IFRAME_URL ?? "https://www.youtube.com/embed/s4KaoywHoY8"
};
