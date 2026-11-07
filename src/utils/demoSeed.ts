/**
 * Writes the demo dataset (src/data/demoSchool.ts) into the app's stores so the School, Teacher,
 * Parent, Student and Admin portals open fully populated. Only runs in demo mode (see demoDefaults.ts).
 * It never overwrites a school someone registered themselves; "Reset demo data" on the sign-in page
 * starts over. Browsers holding an older version of the demo are upgraded once.
 *
 * Demo logins (password Demo@12345): school@, teacher@, parent@, student@ at oaicc.demo.
 */
import { activity, inbox, invitesStore, mentorSessionsStore, parentsStore, sessionStore, studentsStore, teachersStore } from './schoolData';
import { buildDemoData, DEMO_SCHOOL_ID } from '../data/demoSchool';
import { getCrossPortalThreads, saveCrossPortalThreads } from './crossPortalMessaging';
import { defaultOaiccEvents, portalEventsStore, PORTAL_EVENT_KEYS, seedRegistrations } from './portalEvents';
import { sendInviteEmails } from './inviteEmail';
import { INITIAL_QUESTIONS } from '../data/assessmentQuestions';
import {
  adminRolesStorage, adminUsersStorage, careerCategoriesStorage, careersStorage, counselingSessionsStorage, counselorRequestsStorage,
  counselorsStorage, eventsStorage, forumCategoriesStorage, forumsStorage, interestQuizStorage, mentorsStorage, messagesStorage,
  registeredEventsStorage, savedCareersStorage, schoolClassesStorage, schoolsDirectory, schoolStorage, strengthQuizStorage, studentMessagesStorage, studentsStorage,
} from './storage';

const FLAG = 'app_demo_seeded_v2';
/** Flags written by earlier versions of the demo; cleared on reset. */
const OLD_FLAGS = ['app_demo_seeded_v1', 'app_demo_report_seeded_v1'];
/** Every store the demo writes to. Reset clears these before seeding again. */
const DEMO_KEYS = [
  'app_school', 'app_schools', 'app_school_classes', 'app_teachers', 'app_school_students', 'app_parents', 'app_invites', 'app_activity',
  'app_inbox', 'app_student_progress', 'app_mentor_sessions', 'app_email_outbox', ...PORTAL_EVENT_KEYS,
];

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
  if (localStorage.getItem(FLAG)) return false;
  const existing = schoolStorage.get();
  if (existing && existing.id !== DEMO_SCHOOL_ID) return false; // someone registered their own school: leave it alone
  if (existing) clearDemoStores(); // an older demo: replace it with the current one

  const d = buildDemoData(INITIAL_QUESTIONS.length);
  schoolsDirectory.save(d.otherSchools);
  schoolStorage.save(d.school); // also records it in the directory
  schoolClassesStorage.save(d.classes);
  teachersStore.save(d.teachers);
  parentsStore.save(d.parents);
  studentsStore.save(d.students);
  invitesStore.save(d.invites);
  activity.save(d.activity);
  inbox.save(d.inbox);
  localStorage.setItem('app_student_progress', JSON.stringify(Object.fromEntries(d.progress.map(p => [p.studentId, p]))));
  mentorSessionsStore.save(d.mentorSessions);

  // Counselling sessions share a store with the counsellor portal: keep its own sample rows, replace ours.
  const counselling = (counselingSessionsStorage.get() as { studentRef?: unknown }[]).filter(x => typeof x.studentRef !== 'string');
  counselingSessionsStorage.save([...counselling, ...d.counselling]);

  // Conversations: keep the student and counsellor sample threads, replace the demo school's.
  saveCrossPortalThreads([...d.threads, ...getCrossPortalThreads().filter(t => !t.id.startsWith('demo-thread-'))]);

  portalEventsStore.save([...defaultOaiccEvents(), ...d.schoolEvents]);
  seedRegistrations(d.registrations);
  sendInviteEmails(d.outbox.map(o => ({ to: o.to, role: o.role, schoolName: d.school.name, link: `${window.location.origin}${o.link}` })));

  localStorage.setItem(FLAG, '1');
  return true;
}

function clearDemoStores() {
  [...DEMO_KEYS, ...OLD_FLAGS].forEach(k => localStorage.removeItem(k));
  Object.keys(localStorage).filter(k => k.startsWith('app_notif_prefs_')).forEach(k => localStorage.removeItem(k));
}

/**
 * Wipes the school/teacher/parent/student data and seeds the demo again. The admin career library,
 * its categories and article reactions are restored to the sample content too.
 */
export function resetDemoData() {
  clearDemoStores();
  [FLAG, 'app_demo_student_seeded_v1', 'app_careers', 'app_careers_seeded_v1', 'app_career_categories', 'app_career_categories_seeded_v1', 'oaicc_article_reactions_v1']
    .forEach(k => localStorage.removeItem(k));
  sessionStore.clear();
  seedDemoData();
}
