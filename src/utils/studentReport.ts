import React from 'react';
import { schoolClassesStorage, schoolStorage, counselingSessionsStorage } from './storage';
import { fullName, initialsOf, mentorSessionsStore, progressStore, studentsStore } from './schoolData';

export interface ReportData {
  name: string;
  firstName: string;
  initials: string;
  className: string;
  schoolName: string;
  accountStatus: 'active' | 'invited';
  lastLogin: { label: string; relative: string } | null;
  quiz: { answered: number; total: number; percent: number; status: 'Complete' | 'In progress' | 'Not started'; unlocked: boolean };
  recommended: { title: string; category: string; match: number }[];
  favourites: string[];
  counsellor: { name: string; initials: string } | null;
  counsellorSessions: { total: number; completed: number };
  mentorSessions: { total: number; mentors: string[] };
  generatedOn: string;
}

const UNLOCK_AT = 25;

const relativeDays = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

/** Gathers everything the report card shows for one student. Returns null if they don't exist. */
export function buildReportData(studentId: string): ReportData | null {
  const s = studentsStore.get(studentId);
  if (!s) return null;
  const progress = progressStore.get(studentId);
  const answered = progress?.assessmentAnswered ?? 0;
  const total = progress?.assessmentTotal ?? 62;

  const sessions = (counselingSessionsStorage.get([]) as { studentRef?: string; counselorName?: string; date?: string; status?: string }[])
    .filter(x => x.studentRef === studentId)
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
  const counsellorName = sessions[0]?.counselorName;

  const mentors = mentorSessionsStore.forStudent(studentId);
  const name = fullName(s) || s.email;

  return {
    name,
    firstName: s.firstName || name,
    initials: fullName(s) ? initialsOf(s) : '?',
    className: s.classId ? (schoolClassesStorage.get().find(c => c.id === s.classId)?.name ?? 'No class') : 'No class yet',
    schoolName: schoolStorage.get()?.name ?? 'OAICC',
    accountStatus: s.status,
    lastLogin: s.lastLoginAt
      ? { label: new Date(s.lastLoginAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }), relative: relativeDays(s.lastLoginAt) }
      : null,
    quiz: {
      answered, total, percent: total ? Math.round((answered / total) * 100) : 0,
      status: answered >= total ? 'Complete' : answered > 0 ? 'In progress' : 'Not started',
      unlocked: answered >= UNLOCK_AT,
    },
    recommended: progress?.recommended ?? [],
    favourites: (progress?.favourites ?? []).map(f => f.title),
    counsellor: counsellorName ? { name: counsellorName, initials: counsellorName.replace(/^(Mr|Mrs|Ms|Dr|Prof)\.?\s+/i, '').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() } : null,
    counsellorSessions: { total: sessions.length, completed: sessions.filter(x => x.status === 'Completed').length },
    mentorSessions: { total: mentors.length, mentors: [...new Set(mentors.map(m => m.mentorName))] },
    generatedOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/** Builds the report card PDF in the browser. The PDF library is loaded only when needed. */
export async function createStudentReport(studentId: string): Promise<{ blob: Blob; fileName: string; name: string }> {
  const data = buildReportData(studentId);
  if (!data) throw new Error('Student not found');
  const [{ pdf }, { default: StudentReportCard }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../components/Reports/StudentReportCard'),
  ]);
  const blob = await pdf(React.createElement(StudentReportCard, { data })).toBlob();
  return { blob, name: data.name, fileName: `${data.name.replace(/[^\w]+/g, '-')}-OAICC-Report-Card.pdf` };
}

/** Creates the report card and downloads it. Resolves with the student's name. */
export async function downloadStudentReport(studentId: string): Promise<string> {
  const { blob, fileName, name } = await createStudentReport(studentId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return name;
}
