/**
 * The demo dataset: "Demo Secondary School" in Lagos, run on the Nigerian system (JSS1 to SS3), with
 * teachers, students, parents, invitations, career progress, counselling and mentoring, notes,
 * notifications, conversations and events, plus a handful of other schools so the OAICC admin has a
 * platform to compare. Everything is deterministic (same data every reset) and dated relative to now.
 *
 * Demo logins (password Demo@12345): school@, teacher@, parent@ and student@ at oaicc.demo.
 */
import type {
  ActivityEntry, InboxNotification, InviteRecord, MentorSession, ParentRecord, School, SchoolClass, StudentProgress,
  StudentRecord, TeacherRecord,
} from '../types';
import { initialsAvatar, type ChatMessage, type ChatThread } from '../utils/crossPortalMessaging';
import type { PortalEvent, EventAudience } from '../utils/portalEvents';

export const DEMO_SCHOOL_ID = 'demo-school';
const DAY = 86_400_000;
const HOUR = 3_600_000;

/* ───────────── deterministic helpers ───────────── */
const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261);
/** A stable pseudo-random number in [0, 1) for a given key. */
const rand = (key: string) => (hash(key) % 10_000) / 10_000;
const pick = <T,>(key: string, list: readonly T[]) => list[Math.floor(rand(key) * list.length)];
const between = (key: string, min: number, max: number) => Math.round(min + rand(key) * (max - min));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ───────────── career catalogue used for recommendations (titles match the career library) ───────────── */
const CAREERS: Record<string, [string, string][]> = {
  tech: [['Software Engineer', 'Information technology'], ['Data Scientist', 'Information technology'], ['Cybersecurity Analyst', 'Information technology'], ['UX/UI Designer', 'Creative arts and design'], ['Digital Marketer', 'Marketing, advertising and PR']],
  health: [['Medical Doctor', 'Healthcare'], ['Pharmacist', 'Science and pharmaceuticals'], ['Registered Nurse', 'Healthcare'], ['Social Worker', 'Social care'], ['Agricultural Scientist', 'Environment and agriculture']],
  engineering: [['Civil Engineer', 'Engineering and manufacturing'], ['Mechanical Engineer', 'Engineering and manufacturing'], ['Architect', 'Property and construction'], ['Airline Pilot', 'Transport and logistics'], ['Software Engineer', 'Information technology']],
  business: [['Chartered Accountant', 'Accountancy, banking and finance'], ['Human Resources Manager', 'Recruitment and HR'], ['Digital Marketer', 'Marketing, advertising and PR'], ['Hotel Manager', 'Hospitality and events management'], ['Lawyer', 'Law']],
  humanities: [['Lawyer', 'Law'], ['Journalist', 'Media and internet'], ['Secondary School Teacher', 'Teacher training and education'], ['Social Worker', 'Social care'], ['Human Resources Manager', 'Recruitment and HR']],
  creative: [['UX/UI Designer', 'Creative arts and design'], ['Architect', 'Property and construction'], ['Journalist', 'Media and internet'], ['Digital Marketer', 'Marketing, advertising and PR'], ['Hotel Manager', 'Hospitality and events management']],
};
const PATHS = Object.keys(CAREERS);

/* ───────────── the demo school ───────────── */
interface StudentSpec {
  first: string; last: string; cls: string;
  /** invited = invite not yet accepted; new = joined but not onboarded. */
  state?: 'invited' | 'new';
  email?: string;
  path?: string;
}

const CLASSES = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'] as const;
const classId = (name: string) => `demo-class-${name.toLowerCase()}`;

const ROSTER: StudentSpec[] = [
  // JSS1 — new intake this session
  { first: 'Aisha', last: 'Musa', cls: 'JSS1' }, { first: 'Daniel', last: 'Etuk', cls: 'JSS1' },
  { first: 'Kemi', last: 'Adebayo', cls: 'JSS1', state: 'invited' }, { first: 'Zainab', last: 'Bello', cls: 'JSS1' },
  { first: 'Chiamaka', last: 'Obi', cls: 'JSS1' }, { first: 'Samuel', last: 'Ojo', cls: 'JSS1' },
  { first: 'Fatima', last: 'Abdullahi', cls: 'JSS1' }, { first: 'Tobi', last: 'Alabi', cls: 'JSS1', state: 'new' },
  // JSS2
  { first: 'Ifeoma', last: 'Okafor', cls: 'JSS2' }, { first: 'Yusuf', last: 'Garba', cls: 'JSS2' },
  { first: 'Esther', last: 'Bassey', cls: 'JSS2' }, { first: 'David', last: 'Okon', cls: 'JSS2' },
  { first: 'Halima', last: 'Sani', cls: 'JSS2' }, { first: 'Victor', last: 'Nwosu', cls: 'JSS2' },
  { first: 'Precious', last: 'Edet', cls: 'JSS2', state: 'invited' }, { first: 'Michael', last: 'Ajayi', cls: 'JSS2' },
  // JSS3 — choosing SS subjects this year
  { first: 'Favour', last: 'Aina', cls: 'JSS3', path: 'creative' }, { first: 'Tosin', last: 'Adeyemi', cls: 'JSS3', path: 'humanities' },
  { first: 'Blessing', last: 'Udo', cls: 'JSS3' }, { first: 'Abdullahi', last: 'Usman', cls: 'JSS3' },
  { first: 'Chisom', last: 'Eze', cls: 'JSS3' }, { first: 'Joshua', last: 'Akpan', cls: 'JSS3' },
  { first: 'Mariam', last: 'Lawal', cls: 'JSS3', state: 'new' }, { first: 'Femi', last: 'Ogunleye', cls: 'JSS3' },
  // SS1
  { first: 'Gbenga', last: 'Aina', cls: 'SS1', path: 'humanities' }, { first: 'Amaka', last: 'Nwosu', cls: 'SS1', path: 'health' },
  { first: 'Hauwa', last: 'Bello', cls: 'SS1' }, { first: 'Uche', last: 'Okeke', cls: 'SS1' },
  { first: 'Tolu', last: 'Bakare', cls: 'SS1' }, { first: 'Grace', last: 'Effiong', cls: 'SS1' },
  { first: 'Sadiq', last: 'Ibrahim', cls: 'SS1' }, { first: 'Kelechi', last: 'Uba', cls: 'SS1', state: 'invited' },
  // SS2
  { first: 'Bolu', last: 'Ahmed', cls: 'SS2', email: 'student@oaicc.demo', path: 'tech' }, { first: 'Ngozi', last: 'Nnaji', cls: 'SS2', path: 'health' },
  { first: 'Ibrahim', last: 'Musa', cls: 'SS2', path: 'engineering' }, { first: 'Chidi', last: 'Okeke', cls: 'SS2', state: 'new' },
  { first: 'Damilola', last: 'Fashola', cls: 'SS2' }, { first: 'Nneka', last: 'Chukwu', cls: 'SS2' },
  { first: 'Emmanuel', last: 'Ekpo', cls: 'SS2' }, { first: 'Zara', last: 'Mohammed', cls: 'SS2' },
  // SS3 — WAEC / JAMB year
  { first: 'Chinedu', last: 'Okafor', cls: 'SS3', path: 'engineering' }, { first: 'Kunle', last: 'Adeyemi', cls: 'SS3', path: 'business' },
  { first: 'Adaora', last: 'Igwe', cls: 'SS3' }, { first: 'Emeka', last: 'Obi', cls: 'SS3' },
  { first: 'Rukayat', last: 'Salami', cls: 'SS3' }, { first: 'Ese', last: 'Omoregie', cls: 'SS3' },
  { first: 'Tunde', last: 'Fashola', cls: 'SS3' }, { first: 'Amina', last: 'Danjuma', cls: 'SS3', state: 'new' },
];

const studentId = (s: StudentSpec) => (s.email === 'student@oaicc.demo' ? 'demo-student-1' : `demo-student-${slug(`${s.first} ${s.last}`)}`);

interface TeacherSpec { id: string; first: string; last: string; email?: string; subject: string; classes: string[]; state?: 'invited'; bio?: string; joined: number }
const TEACHERS: TeacherSpec[] = [
  { id: 'demo-teacher-1', first: 'Uzo', last: 'Kelechi', email: 'teacher@oaicc.demo', subject: 'Mathematics', classes: ['SS2', 'SS3'], joined: 290, bio: 'Mathematics teacher with 8 years of experience. Form teacher for SS2 and SS3, runs the STEM club and coordinates WAEC preparation.' },
  { id: 'demo-teacher-folake', first: 'Folake', last: 'Davies', subject: 'English Language', classes: ['SS1'], joined: 285, bio: 'English and Literature teacher who runs the debate society and the school magazine.' },
  { id: 'demo-teacher-adaeze', first: 'Adaeze', last: 'Nwankwo', subject: 'Basic Science', classes: ['JSS1'], joined: 70, bio: 'Basic Science teacher focused on helping new JSS1 students settle in and explore science.' },
  { id: 'demo-teacher-ibrahim', first: 'Ibrahim', last: 'Lawal', subject: 'Social Studies', classes: ['JSS2'], joined: 240, bio: 'Social Studies and Civic Education teacher; school community-service coordinator.' },
  { id: 'demo-teacher-grace', first: 'Grace', last: 'Etim', subject: 'Business Studies', classes: ['JSS3'], joined: 230, bio: 'Business Studies teacher guiding JSS3 students through their SS subject choices.' },
  { id: 'demo-teacher-segun', first: 'Segun', last: 'Adeleke', subject: 'Biology', classes: [], joined: 200, bio: 'Biology teacher for SS1 to SS3 science classes; leads the health and environment club.' },
  { id: 'demo-teacher-halima', first: 'Halima', last: 'Yusuf', subject: 'Computer Studies', classes: [], joined: 120, bio: 'Computer Studies teacher who introduced coding clubs for JSS and SS students.' },
  { id: 'demo-teacher-tunde', first: 'Tunde', last: 'Bello', subject: 'Physics', classes: [], state: 'invited', joined: 3 },
];

interface ParentSpec { id: string; first: string; last: string; email?: string; profession: string; children: string[]; state?: 'invited'; location?: string }
const PARENTS: ParentSpec[] = [
  { id: 'demo-parent-1', first: 'Funke', last: 'Aina', email: 'parent@oaicc.demo', profession: 'Pharmacist', children: ['Favour Aina', 'Gbenga Aina'], location: 'Lekki, Lagos' },
  { id: 'demo-parent-ahmed', first: 'Bisi', last: 'Ahmed', profession: 'Accountant', children: ['Bolu Ahmed'] },
  { id: 'demo-parent-okafor', first: 'Emeka', last: 'Okafor', profession: 'Civil Engineer', children: ['Ifeoma Okafor', 'Chinedu Okafor'] },
  { id: 'demo-parent-musa', first: 'Abubakar', last: 'Musa', profession: 'Banker', children: ['Aisha Musa', 'Ibrahim Musa'], location: 'Ikoyi, Lagos' },
  { id: 'demo-parent-adeyemi', first: 'Yetunde', last: 'Adeyemi', profession: 'Lawyer', children: ['Tosin Adeyemi', 'Kunle Adeyemi'] },
  { id: 'demo-parent-nwosu', first: 'Chinwe', last: 'Nwosu', profession: 'Medical Doctor', children: ['Amaka Nwosu', 'Victor Nwosu'] },
  { id: 'demo-parent-okeke', first: 'Okey', last: 'Okeke', profession: 'Business Owner', children: ['Uche Okeke', 'Chidi Okeke'] },
  { id: 'demo-parent-fashola', first: 'Bola', last: 'Fashola', profession: 'Architect', children: ['Damilola Fashola', 'Tunde Fashola'] },
  { id: 'demo-parent-obi', first: 'Ifeanyi', last: 'Obi', profession: 'University Lecturer', children: ['Chiamaka Obi', 'Emeka Obi'] },
  { id: 'demo-parent-bello', first: 'Sani', last: 'Bello', profession: 'Civil Servant', children: ['Zainab Bello', 'Hauwa Bello'] },
  { id: 'demo-parent-etuk', first: 'Iniobong', last: 'Etuk', profession: 'Nurse', children: ['Daniel Etuk'] },
  { id: 'demo-parent-ojo', first: 'Adewale', last: 'Ojo', profession: 'Software Developer', children: ['Samuel Ojo'] },
  { id: 'demo-parent-bassey', first: 'Mfon', last: 'Bassey', profession: 'Teacher', children: ['Esther Bassey'] },
  { id: 'demo-parent-garba', first: 'Hadiza', last: 'Garba', profession: 'Pharmacist', children: ['Yusuf Garba'], location: 'Surulere, Lagos' },
  { id: 'demo-parent-udo', first: 'Joy', last: 'Udo', profession: 'Entrepreneur', children: ['Blessing Udo'] },
  { id: 'demo-parent-omoregie', first: 'Osaro', last: 'Omoregie', profession: 'Airline Pilot', children: ['Ese Omoregie'] },
  { id: 'demo-parent-igwe', first: 'Ijeoma', last: 'Igwe', profession: 'Banker', children: ['Adaora Igwe'] },
  { id: 'demo-parent-bakare', first: 'Funmi', last: 'Bakare', profession: 'Fashion Designer', children: ['Tolu Bakare'], state: 'invited' },
];

/* ───────────── other schools on the platform (for the OAICC admin) ───────────── */
interface OtherSchool { id: string; name: string; location: string; students: number; teachers: number; engagement: number; joined: number; types: string[] }
const OTHER_SCHOOLS: OtherSchool[] = [
  { id: 'school-greenfield', name: 'Greenfield College', location: 'Wuse II, Abuja', students: 64, teachers: 7, engagement: 0.45, joined: 330, types: ['Junior Secondary', 'Senior Secondary'] },
  { id: 'school-kings-heritage', name: 'Kings Heritage Academy', location: 'GRA, Port Harcourt', students: 38, teachers: 5, engagement: 0.85, joined: 260, types: ['Senior Secondary'] },
  { id: 'school-lakeside', name: 'Lakeside International School', location: 'Bodija, Ibadan', students: 29, teachers: 4, engagement: 0.7, joined: 190, types: ['Junior Secondary', 'Senior Secondary'] },
  { id: 'school-unity-model', name: 'Unity Model College', location: 'Nassarawa, Kano', students: 22, teachers: 3, engagement: 0.3, joined: 120, types: ['Junior Secondary', 'Senior Secondary'] },
  { id: 'school-bright-star', name: 'Bright Star Schools', location: 'Independence Layout, Enugu', students: 12, teachers: 2, engagement: 0.6, joined: 35, types: ['Primary', 'Junior Secondary'] },
];
const FIRST = ['Ade', 'Bisola', 'Chuka', 'Dayo', 'Ebere', 'Folarin', 'Gift', 'Habib', 'Ikenna', 'Jumoke', 'Kehinde', 'Lami', 'Musa', 'Nkechi', 'Obinna', 'Peace', 'Rashida', 'Seun', 'Temi', 'Ugochi', 'Wale', 'Yemi', 'Zainab', 'Bashir', 'Chioma', 'Efe', 'Funmilayo', 'Ibukun', 'Kamsi', 'Onyeka'];
const LAST = ['Abiodun', 'Bankole', 'Chukwuma', 'Danladi', 'Egbe', 'Fagbemi', 'Gambo', 'Ihejirika', 'Jimoh', 'Kalu', 'Lawson', 'Mbah', 'Nwachukwu', 'Ogundipe', 'Peters', 'Raji', 'Shehu', 'Tijani', 'Umeh', 'Yakubu'];

export interface DemoData {
  school: School;
  otherSchools: School[];
  classes: SchoolClass[];
  teachers: TeacherRecord[];
  parents: ParentRecord[];
  students: StudentRecord[];
  invites: InviteRecord[];
  activity: ActivityEntry[];
  inbox: InboxNotification[];
  progress: StudentProgress[];
  mentorSessions: MentorSession[];
  /** Rows for the counselling-sessions store (its legacy shape). */
  counselling: Record<string, unknown>[];
  threads: ChatThread[];
  schoolEvents: PortalEvent[];
  registrations: { eventId: string; role: EventAudience; userId: string }[];
  outbox: { to: string; role: 'teacher' | 'student' | 'parent'; link: string }[];
}

export function buildDemoData(questionTotal: number, now = Date.now()): DemoData {
  const ago = (days: number, hours = 0) => new Date(now - days * DAY - hours * HOUR).toISOString();
  const atDay = (dayOffset: number, hour: number, minute = 0) => { const d = new Date(now + dayOffset * DAY); d.setHours(hour, minute, 0, 0); return d.toISOString(); };

  /* ── school + classes ── */
  const school: School = {
    id: DEMO_SCHOOL_ID, name: 'Demo Secondary School', location: 'Lekki, Lagos, Nigeria',
    schoolTypes: ['Junior Secondary', 'Senior Secondary'], expectedClasses: '1 - 10', expectedStudents: '100 - 400',
    adminFirstName: 'Chioma', adminLastName: 'Eze', adminEmail: 'school@oaicc.demo', phone: '+234 802 555 0100',
    about: 'A co-educational day secondary school in Lekki running JSS1 to SS3. We use OAICC to give every student a career plan before WAEC and JAMB, and to keep parents involved along the way.',
    createdAt: ago(300),
  };
  const classTeacher = new Map<string, string>();
  TEACHERS.forEach(t => t.classes.forEach(c => classTeacher.set(c, t.id)));
  const classes: SchoolClass[] = CLASSES.map((name, i) => ({ id: classId(name), schoolId: DEMO_SCHOOL_ID, name, teacherId: classTeacher.get(name), createdAt: ago(298 - i) }));

  /* ── teachers ── */
  const teachers: TeacherRecord[] = TEACHERS.map((t, i) => ({
    id: t.id, schoolId: DEMO_SCHOOL_ID, firstName: t.state === 'invited' ? '' : t.first, lastName: t.state === 'invited' ? '' : t.last,
    email: t.email ?? `${t.first}.${t.last}@oaicc.demo`.toLowerCase(), subject: t.subject, bio: t.bio,
    phone: t.state === 'invited' ? undefined : `+234 80${3 + (i % 6)} 555 01${10 + i}`, location: 'Lagos, Nigeria',
    status: t.state === 'invited' ? 'invited' : 'active', onboarded: t.state !== 'invited', createdAt: ago(t.joined),
  }));

  /* ── parents ── */
  const studentIdByName = new Map(ROSTER.map(s => [`${s.first} ${s.last}`, studentId(s)]));
  const parentIdsOf = new Map<string, string[]>();
  PARENTS.forEach(p => p.children.forEach(c => { const sid = studentIdByName.get(c)!; parentIdsOf.set(sid, [...(parentIdsOf.get(sid) ?? []), p.id]); }));
  const parents: ParentRecord[] = PARENTS.map((p, i) => ({
    id: p.id, schoolId: DEMO_SCHOOL_ID, firstName: p.state === 'invited' ? '' : p.first, lastName: p.state === 'invited' ? '' : p.last,
    email: p.email ?? `${p.first}.${p.last}@oaicc.demo`.toLowerCase(), profession: p.profession,
    phone: p.state === 'invited' ? undefined : `+234 80${5 + (i % 4)} 555 02${10 + i}`, location: p.location ?? 'Lagos, Nigeria',
    status: p.state === 'invited' ? 'invited' : 'active', onboarded: p.state !== 'invited', createdAt: ago(p.state === 'invited' ? 4 : between(`pj-${p.id}`, 20, 240)),
  }));

  /* ── students of the demo school ── */
  const joinedDays = (s: StudentSpec) => {
    if (s.state === 'invited') return between(`inv-${s.first}`, 1, 6);
    if (s.cls === 'JSS1') return between(`j-${s.first}${s.last}`, 6, 62); // new session intake (September)
    if (s.state === 'new') return between(`j-${s.first}${s.last}`, 2, 12);
    return between(`j-${s.first}${s.last}`, 14, 285);
  };
  const students: StudentRecord[] = ROSTER.map(s => {
    const id = studentId(s);
    const days = s.email === 'student@oaicc.demo' ? 240 : joinedDays(s);
    const invited = s.state === 'invited';
    // Most students signed in within the last month; a few have gone quiet.
    const loginDays = invited ? undefined : rand(`quiet-${id}`) < 0.18 ? between(`lq-${id}`, 33, 70) : between(`l-${id}`, 0, 20);
    return {
      id, schoolId: DEMO_SCHOOL_ID, classId: classId(s.cls), firstName: invited ? '' : s.first, lastName: invited ? '' : s.last,
      email: s.email ?? `${s.first}.${s.last}@oaicc.demo`.toLowerCase(), parentIds: parentIdsOf.get(id) ?? [],
      phone: invited ? undefined : `+234 81${between(`ph-${id}`, 0, 9)} 555 ${String(between(`pn-${id}`, 1000, 9999))}`,
      status: invited ? 'invited' : 'active', onboarded: !invited && s.state !== 'new', createdAt: ago(days),
      lastLoginAt: loginDays === undefined ? undefined : ago(Math.min(loginDays, days), between(`lh-${id}`, 0, 9)),
    };
  });
  // A child the demo parent invited directly; they haven't joined a school yet.
  students.push({ id: 'demo-student-ayo-aina', firstName: '', lastName: '', email: 'ayo.aina@oaicc.demo', parentIds: ['demo-parent-1'], status: 'invited', onboarded: false, createdAt: ago(2) });

  /* ── other schools, their staff, students and parents ── */
  const otherSchools: School[] = [];
  const otherStudents: StudentRecord[] = [];
  const otherTeachers: TeacherRecord[] = [];
  const otherParents: ParentRecord[] = [];
  OTHER_SCHOOLS.forEach(os => {
    const [adminFirst, adminLast] = [pick(`af-${os.id}`, FIRST), pick(`al-${os.id}`, LAST)];
    otherSchools.push({
      id: os.id, name: os.name, location: `${os.location}, Nigeria`, schoolTypes: os.types, expectedClasses: '1 - 10', expectedStudents: '1 - 100',
      adminFirstName: adminFirst, adminLastName: adminLast, adminEmail: `admin@${slug(os.name)}.edu.ng`, createdAt: ago(os.joined),
    });
    for (let i = 0; i < os.teachers; i++) {
      const [f, l] = [pick(`tf-${os.id}-${i}`, FIRST), pick(`tl-${os.id}-${i}`, LAST)];
      otherTeachers.push({ id: `${os.id}-teacher-${i}`, schoolId: os.id, firstName: f, lastName: l, email: `${slug(f)}.${slug(l)}.${i}@${slug(os.name)}.edu.ng`, subject: pick(`ts-${os.id}-${i}`, ['Mathematics', 'English Language', 'Biology', 'Economics', 'Chemistry']), status: 'active', onboarded: true, createdAt: ago(between(`tj-${os.id}-${i}`, Math.min(os.joined, 20), os.joined)) });
    }
    for (let i = 0; i < os.students; i++) {
      const key = `${os.id}-${i}`;
      const [f, l] = [pick(`sf-${key}`, FIRST), pick(`sl-${key}`, LAST)];
      const invited = rand(`si-${key}`) < 0.12;
      const days = invited ? between(`sd-${key}`, 1, 14) : between(`sd-${key}`, 1, os.joined);
      const engaged = rand(`se-${key}`) < os.engagement;
      const id = `${os.id}-student-${i}`;
      let parentIds: string[] = [];
      if (!invited && rand(`sp-${key}`) < 0.5) {
        const pid = `${os.id}-parent-${i}`;
        parentIds = [pid];
        otherParents.push({ id: pid, schoolId: os.id, firstName: pick(`pf-${key}`, FIRST), lastName: l, email: `parent.${slug(l)}.${i}@${slug(os.name)}.ng`, status: 'active', onboarded: true, createdAt: ago(Math.max(1, days - 3)) });
      }
      otherStudents.push({
        id, schoolId: os.id, firstName: invited ? '' : f, lastName: invited ? '' : l, email: `${slug(f)}.${slug(l)}.${i}@${slug(os.name)}.ng`,
        parentIds, status: invited ? 'invited' : 'active', onboarded: !invited && rand(`so-${key}`) < 0.9, createdAt: ago(days),
        lastLoginAt: invited ? undefined : ago(Math.min(days, engaged ? between(`sl-${key}`, 0, 14) : between(`sl-${key}`, 25, 90))),
      });
    }
  });
  // Students who signed up on their own, without a school.
  const independents: StudentRecord[] = Array.from({ length: 14 }, (_, i) => {
    const [f, l] = [pick(`if-${i}`, FIRST), pick(`il-${i}`, LAST)];
    const days = between(`id-${i}`, 1, 200);
    return { id: `independent-student-${i}`, firstName: f, lastName: l, email: `${slug(f)}.${slug(l)}.${i}@gmail.com`, parentIds: [], status: 'active', onboarded: true, createdAt: ago(days), lastLoginAt: ago(Math.min(days, between(`il2-${i}`, 0, 45))) };
  });

  const allStudents = [...students, ...otherStudents, ...independents];

  /* ── career progress for every active student ── */
  const progress: StudentProgress[] = [];
  allStudents.filter(s => s.status === 'active').forEach(s => {
    const spec = ROSTER.find(r => studentId(r) === s.id);
    const otherSchool = OTHER_SCHOOLS.find(o => o.id === s.schoolId);
    const appetite = otherSchool ? otherSchool.engagement : 0.7;
    let answered: number;
    if (s.id === 'demo-student-1') answered = 40; // matches the student portal's own demo answers
    else if (!s.onboarded) answered = between(`a-${s.id}`, 0, 6);
    else if (rand(`done-${s.id}`) < appetite * 0.55) answered = questionTotal;
    else answered = between(`a-${s.id}`, 4, questionTotal - 4);
    const path = spec?.path ?? pick(`path-${s.id}`, PATHS);
    const careers = CAREERS[path];
    const recommended = answered >= 10
      ? careers.map(([title, category], i) => ({ title, category, match: Math.max(48, 92 - i * between(`m${i}-${s.id}`, 3, 7) - between(`mo-${s.id}`, 0, 8)) }))
      : [];
    const favCount = answered >= 10 ? between(`f-${s.id}`, 0, 4) : 0;
    const favourites = careers.slice(0, favCount).map(([title, category]) => ({ title, category }));
    if (rand(`extra-${s.id}`) < 0.25 && favCount > 0) {
      const [title, category] = pick(`xf-${s.id}`, CAREERS[pick(`xp-${s.id}`, PATHS)]);
      favourites.push({ title, category });
    }
    progress.push({ studentId: s.id, updatedAt: s.lastLoginAt ?? s.createdAt, assessmentAnswered: answered, assessmentTotal: questionTotal, recommended, favourites: dedupe(favourites) });
  });

  /* ── counselling (shape of the counselling-sessions store) and mentoring ── */
  const counsellors: [number, string][] = [[1, 'Mr. Alfred Funmbi'], [2, 'Mrs. Janet Okon']];
  const topics = ['Career Path Review', 'Choosing University Courses', 'Subject Selection for SS1', 'WAEC & JAMB Planning', 'Exploring STEM Careers', 'Building a Portfolio', 'Scholarship Options'];
  const counselling: Record<string, unknown>[] = [];
  const mentorSessions: MentorSession[] = [];
  const mentors: [number, string][] = [[5, 'John Chidiebere'], [2, 'Amanda Lance'], [9, 'Elena Rodriguez'], [10, 'David Smith'], [8, 'Michael Chen'], [11, 'Priya Sharma']];
  let sessionN = 0;
  allStudents.filter(s => s.status === 'active' && s.onboarded).forEach(s => {
    const otherSchool = OTHER_SCHOOLS.find(o => o.id === s.schoolId);
    const appetite = otherSchool ? otherSchool.engagement : 0.75;
    const name = `${s.firstName} ${s.lastName}`;
    const nCounsel = s.id === 'demo-student-1' ? 3 : rand(`c-${s.id}`) < appetite * 0.7 ? between(`cn-${s.id}`, 1, 3) : 0;
    for (let k = 0; k < nCounsel; k++) {
      const upcoming = k === nCounsel - 1 && rand(`cu-${s.id}`) < 0.35;
      const [cid, cname] = counsellors[(hash(s.id) + k) % 2];
      const dayOffset = upcoming ? between(`cd-${s.id}-${k}`, 1, 12) : -between(`cd-${s.id}-${k}`, 3, 90);
      counselling.push({
        id: 920000 + ++sessionN, counselorId: cid, counselorName: cname, studentRef: s.id, studentName: name,
        studentImage: `https://picsum.photos/seed/${s.id}/100/100`, title: topics[(hash(s.id) + k) % topics.length],
        date: new Date(now + dayOffset * DAY).toISOString().slice(0, 10), time: ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM'][k % 4],
        type: 'Virtual', link: 'https://meet.example.com/oaicc-demo', status: upcoming ? 'Upcoming' : 'Completed',
      });
    }
    const nMentor = s.id === 'demo-student-1' ? 2 : rand(`mt-${s.id}`) < appetite * 0.5 ? between(`mtn-${s.id}`, 1, 3) : 0;
    for (let k = 0; k < nMentor; k++) {
      const [mid, mname] = mentors[(hash(s.id) + k) % mentors.length];
      mentorSessions.push({ id: `demo-m-${s.id}-${k}`, studentId: s.id, mentorId: mid, mentorName: mname, status: 'Completed', createdAt: ago(between(`md-${s.id}-${k}`, 2, 80)) });
    }
  });

  /* ── invitations still waiting to be accepted ── */
  const schoolBy = { role: 'school' as const, userId: DEMO_SCHOOL_ID };
  const invites: InviteRecord[] = [
    ...teachers.filter(t => t.status === 'invited').map(t => invite(t.id, 'teacher', t.email, schoolBy, t.createdAt)),
    ...parents.filter(p => p.status === 'invited').map(p => invite(p.id, 'parent', p.email, schoolBy, p.createdAt)),
    ...students.filter(s => s.status === 'invited' && s.schoolId).map(s => invite(s.id, 'student', s.email, schoolBy, s.createdAt, s.classId)),
    invite('demo-student-ayo-aina', 'student', 'ayo.aina@oaicc.demo', { role: 'parent', userId: 'demo-parent-1' }, ago(2)),
    ...otherStudents.filter(s => s.status === 'invited').map(s => invite(s.id, 'student', s.email, { role: 'school', userId: s.schoolId! }, s.createdAt)),
  ];
  const outbox = invites.filter(i => i.invitedBy.userId === DEMO_SCHOOL_ID).map(i => ({ to: i.email, role: i.role, link: `/invite/${i.token}` }));

  /* ── activity feed and notes ── */
  const activity: ActivityEntry[] = [];
  let n = 0;
  const add = (sid: string, type: ActivityEntry['type'], title: string, at: string, extra: Partial<ActivityEntry> = {}) =>
    activity.push({ id: `demo-a-${++n}`, studentId: sid, type, title, createdAt: at, ...extra });
  const nameOfClass = (id?: string) => classes.find(c => c.id === id)?.name ?? 'a class';
  allStudents.forEach(s => {
    const t = new Date(s.createdAt).getTime();
    const at = (h: number) => new Date(Math.min(now, t + h * HOUR)).toISOString();
    if (s.status === 'invited') { if (s.classId) add(s.id, 'class', `Added to ${nameOfClass(s.classId)}`, at(0)); if (s.parentIds.length) add(s.id, 'parent', 'Linked to a parent account', at(0)); return; }
    add(s.id, 'joined', s.schoolId ? 'Accepted the invitation and created an account' : 'Created an account', at(0));
    if (s.classId) add(s.id, 'class', `Added to ${nameOfClass(s.classId)}`, at(1));
    if (s.parentIds.length) add(s.id, 'parent', 'Linked to a parent account', at(6));
    if (s.onboarded) add(s.id, 'onboarding', 'Completed onboarding', at(20));
  });
  const note = (sid: string, author: string, role: string, text: string, days: number) =>
    add(sid, 'note', `${author} left a comment`, ago(days), { author, authorRole: role, text });
  const S = (name: string) => studentIdByName.get(name)!;
  note(S('Favour Aina'), 'Grace Etim', 'Teacher', 'Favour has strong design instincts. Her poster for Business Studies was the best in JSS3. Worth encouraging her towards Visual Arts in SS1.', 6);
  note(S('Favour Aina'), 'Funke Aina', 'Parent', "Thank you! She has been talking about UX design at home. We'll look at the subject options together.", 5);
  note(S('Favour Aina'), 'Chioma Eze', 'School', 'Favour is on the shortlist for the JSS3 design showcase at Career Day.', 2);
  note(S('Gbenga Aina'), 'Folake Davies', 'Teacher', 'Gbenga writes thoughtful essays and led the SS1 debate team to the semi-finals.', 8);
  note('demo-student-1', 'Uzo Kelechi', 'Teacher', 'Bolu is leading the SS2 STEM club robotics project. Excellent initiative and very consistent with the career assessment.', 4);
  note('demo-student-1', 'Bisi Ahmed', 'Parent', 'Please let me know if he needs extra Further Mathematics lessons before the exams.', 3);
  note(S('Chinedu Okafor'), 'Uzo Kelechi', 'Teacher', 'Chinedu is on track for an A1 in Mathematics. He should book a counselling session about Engineering courses before the JAMB registration.', 9);
  note(S('Chinedu Okafor'), 'Chioma Eze', 'School', 'Chinedu has been nominated for the state Mathematics Olympiad.', 1);
  note(S('Kunle Adeyemi'), 'Yetunde Adeyemi', 'Parent', 'Kunle is torn between Accounting and Law. Could the counsellor help him compare both?', 7);
  note(S('Amaka Nwosu'), 'Folake Davies', 'Teacher', 'Amaka volunteers at the school clinic and is clearly drawn to healthcare careers.', 11);
  note(S('Chidi Okeke'), 'Uzo Kelechi', 'Teacher', "Chidi hasn't completed his onboarding yet. I'll walk him through it in class this week.", 2);
  note(S('Ngozi Nnaji'), 'Segun Adeleke', 'Teacher', 'Ngozi scored the highest in the SS2 Biology test. Medicine is a realistic goal.', 12);
  note(S('Tosin Adeyemi'), 'Grace Etim', 'Teacher', 'Tosin argues well and enjoys Civic Education. Humanities track looks like a good fit for SS1.', 10);
  note(S('Ibrahim Musa'), 'Abubakar Musa', 'Parent', "Ibrahim wants to study Mechanical Engineering. We'd love advice on universities with strong programmes.", 6);
  activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  /* ── in-app notifications for the demo accounts ── */
  let nn = 0;
  const notif = (role: InboxNotification['recipientRole'], id: string, title: string, body: string, days: number, read: boolean, link?: string): InboxNotification =>
    ({ id: `demo-n-${++nn}`, recipientRole: role, recipientId: id, title, body, link, read, createdAt: ago(days) });
  const inbox: InboxNotification[] = [
    notif('school', DEMO_SCHOOL_ID, 'New parent note', 'Ibrahim Musa\'s parent asked about Engineering programmes.', 0.2, false, `/school/student/${S('Ibrahim Musa')}`),
    notif('school', DEMO_SCHOOL_ID, 'New student joined', 'Chidi Okeke accepted your invitation and joined SS2.', 0.4, false, `/school/student/${S('Chidi Okeke')}`),
    notif('school', DEMO_SCHOOL_ID, 'Invitations pending', '3 students, 1 teacher and 1 parent have not accepted their invitations yet.', 1, false, '/school/dashboard'),
    notif('school', DEMO_SCHOOL_ID, 'New teacher joined', 'Adaeze Nwankwo accepted your invitation.', 9, true, '/school/teachers'),
    notif('school', DEMO_SCHOOL_ID, 'Class assigned', 'Adaeze Nwankwo is now the form teacher for JSS1.', 9, true, `/school/classes/${classId('JSS1')}`),
    notif('teacher', 'demo-teacher-1', 'New parent note', 'Bisi Ahmed left a note about Bolu Ahmed.', 0.3, false, '/teacher/student/demo-student-1'),
    notif('teacher', 'demo-teacher-1', 'New school note', 'Chioma Eze left a note about Chinedu Okafor.', 1, false, `/teacher/student/${S('Chinedu Okafor')}`),
    notif('teacher', 'demo-teacher-1', 'New student in your class', 'Chidi Okeke joined SS2.', 3, true, `/teacher/student/${S('Chidi Okeke')}`),
    notif('teacher', 'demo-teacher-1', 'Class assigned', 'You have been assigned to SS3.', 120, true, `/teacher/class/${classId('SS3')}`),
    notif('teacher', 'demo-teacher-1', 'Class assigned', 'You have been assigned to SS2.', 280, true, `/teacher/class/${classId('SS2')}`),
    notif('teacher', 'demo-teacher-grace', 'New parent note', 'Funke Aina left a note about Favour Aina.', 5, false, `/teacher/student/${S('Favour Aina')}`),
    notif('parent', 'demo-parent-1', 'New comment on your child', "Chioma Eze commented on Favour Aina's profile.", 2, false, `/parent/dashboard/child/${S('Favour Aina')}`),
    notif('parent', 'demo-parent-1', 'New comment on your child', "Grace Etim commented on Favour Aina's profile.", 6, true, `/parent/dashboard/child/${S('Favour Aina')}`),
    notif('parent', 'demo-parent-1', 'New comment on your child', "Folake Davies commented on Gbenga Aina's profile.", 8, true, `/parent/dashboard/child/${S('Gbenga Aina')}`),
    notif('parent', 'demo-parent-ahmed', 'New comment on your child', "Uzo Kelechi commented on Bolu Ahmed's profile.", 4, false, '/parent/dashboard/child/demo-student-1'),
    notif('student', 'demo-student-1', 'Counselling session booked', 'Your session "Building a Portfolio" with Mr. Alfred Funmbi is coming up.', 1, false),
    notif('student', 'demo-student-1', 'Added to a class', 'You were added to SS2.', 240, true),
    notif('student', 'demo-student-1', 'Parent linked', 'Bisi Ahmed linked their account to yours.', 239, true),
  ];

  /* ── conversations between the school, teachers and parents ── */
  const who = (id: string, name: string, role: 'school' | 'teacher' | 'parent', online = false) => ({ id, name, role, online });
  const P = {
    school: who(DEMO_SCHOOL_ID, school.name, 'school', true),
    uzo: who('demo-teacher-1', 'Uzo Kelechi', 'teacher', true),
    folake: who('demo-teacher-folake', 'Folake Davies', 'teacher'),
    grace: who('demo-teacher-grace', 'Grace Etim', 'teacher', true),
    funke: who('demo-parent-1', 'Funke Aina', 'parent', true),
    bisi: who('demo-parent-ahmed', 'Bisi Ahmed', 'parent'),
    yetunde: who('demo-parent-adeyemi', 'Yetunde Adeyemi', 'parent'),
    emeka: who('demo-parent-okafor', 'Emeka Okafor', 'parent'),
  };
  type Who = typeof P[keyof typeof P];
  type Extra = Pick<ChatMessage, 'kind' | 'kudos' | 'reactions'>;
  const thread = (a: Who, b: Who, msgs: ([Who, string, number] | [Who, string, number, Extra])[], unreadFor?: Who): ChatThread => {
    const messages = msgs.map(([from, text, hoursAgo, extra], i) => {
      const ts = now - hoursAgo * HOUR;
      return { id: `demo-msg-${a.id}-${b.id}-${i}`, senderId: from.id, senderRole: from.role, senderName: from.name, text, time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: ts, status: (i === msgs.length - 1 && unreadFor ? 'delivered' : 'read') as 'delivered' | 'read', ...extra };
    });
    const last = messages[messages.length - 1];
    return {
      id: `demo-thread-${a.id}-${b.id}`, participants: [a, b].map(p => ({ ...p, image: initialsAvatar(p.name) })), messages,
      lastMessage: last.text, lastMessageTimestamp: last.timestamp, lastMessageTime: relativeLabel(last.timestamp, now),
      unreadCount: { [a.id]: unreadFor?.id === a.id ? 1 : 0, [b.id]: unreadFor?.id === b.id ? 1 : 0 },
    };
  };
  const threads: ChatThread[] = [
    thread(P.school, P.uzo, [
      [P.school, 'Good morning Mr. Kelechi. Could you share the SS3 mock exam summary before Friday\'s management meeting?', 30],
      [P.uzo, 'Good morning. Yes, 7 of 8 students passed Mathematics. Two still need support with calculus, so I\'ve started Saturday revision classes.', 27, { reactions: { '👏': [DEMO_SCHOOL_ID] } }],
      [P.school, 'Excellent. Please nudge the SS3 students who haven\'t finished the career assessment. JAMB registration opens soon.', 26],
      [P.uzo, 'Will do. I\'ll give them 20 minutes in class on Wednesday to complete it.', 2, { reactions: { '👍': [DEMO_SCHOOL_ID] } }],
    ], P.school),
    thread(P.school, P.folake, [
      [P.folake, 'The SS1 debate team made the state semi-finals! Gbenga Aina was named best speaker.', 50, { reactions: { '🎉': [DEMO_SCHOOL_ID] } }],
      [P.school, 'Wonderful news. We\'ll announce it at assembly and feature it at Career Day.', 48],
      [P.school, 'Congratulations to you and the SS1 debate team on reaching the semi-finals!', 47, { kind: 'kudos', kudos: { badge: 'star' }, reactions: { '❤️': ['demo-teacher-folake'] } }],
    ]),
    thread(P.school, P.funke, [
      [P.school, 'Dear Mrs. Aina, a reminder that the JSS3 Subject Selection Evening is on the calendar. Favour\'s teacher recommends the Arts and Design track.', 70],
      [P.funke, 'Thank you. We\'ve registered. Will there be someone to explain how the career assessment results fit in?', 66],
      [P.school, 'Yes, the OAICC counsellor will walk parents through each student\'s report card on the night.', 64],
      [P.funke, 'Perfect, see you then.', 5, { reactions: { '👍': [DEMO_SCHOOL_ID] } }],
    ], P.school),
    thread(P.school, P.emeka, [
      [P.emeka, 'Good afternoon. Chinedu wants to apply for Engineering. Does the school help with university applications?', 20],
      [P.school, 'Good afternoon Mr. Okafor. Yes, and his counsellor can book a session on Engineering courses. We\'ll set it up this week.', 18],
    ]),
    thread(P.uzo, P.bisi, [
      [P.bisi, 'Good evening Mr. Kelechi. How is Bolu doing in Further Mathematics?', 40],
      [P.uzo, 'He\'s doing very well, and his robotics project is impressive. Extra practice on vectors would help before the exams.', 38],
      [P.bisi, 'Thank you, we\'ll get him a tutor for that.', 3, { reactions: { '👍': ['demo-teacher-1'] } }],
    ], P.uzo),
    thread(P.uzo, P.yetunde, [
      [P.uzo, 'Mrs. Adeyemi, Kunle\'s results suggest both Accounting and Law are strong options. A counselling session would help him decide.', 96],
      [P.yetunde, 'That\'s helpful, thank you. I\'ve asked him to book one.', 90],
    ]),
    thread(P.uzo, P.folake, [
      [P.folake, 'Can we combine the SS1 and SS2 STEM and debate clubs for Career Day?', 12],
      [P.uzo, 'Great idea. Let\'s meet on Thursday to plan it.', 11],
      [P.folake, 'Your STEM club has been brilliant this term. Thank you for always saying yes!', 10, { kind: 'kudos', kudos: { badge: 'team' } }],
    ]),
    thread(P.funke, P.grace, [
      [P.grace, 'Mrs. Aina, Favour\'s design work this term has been excellent. I\'ve added a note on her profile.', 150],
      [P.funke, 'We saw it, thank you so much for encouraging her!', 145],
      [P.funke, 'Thank you for believing in Favour and championing her design work.', 144, { kind: 'kudos', kudos: { badge: 'thanks' }, reactions: { '❤️': ['demo-teacher-grace'] } }],
      [P.grace, 'You\'re welcome. Do bring her portfolio to the Subject Selection Evening.', 1],
    ], P.funke),
    thread(P.funke, P.folake, [
      [P.funke, 'Congratulations on the debate semi-final! Gbenga came home very excited.', 46],
      [P.folake, 'He earned it. He\'s a natural speaker.', 45],
    ]),
  ];

  /* ── school events (alongside OAICC's own events) ── */
  const host = { kind: 'school' as const, schoolId: DEMO_SCHOOL_ID, name: school.name };
  const schoolEvents: PortalEvent[] = [
    { id: 'demo-ss3-briefing', title: 'SS3 WAEC & JAMB Readiness Briefing', category: 'Briefing', host, audience: ['school', 'teacher', 'parent'], start: atDay(3, 15), end: atDay(3, 17), mode: 'In person', location: 'School Hall, Demo Secondary School', image: 'https://picsum.photos/seed/demo-waec/800/400', baseAttendees: 58, featured: true,
      description: 'Exam timetable, JAMB registration steps and how each SS3 student\'s career recommendations map to university courses. Parents and SS3 students are encouraged to attend.' },
    { id: 'demo-pta', title: 'PTA General Meeting', category: 'Meeting', host, audience: ['school', 'teacher', 'parent'], start: atDay(6, 10), end: atDay(6, 12), mode: 'In person', location: 'School Hall, Demo Secondary School', image: 'https://picsum.photos/seed/demo-pta/800/400', baseAttendees: 74,
      description: 'Term updates from the principal, the new career-guidance programme on OAICC, and an open Q&A with parents.' },
    { id: 'demo-jss3-subjects', title: 'JSS3 Subject Selection Evening', category: 'Workshop', host, audience: ['school', 'teacher', 'parent'], start: atDay(14, 17), end: atDay(14, 19), mode: 'In person', location: 'Library, Demo Secondary School', image: 'https://picsum.photos/seed/demo-subjects/800/400', baseAttendees: 31,
      description: 'Choosing between Science, Arts and Commercial tracks for SS1. Form teachers and the OAICC counsellor walk families through each student\'s assessment results.' },
    { id: 'demo-career-day', title: 'Career Day 2026', category: 'Career Day', host, audience: ['school', 'teacher', 'parent'], start: atDay(21, 9), end: atDay(21, 14), mode: 'In person', location: 'Sports Field, Demo Secondary School', image: 'https://picsum.photos/seed/demo-careerday/800/400', baseAttendees: 140, featured: true,
      description: 'Doctors, engineers, lawyers, designers and entrepreneurs, many of them parents, host stands and short talks for JSS1 to SS3 students.' },
    { id: 'demo-sports', title: 'Inter-House Sports Competition', category: 'Sports', host, audience: ['school', 'teacher', 'parent'], start: atDay(-20, 8), end: atDay(-20, 15), mode: 'In person', location: 'Sports Field, Demo Secondary School', image: 'https://picsum.photos/seed/demo-sports/800/400', baseAttendees: 210,
      description: 'Our annual inter-house sports competition. Congratulations to Green House!' },
    { id: 'demo-open-day', title: 'First Term Open Day', category: 'Open Day', host, audience: ['school', 'teacher', 'parent'], start: atDay(-34, 10), end: atDay(-34, 13), mode: 'In person', location: 'Demo Secondary School', image: 'https://picsum.photos/seed/demo-openday/800/400', baseAttendees: 96,
      description: 'Parents met form teachers, reviewed first-term progress and saw how OAICC career plans are built.' },
  ];
  const registrations: DemoData['registrations'] = [
    { eventId: 'oaicc-leaders-summit', role: 'school', userId: DEMO_SCHOOL_ID },
    { eventId: 'demo-career-day', role: 'school', userId: DEMO_SCHOOL_ID },
    { eventId: 'oaicc-digital-schools', role: 'school', userId: DEMO_SCHOOL_ID },
    { eventId: 'demo-open-day', role: 'school', userId: DEMO_SCHOOL_ID },
    { eventId: 'oaicc-educator-webinar', role: 'teacher', userId: 'demo-teacher-1' },
    { eventId: 'demo-ss3-briefing', role: 'teacher', userId: 'demo-teacher-1' },
    { eventId: 'demo-sports', role: 'teacher', userId: 'demo-teacher-1' },
    { eventId: 'oaicc-parent-symposium', role: 'parent', userId: 'demo-parent-1' },
    { eventId: 'demo-jss3-subjects', role: 'parent', userId: 'demo-parent-1' },
    { eventId: 'oaicc-mental-health', role: 'parent', userId: 'demo-parent-1' },
    { eventId: 'demo-open-day', role: 'parent', userId: 'demo-parent-1' },
  ];

  return {
    school, otherSchools, classes,
    teachers: [...teachers, ...otherTeachers], parents: [...parents, ...otherParents], students: allStudents,
    invites, activity, inbox, progress, mentorSessions, counselling, threads, schoolEvents, registrations, outbox,
  };
}

function invite(userId: string, role: InviteRecord['role'], email: string, invitedBy: InviteRecord['invitedBy'], createdAt: string, classId?: string): InviteRecord {
  const schoolId = invitedBy.role === 'school' ? invitedBy.userId : undefined;
  return { id: `demo-inv-${userId}`, token: `demo${hash(userId).toString(36)}${userId.length}`, role, email, userId, schoolId, classId, invitedBy, status: 'pending', createdAt };
}

function dedupe<T extends { title: string }>(list: T[]): T[] {
  const seen = new Set<string>();
  return list.filter(x => (seen.has(x.title) ? false : (seen.add(x.title), true)));
}

function relativeLabel(ts: number, now: number) {
  const d = new Date(ts);
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  if (ts >= today.getTime()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (ts >= today.getTime() - DAY) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
