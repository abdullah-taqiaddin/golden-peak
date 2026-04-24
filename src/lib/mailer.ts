import nodemailer, { type Transporter } from "nodemailer";

import { env } from "@/lib/env";

type ApprovalEmailInput = {
  to: string;
  firstName: string;
  password: string;
};

function getSmtpTransporter(): Transporter | null {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

function getSesTransporter(): Transporter | null {
  if (!env.SES_SMTP_USER || !env.SES_SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SES_SMTP_HOST ?? `email-smtp.${env.SES_REGION}.amazonaws.com`,
    port: env.SES_SMTP_PORT,
    secure: env.SES_SMTP_SECURE,
    auth: {
      user: env.SES_SMTP_USER,
      pass: env.SES_SMTP_PASS
    }
  });
}

function getTransporter(): Transporter | null {
  if (env.EMAIL_PROVIDER === "ses") {
    return getSesTransporter();
  }

  return getSmtpTransporter();
}

export async function sendApprovalEmail({ to, firstName, password }: ApprovalEmailInput) {
  const transporter = getTransporter();
  const loginUrl = `${env.APP_BASE_URL}/login`;

  const subject = "Your Golden Peak Trading Academy account is now approved";
  const text = [
    `Hi ${firstName},`,
    "",
    "Your account has been approved.",
    `Email: ${to}`,
    `Password: ${password}`,
    `Login: ${loginUrl}`,
    "",
    "For security, please log in and change your password immediately."
  ].join("\n");

  if (!transporter) {
    console.warn(`Email provider (${env.EMAIL_PROVIDER}) not configured. Approval email payload:`, {
      to,
      subject,
      text
    });
    return false;
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error("Failed to send approval email.", error);
    return false;
  }
}
