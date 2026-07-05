import nodemailer from 'nodemailer';

export type ContactEmailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendContactEmailResult = {
  delivered: boolean;
  provider?: 'gmail' | 'resend';
  error?: string;
};

function getContactToEmail(): string | undefined {
  return process.env.CONTACT_TO_EMAIL?.trim() || undefined;
}

function getContactFromEmail(): string {
  return process.env.CONTACT_FROM_EMAIL?.trim() || 'BinaryScouts <onboarding@resend.dev>';
}

function isGmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim()
  );
}

function isResendSandboxFrom(from: string): boolean {
  return from.includes('resend.dev');
}

async function sendViaGmail(
  payload: ContactEmailPayload,
  to: string
): Promise<SendContactEmailResult> {
  const user = process.env.GMAIL_USER!.trim();
  const pass = process.env.GMAIL_APP_PASSWORD!.replace(/\s/g, '');

  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    await transport.sendMail({
      from: `BinaryScouts <${user}>`,
      to,
      subject: payload.subject,
      text: payload.text,
      replyTo: payload.replyTo,
    });

    return { delivered: true, provider: 'gmail' };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Gmail SMTP failed';
    console.error('Gmail SMTP error:', message);
    return { delivered: false, error: message };
  }
}

async function sendViaResend(
  payload: ContactEmailPayload,
  to: string,
  from: string
): Promise<SendContactEmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { delivered: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: payload.subject,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    if (res.ok) {
      return { delivered: true, provider: 'resend' };
    }

    const errBody = await res.text().catch(() => '');
    console.error('Resend API error:', res.status, errBody.slice(0, 500));
    return {
      delivered: false,
      error: `Resend ${res.status}: ${errBody.slice(0, 200)}`,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Resend request failed';
    console.error('Resend error:', message);
    return { delivered: false, error: message };
  }
}

/**
 * Deliver contact/newsletter notifications to CONTACT_TO_EMAIL.
 * Prefers Gmail SMTP when configured (works without a verified Resend domain).
 * Falls back to Resend; retries Gmail if Resend fails on sandbox restrictions.
 */
export async function sendContactNotification(
  payload: ContactEmailPayload
): Promise<SendContactEmailResult> {
  const to = getContactToEmail();
  if (!to) {
    return { delivered: false, error: 'CONTACT_TO_EMAIL not configured' };
  }

  const from = getContactFromEmail();
  const gmailReady = isGmailConfigured();

  if (gmailReady) {
    const gmailResult = await sendViaGmail(payload, to);
    if (gmailResult.delivered) return gmailResult;
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    const resendResult = await sendViaResend(payload, to, from);

    if (resendResult.delivered) return resendResult;

    const shouldRetryGmail =
      gmailReady &&
      (isResendSandboxFrom(from) ||
        resendResult.error?.includes('403') ||
        resendResult.error?.toLowerCase().includes('testing domain'));

    if (shouldRetryGmail) {
      const retry = await sendViaGmail(payload, to);
      if (retry.delivered) return retry;
      return {
        delivered: false,
        error: retry.error || resendResult.error,
      };
    }

    return resendResult;
  }

  if (gmailReady) {
    return sendViaGmail(payload, to);
  }

  return {
    delivered: false,
    error: 'No email provider configured (set GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY)',
  };
}
