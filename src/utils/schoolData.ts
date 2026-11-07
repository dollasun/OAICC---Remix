/**
 * Shared data layer for the School / Teacher / Parent / Student portals.
 * Everything lives in localStorage (no backend yet), so records are shared between
 * portals opened in the same browser. All reads are defensive: bad JSON yields [].
 */
import type {
  ActivityEntry, InboxNotification, InviteRecord, MentorSession, ParentRecord, PortalRole, SchoolClass,
  Session, StudentProgress, StudentRecord, TeacherRecord, AccountStatus,
} from '../types';
import { schoolClassesStorage, schoolStorage } from './storage';

const K = {
  session: 'app_session',
  teachers: 'app_teachers',
  students: 'app_school_students',
  parents: 'app_parents',
  invites: 'app_invites',
  activity: 'app_activity',
  inbox: 'app_inbox',
  progress: 'app_student_progress',
  mentorSessions: 'app_mentor_sessions',
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
/** Removes keys whose value is undefined so they never overwrite existing data in an update. */
const defined = <T extends object>(o: T): Partial<T> => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
const normEmail = (e: string) => e.trim().toLowerCase();
const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
export const fullName = (p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`.trim();
export const initialsOf = (p: { firstName: string; lastName: string }) =>
  `${p.firstName[0] ?? ''}${p.lastName[0] ?? ''}`.toUpperCase() || '?';

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

/* ───────────── session ───────────── */
export const sessionStore = {
  get: (): Session | null => read<Session | null>(K.session, null),
  set: (s: Session) => write(K.session, s),
  clear: () => localStorage.removeItem(K.session),
};

/* ───────────── collections ───────────── */
export const teachersStore = {
  all: (): TeacherRecord[] => read<TeacherRecord[]>(K.teachers, []),
  save: (v: TeacherRecord[]) => write(K.teachers, v),
  get: (id?: string | null) => (id ? teachersStore.all().find(t => t.id === id) : undefined),
  update: (id: string, changes: Partial<TeacherRecord>) =>
    teachersStore.save(teachersStore.all().map(t => (t.id === id ? { ...t, ...changes } : t))),
};
export const studentsStore = {
  all: (): StudentRecord[] => read<StudentRecord[]>(K.students, []),
  save: (v: StudentRecord[]) => write(K.students, v),
  get: (id?: string | null) => (id ? studentsStore.all().find(s => s.id === id) : undefined),
  update: (id: string, changes: Partial<StudentRecord>) =>
    studentsStore.save(studentsStore.all().map(s => (s.id === id ? { ...s, ...changes } : s))),
};
export const parentsStore = {
  all: (): ParentRecord[] => read<ParentRecord[]>(K.parents, []),
  save: (v: ParentRecord[]) => write(K.parents, v),
  get: (id?: string | null) => (id ? parentsStore.all().find(p => p.id === id) : undefined),
  update: (id: string, changes: Partial<ParentRecord>) =>
    parentsStore.save(parentsStore.all().map(p => (p.id === id ? { ...p, ...changes } : p))),
};
export const invitesStore = {
  all: (): InviteRecord[] => read<InviteRecord[]>(K.invites, []),
  save: (v: InviteRecord[]) => write(K.invites, v),
  byToken: (token?: string) => (token ? invitesStore.all().find(i => i.token === token) : undefined),
  forUser: (userId: string) => invitesStore.all().find(i => i.userId === userId && i.status === 'pending'),
};

/* ───────────── notifications (in-app inbox) ───────────── */
/** Per-user in-app notification preferences (a missing key means "on"). */
export const notifPrefs = {
  key: (role: string, id: string) => `app_notif_prefs_${role}_${id}`,
  get: (role: string, id?: string | null): Record<string, boolean> => (id ? read<Record<string, boolean>>(notifPrefs.key(role, id), {}) : {}),
  set: (role: string, id: string, prefs: Record<string, boolean>) => write(notifPrefs.key(role, id), prefs),
};

export const inbox = {
  all: (): InboxNotification[] => read<InboxNotification[]>(K.inbox, []),
  save: (v: InboxNotification[]) => write(K.inbox, v),
  forRecipient: (role: string, id?: string | null) =>
    inbox.all().filter(n => n.recipientRole === role && n.recipientId === (id ?? '')).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  /** `category` lets the recipient mute this kind of notification in Settings. */
  notify: (role: PortalRole, recipientId: string | undefined, title: string, body: string, link?: string, category?: string) => {
    if (!recipientId) return;
    if (category && notifPrefs.get(role, recipientId)[category] === false) return;
    inbox.save([{ id: uid('n'), recipientRole: role, recipientId, title, body, link, read: false, createdAt: new Date().toISOString() }, ...inbox.all()]);
  },
  markRead: (id: string) => inbox.save(inbox.all().map(n => (n.id === id ? { ...n, read: true } : n))),
  markAllRead: (role: string, recipientId: string) =>
    inbox.save(inbox.all().map(n => (n.recipientRole === role && n.recipientId === recipientId ? { ...n, read: true } : n))),
  remove: (id: string) => inbox.save(inbox.all().filter(n => n.id !== id)),
};

/* ───────────── student activity ───────────── */
export const activity = {
  all: (): ActivityEntry[] => read<ActivityEntry[]>(K.activity, []),
  save: (v: ActivityEntry[]) => write(K.activity, v),
  log: (studentId: string, type: ActivityEntry['type'], title: string, extra?: Pick<ActivityEntry, 'author' | 'authorRole' | 'text'>) =>
    write(K.activity, [{ id: uid('a'), studentId, type, title, createdAt: new Date().toISOString(), ...extra }, ...activity.all()]),
  forStudent: (studentId: string) => activity.all().filter(a => a.studentId === studentId),
};

/* ───────────── invites ───────────── */
export const inviteLink = (token: string) => `${window.location.origin}/invite/${token}`;

interface InviteInput {
  role: 'teacher' | 'student' | 'parent';
  email: string;
  firstName?: string;
  lastName?: string;
  classId?: string;
  invitedBy: Session;
  /** For student invites sent by a parent. */
  parentId?: string;
}

/** Creates the (inactive) account record and a pending invite for it. */
export function createInvite(input: InviteInput): Result<{ invite: InviteRecord; link: string }> {
  const email = normEmail(input.email);
  if (!isEmail(email)) return fail('Enter a valid email address.');
  const schoolId = input.invitedBy.role === 'school' ? input.invitedBy.userId : undefined;

  const existing =
    input.role === 'teacher' ? teachersStore.all().find(t => normEmail(t.email) === email)
    : input.role === 'student' ? studentsStore.all().find(s => normEmail(s.email) === email)
    : parentsStore.all().find(p => normEmail(p.email) === email);
  if (existing) return fail(`A ${input.role} with this email already exists.`);

  const now = new Date().toISOString();
  const base = { firstName: (input.firstName ?? '').trim(), lastName: (input.lastName ?? '').trim(), email, status: 'invited' as const, onboarded: false, createdAt: now };
  let userId: string;
  if (input.role === 'teacher') {
    userId = uid('t');
    teachersStore.save([{ id: userId, schoolId, ...base }, ...teachersStore.all()]);
  } else if (input.role === 'student') {
    userId = uid('s');
    studentsStore.save([{ id: userId, schoolId, classId: input.classId, parentIds: input.parentId ? [input.parentId] : [], ...base }, ...studentsStore.all()]);
    if (input.classId) activity.log(userId, 'class', `Added to ${className(input.classId)}`);
    if (input.parentId) activity.log(userId, 'parent', 'Linked to a parent account');
  } else {
    userId = uid('p');
    parentsStore.save([{ id: userId, schoolId, ...base }, ...parentsStore.all()]);
  }
  const invite: InviteRecord = {
    id: uid('i'), token: uid('tok').replace(/-/g, ''), role: input.role, email, userId, schoolId,
    classId: input.classId, invitedBy: input.invitedBy, status: 'pending', createdAt: now,
  };
  invitesStore.save([invite, ...invitesStore.all()]);
  return { ok: true, value: { invite, link: inviteLink(invite.token) } };
}

export function revokeInvite(userId: string) {
  invitesStore.save(invitesStore.all().map(i => (i.userId === userId && i.status === 'pending' ? { ...i, status: 'revoked' } : i)));
}

/** Activates the account behind an invite, signs the user in and notifies the inviter. */
export function acceptInvite(token: string, details: { firstName: string; lastName: string; phone?: string }): Result<Session> {
  const invite = invitesStore.byToken(token);
  if (!invite || invite.status !== 'pending') return fail('This invite link is invalid or has already been used.');
  if (!details.firstName.trim() || !details.lastName.trim()) return fail('Enter your first and last name.');
  const changes = defined({ firstName: details.firstName.trim(), lastName: details.lastName.trim(), phone: details.phone?.trim() || undefined, status: 'active' as const });
  const name = `${details.firstName.trim()} ${details.lastName.trim()}`.trim();

  if (invite.role === 'teacher') teachersStore.update(invite.userId, changes);
  else if (invite.role === 'student') studentsStore.update(invite.userId, changes);
  else parentsStore.update(invite.userId, changes);
  invitesStore.save(invitesStore.all().map(i => (i.id === invite.id ? { ...i, status: 'accepted', acceptedAt: new Date().toISOString() } : i)));

  if (invite.role === 'student') {
    activity.log(invite.userId, 'joined', 'Accepted the invitation and created an account');
    const student = studentsStore.get(invite.userId);
    if (student?.classId) notifyClassTeacher(student.classId, 'New student in your class', `${name} joined ${className(student.classId)}.`, student.id, 'students');
    student?.parentIds.forEach(pid => inbox.notify('parent', pid, 'Your child joined', `${name} accepted your invitation.`, '/parent/dashboard', 'children'));
  }
  const role: PortalRole = invite.role;
  if (invite.invitedBy.role === 'school') {
    inbox.notify('school', invite.invitedBy.userId, `New ${invite.role} joined`, `${name} accepted your invitation.`, invite.role === 'teacher' ? '/school/teachers' : '/school/dashboard', 'invitations');
  } else {
    // A parent who invited their child was already told ("Your child joined") above.
    const alreadyNotified = invite.role === 'student' && studentsStore.get(invite.userId)?.parentIds.includes(invite.invitedBy.userId);
    if (!alreadyNotified) inbox.notify(invite.invitedBy.role, invite.invitedBy.userId, 'Invitation accepted', `${name} accepted your invitation.`);
  }
  if (invite.role === 'student') studentsStore.update(invite.userId, { lastLoginAt: new Date().toISOString() });
  const session = { role, userId: invite.userId };
  sessionStore.set(session);
  return { ok: true, value: session };
}

/* ───────────── self-registration / sign-in ───────────── */
export function registerAccount(role: 'teacher' | 'parent' | 'student', d: { firstName: string; lastName: string; email: string; phone?: string }): Result<Session> {
  const email = normEmail(d.email);
  const pending = invitesStore.all().find(i => i.role === role && i.status === 'pending' && normEmail(i.email) === email);
  if (pending) return acceptInvite(pending.token, d); // they were invited: activate that record instead of duplicating
  const taken = findByEmail(role, email);
  if (taken) return fail('An account with this email already exists. Please sign in.');
  const rec = { id: uid(role[0]), firstName: d.firstName.trim(), lastName: d.lastName.trim(), email, phone: d.phone?.trim() || undefined, status: 'active' as const, onboarded: false, createdAt: new Date().toISOString() };
  if (role === 'teacher') teachersStore.save([{ ...rec }, ...teachersStore.all()]);
  else if (role === 'student') studentsStore.save([{ ...rec, parentIds: [] }, ...studentsStore.all()]);
  else parentsStore.save([rec, ...parentsStore.all()]);
  if (role === 'student') { activity.log(rec.id, 'joined', 'Created an account'); studentsStore.update(rec.id, { lastLoginAt: new Date().toISOString() }); }
  const session = { role, userId: rec.id };
  sessionStore.set(session);
  return { ok: true, value: session };
}

export function findByEmail(role: string, email: string) {
  const e = normEmail(email);
  if (role === 'teacher') return teachersStore.all().find(t => normEmail(t.email) === e);
  if (role === 'student') return studentsStore.all().find(s => normEmail(s.email) === e);
  if (role === 'parent') return parentsStore.all().find(p => normEmail(p.email) === e);
  if (role === 'school') { const s = schoolStorage.get(); return s && normEmail(s.adminEmail) === e ? s : undefined; }
  return undefined;
}

/** Signs in if an account with this email exists for the role. Returns false when none does. */
export function signInByEmail(role: string, email: string): boolean {
  const rec = findByEmail(role, email);
  if (!rec || ('status' in rec && (rec.status === 'invited' || rec.status === 'inactive'))) return false;
  sessionStore.set({ role: role as PortalRole, userId: rec.id });
  if (role === 'student') studentsStore.update(rec.id, { lastLoginAt: new Date().toISOString() });
  return true;
}

/** The signed-in person's account status, or undefined when nobody of a record-backed role is signed in. */
export function sessionAccountStatus(): AccountStatus | undefined {
  const s = sessionStore.get();
  if (!s) return undefined;
  if (s.role === 'teacher') return teachersStore.get(s.userId)?.status;
  if (s.role === 'student') return studentsStore.get(s.userId)?.status;
  if (s.role === 'parent') return parentsStore.get(s.userId)?.status;
  if (s.role === 'school') { const sc = schoolStorage.get(); return sc && sc.id === s.userId ? sc.status ?? 'active' : undefined; }
  return undefined;
}

export function markOnboarded(role: 'teacher' | 'parent' | 'student', userId: string) {
  if (role === 'teacher') teachersStore.update(userId, { onboarded: true });
  else if (role === 'parent') parentsStore.update(userId, { onboarded: true });
  else { studentsStore.update(userId, { onboarded: true }); activity.log(userId, 'onboarding', 'Completed onboarding'); }
}

/* ───────────── classes ↔ teachers ↔ students ───────────── */
export const className = (classId?: string) => schoolClassesStorage.get().find(c => c.id === classId)?.name ?? 'a class';
export const classesForTeacher = (teacherId: string): SchoolClass[] => schoolClassesStorage.get().filter(c => c.teacherId === teacherId);
export const studentsInClass = (classId: string) => studentsStore.all().filter(s => s.classId === classId);
export const teacherOfClass = (classId: string) => teachersStore.get(schoolClassesStorage.get().find(c => c.id === classId)?.teacherId);

export function notifyClassTeacher(classId: string, title: string, body: string, studentId?: string, category = 'students') {
  const t = teacherOfClass(classId);
  if (t) inbox.notify('teacher', t.id, title, body, studentId ? `/teacher/student/${studentId}` : `/teacher/class/${classId}`, category);
}

export function assignTeacher(classId: string, teacherId: string | undefined) {
  const cls = schoolClassesStorage.get().find(c => c.id === classId);
  if (!cls) return;
  const previous = cls.teacherId;
  if (previous === teacherId) return;
  schoolClassesStorage.setTeacher(classId, teacherId);
  if (teacherId) inbox.notify('teacher', teacherId, 'Class assigned', `You have been assigned to ${cls.name}.`, `/teacher/class/${classId}`, 'classes');
  if (previous) inbox.notify('teacher', previous, 'Class reassigned', `You are no longer assigned to ${cls.name}.`, undefined, 'classes');
}

export function moveStudentToClass(studentId: string, classId: string | undefined) {
  const s = studentsStore.get(studentId);
  if (!s) return;
  studentsStore.update(studentId, { classId });
  if (classId) {
    activity.log(studentId, 'class', `Added to ${className(classId)}`);
    notifyClassTeacher(classId, 'Student added to your class', `${fullName(s) || s.email} was added to ${className(classId)}.`, studentId);
    inbox.notify('student', studentId, 'Added to a class', `You were added to ${className(classId)}.`);
  }
}

export function removeTeacher(teacherId: string) {
  schoolClassesStorage.get().filter(c => c.teacherId === teacherId).forEach(c => schoolClassesStorage.setTeacher(c.id, undefined));
  revokeInvite(teacherId);
  teachersStore.save(teachersStore.all().filter(t => t.id !== teacherId));
  inbox.save(inbox.all().filter(n => !(n.recipientRole === 'teacher' && n.recipientId === teacherId)));
  localStorage.removeItem(notifPrefs.key('teacher', teacherId));
}

export function removeStudent(studentId: string) {
  revokeInvite(studentId);
  studentsStore.save(studentsStore.all().filter(s => s.id !== studentId));
  // clean up everything that belonged to this student so nothing is left orphaned
  activity.save(activity.all().filter(a => a.studentId !== studentId));
  progressStore.remove(studentId);
  mentorSessionsStore.save(mentorSessionsStore.all().filter(m => m.studentId !== studentId));
  inbox.save(inbox.all().filter(n => !(n.recipientRole === 'student' && n.recipientId === studentId)));
  localStorage.removeItem(notifPrefs.key('student', studentId));
}

/* ───────────── parent ↔ children ───────────── */
export const childrenOf = (parentId: string) => studentsStore.all().filter(s => s.parentIds.includes(parentId));

/** Adds a child for a parent: links an existing student by email, or creates an invited student. */
export function addChild(parentId: string, d: { email: string; firstName?: string; lastName?: string }): Result<{ child: StudentRecord; link?: string; linked: boolean }> {
  const email = normEmail(d.email);
  if (!isEmail(email)) return fail('Enter a valid email address.');
  const existing = studentsStore.all().find(s => normEmail(s.email) === email);
  if (existing) {
    if (existing.parentIds.includes(parentId)) return fail('This child is already linked to your account.');
    studentsStore.update(existing.id, { parentIds: [...existing.parentIds, parentId] });
    activity.log(existing.id, 'parent', 'Linked to a parent account');
    inbox.notify('student', existing.id, 'Parent linked', 'A parent linked their account to yours.');
    return { ok: true, value: { child: { ...existing, parentIds: [...existing.parentIds, parentId] }, linked: true } };
  }
  const r = createInvite({ role: 'student', email, firstName: d.firstName, lastName: d.lastName, invitedBy: { role: 'parent', userId: parentId }, parentId });
  if ('error' in r) return fail(r.error);
  const child = studentsStore.get(r.value.invite.userId)!;
  return { ok: true, value: { child, link: r.value.link, linked: false } };
}

export const pendingChildInvites = (parentId: string) =>
  invitesStore.all().filter(i => i.role === 'student' && i.status === 'pending' && i.invitedBy.role === 'parent' && i.invitedBy.userId === parentId);

/** Marks the signed-in user's onboarding as complete and saves the profile details they entered. */
export function finishOnboarding(role: 'teacher' | 'parent' | 'student', profile?: Partial<TeacherRecord & ParentRecord>) {
  const s = sessionStore.get();
  if (!s || s.role !== role) return;
  if (role === 'teacher') {
    teachersStore.update(s.userId, { onboarded: true, ...defined({ firstName: profile?.firstName, lastName: profile?.lastName, phone: profile?.phone, bio: profile?.bio, location: profile?.location }) });
  } else if (role === 'parent') {
    parentsStore.update(s.userId, { onboarded: true, ...defined({ firstName: profile?.firstName, lastName: profile?.lastName, phone: profile?.phone, profession: profile?.profession, location: profile?.location }) });
  } else {
    markOnboarded('student', s.userId);
  }
}

/**
 * A comment on a student's profile. Teacher comments notify the parents; parent notes notify the class
 * teacher; school notes notify both.
 */
export function addStudentNote(studentId: string, author: string, authorRole: 'Teacher' | 'Parent' | 'School', text: string) {
  const s = studentsStore.get(studentId);
  activity.log(studentId, 'note', `${author} left a comment`, { author, authorRole, text });
  const who = s ? fullName(s) || 'your child' : 'your child';
  if (authorRole !== 'Parent') {
    s?.parentIds.forEach(pid => inbox.notify('parent', pid, 'New comment on your child', `${author} commented on ${who}'s profile.`, `/parent/dashboard/child/${studentId}`, 'comments'));
  }
  if (authorRole !== 'Teacher' && s?.classId) {
    const title = authorRole === 'Parent' ? 'New parent note' : 'New school note';
    notifyClassTeacher(s.classId, title, `${author} left a note about ${who}.`, studentId, authorRole === 'Parent' ? 'parentNotes' : 'students');
  }
}

/* ───────────── school-side helpers ───────────── */
export const teachersOfSchool = (schoolId?: string) => teachersStore.all().filter(t => t.schoolId === schoolId);
export const studentsOfSchool = (schoolId?: string) => studentsStore.all().filter(s => s.schoolId === schoolId);
export const parentsOfSchool = (schoolId?: string) => {
  const kids = studentsOfSchool(schoolId);
  return parentsStore.all().filter(p => p.schoolId === schoolId || kids.some(k => k.parentIds.includes(p.id)));
};

export function removeParent(parentId: string) {
  revokeInvite(parentId);
  parentsStore.save(parentsStore.all().filter(p => p.id !== parentId));
  studentsStore.save(studentsStore.all().map(s => ({ ...s, parentIds: s.parentIds.filter(id => id !== parentId) })));
}

/** Links a parent to the given students (used when a school invites a parent for specific children). */
export function linkParentToStudents(parentId: string, studentIds: string[]) {
  studentIds.forEach(id => {
    const s = studentsStore.get(id);
    if (s && !s.parentIds.includes(parentId)) {
      studentsStore.update(id, { parentIds: [...s.parentIds, parentId] });
      activity.log(id, 'parent', 'Linked to a parent account');
    }
  });
}

/** An existing student account (not yet in this school) is added to the school and class and notified. */
export function addExistingStudentToSchool(schoolId: string, studentId: string, classId?: string): Result<StudentRecord> {
  const s = studentsStore.get(studentId);
  if (!s) return fail('Student not found.');
  if (s.schoolId === schoolId) return fail('This student is already in your school.');
  studentsStore.update(studentId, { schoolId, classId: undefined }); // a class from their previous school no longer applies
  inbox.notify('student', studentId, 'Added to a school', `${schoolStorage.get()?.name ?? 'A school'} added you to their school.`);
  if (classId) moveStudentToClass(studentId, classId);
  return { ok: true, value: { ...s, schoolId, classId } };
}

/** Sets exactly which classes a teacher teaches (a class has one teacher; others are untouched). */
export function setTeacherClasses(teacherId: string, classIds: string[]) {
  schoolClassesStorage.get().forEach(c => {
    const shouldTeach = classIds.includes(c.id);
    if (shouldTeach && c.teacherId !== teacherId) assignTeacher(c.id, teacherId);
    else if (!shouldTeach && c.teacherId === teacherId) assignTeacher(c.id, undefined);
  });
}

/* ───────────── per-student progress + mentor sessions (used by the school report card) ───────────── */
export const progressStore = {
  all: (): Record<string, StudentProgress> => read<Record<string, StudentProgress>>(K.progress, {}),
  get: (studentId: string) => progressStore.all()[studentId],
  save: (p: StudentProgress) => write(K.progress, { ...progressStore.all(), [p.studentId]: p }),
  remove: (studentId: string) => { const all = progressStore.all(); delete all[studentId]; write(K.progress, all); },
};

export const mentorSessionsStore = {
  all: (): MentorSession[] => read<MentorSession[]>(K.mentorSessions, []),
  save: (v: MentorSession[]) => write(K.mentorSessions, v),
  forStudent: (studentId: string) => mentorSessionsStore.all().filter(m => m.studentId === studentId),
  add: (studentId: string, mentorId: number | string, mentorName: string) =>
    mentorSessionsStore.save([{ id: uid('m'), studentId, mentorId, mentorName, status: 'Requested', createdAt: new Date().toISOString() }, ...mentorSessionsStore.all()]),
};
