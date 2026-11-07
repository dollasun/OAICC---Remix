import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, Calendar, ChevronRight, ClipboardCheck, Clock, GraduationCap, HeartHandshake, Mail, MapPin, MessageSquare, Phone, Power, PowerOff,
  School as SchoolIcon, Star, Trash2, UserSquare2, Users, type LucideIcon,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import BulkDeleteModal from '../../Common/BulkDeleteModal';
import { STATUS_BADGE } from '../../../utils/accountStatus';
import { counselingSessionsStorage, schoolClassesStorage, schoolsDirectory } from '../../../utils/storage';
import {
  activity, childrenOf, classesForTeacher, mentorSessionsStore, parentsStore, progressStore, studentsInClass, studentsStore, teachersStore,
} from '../../../utils/schoolData';
import { careerInterestsFor } from '../../../utils/studentCareers';
import {
  deletePlatformUser, KIND_LABEL, listPlatformUsers, schoolDeletionImpact, setUserActive, USER_KINDS, userKey, userPath, usersListPath,
  type PlatformUser, type UserKind,
} from '../../../utils/platformUsers';

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const ago = (iso?: string) => {
  if (!iso) return 'Never';
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
};
const ROLE_TONE: Record<UserKind, string> = { school: 'bg-violet-50 text-violet-600', student: 'bg-brand/10 text-brand', teacher: 'bg-amber-50 text-amber-600', parent: 'bg-indigo-50 text-indigo-500' };

function Card({ title, action, children, className = '' }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-lg font-bold text-slate-900">{title}</h3>{action}</div>
      {children}
    </section>
  );
}
function Fact({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
      <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><div className="text-sm font-semibold text-slate-800 break-words">{children}</div></div>
    </div>
  );
}
const PersonLink = ({ user, sub }: { user: PlatformUser; sub?: string }) => (
  <Link to={userPath(user.kind, user.id)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand/40 hover:bg-brand/5 transition-all group">
    <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-brand">{user.name}</p>
      <p className="text-xs text-slate-500 truncate">{sub ?? user.detail}</p>
    </div>
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_BADGE[user.status].className}`}>{STATUS_BADGE[user.status].label}</span>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand shrink-0" />
  </Link>
);

export default function PlatformUserDetail() {
  const { kind, id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [version, setVersion] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<'profile' | 'careers' | 'activity'>('profile');

  const valid = (USER_KINDS as string[]).includes(kind ?? '') && Boolean(id);
  const everyone = useMemo(() => listPlatformUsers(), [version]);
  const byKey = useMemo(() => new Map(everyone.map(u => [u.key, u])), [everyone]);
  const user = valid ? byKey.get(userKey(kind as UserKind, id!)) : undefined;

  if (!valid) return <Navigate to="/admin/all-users" replace />;
  if (!user) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/admin/all-users')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"><ArrowLeft className="w-5 h-5" /> Back to users</button>
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="font-bold text-slate-700">This user no longer exists</p>
          <Link to="/admin/all-users" className="mt-2 inline-block text-sm font-bold text-brand hover:underline">Go to all users</Link>
        </div>
      </div>
    );
  }

  const badge = STATUS_BADGE[user.status];
  const person = (k: UserKind, rid: string) => byKey.get(userKey(k, rid));
  const flip = () => {
    const turnOn = user.status === 'inactive';
    if (setUserActive(user.kind, user.id, turnOn)) { showToast(`${user.name} ${turnOn ? 'activated' : 'deactivated'}.`); setVersion(v => v + 1); }
  };
  const del = () => { deletePlatformUser(user.kind, user.id); showToast(`${user.name} deleted.`); navigate('/admin/all-users', { replace: true }); };
  const impact = user.kind === 'school' ? schoolDeletionImpact(user.id) : null;

  /* ── kind-specific content ── */
  let body: React.ReactNode = null;
  const subtitle: string[] = [];

  if (user.kind === 'student') {
    const rec = studentsStore.get(user.id)!;
    const parents = rec.parentIds.map(pid => person('parent', pid)).filter((p): p is PlatformUser => Boolean(p));
    const progress = progressStore.get(user.id);
    const careers = careerInterestsFor(user.id);
    const feed = activity.forStudent(user.id);
    const pct = progress && progress.assessmentTotal ? Math.round((progress.assessmentAnswered / progress.assessmentTotal) * 100) : 0;
    const counselling = (counselingSessionsStorage.get() as { studentRef?: unknown; status?: string }[]).filter(s => s.studentRef === user.id);
    const mentoring = mentorSessionsStore.forStudent(user.id);
    subtitle.push(user.detail, user.schoolName || 'No school');
    body = (
      <>
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm w-fit max-w-full overflow-x-auto" role="tablist">
          {([['profile', 'Profile'], ['careers', 'Career interest'], ['activity', 'Activity']] as const).map(([t, label]) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`px-6 sm:px-10 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${tab === t ? 'bg-brand text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{label}</button>
          ))}
        </div>
        {tab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Contact & school" className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Fact icon={Mail} label="Email">{rec.email}</Fact>
                <Fact icon={Phone} label="Phone">{rec.phone ?? 'Not provided'}</Fact>
                <Fact icon={SchoolIcon} label="School">{user.schoolId ? <Link className="hover:text-brand hover:underline" to={userPath('school', user.schoolId)}>{user.schoolName}</Link> : 'Not linked to a school'}</Fact>
                <Fact icon={GraduationCap} label="Class">{user.detail}</Fact>
                <Fact icon={Calendar} label="Joined">{fmtDate(rec.createdAt)}</Fact>
                <Fact icon={Clock} label="Last sign-in">{rec.lastLoginAt ? `${fmtDate(rec.lastLoginAt)} (${ago(rec.lastLoginAt)})` : 'Never'}</Fact>
              </div>
            </Card>
            <Card title="Engagement">
              <div className="space-y-4">
                <Fact icon={ClipboardCheck} label="Career assessment">{pct}% ({progress?.assessmentAnswered ?? 0} of {progress?.assessmentTotal ?? 0})</Fact>
                <Fact icon={HeartHandshake} label="Counselling sessions">{counselling.length}</Fact>
                <Fact icon={Briefcase} label="Mentor sessions">{mentoring.length}</Fact>
                <Fact icon={Star} label="Saved careers">{progress?.favourites.length ?? 0}</Fact>
              </div>
            </Card>
            <Card title={`Parents & guardians (${parents.length})`} className="lg:col-span-3">
              {parents.length === 0 ? <p className="text-sm text-slate-500">No parent or guardian linked yet.</p>
                : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{parents.map(p => <React.Fragment key={p.key}><PersonLink user={p} /></React.Fragment>)}</div>}
            </Card>
          </div>
        )}
        {tab === 'careers' && (
          <Card title="Career interest" action={progress && <span className="text-xs font-bold text-slate-500">Assessment {pct}% complete</span>}>
            {careers.length === 0 ? <p className="text-sm text-slate-500">No recommendations yet. They appear once the student has answered enough of the career assessment.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {careers.map(c => (
                  <div key={c.id} className="rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                    <div className="relative h-28"><img src={c.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between p-3 gap-2">
                        <p className="text-white font-bold truncate">{c.title}</p>
                        {c.isFavorited && <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold flex items-center gap-1 shrink-0"><Star className="w-3 h-3 fill-white" /> Saved</span>}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                      {c.matchScore !== undefined ? (
                        <div><div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>Match</span><span className="text-brand">{c.matchScore}%</span></div>
                          <div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-brand" style={{ width: `${c.matchScore}%` }} /></div></div>
                      ) : <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Saved career · outside top matches</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        {tab === 'activity' && (
          <Card title="Activity">
            {feed.length === 0 ? <p className="text-sm text-slate-500">No activity recorded yet.</p> : (
              <ol className="space-y-4">
                {feed.slice(0, 30).map(a => (
                  <li key={a.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">{a.title}</p>
                      {a.text && <p className="text-sm text-slate-600 italic mt-0.5">"{a.text}"{a.authorRole && <span className="not-italic text-slate-400"> — {a.authorRole}</span>}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">{fmtDate(a.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        )}
      </>
    );
  } else if (user.kind === 'teacher') {
    const rec = teachersStore.get(user.id)!;
    const classes = classesForTeacher(user.id);
    const students = classes.flatMap(c => studentsInClass(c.id)).map(s => person('student', s.id)).filter((s): s is PlatformUser => Boolean(s));
    subtitle.push(rec.subject ?? 'Teacher', user.schoolName || 'No school');
    body = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Profile" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Fact icon={Mail} label="Email">{rec.email}</Fact>
            <Fact icon={Phone} label="Phone">{rec.phone ?? 'Not provided'}</Fact>
            <Fact icon={SchoolIcon} label="School">{user.schoolId ? <Link className="hover:text-brand hover:underline" to={userPath('school', user.schoolId)}>{user.schoolName}</Link> : 'Not linked to a school'}</Fact>
            <Fact icon={Briefcase} label="Subject">{rec.subject ?? 'Not set'}</Fact>
            <Fact icon={MapPin} label="Location">{rec.location ?? 'Not set'}</Fact>
            <Fact icon={Calendar} label="Joined">{fmtDate(rec.createdAt)}</Fact>
          </div>
          {rec.bio && <p className="mt-5 pt-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">{rec.bio}</p>}
        </Card>
        <Card title="Teaching">
          <div className="space-y-4">
            <Fact icon={GraduationCap} label="Classes">{classes.length ? classes.map(c => c.name).join(', ') : 'None assigned'}</Fact>
            <Fact icon={Users} label="Students">{students.length}</Fact>
          </div>
        </Card>
        <Card title={`Students in their classes (${students.length})`} className="lg:col-span-3">
          {students.length === 0 ? <p className="text-sm text-slate-500">This teacher has no students yet.</p>
            : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{students.slice(0, 12).map(s => <React.Fragment key={s.key}><PersonLink user={s} /></React.Fragment>)}</div>}
          {students.length > 12 && <p className="text-xs text-slate-500 mt-3">and {students.length - 12} more. <Link className="font-bold text-brand hover:underline" to={usersListPath({ role: 'student', school: user.schoolId })}>See all of the school's students</Link></p>}
        </Card>
      </div>
    );
  } else if (user.kind === 'parent') {
    const rec = parentsStore.get(user.id)!;
    const children = childrenOf(user.id).map(c => person('student', c.id)).filter((c): c is PlatformUser => Boolean(c));
    subtitle.push(rec.profession ?? 'Parent / Guardian', user.schoolName || 'No school');
    body = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Profile" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Fact icon={Mail} label="Email">{rec.email}</Fact>
            <Fact icon={Phone} label="Phone">{rec.phone ?? 'Not provided'}</Fact>
            <Fact icon={SchoolIcon} label="School">{user.schoolId ? <Link className="hover:text-brand hover:underline" to={userPath('school', user.schoolId)}>{user.schoolName}</Link> : 'Not linked to a school'}</Fact>
            <Fact icon={Briefcase} label="Profession">{rec.profession ?? 'Not set'}</Fact>
            <Fact icon={MapPin} label="Location">{rec.location ?? 'Not set'}</Fact>
            <Fact icon={Calendar} label="Joined">{fmtDate(rec.createdAt)}</Fact>
          </div>
        </Card>
        <Card title="Family"><Fact icon={GraduationCap} label="Children">{children.length}</Fact></Card>
        <Card title={`Children (${children.length})`} className="lg:col-span-3">
          {children.length === 0 ? <p className="text-sm text-slate-500">No children linked yet.</p>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children.map(c => <React.Fragment key={c.key}><PersonLink user={c} sub={`${c.detail} · ${c.schoolName || 'No school'}`} /></React.Fragment>)}</div>}
        </Card>
      </div>
    );
  } else {
    const school = schoolsDirectory.all().find(s => s.id === user.id)!;
    const members = everyone.filter(u => u.schoolId === user.id && u.kind !== 'school');
    const count = (k: UserKind) => members.filter(m => m.kind === k).length;
    const classes = schoolClassesStorage.get().filter(c => c.schoolId === user.id);
    subtitle.push(school.location, `${school.schoolTypes.join(' · ') || 'School'}`);
    body = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="School profile" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Fact icon={UserSquare2} label="Administrator">{`${school.adminFirstName} ${school.adminLastName}`.trim() || '—'}</Fact>
            <Fact icon={Mail} label="Admin email">{school.adminEmail}</Fact>
            <Fact icon={Phone} label="Phone">{school.phone ?? 'Not provided'}</Fact>
            <Fact icon={MapPin} label="Location">{school.location}</Fact>
            <Fact icon={GraduationCap} label="School type">{school.schoolTypes.join(', ') || 'Not set'}</Fact>
            <Fact icon={Calendar} label="On OAICC since">{fmtDate(school.createdAt)}</Fact>
          </div>
          {school.about && <p className="mt-5 pt-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">{school.about}</p>}
        </Card>
        <Card title="People">
          <div className="space-y-2">
            {([['student', 'Students', GraduationCap], ['teacher', 'Teachers', UserSquare2], ['parent', 'Parents', Users]] as const).map(([k, label, Icon]) => (
              <Link key={k} to={usersListPath({ role: k, school: user.id })} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand/40 hover:bg-brand/5 transition-all group">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand" /><span className="text-sm font-bold text-slate-700 flex-1">{label}</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{count(k)}</span><ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </Card>
        <Card title={`Classes (${classes.length})`} className="lg:col-span-3">
          {classes.length === 0 ? <p className="text-sm text-slate-500">This school hasn't created any classes yet.</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classes.map(c => {
                const teacher = c.teacherId ? person('teacher', c.teacherId) : undefined;
                return (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between"><p className="font-bold text-slate-900">{c.name}</p><span className="text-xs font-bold text-slate-500">{studentsInClass(c.id).length} students</span></div>
                    <p className="text-xs text-slate-500 mt-1">Form teacher: {teacher ? <Link to={userPath('teacher', teacher.id)} className="font-bold text-brand hover:underline">{teacher.name}</Link> : <span className="font-semibold text-red-500">Not assigned</span>}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"><ArrowLeft className="w-5 h-5" /> Back</button>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6">
        <img src={user.avatar} alt="" className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">{user.name}</h1>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${ROLE_TONE[user.kind]}`}>{KIND_LABEL[user.kind]}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.className}`}>{badge.label}</span>
          </div>
          <p className="text-slate-500 font-medium mt-1">{subtitle.filter(Boolean).join(' • ')}</p>
          <p className="text-sm text-slate-400 font-medium mt-1">{user.email} · Joined {fmtDate(user.joinedAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {user.status === 'active' && <button onClick={flip} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 transition-all"><PowerOff className="w-4 h-4" /> Deactivate</button>}
          {user.status === 'inactive' && <button onClick={flip} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all"><Power className="w-4 h-4" /> Activate</button>}
          {user.status === 'invited' && <span className="px-4 py-2.5 text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl">Awaiting sign-up</span>}
          <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /> Delete</button>
        </div>
      </div>

      {user.status === 'inactive' && (
        <div role="status" className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 flex items-center gap-2"><MessageSquare className="w-4 h-4 shrink-0" />This account is deactivated. {user.kind === 'school' ? 'The school administrator' : 'They'} can't sign in until you activate it again.</div>
      )}

      {body}

      <BulkDeleteModal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={del} itemCount={1} itemType={KIND_LABEL[user.kind]}
        items={[{ id: user.key, name: user.name, role: KIND_LABEL[user.kind], avatar: user.avatar }]}
        note={impact ? <>Deleting a school also deletes <b>{impact.students}</b> students, <b>{impact.teachers}</b> teachers, <b>{impact.parents}</b> parents and <b>{impact.classes}</b> classes, along with their invitations, notes and progress.</> : undefined} />
    </div>
  );
}
