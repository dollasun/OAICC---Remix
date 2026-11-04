/**
 * Demo prefill for auth forms, so every sign-in / sign-up page can be walked
 * through quickly. Active only in `vite dev` or when the build sets
 * VITE_DEMO_PREFILL=true. Off in normal production builds.
 *
 * These are throwaway values, not real credentials.
 */
export const DEMO_PREFILL: boolean =
  import.meta.env.DEV || import.meta.env.VITE_DEMO_PREFILL === 'true';

export const DEMO_PASSWORD = 'Demo@12345';

const EMAILS: Record<string, string> = {
  student: 'student@oaicc.demo',
  parent: 'parent@oaicc.demo',
  teacher: 'teacher@oaicc.demo',
  school: 'school@oaicc.demo',
  counselor: 'counselor@oaicc.com',
  admin: 'admin@oaicc.demo',
};

/** Returns `value` unchanged unless demo prefill is on. */
export const demo = <T,>(value: T, demoValue: T): T => (DEMO_PREFILL ? demoValue : value);

export const demoEmail = (role: string): string =>
  DEMO_PREFILL ? EMAILS[role] ?? EMAILS.student : '';

export const demoPerson = {
  firstName: 'Demo',
  lastName: 'User',
  phone: '+234 800 000 0000',
};
