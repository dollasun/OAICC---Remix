/**
 * The platform-wide people list for the OAICC admin: schools, students, teachers and parents (mentors
 * and counsellors have their own sections). This is the single place that knows how to list them,
 * switch them on or off, and delete them.
 */
import type { AccountStatus, ParentRecord, School, StudentRecord, TeacherRecord } from '../types';
import { initialsAvatar } from './crossPortalMessaging';
import { schoolClassesStorage, schoolsDirectory } from './storage';
import {
  fullName, invitesStore, parentsStore, removeParent, removeStudent, removeTeacher, sessionStore, studentsStore, teachersStore,
} from './schoolData';
import { portalEventsStore } from './portalEvents';

export type UserKind = 'school' | 'student' | 'teacher' | 'parent';
export const USER_KINDS: UserKind[] = ['school', 'student', 'teacher', 'parent'];
export const KIND_LABEL: Record<UserKind, string> = { school: 'School', student: 'Student', teacher: 'Teacher', parent: 'Parent' };
export const KIND_PLURAL: Record<UserKind, string> = { school: 'Schools', student: 'Students', teacher: 'Teachers', parent: 'Parents' };

export interface PlatformUser {
  /** Unique across kinds, e.g. "student:abc". */
  key: string;
  kind: UserKind;
  id: string;
  name: string;
  email: string;
  schoolId?: string;
  schoolName: string;
  joinedAt: string;
  status: AccountStatus;
  avatar: string;
  /** Short context line: class, subject, location... */
  detail: string;
}

export const userKey = (kind: UserKind, id: string) => `${kind}:${id}`;
export const userPath = (kind: UserKind, id: string) => `/admin/all-users/${kind}/${id}`;
/** The users list, pre-filtered. */
export const usersListPath = (filters: { role?: UserKind; school?: string; status?: string } = {}) => {
  const q = new URLSearchParams();
  if (filters.role) q.set('role', filters.role);
  if (filters.school) q.set('school', filters.school);
  if (filters.status) q.set('status', filters.status);
  const s = q.toString();
  return `/admin/all-users${s ? `?${s}` : ''}`;
};

const displayName = (r: { firstName: string; lastName: string; email: string }) => fullName(r) || r.email;

function listAll() {
  const schools = schoolsDirectory.all();
  const schoolById = new Map(schools.map(s => [s.id, s]));
  const students = studentsStore.all();
  const teachers = teachersStore.all();
  const parents = parentsStore.all();
  return { schools, schoolById, students, teachers, parents };
}

export function listPlatformUsers(): PlatformUser[] {
  const { schools, schoolById, students, teachers, parents } = listAll();
  const schoolName = (id?: string) => (id ? schoolById.get(id)?.name ?? 'Unknown school' : '');
  const avatarOf = (a: string | undefined, name: string) => a || initialsAvatar(name);

  // A parent belongs to the school that invited them, or else the school of their children.
  const childSchool = new Map<string, string>();
  students.forEach(s => { if (s.schoolId) s.parentIds.forEach(pid => { if (!childSchool.has(pid)) childSchool.set(pid, s.schoolId!); }); });
  const classNameById = new Map(schoolClassesStorage.get().map(c => [c.id, c.name]));

  const out: PlatformUser[] = [];
  schools.forEach((s: School) => out.push({
    key: userKey('school', s.id), kind: 'school', id: s.id, name: s.name, email: s.adminEmail, schoolId: s.id, schoolName: s.name,
    joinedAt: s.createdAt, status: s.status ?? 'active', avatar: avatarOf(s.avatar, s.name), detail: s.location,
  }));
  students.forEach((s: StudentRecord) => { const n = displayName(s); out.push({
    key: userKey('student', s.id), kind: 'student', id: s.id, name: s.firstName || s.lastName ? n : 'Awaiting sign-up', email: s.email, schoolId: s.schoolId, schoolName: schoolName(s.schoolId),
    joinedAt: s.createdAt, status: s.status, avatar: avatarOf(s.avatar, n), detail: s.classId ? classNameById.get(s.classId) ?? 'Class' : s.schoolId ? 'No class' : 'No school',
  }); });
  teachers.forEach((t: TeacherRecord) => { const n = displayName(t); out.push({
    key: userKey('teacher', t.id), kind: 'teacher', id: t.id, name: t.firstName || t.lastName ? n : 'Awaiting sign-up', email: t.email, schoolId: t.schoolId, schoolName: schoolName(t.schoolId),
    joinedAt: t.createdAt, status: t.status, avatar: avatarOf(t.avatar, n), detail: t.subject ?? 'Teacher',
  }); });
  parents.forEach((p: ParentRecord) => { const n = displayName(p); const sid = p.schoolId ?? childSchool.get(p.id); out.push({
    key: userKey('parent', p.id), kind: 'parent', id: p.id, name: p.firstName || p.lastName ? n : 'Awaiting sign-up', email: p.email, schoolId: sid, schoolName: schoolName(sid),
    joinedAt: p.createdAt, status: p.status, avatar: avatarOf(p.avatar, n), detail: p.profession ?? 'Parent / Guardian',
  }); });
  return out;
}

/* ───────────── activate / deactivate ───────────── */

/** Switches an active account off, or an inactive one back on. Pending accounts are not touched. */
export function setUserActive(kind: UserKind, id: string, active: boolean): boolean {
  const next: AccountStatus = active ? 'active' : 'inactive';
  const from: AccountStatus = active ? 'inactive' : 'active';
  if (kind === 'school') {
    const list = schoolsDirectory.all();
    const school = list.find(s => s.id === id);
    if (!school || (school.status ?? 'active') !== from) return false;
    schoolsDirectory.upsert({ ...school, status: next });
    // the school's own portal reads a separate copy of its record
    const current = localStorage.getItem('app_school');
    if (current) { try { const c = JSON.parse(current) as School; if (c.id === id) localStorage.setItem('app_school', JSON.stringify({ ...c, status: next })); } catch { /* ignore */ } }
    return true;
  }
  const store = kind === 'student' ? studentsStore : kind === 'teacher' ? teachersStore : parentsStore;
  const rec = (store.all() as { id: string; status: AccountStatus }[]).find(r => r.id === id);
  if (!rec || rec.status !== from) return false;
  (store as { update: (id: string, c: { status: AccountStatus }) => void }).update(id, { status: next });
  return true;
}

/* ───────────── delete ───────────── */

/** What deleting a school also removes, so the confirmation can say so. */
export function schoolDeletionImpact(schoolId: string) {
  const { students, teachers, parents } = listAll();
  return {
    students: students.filter(s => s.schoolId === schoolId).length,
    teachers: teachers.filter(t => t.schoolId === schoolId).length,
    parents: parents.filter(p => p.schoolId === schoolId).length,
    classes: schoolClassesStorage.get().filter(c => c.schoolId === schoolId).length,
  };
}

/** Deletes a school together with its classes, students, teachers and the parents it invited. */
function deleteSchool(schoolId: string) {
  studentsStore.all().filter(s => s.schoolId === schoolId).forEach(s => removeStudent(s.id));
  teachersStore.all().filter(t => t.schoolId === schoolId).forEach(t => removeTeacher(t.id));
  parentsStore.all().filter(p => p.schoolId === schoolId).forEach(p => removeParent(p.id));
  schoolClassesStorage.save(schoolClassesStorage.get().filter(c => c.schoolId !== schoolId));
  invitesStore.save(invitesStore.all().filter(i => i.schoolId !== schoolId));
  portalEventsStore.save(portalEventsStore.all().filter(e => !(e.host.kind === 'school' && e.host.schoolId === schoolId)));
  schoolsDirectory.save(schoolsDirectory.all().filter(s => s.id !== schoolId));
  try {
    const current = JSON.parse(localStorage.getItem('app_school') || 'null') as School | null;
    if (current?.id === schoolId) {
      localStorage.removeItem('app_school');
      if (sessionStore.get()?.userId === schoolId) sessionStore.clear();
    }
  } catch { /* ignore */ }
}

export function deletePlatformUser(kind: UserKind, id: string) {
  if (kind === 'school') deleteSchool(id);
  else if (kind === 'student') removeStudent(id);
  else if (kind === 'teacher') removeTeacher(id);
  else removeParent(id);
}
