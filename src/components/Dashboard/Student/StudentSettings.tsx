/**
 * Student settings, built on the standard settings layout (Shared/SettingsLayout) used by every portal.
 * Personal details save to the student's own record; the intake questionnaire and the events and
 * sessions lists are student-specific sections.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bell, Calendar, Check, CheckCircle2, Lock, ShieldCheck, Target, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { intakeQuestions } from '../../../data/questionnaire';
import { counselingSessionsStorage, eventsStorage, registeredEventsStorage, schoolStorage } from '../../../utils/storage';
import { className, fullName, notifPrefs, sessionStore, studentsStore } from '../../../utils/schoolData';
import {
  NotificationsPanel, PoliciesPanel, SaveBar, SecurityPanel, SettingsPanel, SettingsShell, SignOutModal, SETTINGS_INPUT, SETTINGS_INPUT_DISABLED,
  SETTINGS_LABEL, savedNow, shrinkImage, usePolicies, type NotificationItem,
} from '../Shared/SettingsLayout';

type StudentSection = 'personal' | 'assessment' | 'events' | 'security' | 'notifications' | 'policies';
const SECTIONS: StudentSection[] = ['personal', 'assessment', 'events', 'security', 'notifications', 'policies'];

const STUDENT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'sessions', title: 'Counselling Session Reminders', desc: 'Reminders before your booked one-to-one counselling sessions.', badge: 'Recommended' },
  { id: 'mentor', title: 'Mentor Messages', desc: 'Alerts when a mentor replies or sends you career advice.' },
  { id: 'events', title: 'Events & Workshops', desc: 'Alerts when new workshops or events are published.' },
  { id: 'recommendations', title: 'Career Recommendations', desc: 'Updates when your career matches change after the assessment.' },
];

interface EventRow { id: number; title: string; date?: string; time?: string }
interface SessionRow { id: number; title?: string; counselorName?: string; date?: string; time?: string; status?: string; studentRef?: unknown; studentName?: string }

export default function StudentSettings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // ?tab=intake is an older alias for the intake questionnaire.
  const tabParam = searchParams.get('tab');
  const requested = (tabParam === 'intake' ? 'assessment' : tabParam) as StudentSection | null;
  const [activeSection, setActiveSection] = useState<StudentSection>(requested && SECTIONS.includes(requested) ? requested : 'personal');

  const session = sessionStore.get();
  const record = session?.role === 'student' ? studentsStore.get(session.userId) : undefined;
  const school = record?.schoolId ? schoolStorage.get() : null;
  const schoolName = school && school.id === record?.schoolId ? school.name : record?.schoolId ? 'Your school' : 'Not linked to a school';

  const [form, setForm] = useState({ firstName: record?.firstName ?? '', lastName: record?.lastName ?? '', email: record?.email ?? '', phone: record?.phone ?? '' });
  const [avatarUrl, setAvatarUrl] = useState(record?.avatar ?? `https://picsum.photos/seed/${record?.id ?? 'student'}/200/200`);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const policies = usePolicies('student');
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => notifPrefs.get('student', record?.id));

  /* intake questionnaire (saved as you go) */
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string | string[]>>({});
  useEffect(() => {
    try { setIntakeAnswers(JSON.parse(localStorage.getItem('studentIntakeAnswers') || '{}')); } catch { /* start empty */ }
  }, []);
  const handleIntakeChange = (id: string, value: string | string[], type: string) => {
    let updated: Record<string, string | string[]>;
    if (type === 'multiple') {
      const current = (intakeAnswers[id] as string[]) || [];
      const v = value as string;
      updated = { ...intakeAnswers, [id]: current.includes(v) ? current.filter(x => x !== v) : [...current, v] };
    } else {
      updated = { ...intakeAnswers, [id]: value };
    }
    setIntakeAnswers(updated);
    localStorage.setItem('studentIntakeAnswers', JSON.stringify(updated));
    showToast('Progress saved automatically');
  };
  const answeredCount = Object.values(intakeAnswers).filter(v => (Array.isArray(v) ? v.length > 0 : Boolean(v))).length;
  const completionPercentage = Math.round((answeredCount / intakeQuestions.length) * 100);

  /* this student's registered events and counselling sessions */
  const { events, sessions } = useMemo(() => {
    const registered = new Set<number>(registeredEventsStorage.get() as number[]);
    const allEvents = eventsStorage.get() as EventRow[];
    const name = record ? fullName(record) : '';
    const mine = (counselingSessionsStorage.get() as SessionRow[])
      .filter(s => (record && s.studentRef === record.id) || (!s.studentRef && name && s.studentName === name))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return { events: allEvents.filter(e => registered.has(e.id)), sessions: mine };
  }, [record]);
  const upcomingSessions = sessions.filter(s => s.status !== 'Completed').length;

  const changeSection = (id: string) => {
    setActiveSection(id as StudentSection);
    setSearchParams(id === 'personal' ? {} : { tab: id });
  };

  const needsAccount = () => {
    if (record) return false;
    showToast('Sign in with your student account to change your settings.', 'error');
    return true;
  };

  const handleAvatarFile = async (file: File) => {
    if (needsAccount()) return;
    try {
      const url = await shrinkImage(file);
      setAvatarUrl(url);
      studentsStore.update(record!.id, { avatar: url });
      showToast('Profile photo updated successfully!');
    } catch {
      showToast('That image could not be used. Try a different file.', 'error');
    }
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsAccount()) return;
    const email = form.email.trim().toLowerCase();
    if (!form.firstName.trim() || !email.includes('@')) { showToast('First name and a valid email are required.', 'error'); return; }
    if (studentsStore.all().some(s => s.id !== record!.id && s.email.toLowerCase() === email)) { showToast('Another student already uses this email.', 'error'); return; }
    studentsStore.update(record!.id, { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email, phone: form.phone.trim() || undefined });
    setSavedAt(savedNow());
    showToast('Personal information updated successfully!');
  };

  const isOn = (id: string) => prefs[id] !== false;
  const writePrefs = (next: Record<string, boolean>) => { setPrefs(next); if (record) notifPrefs.set('student', record.id, next); };

  const signOut = () => { sessionStore.clear(); localStorage.removeItem('user_role'); navigate('/'); };

  const displayName = fullName(form) || 'Your account';
  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

  return (
    <>
      <SettingsShell
        subtitle="Manage your student profile, intake questionnaire, account security and notifications."
        banner={{
          avatarUrl, onAvatarFile: handleAvatarFile, name: displayName, roleLabel: 'Student', email: form.email,
          meta: [schoolName, record?.classId ? className(record.classId) : 'No class yet', `Intake ${completionPercentage}% complete`],
          statusLabel: record ? 'Active account' : 'Not signed in',
        }}
        nav={[
          { id: 'personal', label: 'Personal Information', description: 'Profile identity & contact info', icon: User },
          { id: 'assessment', label: 'Student Intake Profile', description: 'Where you are right now', icon: BarChart, badge: `${completionPercentage}%` },
          { id: 'events', label: 'Events & Sessions', description: 'Workshops & counselling', icon: Calendar, badge: upcomingSessions ? String(upcomingSessions) : undefined },
          { id: 'security', label: 'Security & Access', description: 'Password & active sessions', icon: Lock },
          { id: 'notifications', label: 'Notifications', description: 'Alerts & activity updates', icon: Bell },
          { id: 'policies', label: 'Platform Policies', description: 'Legal terms & compliance', icon: ShieldCheck, badge: `${policies.length} Docs` },
        ]}
        active={activeSection}
        onSelect={changeSection}
        summary={{ title: 'Your Journey', items: [
          { label: 'Intake answered', value: `${answeredCount}/${intakeQuestions.length}` },
          { label: 'Events', value: events.length },
          { label: 'Sessions', value: sessions.length },
          { label: 'Upcoming', value: upcomingSessions },
        ] }}
        onSignOutClick={() => setIsSignOutOpen(true)}
      >
        {activeSection === 'personal' && (
          <SettingsPanel panelKey="personal" icon={User} title="Personal Information" description="Update your name and contact details. Your school manages your class.">
            <form onSubmit={handleSavePersonal} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {([['firstName', 'First Name', 'text'], ['lastName', 'Last Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel']] as const).map(([key, label, type]) => (
                  <div key={key} className="space-y-2">
                    <label className={SETTINGS_LABEL}>{label}</label>
                    <input type={type} value={form[key]} required={key === 'firstName' || key === 'email'} onChange={e => setForm({ ...form, [key]: e.target.value })} className={SETTINGS_INPUT} />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className={SETTINGS_LABEL}>School</label>
                  <input value={schoolName} disabled className={SETTINGS_INPUT_DISABLED} />
                  <span className="text-[11px] text-slate-400">Set when your school invites you</span>
                </div>
                <div className="space-y-2">
                  <label className={SETTINGS_LABEL}>Class</label>
                  <input value={record?.classId ? className(record.classId) : 'No class yet'} disabled className={SETTINGS_INPUT_DISABLED} />
                  <span className="text-[11px] text-slate-400">Managed by your school</span>
                </div>
              </div>
              <SaveBar savedAt={savedAt} />
            </form>
          </SettingsPanel>
        )}

        {activeSection === 'assessment' && (
          <SettingsPanel panelKey="assessment" icon={BarChart} tone="bg-emerald-50 text-emerald-600" title="Student Intake Profile"
            description="A quick snapshot of where you are, used to personalise your recommendations."
            actions={completionPercentage === 100 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold shrink-0 border border-emerald-200/60"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed</span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold shrink-0">{answeredCount} of {intakeQuestions.length} answered</span>
            )}>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">Instructions:</strong> Please complete these questions to help our algorithmic advisor match you with the right careers, mentors, and counseling pathways. All progress is saved automatically.
              </div>

              <div className="space-y-6">
                {intakeQuestions.map((q, idx) => {
                  const hasAnswered = q.type === 'multiple' 
                    ? (intakeAnswers[q.id] as string[])?.length > 0
                    : !!intakeAnswers[q.id];

                  return (
                    <div key={q.id} className="p-5 sm:p-6 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          {q.area}
                        </span>
                        {hasAnswered && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Answered
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2.5">
                          <span className="text-brand shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{q.question}</span>
                        </p>
                        {q.type === 'multiple' && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 pl-6">Select all options that apply to you</p>
                        )}
                      </div>

                      <div className="pl-0 sm:pl-6">
                        {q.type === 'text' ? (
                          <textarea
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none h-28 focus:border-brand dark:focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                            placeholder="Type your answer here..."
                            value={(intakeAnswers[q.id] as string) || ''}
                            onChange={(e) => handleIntakeChange(q.id, e.target.value, 'text')}
                          />
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options?.map(opt => {
                              const isSelected = q.type === 'multiple' 
                                ? (intakeAnswers[q.id] as string[])?.includes(opt)
                                : intakeAnswers[q.id] === opt;
                              
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleIntakeChange(q.id, opt, q.type || 'single')}
                                  className={`w-full p-3.5 rounded-xl text-left font-bold text-sm transition-all flex items-center justify-between border ${
                                    isSelected
                                      ? 'border-brand bg-brand/10 text-brand shadow-xs'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-brand text-white' : 'border border-slate-300 dark:border-slate-600'
                                  }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SettingsPanel>
        )}

        {activeSection === 'events' && (
          <SettingsPanel panelKey="events" icon={Calendar} tone="bg-indigo-50 text-indigo-500" title="Events & Counselling Sessions"
            description="Workshops you've registered for and your counselling sessions."
            actions={<button onClick={() => navigate('/student/counselors')} className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl shadow-xs hover:brightness-105 transition-all shrink-0">Book a Session</button>}>
            <div className="p-6 sm:p-8 space-y-8">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Registered Workshops & Events</h4>
                <div className="space-y-3">
                  {events.length === 0 && <p className="text-sm text-slate-500">You haven't registered for any events yet. <button onClick={() => navigate('/student/events')} className="font-bold text-brand hover:underline">Browse events</button></p>}
                  {events.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand shadow-xs shrink-0 border border-slate-200/60"><Calendar className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{e.title}</p>
                          <p className="text-xs text-slate-500 font-medium">{[fmtDate(e.date), e.time].filter(Boolean).join(' • ')}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">Registered</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Career Counselling Sessions</h4>
                <div className="space-y-3">
                  {sessions.length === 0 && <p className="text-sm text-slate-500">No counselling sessions yet.</p>}
                  {sessions.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-xs shrink-0 border border-slate-200/60"><Target className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{s.title ?? 'Counselling session'}</p>
                          <p className="text-xs text-slate-500 font-medium">{[s.counselorName && `with ${s.counselorName}`, fmtDate(s.date), s.time].filter(Boolean).join(' • ')}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${s.status === 'Completed' ? 'bg-slate-200/80 text-slate-600' : 'bg-blue-50 text-blue-600 border border-blue-200/60'}`}>
                        {s.status === 'Completed' ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Completed</span> : s.status ?? 'Upcoming'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SettingsPanel>
        )}

        {activeSection === 'security' && <SecurityPanel onSignOutClick={() => setIsSignOutOpen(true)} />}

        {activeSection === 'notifications' && (
          <NotificationsPanel
            description="Choose which updates about your career journey appear in your notification inbox."
            items={STUDENT_NOTIFICATIONS}
            isOn={isOn}
            onToggle={id => { writePrefs({ ...prefs, [id]: !isOn(id) }); showToast('Notification preference updated'); }}
            onSetAll={enable => { writePrefs(Object.fromEntries(STUDENT_NOTIFICATIONS.map(n => [n.id, enable]))); showToast(enable ? 'All notifications enabled' : 'All notifications muted'); }}
          />
        )}

        {activeSection === 'policies' && (
          <PoliciesPanel role="student" governance="OAICC keeps student data private and safe. These policies explain how your information is used and how to stay safe on the platform." />
        )}
      </SettingsShell>

      <SignOutModal open={isSignOutOpen} onClose={() => setIsSignOutOpen(false)} portalName="Student Portal" onConfirm={signOut} />
    </>
  );
}
