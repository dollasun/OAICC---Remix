/**
 * Invitation email delivery.
 *
 * There is no email provider connected yet, so "sending" records the message in a local outbox. This is
 * the only place that needs to change when a real provider (Resend, SendGrid, ...) is added: replace the
 * body of `sendInviteEmail` with a call to the provider and keep the signature.
 */
export interface InviteEmail {
  to: string;
  role: 'teacher' | 'student' | 'parent';
  schoolName: string;
  link: string;
}

export interface OutboxEntry extends InviteEmail {
  id: string;
  subject: string;
  body: string;
  queuedAt: string;
}

const OUTBOX_KEY = 'app_email_outbox';
const ROLE_LABEL = { teacher: 'a teacher', student: 'a student', parent: 'a parent or guardian' } as const;

const readOutbox = (): OutboxEntry[] => {
  try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]'); } catch { return []; }
};

export const emailOutbox = { all: readOutbox };

/** Queues the invitation email for the recipient. Never throws; resolves true once queued. */
export function sendInviteEmails(emails: InviteEmail[]): boolean {
  if (!emails.length) return true;
  try {
    const now = new Date().toISOString();
    const entries: OutboxEntry[] = emails.map((e, i) => ({
      ...e,
      id: `mail-${Date.now().toString(36)}-${i}`,
      subject: `${e.schoolName} has invited you to OAICC`,
      body: `${e.schoolName} has invited you to join OAICC as ${ROLE_LABEL[e.role]}. Accept your invitation: ${e.link}`,
      queuedAt: now,
    }));
    // keep the outbox bounded so it can never fill localStorage
    localStorage.setItem(OUTBOX_KEY, JSON.stringify([...entries, ...readOutbox()].slice(0, 500)));
    return true;
  } catch {
    return false;
  }
}
