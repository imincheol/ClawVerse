import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM || "ClawVerse <noreply@clawverse.io>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log(`[Email Fallback] To: ${to} | Subject: ${subject}`);
    console.log(`[Email Fallback] Body preview: ${html.slice(0, 200)}...`);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function sendBatchEmails(
  emails: SendEmailOptions[]
): Promise<{ success: boolean; sent: number; error?: string }> {
  if (!resend) {
    for (const email of emails) {
      console.log(`[Email Fallback] To: ${email.to} | Subject: ${email.subject}`);
    }
    return { success: true, sent: emails.length };
  }

  try {
    const { error } = await resend.batch.send(
      emails.map((e) => ({ from: FROM_EMAIL, ...e }))
    );

    if (error) return { success: false, sent: 0, error: error.message };
    return { success: true, sent: emails.length };
  } catch (e) {
    return { success: false, sent: 0, error: String(e) };
  }
}
