/**
 * Events shown in the School, Teacher and Parent portals. An event is hosted either by OAICC (visible
 * to everyone in its audience) or by a school (visible only to that school's people in the audience).
 * Registrations are kept per person, so registering in one portal never registers anyone else.
 */
import type { PortalRole } from '../types';

export type EventAudience = Extract<PortalRole, 'school' | 'teacher' | 'parent'>;

export interface PortalEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  host: { kind: 'oaicc' } | { kind: 'school'; schoolId: string; name: string };
  audience: EventAudience[];
  /** ISO start and end. */
  start: string;
  end: string;
  mode: 'In person' | 'Online';
  /** Venue for in-person events, platform for online ones. */
  location: string;
  image: string;
  /** People registered outside this browser (shown as "+n attending"). */
  baseAttendees: number;
  featured?: boolean;
}

const EVENTS_KEY = 'app_portal_events';
const REGISTRATIONS_KEY = 'app_portal_event_registrations';
const DAY = 86_400_000;

const read = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
};

const at = (dayOffset: number, hour: number, minute = 0) => {
  const d = new Date(Date.now() + dayOffset * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

/** OAICC-hosted events every school, teacher and parent sees, dated relative to first use. */
export function defaultOaiccEvents(): PortalEvent[] {
  const oaicc = { kind: 'oaicc' } as const;
  return [
    { id: 'oaicc-leaders-summit', title: 'School Leaders Career Guidance Summit', category: 'Summit', host: oaicc, audience: ['school'], start: at(12, 10), end: at(12, 16), mode: 'In person', location: 'Eko Hotel, Victoria Island, Lagos', image: 'https://picsum.photos/seed/oaicc-summit/800/400', baseAttendees: 240, featured: true,
      description: 'Principals and school leaders share how they run career guidance programmes, track student outcomes and involve parents. Includes a hands-on session on reading OAICC class reports.' },
    { id: 'oaicc-educator-webinar', title: 'Career Guidance for Educators', category: 'Webinar', host: oaicc, audience: ['teacher', 'school'], start: at(5, 16), end: at(5, 17, 30), mode: 'Online', location: 'Zoom', image: 'https://picsum.photos/seed/oaicc-educators/800/400', baseAttendees: 310,
      description: 'How to use assessment results, career recommendations and student notes to hold better one-to-one career conversations with your class.' },
    { id: 'oaicc-parent-symposium', title: 'Parents & Careers Symposium', category: 'Symposium', host: oaicc, audience: ['parent'], start: at(9, 11), end: at(9, 13), mode: 'Online', location: 'Zoom', image: 'https://picsum.photos/seed/oaicc-parents/800/400', baseAttendees: 520, featured: true,
      description: 'A session for parents on the changing job market in Nigeria and abroad, and practical ways to support your child as they choose subjects and careers.' },
    { id: 'oaicc-stem-pathways', title: 'STEM Pathways for Nigerian Students', category: 'Workshop', host: oaicc, audience: ['teacher', 'parent'], start: at(20, 14), end: at(20, 16), mode: 'Online', location: 'Google Meet', image: 'https://picsum.photos/seed/oaicc-stem/800/400', baseAttendees: 185,
      description: 'Engineers, doctors and data scientists talk through the subjects, exams and university courses that lead to their careers.' },
    { id: 'oaicc-teacher-pd', title: 'Classroom Strategies for Career Readiness', category: 'Workshop', host: oaicc, audience: ['teacher'], start: at(27, 15), end: at(27, 17), mode: 'In person', location: 'Landmark Centre, Lagos', image: 'https://picsum.photos/seed/oaicc-pd/800/400', baseAttendees: 96, featured: true,
      description: 'Practical lesson ideas that connect everyday subjects to real careers, with ready-to-use activities for JSS and SS classes.' },
    { id: 'oaicc-digital-schools', title: 'Digital Transformation for Schools', category: 'Workshop', host: oaicc, audience: ['school'], start: at(-18, 14), end: at(-18, 15, 30), mode: 'Online', location: 'Zoom', image: 'https://picsum.photos/seed/oaicc-digital/800/400', baseAttendees: 450,
      description: 'Bringing student records, invitations and reporting online, and what schools learned in their first term with OAICC.' },
    { id: 'oaicc-mental-health', title: "Supporting Your Child's Wellbeing During Exams", category: 'Webinar', host: oaicc, audience: ['parent', 'teacher'], start: at(-11, 18), end: at(-11, 19, 30), mode: 'Online', location: 'Zoom', image: 'https://picsum.photos/seed/oaicc-wellbeing/800/400', baseAttendees: 640,
      description: 'Recognising exam stress, keeping routines healthy and knowing when to ask for help, with a counsellor and a child psychologist.' },
  ];
}

export const portalEventsStore = {
  all: (): PortalEvent[] => {
    const stored = read<PortalEvent[] | null>(EVENTS_KEY, null);
    if (stored && Array.isArray(stored)) return stored;
    const initial = defaultOaiccEvents();
    localStorage.setItem(EVENTS_KEY, JSON.stringify(initial));
    return initial;
  },
  save: (events: PortalEvent[]) => localStorage.setItem(EVENTS_KEY, JSON.stringify(events)),
};

/** Registrations: event id -> list of "role:userId" keys. */
const registrationsStore = {
  all: (): Record<string, string[]> => read<Record<string, string[]>>(REGISTRATIONS_KEY, {}),
  save: (r: Record<string, string[]>) => localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(r)),
};
const personKey = (role: EventAudience, userId: string) => `${role}:${userId}`;

export const isRegistered = (eventId: string, role: EventAudience, userId: string) =>
  (registrationsStore.all()[eventId] ?? []).includes(personKey(role, userId));

/** Registers or unregisters; returns the new registration state. */
export function toggleRegistration(eventId: string, role: EventAudience, userId: string): boolean {
  const all = registrationsStore.all();
  const key = personKey(role, userId);
  const list = all[eventId] ?? [];
  const next = list.includes(key) ? list.filter(k => k !== key) : [...list, key];
  registrationsStore.save({ ...all, [eventId]: next });
  return next.includes(key);
}

export const attendeeCount = (e: PortalEvent) => e.baseAttendees + (registrationsStore.all()[e.id]?.length ?? 0);

/** Events a person in this portal can see: OAICC events for their role, plus their own school's events. */
export const eventsFor = (role: EventAudience, schoolId?: string) =>
  portalEventsStore.all().filter(e => e.audience.includes(role) && (e.host.kind === 'oaicc' || e.host.schoolId === schoolId));

export const hostName = (e: PortalEvent) => (e.host.kind === 'oaicc' ? 'OAICC' : e.host.name);

/** Replaces the registrations for the given people (used by the demo seed). */
export function seedRegistrations(entries: { eventId: string; role: EventAudience; userId: string }[]) {
  const all: Record<string, string[]> = {};
  entries.forEach(({ eventId, role, userId }) => { (all[eventId] ??= []).push(personKey(role, userId)); });
  registrationsStore.save(all);
}

export const PORTAL_EVENT_KEYS = [EVENTS_KEY, REGISTRATIONS_KEY];
