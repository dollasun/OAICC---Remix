/**
 * Who a School, Teacher or Parent portal user can message, derived from the school's real
 * relationships: a school talks to its teachers and parents; a teacher to their school, colleagues
 * and the parents of the students they teach; a parent to the school and their children's teachers.
 */
import { initialsAvatar, type ChatParticipant } from './crossPortalMessaging';
import type { PortalIdentity } from './portalIdentity';
import { schoolStorage } from './storage';
import { childrenOf, className, classesForTeacher, fullName, parentsStore, studentsStore, teacherOfClass, teachersOfSchool } from './schoolData';
import type { ParentRecord, StudentRecord, TeacherRecord } from '../types';

export interface Contact extends ChatParticipant {
  /** What this person is to the viewer, e.g. "Parent of Favour Aina (JSS3)". */
  subtitle: string;
}

export const participantFor = (me: PortalIdentity): ChatParticipant =>
  ({ id: me.id, name: me.name, role: me.role, image: initialsAvatar(me.name), online: true });

const person = (id: string, name: string, role: ChatParticipant['role'], subtitle: string): Contact =>
  ({ id, name, role, image: initialsAvatar(name), online: false, subtitle });

const nameOf = (r: TeacherRecord | ParentRecord | StudentRecord) => fullName(r) || r.email;
const childLabel = (s: StudentRecord) => `${nameOf(s)}${s.classId ? ` (${className(s.classId)})` : ''}`;

const teacherContact = (t: TeacherRecord) => {
  const classes = classesForTeacher(t.id).map(c => c.name);
  return person(t.id, nameOf(t), 'teacher', `Teacher${classes.length ? ` · ${classes.join(', ')}` : t.subject ? ` · ${t.subject}` : ''}`);
};
const parentContact = (p: ParentRecord, children: StudentRecord[]) =>
  person(p.id, nameOf(p), 'parent', children.length ? `Parent of ${children.map(childLabel).join(', ')}` : 'Parent / Guardian');

export function contactsFor(me: PortalIdentity): Contact[] {
  const school = schoolStorage.get();
  const schoolContact = school && school.id === me.schoolId ? [person(school.id, school.name, 'school', 'Your school')] : [];
  const activeTeachers = teachersOfSchool(me.schoolId).filter(t => t.status === 'active');
  const schoolStudents = studentsStore.all().filter(s => s.schoolId === me.schoolId);
  const parentById = new Map(parentsStore.all().filter(p => p.status === 'active').map(p => [p.id, p]));

  // Parents of a set of students, each with the children that link them.
  const parentsOf = (students: StudentRecord[]) => {
    const kids = new Map<string, StudentRecord[]>();
    students.forEach(s => s.parentIds.forEach(pid => { if (parentById.has(pid)) kids.set(pid, [...(kids.get(pid) ?? []), s]); }));
    return [...kids.entries()].map(([pid, children]) => parentContact(parentById.get(pid)!, children));
  };

  let list: Contact[];
  if (me.role === 'school') {
    list = [...activeTeachers.map(teacherContact), ...parentsOf(schoolStudents)];
  } else if (me.role === 'teacher') {
    const myClassIds = new Set(classesForTeacher(me.id).map(c => c.id));
    const myStudents = schoolStudents.filter(s => s.classId && myClassIds.has(s.classId));
    list = [...schoolContact, ...parentsOf(myStudents), ...activeTeachers.filter(t => t.id !== me.id).map(teacherContact)];
  } else {
    const children = childrenOf(me.id);
    const teachers = new Map<string, { t: TeacherRecord; kids: StudentRecord[] }>();
    children.forEach(c => {
      const t = c.classId ? teacherOfClass(c.classId) : undefined;
      if (t && t.status === 'active') teachers.set(t.id, { t, kids: [...(teachers.get(t.id)?.kids ?? []), c] });
    });
    list = [...schoolContact, ...[...teachers.values()].map(({ t, kids }) => person(t.id, nameOf(t), 'teacher', `Teacher of ${kids.map(childLabel).join(', ')}`))];
  }
  return list.sort((a, b) => (a.role === 'school' ? -1 : b.role === 'school' ? 1 : a.name.localeCompare(b.name)));
}
