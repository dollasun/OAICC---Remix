/**
 * Settings page shared by the School, Teacher and Parent portals, built on the standard settings
 * layout (Shared/SettingsLayout) and saving to the real account records.
 */
import React, { useMemo, useState } from 'react';
import { Bell, Lock, ShieldCheck, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import {
  NotificationsPanel, PoliciesPanel, SaveBar, SecurityPanel, SettingsPanel, SettingsShell, SignOutModal, SETTINGS_INPUT, SETTINGS_INPUT_DISABLED,
  SETTINGS_LABEL, savedNow, shrinkImage, usePolicies,
} from './Shared/SettingsLayout';
import { schoolClassesStorage, schoolStorage } from '../../utils/storage';
import {
  classesForTeacher, childrenOf, fullName, notifPrefs, parentsStore, sessionStore, studentsInClass, studentsOfSchool, teachersOfSchool,
  teachersStore,
} from '../../utils/schoolData';

type PortalRole = 'school' | 'teacher' | 'parent';
type Section = 'personal' | 'security' | 'notifications' | 'policies';
type Form = Record<string, string>;

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  textarea?: boolean;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  full?: boolean;
}
interface NotifItem { id: string; title: string; desc: string; badge?: string }

const CONFIG: Record<PortalRole, {
  subtitle: string; roleLabel: string; portalName: string; personalDesc: string; notifDesc: string; summaryTitle: string;
  fields: FieldDef[]; notifications: NotifItem[]; policyRole: 'school' | 'teacher' | 'parent'; governance: string;
}> = {
  school: {
    subtitle: 'Manage your school profile, security, and notification preferences.',
    roleLabel: 'School Administrator',
    portalName: 'School Portal',
    personalDesc: 'Update your school profile, administrator details, and contact information.',
    notifDesc: 'Choose which school activity appears in your notification inbox.',
    summaryTitle: 'School Overview',
    policyRole: 'school',
    governance: 'Schools act as the authority for student accounts they create. Please review the safeguarding and school-authority policies below.',
    fields: [
      { key: 'firstName', label: 'First Name', required: true },
      { key: 'lastName', label: 'Last Name', required: true },
      { key: 'email', label: 'Work Email Address', type: 'email', required: true },
      { key: 'phone', label: 'Phone Number', type: 'tel' },
      { key: 'role', label: 'Account Role', disabled: true, hint: 'Assigned when your school was registered' },
      { key: 'schoolName', label: 'School Name', required: true },
      { key: 'location', label: 'Location', full: true },
      { key: 'about', label: 'About the School', textarea: true, full: true },
    ],
    notifications: [
      { id: 'invitations', title: 'Invitations Accepted', desc: 'Get notified when a teacher, student or parent accepts your invitation.', badge: 'Recommended' },
    ],
  },
  teacher: {
    subtitle: 'Manage your teacher profile, security, and notification preferences.',
    roleLabel: 'Teacher',
    portalName: 'Teacher Portal',
    personalDesc: 'Update your teacher profile, credentials, and contact details.',
    notifDesc: 'Choose which class and student activity appears in your notification inbox.',
    summaryTitle: 'Teaching Overview',
    policyRole: 'teacher',
    governance: 'Teachers have a duty of care for the students in their classes. Please review the safeguarding and acceptable-use policies below.',
    fields: [
      { key: 'firstName', label: 'First Name', required: true },
      { key: 'lastName', label: 'Last Name', required: true },
      { key: 'email', label: 'Email Address', type: 'email', required: true },
      { key: 'phone', label: 'Phone Number', type: 'tel' },
      { key: 'role', label: 'Account Role', disabled: true, hint: 'Assigned by your school' },
      { key: 'subject', label: 'Subject / Department' },
      { key: 'location', label: 'Location', full: true },
      { key: 'bio', label: 'Professional Bio', textarea: true, full: true },
    ],
    notifications: [
      { id: 'classes', title: 'Class Assignments', desc: 'Alerts when your school assigns you to a class.', badge: 'Recommended' },
      { id: 'students', title: 'Students Added to Your Classes', desc: 'Alerts when a student joins or is added to one of your classes.' },
      { id: 'parentNotes', title: 'Parent Notes', desc: "Alerts when a parent leaves a note about a student in your class." },
    ],
  },
  parent: {
    subtitle: 'Manage your parent profile, security, and notification preferences.',
    roleLabel: 'Parent / Guardian',
    portalName: 'Parent Portal',
    personalDesc: 'Update your profile and contact details.',
    notifDesc: "Choose which updates about your children appear in your notification inbox.",
    summaryTitle: 'Family Overview',
    policyRole: 'parent',
    governance: 'As a parent or guardian you control how your children use OAICC. Please review the parental consent and student-privacy policies below.',
    fields: [
      { key: 'firstName', label: 'First Name', required: true },
      { key: 'lastName', label: 'Last Name', required: true },
      { key: 'email', label: 'Email Address', type: 'email', required: true },
      { key: 'phone', label: 'Phone Number', type: 'tel' },
      { key: 'role', label: 'Account Role', disabled: true, hint: 'Your relationship to your children' },
      { key: 'profession', label: 'Profession' },
      { key: 'location', label: 'Location', full: true },
    ],
    notifications: [
      { id: 'comments', title: 'Teacher Comments', desc: "Alerts when a teacher comments on one of your children's profiles.", badge: 'Recommended' },
      { id: 'children', title: 'Child Account Updates', desc: 'Alerts when a child accepts your invitation or joins a class.' },
    ],
  },
};

/** Loads the signed-in account behind this portal as an editable form. */
function loadAccount(role: PortalRole) {
  const session = sessionStore.get();
  const roleLabel = CONFIG[role].roleLabel;
  if (role === 'school') {
    const s = schoolStorage.get();
    return {
      id: s?.id, exists: Boolean(s), createdAt: s?.createdAt, avatar: s?.avatar,
      form: { firstName: s?.adminFirstName ?? '', lastName: s?.adminLastName ?? '', email: s?.adminEmail ?? '', phone: s?.phone ?? '', role: roleLabel, schoolName: s?.name ?? '', location: s?.location ?? '', about: s?.about ?? '' } as Form,
      detail: s?.location ?? 'Location not set',
    };
  }
  if (role === 'teacher') {
    const t = session?.role === 'teacher' ? teachersStore.get(session.userId) : undefined;
    return {
      id: t?.id, exists: Boolean(t), createdAt: t?.createdAt, avatar: t?.avatar,
      form: { firstName: t?.firstName ?? '', lastName: t?.lastName ?? '', email: t?.email ?? '', phone: t?.phone ?? '', role: roleLabel, subject: t?.subject ?? '', location: t?.location ?? '', bio: t?.bio ?? '' } as Form,
      detail: t?.subject ? `Subject: ${t.subject}` : 'Subject not set',
    };
  }
  const p = session?.role === 'parent' ? parentsStore.get(session.userId) : undefined;
  return {
    id: p?.id, exists: Boolean(p), createdAt: p?.createdAt, avatar: p?.avatar,
    form: { firstName: p?.firstName ?? '', lastName: p?.lastName ?? '', email: p?.email ?? '', phone: p?.phone ?? '', role: roleLabel, profession: p?.profession ?? '', location: p?.location ?? '' } as Form,
    detail: p?.profession ? `Profession: ${p.profession}` : 'Profession not set',
  };
}

export default function PortalSettings({ role }: { role: PortalRole }) {
  const cfg = CONFIG[role];
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const account = useMemo(() => loadAccount(role), [role]);
  const sections: Section[] = ['personal', 'security', 'notifications', 'policies'];
  const tab = searchParams.get('tab') as Section | null;
  const [activeSection, setActiveSection] = useState<Section>(tab && sections.includes(tab) ? tab : 'personal');

  const [form, setForm] = useState<Form>(account.form);
  const [avatarUrl, setAvatarUrl] = useState(account.avatar ?? `https://picsum.photos/seed/${role}-${account.id ?? 'guest'}/200/200`);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const policies = usePolicies(cfg.policyRole);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => notifPrefs.get(role, account.id));

  const changeSection = (section: string) => {
    setActiveSection(section as Section);
    setSearchParams(section === 'personal' ? {} : { tab: section });
  };

  const needsAccount = () => {
    if (account.exists) return false;
    showToast(`Sign in with a ${role} account to change your settings.`, 'error');
    return true;
  };

  const handleAvatarFile = async (file: File) => {
    if (needsAccount()) return;
    try {
      const url = await shrinkImage(file);
      setAvatarUrl(url);
      if (role === 'school') { const s = schoolStorage.get(); if (s) schoolStorage.save({ ...s, avatar: url }); }
      else if (role === 'teacher') teachersStore.update(account.id!, { avatar: url });
      else parentsStore.update(account.id!, { avatar: url });
      showToast('Profile photo updated successfully!');
    } catch {
      showToast('That image could not be used. Try a different file.', 'error');
    }
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsAccount()) return;
    const email = (form.email ?? '').trim().toLowerCase();
    if (!form.firstName?.trim() || !email.includes('@')) { showToast('First name and a valid email are required.', 'error'); return; }

    if (role === 'school') {
      const s = schoolStorage.get()!;
      if (!form.schoolName?.trim()) { showToast('School name is required.', 'error'); return; }
      schoolStorage.save({ ...s, name: form.schoolName.trim(), adminFirstName: form.firstName.trim(), adminLastName: (form.lastName ?? '').trim(), adminEmail: email, phone: (form.phone ?? '').trim(), location: (form.location ?? '').trim(), about: (form.about ?? '').trim() });
    } else if (role === 'teacher') {
      if (teachersStore.all().some(t => t.id !== account.id && t.email.toLowerCase() === email)) { showToast('Another teacher already uses this email.', 'error'); return; }
      teachersStore.update(account.id!, { firstName: form.firstName.trim(), lastName: (form.lastName ?? '').trim(), email, phone: (form.phone ?? '').trim(), subject: (form.subject ?? '').trim(), location: (form.location ?? '').trim(), bio: (form.bio ?? '').trim() });
    } else {
      if (parentsStore.all().some(p => p.id !== account.id && p.email.toLowerCase() === email)) { showToast('Another parent already uses this email.', 'error'); return; }
      parentsStore.update(account.id!, { firstName: form.firstName.trim(), lastName: (form.lastName ?? '').trim(), email, phone: (form.phone ?? '').trim(), profession: (form.profession ?? '').trim(), location: (form.location ?? '').trim() });
    }
    setSavedAt(savedNow());
    showToast('Personal information updated successfully!');
  };

  const isOn = (id: string) => prefs[id] !== false;
  const writePrefs = (next: Record<string, boolean>) => {
    setPrefs(next);
    if (account.id) notifPrefs.set(role, account.id, next);
  };
  const toggleNotification = (id: string) => {
    if (needsAccount()) return;
    writePrefs({ ...prefs, [id]: !isOn(id) });
    showToast('Notification preference updated');
  };
  const setAllNotifications = (enable: boolean) => {
    if (needsAccount()) return;
    writePrefs(Object.fromEntries(cfg.notifications.map(n => [n.id, enable])));
    showToast(enable ? 'All notifications enabled' : 'All notifications muted');
  };

  const signOut = () => { sessionStore.clear(); navigate('/'); };

  /* overview numbers shown in the left card */
  const summary: { label: string; value: number }[] = (() => {
    if (role === 'school') {
      const id = schoolStorage.get()?.id;
      return [{ label: 'Classes', value: schoolClassesStorage.get().length }, { label: 'Teachers', value: teachersOfSchool(id).length }, { label: 'Students', value: studentsOfSchool(id).length }];
    }
    if (role === 'teacher') {
      const mine = account.id ? classesForTeacher(account.id) : [];
      return [{ label: 'Classes', value: mine.length }, { label: 'Students', value: mine.reduce((n, c) => n + studentsInClass(c.id).length, 0) }];
    }
    return [{ label: 'Children', value: account.id ? childrenOf(account.id).length : 0 }];
  })();

  const displayName = fullName({ firstName: form.firstName ?? '', lastName: form.lastName ?? '' }) || 'Your account';
  const joined = account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';

  return (
    <>
      <SettingsShell
        subtitle={cfg.subtitle}
        banner={{
          avatarUrl, onAvatarFile: handleAvatarFile, name: displayName, roleLabel: cfg.roleLabel, email: form.email,
          meta: [role === 'school' ? form.schoolName || 'School not set' : account.detail, `Joined ${joined}`],
          statusLabel: account.exists ? 'Active account' : 'Not signed in',
        }}
        nav={[
          { id: 'personal', label: 'Personal Information', description: 'Profile identity & contact info', icon: User },
          { id: 'security', label: 'Security & Access', description: 'Password & active sessions', icon: Lock },
          { id: 'notifications', label: 'Notifications', description: 'Alerts & activity updates', icon: Bell },
          { id: 'policies', label: 'Platform Policies', description: 'Legal terms & compliance', icon: ShieldCheck, badge: `${policies.length} Docs` },
        ]}
        active={activeSection}
        onSelect={changeSection}
        summary={{ title: cfg.summaryTitle, items: summary }}
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      >
        {activeSection === 'personal' && (
          <SettingsPanel panelKey="personal" icon={User} title="Personal Information" description={cfg.personalDesc}>
            <form onSubmit={handleSavePersonal} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cfg.fields.map(f => (
                  <div key={f.key} className={`space-y-2 ${f.full ? 'sm:col-span-2' : ''}`}>
                    <label className={SETTINGS_LABEL}>{f.label}</label>
                    {f.textarea ? (
                      <textarea rows={3} value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={`${SETTINGS_INPUT} resize-none`} />
                    ) : (
                      <input type={f.type ?? 'text'} value={form[f.key] ?? ''} disabled={f.disabled} required={f.required} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={f.disabled ? SETTINGS_INPUT_DISABLED : SETTINGS_INPUT} />
                    )}
                    {f.hint && <span className="text-[11px] text-slate-400">{f.hint}</span>}
                  </div>
                ))}
              </div>
              <SaveBar savedAt={savedAt} />
            </form>
          </SettingsPanel>
        )}
        {activeSection === 'security' && <SecurityPanel onSignOutClick={() => setIsSignOutModalOpen(true)} />}
        {activeSection === 'notifications' && (
          <NotificationsPanel description={cfg.notifDesc} items={cfg.notifications} isOn={isOn} onToggle={toggleNotification} onSetAll={setAllNotifications} />
        )}
        {activeSection === 'policies' && <PoliciesPanel role={cfg.policyRole} governance={cfg.governance} />}
      </SettingsShell>

      <SignOutModal open={isSignOutModalOpen} onClose={() => setIsSignOutModalOpen(false)} portalName={cfg.portalName} onConfirm={signOut} />
    </>
  );
}
