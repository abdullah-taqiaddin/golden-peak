import nodemailer, { type Transporter } from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

import { env } from "@/lib/env";

type ApprovalEmailInput = {
  to: string;
  firstName: string;
  password: string;
};

type SupportEmailInput = {
  recipient: string;
  subject: string;
  body: string;
  footer?: string;
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
    host: env.SES_SMTP_HOST || `email-smtp.${env.SES_REGION}.amazonaws.com`,
    port: env.SES_SMTP_PORT,
    secure: env.SES_SMTP_SECURE,
    auth: {
      user: env.SES_SMTP_USER,
      pass: env.SES_SMTP_PASS
    }
  });
}

function getSesApiClient(): SESv2Client | null {
  if (!env.SES_ACCESS_KEY_ID || !env.SES_SECRET_ACCESS_KEY) {
    return null;
  }

  return new SESv2Client({
    region: env.SES_REGION,
    credentials: {
      accessKeyId: env.SES_ACCESS_KEY_ID,
      secretAccessKey: env.SES_SECRET_ACCESS_KEY,
      ...(env.SES_SESSION_TOKEN ? { sessionToken: env.SES_SESSION_TOKEN } : {})
    }
  });
}

async function sendWithTransporter(
  transporter: Transporter,
  payload: { to: string; subject: string; text: string }
) {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: payload.to,
    subject: payload.subject,
    text: payload.text
  });
}

export async function sendSupportEmail({ recipient, subject, body, footer }: SupportEmailInput) {
  if (!env.EMAIL_API_KEY) {
    throw new Error("EMAIL_API_KEY is not configured.");
  }

  const res = await fetch(env.SUPPORT_EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.EMAIL_API_KEY
    },
    body: JSON.stringify({
      recipient,
      subject,
      body,
      footer
    })
  });

  const raw = await res.text();
  const data: { error?: string } = raw ? JSON.parse(raw) : {};

  if (!res.ok) {
    throw new Error(data.error || "Failed to send email");
  }

  return data;
}

export async function sendApprovalEmail({ to, firstName, password }: ApprovalEmailInput) {
  const loginUrl = `${env.APP_BASE_URL}/login`;

  const subject = "Your Golden Peak Trading Academy account is now approved";
  const body = [
    `Hi ${firstName},`,
    "",
    "Your account has been approved.",
    `Email: ${to}`,
    `Password: ${password}`,
    `Login: ${loginUrl}`
  ].join("\n");
  const footer = "For security, please log in and change your password immediately.";
  const text = [body, "", footer].join("\n");

  if (env.EMAIL_API_KEY) {
    try {
      await sendSupportEmail({
        recipient: to,
        subject,
        body,
        footer
      });
      return true;
    } catch (error) {
      console.error("Failed to send approval email via Firebase email API.", error);
    }
  }

  if (env.EMAIL_PROVIDER === "ses") {
    const sesClient = getSesApiClient();

    if (sesClient) {
      try {
        await sesClient.send(
          new SendEmailCommand({
            FromEmailAddress: env.SMTP_FROM,
            Destination: { ToAddresses: [to] },
            Content: {
              Simple: {
                Subject: { Data: subject, Charset: "UTF-8" },
                Body: { Text: { Data: text, Charset: "UTF-8" } }
              }
            }
          })
        );
        return true;
      } catch (error) {
        console.error("Failed to send approval email via SES API.", error);
      }
    }

    const sesSmtpTransporter = getSesTransporter();
    if (sesSmtpTransporter) {
      try {
        await sendWithTransporter(sesSmtpTransporter, { to, subject, text });
        return true;
      } catch (error) {
        console.error("Failed to send approval email via SES SMTP.", error);
        return false;
      }
    }

    console.warn("Email provider (ses) not configured for API or SMTP. Approval email payload:", {
      to,
      subject,
      text
    });
    return false;
  }

  const smtpTransporter = getSmtpTransporter();
  if (!smtpTransporter) {
    console.warn("Email provider (smtp) not configured. Approval email payload:", {
      to,
      subject,
      text
    });
    return false;
  }

  try {
    await sendWithTransporter(smtpTransporter, { to, subject, text });
    return true;
  } catch (error) {
    console.error("Failed to send approval email via SMTP.", error);
    return false;
  }
}
