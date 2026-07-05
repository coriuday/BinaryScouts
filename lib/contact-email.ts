import { google } from 'googleapis';

export type ContactEmailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendContactEmailResult = {
  delivered: boolean;
  provider?: 'gmail';
  error?: string;
};

const GMAIL_SEND_TIMEOUT_MS = 15_000;
const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

function getContactToEmail(): string | undefined {
  return process.env.CONTACT_TO_EMAIL?.trim() || undefined;
}

function isGmailApiConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_USER?.trim() &&
      process.env.GMAIL_CLIENT_ID?.trim() &&
      process.env.GMAIL_CLIENT_SECRET?.trim() &&
      process.env.GMAIL_REFRESH_TOKEN?.trim()
  );
}

function encodeMimeMessage(raw: string): string {
  return Buffer.from(raw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function buildMimeMessage(
  from: string,
  to: string,
  payload: ContactEmailPayload
): string {
  const lines = [
    `From: BinaryScouts <${from}>`,
    `To: ${to}`,
    `Subject: ${payload.subject}`,
  ];
  if (payload.replyTo) {
    lines.push(`Reply-To: ${payload.replyTo}`);
  }
  lines.push('MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', '', payload.text);
  return lines.join('\r\n');
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function sendViaGmailApi(
  payload: ContactEmailPayload,
  to: string
): Promise<SendContactEmailResult> {
  const user = process.env.GMAIL_USER!.trim();
  const clientId = process.env.GMAIL_CLIENT_ID!.trim();
  const clientSecret = process.env.GMAIL_CLIENT_SECRET!.trim();
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN!.trim();

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const raw = encodeMimeMessage(buildMimeMessage(user, to, payload));

    await withTimeout(
      gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw },
      }),
      GMAIL_SEND_TIMEOUT_MS,
      'Gmail API'
    );

    return { delivered: true, provider: 'gmail' };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Gmail API failed';
    console.error('Gmail API error:', message);
    return { delivered: false, error: message };
  }
}

/**
 * Deliver contact/newsletter notifications via Gmail API (HTTPS).
 * Works on Render free tier where SMTP ports 465/587 are blocked.
 */
export async function sendContactNotification(
  payload: ContactEmailPayload
): Promise<SendContactEmailResult> {
  const to = getContactToEmail();
  if (!to) {
    return { delivered: false, error: 'CONTACT_TO_EMAIL not configured' };
  }

  if (!isGmailApiConfigured()) {
    return {
      delivered: false,
      error:
        'Gmail API not configured (set GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN)',
    };
  }

  return sendViaGmailApi(payload, to);
}

export { GMAIL_SEND_SCOPE };
