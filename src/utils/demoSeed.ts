/**
 * Demo data for the School / Teacher / Parent / Student demo accounts, so each one opens to a
 * fully populated portal. Only runs when demo mode is on (see demoDefaults.ts). It never
 * overwrites an existing school: use "Reset demo data" on the sign-in page to start over.
 *
 * Demo logins (password Demo@12345): school@, teacher@, parent@, student@ at oaicc.demo.
 */
import type { ActivityEntry, InboxNotification, InviteRecord, ParentRecord, SchoolClass, StudentRecord, TeacherRecord } from '../types';
import { activity, inbox, invitesStore, mentorSessionsStore, parentsStore, progressStore, sessionStore, studentsStore, teachersStore } from './schoolData';
import { INITIAL_QUESTIONS } from '../data/assessmentQuestions';
import {
  adminRolesStorage, adminUsersStorage, careerCategoriesStorage, careersStorage, counselingSessionsStorage, counselorRequestsStorage,
  counselorsStorage, eventsStorage, forumCategoriesStorage, forumsStorage, interestQuizStorage, mentorsStorage, messagesStorage,
  registeredEventsStorage, savedCareersStorage, schoolClassesStorage, schoolStorage, strengthQuizStorage, studentMessagesStorage, studentsStorage,
} from './storage';

const FLAG = 'app_demo_seeded_v1';
const SCHOOL_ID = 'demo-school';
const DAY = 86_400_000;
const ago = (days: number, hours = 0) => new Date(Date.now() - days * DAY - hours * 3_600_000).toISOString();

/**
 * The student portal's sample content (careers, events, mentors, forum, sessions...) is created the
 * first time each storage is read, and several pages read it with an empty fallback, which locks in
 * empty lists. Initialising every store with its built-in sample data first avoids that, then the
 * demo student gets saved careers, event registrations and a partly completed career assessment.
 */
function seedStudentPortal() {
  [careersStorage, careerCategoriesStorage, forumsStorage, forumCategoriesStorage, mentorsStorage, eventsStorage, counselorsStorage,
    counselorRequestsStorage, studentsStorage, adminUsersStorage, adminRolesStorage, registeredEventsStorage, interestQuizStorage,
    strengthQuizStorage, counselingSessionsStorage, messagesStorage, studentMessagesStorage,
  ].forEach(store => { try { (store as { get: () => unknown }).get(); } catch { /* keep going */ } });

  // One-time: give the demo student saved careers and a partly completed assessment.
  if (!localStorage.getItem('app_demo_student_seeded_v1')) {
    const ids = (careersStorage.get() as { id: number }[]).slice(0, 4).map(c => c.id);
    savedCareersStorage.save(ids);
    const answers: Record<string, number> = {};
    INITIAL_QUESTIONS.slice(0, 40).forEach((q, i) => { answers[q.id] = [4, 5, 3, 4, 2, 5, 4][i % 7]; });
    localStorage.setItem('studentAssessmentAnswers', JSON.stringify(answers));
    localStorage.setItem('app_demo_student_seeded_v1', '1');
  }
}

export function seedDemoData(): boolean {
  seedStudentPortal();
  if (localStorage.getItem(FLAG) || schoolStorage.get()) return false;

  schoolStorage.save({
    id: SCHOOL_ID, name: 'Demo Secondary School', location: 'Lagos, Nigeria',
    schoolTypes: ['Junior Secondary', 'Senior Secondary'], expectedClasses: '12 - 20', expectedStudents: '100 - 400',
    adminFirstName: 'Chioma', adminLastName: 'Eze', adminEmail: 'school@oaicc.demo', phone: '+234 802 555 0100', createdAt: ago(60),
  });

  /* ── teachers ── */
  const teacher = (id: string, firstName: string, lastName: string, email: string, extra: Partial<TeacherRecord>): TeacherRecord => ({
    id, schoolId: SCHOOL_ID, firstName, lastName, email, status: 'active', onboarded: true, createdAt: ago(45), ...extra,
  });
  const teachers: TeacherRecord[] = [
    teacher('demo-teacher-1', 'Uzo', 'Kelechi', 'teacher@oaicc.demo', { phone: '+234 801 555 0111', subject: 'Mathematics', location: 'Lagos, Nigeria', bio: 'Mathematics teacher with 8 years of experience, passionate about career guidance and STEM clubs.', createdAt: ago(55) }),
    teacher('demo-teacher-2', 'Folake', 'Davies', 'folake.davies@oaicc.demo', { phone: '+234 803 555 0122', subject: 'English Language', location: 'Lagos, Nigeria', bio: 'English and literature teacher who runs the debate club.', createdAt: ago(40) }),
    teacher('demo-teacher-3', 'Tunde', 'Bello', 'tunde.bello@oaicc.demo', { status: 'invited', onboarded: false, createdAt: ago(2) }),
  ];
  teachersStore.save(teachers);

  /* ── classes ── */
  const cls = (id: string, name: string, teacherId: string | undefined, days: number): SchoolClass => ({ id, schoolId: SCHOOL_ID, name, teacherId, createdAt: ago(days) });
  schoolClassesStorage.save([
    cls('demo-class-sss3', 'SSS3', undefined, 50),
    cls('demo-class-sss2', 'SSS2', 'demo-teacher-1', 52),
    cls('demo-class-sss1', 'SSS1', 'demo-teacher-2', 53),
    cls('demo-class-jss3', 'JSS3', 'demo-teacher-1', 54),
    cls('demo-class-jss1', 'JSS1', undefined, 55),
  ]);

  /* ── parents ── */
  const parent = (id: string, firstName: string, lastName: string, email: string, extra: Partial<ParentRecord>): ParentRecord => ({
    id, schoolId: SCHOOL_ID, firstName, lastName, email, status: 'active', onboarded: true, createdAt: ago(40), ...extra,
  });
  parentsStore.save([
    parent('demo-parent-1', 'Fadeyibi', 'Aina', 'parent@oaicc.demo', { phone: '+234 805 555 0133', profession: 'Professor', location: 'Abuja, Nigeria', createdAt: ago(44) }),
    parent('demo-parent-2', 'Bisi', 'Ahmed', 'bisi.ahmed@oaicc.demo', { phone: '+234 806 555 0144', profession: 'Accountant', location: 'Lagos, Nigeria', createdAt: ago(30) }),
  ]);

  /* ── students ── */
  const student = (id: string, firstName: string, lastName: string, classId: string | undefined, days: number, extra: Partial<StudentRecord> = {}): StudentRecord => ({
    id, schoolId: SCHOOL_ID, classId, firstName, lastName, email: `${firstName}.${lastName}@oaicc.demo`.toLowerCase(),
    parentIds: [], status: 'active', onboarded: true, createdAt: ago(days), ...extra,
  });
  const students: StudentRecord[] = [
    student('demo-student-1', 'Bolu', 'Ahmed', 'demo-class-sss2', 30, { email: 'student@oaicc.demo', phone: '+234 807 555 0155', parentIds: ['demo-parent-2'] }),
    student('demo-student-2', 'Ngozi', 'Eze', 'demo-class-sss2', 28),
    student('demo-student-3', 'Ibrahim', 'Musa', 'demo-class-sss2', 27),
    student('demo-student-4', 'Chidi', 'Okeke', 'demo-class-sss2', 3, { onboarded: false }),
    student('demo-student-5', 'Favour', 'Aina', 'demo-class-jss3', 33, { email: 'favour@oaicc.demo', parentIds: ['demo-parent-1'] }),
    student('demo-student-6', 'Tosin', 'Adeyemi', 'demo-class-jss3', 26),
    student('demo-student-7', 'Gbenga', 'Aina', 'demo-class-sss1', 32, { email: 'gbenga@oaicc.demo', parentIds: ['demo-parent-1'] }),
    student('demo-student-8', 'Amaka', 'Nwosu', 'demo-class-sss1', 25),
    student('demo-student-9', 'Zainab', 'Bello', 'demo-class-jss1', 20),
    student('demo-student-10', 'Emeka', 'Obi', 'demo-class-sss3', 18, { onboarded: false }),
    student('demo-student-11', 'Ayo', 'Aina', undefined, 1, { schoolId: undefined, status: 'invited', onboarded: false, parentIds: ['demo-parent-1'], email: 'ayo.aina@oaicc.demo' }),
    student('demo-student-12', 'Kemi', 'Adebayo', 'demo-class-jss1', 2, { status: 'invited', onboarded: false, email: 'kemi.adebayo@oaicc.demo' }),
  ];
  studentsStore.save(students);

  /* ── pending invites (their links work: /invite/<token>) ── */
  const invite = (token: string, role: InviteRecord['role'], email: string, userId: string, by: InviteRecord['invitedBy'], extra: Partial<InviteRecord> = {}): InviteRecord => ({
    id: `demo-${token}`, token, role, email, userId, schoolId: SCHOOL_ID, invitedBy: by, status: 'pending', createdAt: ago(1), ...extra,
  });
  invitesStore.save([
    invite('demo-invite-teacher', 'teacher', 'tunde.bello@oaicc.demo', 'demo-teacher-3', { role: 'school', userId: SCHOOL_ID }, { createdAt: ago(2) }),
    invite('demo-invite-student', 'student', 'kemi.adebayo@oaicc.demo', 'demo-student-12', { role: 'school', userId: SCHOOL_ID }, { classId: 'demo-class-jss1', createdAt: ago(2) }),
    invite('demo-invite-child', 'student', 'ayo.aina@oaicc.demo', 'demo-student-11', { role: 'parent', userId: 'demo-parent-1' }, { schoolId: undefined, createdAt: ago(1) }),
  ]);

  /* ── activity feed (what parents, teachers and the school see per student) ── */
  const log: ActivityEntry[] = [];
  let n = 0;
  const add = (studentId: string, type: ActivityEntry['type'], title: string, days: number, extra: Partial<ActivityEntry> = {}) =>
    log.push({ id: `demo-a-${++n}`, studentId, type, title, createdAt: ago(days), ...extra });
  const className = (id?: string) => schoolClassesStorage.get().find(c => c.id === id)?.name ?? 'a class';
  students.filter(s => s.status === 'active').forEach(s => {
    const base = (Date.now() - new Date(s.createdAt).getTime()) / DAY;
    add(s.id, 'joined', 'Accepted the invitation and created an account', base);
    add(s.id, 'class', `Added to ${className(s.classId)}`, base - 0.1);
    if (s.parentIds.length) add(s.id, 'parent', 'Linked to a parent account', base - 0.5);
    if (s.onboarded) add(s.id, 'onboarding', 'Completed onboarding', base - 1);
  });
  add('demo-student-5', 'note', 'Uzo Kelechi left a comment', 6, { author: 'Uzo Kelechi', authorRole: 'Teacher', text: 'Favour has shown great improvement in Mathematics this term. Keep it up!' });
  add('demo-student-5', 'note', 'Fadeyibi Aina left a comment', 5, { author: 'Fadeyibi Aina', authorRole: 'Parent', text: "Thank you, we'll keep encouraging her at home." });
  add('demo-student-1', 'note', 'Uzo Kelechi left a comment', 4, { author: 'Uzo Kelechi', authorRole: 'Teacher', text: 'Bolu is leading the SSS2 tech club project. Excellent initiative.' });
  add('demo-student-1', 'note', 'Bisi Ahmed left a comment', 3, { author: 'Bisi Ahmed', authorRole: 'Parent', text: 'Please let me know if he needs extra lessons before the exams.' });
  add('demo-student-7', 'note', 'Folake Davies left a comment', 8, { author: 'Folake Davies', authorRole: 'Teacher', text: 'Gbenga writes thoughtful essays and is a strong debater.' });
  add('demo-student-11', 'parent', 'Linked to a parent account', 1);
  add('demo-student-12', 'class', 'Added to JSS1', 2);
  activity.save(log.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

  /* ── in-app notifications per demo account ── */
  const note = (role: InboxNotification['recipientRole'], id: string, title: string, body: string, days: number, read: boolean, link?: string): InboxNotification =>
    ({ id: `demo-n-${role}-${++n}`, recipientRole: role, recipientId: id, title, body, link, read, createdAt: ago(days) });
  inbox.save([
    note('school', SCHOOL_ID, 'New student joined', 'Chidi Okeke accepted your invitation.', 0.1, false, '/school/dashboard'),
    note('school', SCHOOL_ID, 'New teacher joined', 'Folake Davies accepted your invitation.', 3, false, '/school/teachers'),
    note('school', SCHOOL_ID, 'New parent joined', 'Bisi Ahmed accepted your invitation.', 10, true, '/school/dashboard'),
    note('teacher', 'demo-teacher-1', 'New parent note', 'Fadeyibi Aina left a note about Favour Aina.', 0.2, false, '/teacher/student/demo-student-5'),
    note('teacher', 'demo-teacher-1', 'New student in your class', 'Chidi Okeke joined SSS2.', 3, false, '/teacher/student/demo-student-4'),
    note('teacher', 'demo-teacher-1', 'Class assigned', 'You have been assigned to SSS2.', 52, true, '/teacher/class/demo-class-sss2'),
    note('teacher', 'demo-teacher-1', 'Class assigned', 'You have been assigned to JSS3.', 54, true, '/teacher/class/demo-class-jss3'),
    note('teacher', 'demo-teacher-2', 'Class assigned', 'You have been assigned to SSS1.', 53, true),
    note('parent', 'demo-parent-1', 'New comment on your child', 'Uzo Kelechi commented on Favour Aina\'s profile.', 0.3, false, '/parent/dashboard/child/demo-student-5'),
    note('parent', 'demo-parent-1', 'Your child joined', 'Gbenga Aina accepted your invitation.', 30, true),
    note('parent', 'demo-parent-2', 'New comment on your child', 'Uzo Kelechi commented on Bolu Ahmed\'s profile.', 4, false, '/parent/dashboard/child/demo-student-1'),
    note('student', 'demo-student-1', 'Added to a class', 'You were added to SSS2.', 30, true),
    note('student', 'demo-student-1', 'Parent linked', 'A parent linked their account to yours.', 30, false),
  ]);

  seedReportData(students);

  localStorage.setItem(FLAG, '1');
  return true;
}

/** Login dates, quiz progress, careers, counsellor and mentor sessions that feed each student's report card. */
function seedReportData(students: StudentRecord[]) {
  const logins: Record<string, [number, number]> = {
    'demo-student-1': [0, 3], 'demo-student-2': [1, 2], 'demo-student-3': [4, 0], 'demo-student-4': [2, 5], 'demo-student-5': [0, 20],
    'demo-student-6': [6, 0], 'demo-student-7': [9, 0], 'demo-student-8': [3, 8], 'demo-student-9': [12, 0], 'demo-student-10': [18, 0],
  };
  studentsStore.save(students.map(s => (logins[s.id] ? { ...s, lastLoginAt: ago(...logins[s.id]) } : s)));

  const rec = (...items: [string, string, number][]) => items.map(([title, category, match]) => ({ title, category, match }));
  const fav = (...items: [string, string][]) => items.map(([title, category]) => ({ title, category }));
  const progress: Record<string, [number, ReturnType<typeof rec>, ReturnType<typeof fav>]> = {
    'demo-student-1': [40, rec(['Software Engineering', 'Technology', 88], ['Data Science', 'Technology', 84], ['Cybersecurity', 'Technology', 79], ['UX Design', 'Design', 74], ['Project Management', 'Business', 68]), fav(['Software Engineering', 'Technology'], ['Data Science', 'Technology'], ['UX Design', 'Design'], ['Cybersecurity', 'Technology'])],
    'demo-student-2': [62, rec(['Medicine', 'Healthcare', 91], ['Nursing', 'Healthcare', 85], ['Psychology', 'Healthcare', 80], ['Teaching', 'Education', 71], ['Law', 'Legal', 64]), fav(['Medicine', 'Healthcare'], ['Psychology', 'Healthcare'])],
    'demo-student-3': [62, rec(['Mechanical Engineering', 'Engineering', 89], ['Architecture', 'Architecture', 83], ['Project Management', 'Business', 77], ['Software Engineering', 'Technology', 70], ['Financial Analysis', 'Finance', 62]), fav(['Mechanical Engineering', 'Engineering'], ['Architecture', 'Architecture'], ['Project Management', 'Business'])],
    'demo-student-5': [62, rec(['Graphic Design', 'Design', 90], ['UX Design', 'Design', 86], ['Digital Marketing', 'Marketing', 78], ['Architecture', 'Architecture', 72], ['Teaching', 'Education', 66]), fav(['Graphic Design', 'Design'], ['UX Design', 'Design'], ['Digital Marketing', 'Marketing'], ['Architecture', 'Architecture'], ['Teaching', 'Education'])],
    'demo-student-6': [48, rec(['Law', 'Legal', 82], ['Financial Analysis', 'Finance', 76], ['Project Management', 'Business', 69], ['Teaching', 'Education', 61]), fav(['Law', 'Legal'])],
    'demo-student-7': [62, rec(['Law', 'Legal', 87], ['Teaching', 'Education', 81], ['Psychology', 'Healthcare', 75], ['Digital Marketing', 'Marketing', 70], ['Financial Analysis', 'Finance', 63]), fav(['Law', 'Legal'], ['Psychology', 'Healthcare'], ['Teaching', 'Education'])],
    'demo-student-8': [35, rec(['Nursing', 'Healthcare', 80], ['Medicine', 'Healthcare', 74], ['Psychology', 'Healthcare', 66]), fav(['Nursing', 'Healthcare'])],
    'demo-student-9': [20, rec(['Teaching', 'Education', 72], ['Graphic Design', 'Design', 65]), []],
  };
  Object.entries(progress).forEach(([studentId, [answered, recommended, favourites]]) =>
    progressStore.save({ studentId, updatedAt: ago(0, 1), assessmentAnswered: answered, assessmentTotal: 62, recommended, favourites }));

  const session = (n: number, studentId: string, counselor: [number, string], title: string, days: number, status: 'Completed' | 'Upcoming') => {
    const s = students.find(x => x.id === studentId)!;
    return {
      id: 910000 + n, counselorId: counselor[0], counselorName: counselor[1], studentRef: studentId, studentName: `${s.firstName} ${s.lastName}`,
      studentImage: `https://picsum.photos/seed/${studentId}/100/100`, title, date: new Date(Date.now() + days * DAY).toISOString().slice(0, 10),
      time: ['09:00 AM', '10:30 AM', '01:00 PM'][n % 3], type: 'Virtual', link: 'https://meet.example.com/oaicc-demo', status,
    };
  };
  const funmbi: [number, string] = [1, 'Mr. Alfred Funmbi'];
  const ojo: [number, string] = [2, 'Mrs. Sarah Ojo'];
  const existing = (counselingSessionsStorage.get() as { studentRef?: string }[]).filter(x => !String(x.studentRef ?? '').startsWith('demo-student'));
  counselingSessionsStorage.save([
    ...existing,
    session(1, 'demo-student-1', funmbi, 'Career Path Review', -21, 'Completed'),
    session(2, 'demo-student-1', funmbi, 'Choosing University Courses', -8, 'Completed'),
    session(3, 'demo-student-1', funmbi, 'Tech Portfolio Feedback', 5, 'Upcoming'),
    session(4, 'demo-student-2', ojo, 'Medicine Pathways', -14, 'Completed'),
    session(5, 'demo-student-2', ojo, 'Exam Strategy', 3, 'Upcoming'),
    session(6, 'demo-student-3', funmbi, 'Engineering Roadmap', -10, 'Completed'),
    session(7, 'demo-student-5', ojo, 'Creative Careers Chat', -6, 'Completed'),
    session(8, 'demo-student-7', ojo, 'Law School Planning', -4, 'Completed'),
    session(9, 'demo-student-7', ojo, 'Debate & Public Speaking', 7, 'Upcoming'),
  ]);

  const mentor = (studentId: string, id: number, name: string, days: number) =>
    ({ id: `demo-m-${studentId}-${id}`, studentId, mentorId: id, mentorName: name, status: 'Completed' as const, createdAt: ago(days) });
  mentorSessionsStore.save([
    mentor('demo-student-1', 1, 'John Chidiebere', 18), mentor('demo-student-1', 2, 'Sarah Johnson', 9),
    mentor('demo-student-2', 3, 'Dr. Amina Yusuf', 12),
    mentor('demo-student-5', 4, 'Kemi Adewale', 7),
    mentor('demo-student-7', 5, 'Barr. Chuka Obi', 5), mentor('demo-student-7', 6, 'John Chidiebere', 2),
  ]);
}

/** Wipes the school/teacher/parent/student data and seeds the demo data again. */
export function resetDemoData() {
  ['app_school', 'app_school_classes', 'app_teachers', 'app_school_students', 'app_parents', 'app_invites', 'app_activity', 'app_inbox', 'app_student_progress', 'app_mentor_sessions', FLAG, 'app_demo_student_seeded_v1']
    .forEach(k => localStorage.removeItem(k));
  sessionStore.clear();
  seedDemoData();
}
