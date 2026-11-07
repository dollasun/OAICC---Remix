/**
 * Decision-making numbers for the School and Admin dashboards, computed from the same records the
 * portals use (students, teachers, parents, invitations, career progress, counselling and mentoring).
 * Everything here is a pure read: no component state, no writes.
 */
import type { ParentRecord, School, StudentRecord, TeacherRecord } from '../types';
import { invitesStore, mentorSessionsStore, parentsStore, progressStore, studentsStore, teachersStore } from './schoolData';
import { counselingSessionsStorage, counselorRequestsStorage, schoolClassesStorage, schoolsDirectory } from './storage';

const DAY = 86_400_000;
export const ACTIVE_WINDOW_DAYS = 30;

/* ───────────── engagement ───────────── */

/**
 * How much a student is using OAICC, 0–100. Weighted towards the things that move a career plan
 * forward: finishing the assessment (35), talking to a counsellor (20), mentoring (15), saving
 * careers to explore (15) and signing in recently (15).
 */
export interface Engagement {
  total: number;
  assessment: number;
  counselling: number;
  mentoring: number;
  careers: number;
  recency: number;
}

interface Ctx {
  now: number;
  counsellingByStudent: Map<string, { completed: number; upcoming: number }>;
  mentoringByStudent: Map<string, number>;
}

function context(now = Date.now()): Ctx {
  const counsellingByStudent = new Map<string, { completed: number; upcoming: number }>();
  (counselingSessionsStorage.get() as { studentRef?: unknown; status?: string }[]).forEach(s => {
    if (typeof s.studentRef !== 'string') return;
    const c = counsellingByStudent.get(s.studentRef) ?? { completed: 0, upcoming: 0 };
    if (s.status === 'Completed') c.completed++; else c.upcoming++;
    counsellingByStudent.set(s.studentRef, c);
  });
  const mentoringByStudent = new Map<string, number>();
  mentorSessionsStore.all().forEach(m => mentoringByStudent.set(m.studentId, (mentoringByStudent.get(m.studentId) ?? 0) + 1));
  return { now, counsellingByStudent, mentoringByStudent };
}

const daysSince = (iso: string | undefined, now: number) => (iso ? (now - new Date(iso).getTime()) / DAY : Infinity);
const round = (n: number) => Math.round(n);

function engagementOf(s: StudentRecord, ctx: Ctx): Engagement {
  if (s.status !== 'active') return { total: 0, assessment: 0, counselling: 0, mentoring: 0, careers: 0, recency: 0 };
  const p = progressStore.get(s.id);
  const assessment = p && p.assessmentTotal ? (p.assessmentAnswered / p.assessmentTotal) * 35 : 0;
  const c = ctx.counsellingByStudent.get(s.id);
  const counselling = (Math.min((c?.completed ?? 0) + (c?.upcoming ?? 0), 3) / 3) * 20;
  const mentoring = (Math.min(ctx.mentoringByStudent.get(s.id) ?? 0, 3) / 3) * 15;
  const careers = (Math.min(p?.favourites.length ?? 0, 4) / 4) * 15;
  const since = daysSince(s.lastLoginAt, ctx.now);
  const recency = since <= 7 ? 15 : since <= ACTIVE_WINDOW_DAYS ? 8 : 0;
  const parts = { assessment: round(assessment), counselling: round(counselling), mentoring: round(mentoring), careers: round(careers), recency };
  return { ...parts, total: parts.assessment + parts.counselling + parts.mentoring + parts.careers + parts.recency };
}

const isActiveRecently = (s: StudentRecord, now: number) => s.status === 'active' && daysSince(s.lastLoginAt, now) <= ACTIVE_WINDOW_DAYS;

/** When the student actually joined: the day they accepted their invitation, or when the account was made. */
function joinedAt(s: { id: string; createdAt: string; status: string }, acceptedAt: Map<string, string>) {
  return s.status === 'active' ? acceptedAt.get(s.id) ?? s.createdAt : undefined;
}
const acceptedDates = () => new Map(invitesStore.all().filter(i => i.acceptedAt).map(i => [i.userId, i.acceptedAt!]));

/* ───────────── growth over time ───────────── */

export type GrowthPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export interface GrowthPoint { label: string; end: number; total: number; added: number }

const PERIOD_STEPS: Record<GrowthPeriod, number> = { daily: 14, weekly: 12, monthly: 12, yearly: 5 };

/** Bucket ends for the period, oldest first, the last one being "now". */
function bucketEnds(period: GrowthPeriod, now: number): { label: string; start: number; end: number }[] {
  const out: { label: string; start: number; end: number }[] = [];
  const steps = PERIOD_STEPS[period];
  for (let i = steps - 1; i >= 0; i--) {
    const d = new Date(now);
    let start: Date; let end: Date; let label: string;
    if (period === 'daily') {
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
      label = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } else if (period === 'weekly') {
      const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
      start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - i * 7);
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
      label = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } else if (period === 'monthly') {
      start = new Date(d.getFullYear(), d.getMonth() - i, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      label = start.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
    } else {
      start = new Date(d.getFullYear() - i, 0, 1);
      end = new Date(start.getFullYear() + 1, 0, 1);
      label = String(start.getFullYear());
    }
    out.push({ label, start: start.getTime(), end: Math.min(end.getTime(), now) });
  }
  return out;
}

/** Cumulative count of people joined by the end of each bucket, plus how many joined within it. */
export function growthSeries(joinDates: (string | undefined)[], period: GrowthPeriod, now = Date.now()): GrowthPoint[] {
  const times = joinDates.filter((d): d is string => Boolean(d)).map(d => new Date(d).getTime()).sort((a, b) => a - b);
  return bucketEnds(period, now).map(b => ({
    label: b.label, end: b.end,
    total: times.filter(t => t < b.end).length,
    added: times.filter(t => t >= b.start && t < b.end).length,
  }));
}

/* ───────────── career interest ───────────── */

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Students interested in each industry: their top three matches plus anything they saved. */
export function careerInterest(students: StudentRecord[], limit = 6) {
  const counts = new Map<string, { label: string; students: number; careers: Map<string, number> }>();
  students.forEach(s => {
    const p = progressStore.get(s.id);
    if (!p) return;
    const picks = [...p.recommended.slice(0, 3), ...p.favourites];
    const seen = new Set<string>();
    picks.forEach(c => {
      const key = c.category.trim().toLowerCase();
      if (!key) return;
      const entry = counts.get(key) ?? { label: titleCase(c.category.trim()), students: 0, careers: new Map() };
      if (!seen.has(key)) { entry.students++; seen.add(key); }
      entry.careers.set(c.title, (entry.careers.get(c.title) ?? 0) + 1);
      counts.set(key, entry);
    });
  });
  return [...counts.values()]
    .sort((a, b) => b.students - a.students)
    .slice(0, limit)
    .map(e => ({ label: e.label, students: e.students, topCareers: [...e.careers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t) }));
}

/* ───────────── school dashboard ───────────── */

export interface Funnel { invited: number; accepted: number; active: number }

export function schoolAnalytics(schoolId: string, now = Date.now()) {
  const ctx = context(now);
  const students = studentsStore.all().filter(s => s.schoolId === schoolId);
  const teachers = teachersStore.all().filter(t => t.schoolId === schoolId);
  const parents = parentsOfSchoolIds(schoolId, students);
  const classes = schoolClassesStorage.get().filter(c => c.schoolId === schoolId);
  const accepted = acceptedDates();
  const active = students.filter(s => s.status === 'active');

  const count = <T extends { status: string }>(list: T[]) => ({ total: list.length, active: list.filter(x => x.status === 'active').length, pending: list.filter(x => x.status === 'invited').length });

  const engagement = active
    .map(s => ({ student: s, engagement: engagementOf(s, ctx) }))
    .sort((a, b) => b.engagement.total - a.engagement.total);

  const classProgress = classes.map(c => {
    const inClass = active.filter(s => s.classId === c.id);
    const ratios = inClass.map(s => { const p = progressStore.get(s.id); return p && p.assessmentTotal ? p.assessmentAnswered / p.assessmentTotal : 0; });
    const completed = ratios.filter(r => r >= 1).length;
    return {
      id: c.id, label: c.name, students: inClass.length, completed,
      avgProgress: ratios.length ? Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100) : 0,
    };
  });

  const pendingByRole = {
    students: students.filter(s => s.status === 'invited').length,
    teachers: teachers.filter(t => t.status === 'invited').length,
    parents: parents.filter(p => p.status === 'invited').length,
  };
  const upcomingCounselling = active.reduce((n, s) => n + (ctx.counsellingByStudent.get(s.id)?.upcoming ?? 0), 0);

  return {
    totals: { users: count([...students, ...teachers, ...parents]), students: count(students), teachers: count(teachers), parents: count(parents) },
    topStudents: engagement.slice(0, 8),
    averageEngagement: engagement.length ? Math.round(engagement.reduce((a, e) => a + e.engagement.total, 0) / engagement.length) : 0,
    funnel: { invited: students.length, accepted: students.filter(s => s.status !== 'invited').length, active: students.filter(s => isActiveRecently(s, now)).length } as Funnel,
    joinDates: students.map(s => joinedAt(s, accepted)),
    classProgress,
    careerInterest: careerInterest(active),
    attention: {
      pendingByRole,
      classesWithoutTeacher: classes.filter(c => !c.teacherId || !teachers.some(t => t.id === c.teacherId)),
      notOnboarded: active.filter(s => !s.onboarded),
      inactive: active.filter(s => daysSince(s.lastLoginAt, now) > ACTIVE_WINDOW_DAYS),
      noParent: active.filter(s => s.parentIds.length === 0),
      notStartedAssessment: active.filter(s => (progressStore.get(s.id)?.assessmentAnswered ?? 0) === 0),
      upcomingCounselling,
    },
  };
}

function parentsOfSchoolIds(schoolId: string, students: StudentRecord[]): ParentRecord[] {
  return parentsStore.all().filter(p => p.schoolId === schoolId || students.some(s => s.parentIds.includes(p.id)));
}

/* ───────────── admin dashboard ───────────── */

export function platformAnalytics(now = Date.now()) {
  const ctx = context(now);
  const schools = schoolsDirectory.all();
  const students = studentsStore.all();
  const teachers = teachersStore.all();
  const parents = parentsStore.all();
  const accepted = acceptedDates();
  const active = students.filter(s => s.status === 'active');

  const count = <T extends { status: string }>(list: T[]) => ({ total: list.length, active: list.filter(x => x.status === 'active').length, pending: list.filter(x => x.status === 'invited').length });

  const perSchool = schools.map((school: School) => {
    const mine = students.filter(s => s.schoolId === school.id);
    const enrolled = mine.filter(s => s.status === 'active');
    const scores = enrolled.map(s => engagementOf(s, ctx).total);
    return {
      school,
      students: mine.length,
      enrolled: enrolled.length,
      pending: mine.filter(s => s.status === 'invited').length,
      teachers: teachers.filter((t: TeacherRecord) => t.schoolId === school.id).length,
      active30: enrolled.filter(s => isActiveRecently(s, now)).length,
      activation: mine.length ? Math.round((mine.filter(s => s.status !== 'invited').length / mine.length) * 100) : 0,
      avgEngagement: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    };
  });

  const schoolInvited = students.filter(s => s.schoolId);
  const counsellingRows = counselingSessionsStorage.get() as { counselorName?: string; status?: string; date?: string }[];
  const counsellorLoad = new Map<string, { completed: number; upcoming: number }>();
  counsellingRows.forEach(r => {
    if (!r.counselorName) return;
    const c = counsellorLoad.get(r.counselorName) ?? { completed: 0, upcoming: 0 };
    if (r.status === 'Completed') c.completed++; else c.upcoming++;
    counsellorLoad.set(r.counselorName, c);
  });
  const recentCounselling = counsellingRows.filter(r => r.status === 'Completed' && r.date && daysSince(r.date, now) <= ACTIVE_WINDOW_DAYS).length;
  const recentMentoring = mentorSessionsStore.all().filter(m => daysSince(m.createdAt, now) <= ACTIVE_WINDOW_DAYS).length;
  const assessmentRatios = active.map(s => { const p = progressStore.get(s.id); return p && p.assessmentTotal ? p.assessmentAnswered / p.assessmentTotal : 0; });
  const pendingRequests = (counselorRequestsStorage.get() as { status?: string }[]).filter(r => r.status === 'Pending').length;

  return {
    totals: { schools: schools.length, students: count(students), teachers: count(teachers), parents: count(parents) },
    kpis: {
      active30: active.filter(s => isActiveRecently(s, now)).length,
      activeStudents: active.length,
      assessmentAvg: assessmentRatios.length ? Math.round((assessmentRatios.reduce((a, b) => a + b, 0) / assessmentRatios.length) * 100) : 0,
      assessmentCompleted: assessmentRatios.filter(r => r >= 1).length,
      recentCounselling,
      recentMentoring,
    },
    perSchool,
    funnel: { invited: schoolInvited.length, accepted: schoolInvited.filter(s => s.status !== 'invited').length, active: schoolInvited.filter(s => isActiveRecently(s, now)).length } as Funnel,
    joinDates: {
      students: students.map(s => joinedAt(s, accepted)),
      teachers: teachers.map(t => joinedAt(t, accepted)),
      parents: parents.map(p => joinedAt(p, accepted)),
    },
    careerInterest: careerInterest(active, 8),
    counselling: {
      studentsCounselled: active.filter(s => (ctx.counsellingByStudent.get(s.id)?.completed ?? 0) + (ctx.counsellingByStudent.get(s.id)?.upcoming ?? 0) > 0).length,
      upcoming: counsellingRows.filter(r => r.status !== 'Completed').length,
      counsellors: counsellorLoad.size,
    },
    counsellorLoad: [...counsellorLoad.entries()].map(([name, c]) => ({ name, ...c, total: c.completed + c.upcoming })).sort((a, b) => b.total - a.total),
    attention: {
      lowActivation: perSchool.filter(p => p.students >= 5 && p.activation < 80),
      lowEngagement: perSchool.filter(p => p.enrolled >= 5 && p.avgEngagement < 35),
      independentStudents: students.filter(s => !s.schoolId && s.status === 'active').length,
      pendingRequests,
    },
  };
}
