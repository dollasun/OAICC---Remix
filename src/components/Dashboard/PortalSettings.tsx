/**
 * Settings page shared by the School, Teacher and Parent portals. It mirrors the Admin settings
 * layout (sticky profile banner, left section navigation, Personal / Security / Notifications /
 * Platform Policies panels, sign-out modal) and saves to the real account records.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle, Bell, Camera, Check, CheckCircle2, ChevronRight, Cookie, ExternalLink, Eye, EyeOff, FileText, Heart, Key, Laptop,
  Lock, LogOut, Scale, School as SchoolIcon, Shield, ShieldCheck, Smartphone, Sparkles, User, UserCheck, X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { PolicyDocument, getPoliciesForRole } from '../../data/policiesData';
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

const INPUT = 'w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-700 text-sm transition-all';
const DISABLED = 'w-full px-5 py-3.5 bg-slate-100/70 border border-slate-200/60 rounded-xl outline-none font-medium text-slate-500 text-sm cursor-not-allowed';

const policyIcon = (id: string) => {
  switch (id) {
    case 'terms': return <FileText className="w-5 h-5 text-indigo-500" />;
    case 'privacy': return <Lock className="w-5 h-5 text-emerald-500" />;
    case 'student-privacy': return <Sparkles className="w-5 h-5 text-amber-500" />;
    case 'cookies': return <Cookie className="w-5 h-5 text-orange-500" />;
    case 'safeguarding': return <ShieldCheck className="w-5 h-5 text-rose-500" />;
    case 'acceptable-use': return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
    case 'counselor-code': return <UserCheck className="w-5 h-5 text-purple-500" />;
    case 'parent-consent': return <Heart className="w-5 h-5 text-pink-500" />;
    case 'school-authority': return <SchoolIcon className="w-5 h-5 text-cyan-500" />;
    case 'complaints-refunds': return <Scale className="w-5 h-5 text-blue-500" />;
    default: return <FileText className="w-5 h-5 text-slate-500" />;
  }
};

/** Describes the browser the user is on right now (the only session we can truthfully show). */
function describeDevice() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'this device';
  return { label: `${browser} on ${os}`, mobile: /iPhone|iPad|Android/.test(ua) };
}

/** Downscales an uploaded photo so it fits comfortably in localStorage. */
function shrinkImage(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

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

function Panel({ id, children }: { id: Section; children: React.ReactNode }) {
  return (
    <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {children}
    </motion.div>
  );
}

export default function PortalSettings({ role }: { role: PortalRole }) {
  const cfg = CONFIG[role];
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const account = useMemo(() => loadAccount(role), [role]);
  const sections: Section[] = ['personal', 'security', 'notifications', 'policies'];
  const tab = searchParams.get('tab') as Section | null;
  const [activeSection, setActiveSection] = useState<Section>(tab && sections.includes(tab) ? tab : 'personal');

  const [form, setForm] = useState<Form>(account.form);
  const [avatarUrl, setAvatarUrl] = useState(account.avatar ?? `https://picsum.photos/seed/${role}-${account.id ?? 'guest'}/200/200`);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirmPass: '' });
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);
  const [policies, setPolicies] = useState<PolicyDocument[]>(() => getPoliciesForRole(cfg.policyRole));
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => notifPrefs.get(role, account.id));

  useEffect(() => {
    const refresh = () => setPolicies(getPoliciesForRole(cfg.policyRole));
    refresh();
    window.addEventListener('oaicc-policies-updated', refresh);
    return () => window.removeEventListener('oaicc-policies-updated', refresh);
  }, [cfg.policyRole]);

  /* sticky banner + nav offsets (same behaviour as the admin page) */
  const profileCardRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [profileCardHeight, setProfileCardHeight] = useState(140);
  const [headerOffset, setHeaderOffset] = useState(73);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const update = () => { const h = document.querySelector('header'); if (h) setHeaderOffset(h.offsetHeight); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    if (!profileCardRef.current) return;
    const update = () => profileCardRef.current && setProfileCardHeight(profileCardRef.current.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(profileCardRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), { threshold: 0, rootMargin: `-${headerOffset}px 0px 0px 0px` });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerOffset]);

  const changeSection = (section: Section) => {
    setActiveSection(section);
    setSearchParams(section === 'personal' ? {} : { tab: section });
    if (isSticky) window.scrollTo({ top: sentinelRef.current ? sentinelRef.current.offsetTop - headerOffset : 0, behavior: 'smooth' });
  };

  const needsAccount = () => {
    if (account.exists) return false;
    showToast(`Sign in with a ${role} account to change your settings.`, 'error');
    return true;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || needsAccount()) return;
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
    setSavedAt(new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }));
    showToast('Personal information updated successfully!');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass.length < 8 || !/[\d\W]/.test(passwordForm.newPass)) { showToast('Use at least 8 characters including a number or symbol.', 'error'); return; }
    if (passwordForm.newPass !== passwordForm.confirmPass) { showToast('Passwords do not match.', 'error'); return; }
    setIsPasswordModalOpen(false);
    setPasswordForm({ current: '', newPass: '', confirmPass: '' });
    showToast('Password sign-in is not enabled yet, so no password was changed.', 'info');
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

  const device = describeDevice();
  const displayName = fullName({ firstName: form.firstName ?? '', lastName: form.lastName ?? '' }) || 'Your account';
  const joined = account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';

  const navItems: { id: Section; label: string; description: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'personal', label: 'Personal Information', description: 'Profile identity & contact info', icon: User },
    { id: 'security', label: 'Security & Access', description: 'Password & active sessions', icon: Lock },
    { id: 'notifications', label: 'Notifications', description: 'Alerts & activity updates', icon: Bell },
    { id: 'policies', label: 'Platform Policies', description: 'Legal terms & compliance', icon: ShieldCheck, badge: `${policies.length} Docs` },
  ];
  const asideTop = headerOffset + profileCardHeight + 16;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">{cfg.subtitle}</p>
      </div>

      <div ref={sentinelRef} className="h-0 w-full pointer-events-none -mb-6" />

      {/* Profile summary banner (sticks under the header on scroll) */}
      <div ref={profileCardRef} style={{ top: `${headerOffset}px` }} className={`sticky z-30 transition-all duration-200 ${isSticky ? 'bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 pb-4 -my-2' : 'pt-0 pb-0'}`}>
        <div className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-6 ${isSticky ? 'border-slate-200 dark:border-slate-800 shadow-md ring-1 ring-slate-900/5' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img src={avatarUrl} alt={form.firstName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm group-hover:opacity-80 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/40 backdrop-blur-[1px] text-white"><Camera className="w-6 h-6" /></div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{displayName}</h2>
                <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold uppercase tracking-wider">{cfg.roleLabel}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">{form.email || 'No email on file'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-medium mt-3">
                <span>{role === 'school' ? form.schoolName || 'School not set' : account.detail}</span>
                <span>•</span>
                <span>Joined {joined}</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {account.exists ? 'Active account' : 'Not signed in'}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsSignOutModalOpen(true)} className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left navigation */}
        <aside style={{ top: `${asideTop}px` }} className="lg:col-span-1 space-y-4 lg:sticky z-20 transition-all duration-200 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Settings Navigation</p>
            <nav className="space-y-1.5" aria-label="Settings Sections">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => changeSection(item.id)} className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group ${active ? 'bg-brand/10 text-brand shadow-xs border border-brand/20 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 border border-transparent font-medium'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-brand text-white shadow-xs' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'}`}><Icon className="w-4 h-4" /></div>
                      <div className="min-w-0 text-left">
                        <span className="block text-sm truncate leading-tight">{item.label}</span>
                        <span className={`block text-[11px] truncate mt-0.5 ${active ? 'text-brand/80 font-normal' : 'text-slate-400 font-normal'}`}>{item.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${active ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>{item.badge}</span>}
                      <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'text-brand translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3 hidden lg:block">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Shield className="w-4 h-4 text-brand" /><span>{cfg.summaryTitle}</span></div>
            <div className="grid grid-cols-2 gap-3">
              {summary.map(item => (
                <div key={item.label}>
                  <p className="text-2xl font-bold text-slate-900 font-display">{item.value}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeSection === 'personal' && (
              <Panel id="personal">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0"><User className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    <p className="text-sm font-medium text-slate-500">{cfg.personalDesc}</p>
                  </div>
                </div>
                <form onSubmit={handleSavePersonal} className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {cfg.fields.map(f => (
                      <div key={f.key} className={`space-y-2 ${f.full ? 'sm:col-span-2' : ''}`}>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{f.label}</label>
                        {f.textarea ? (
                          <textarea rows={3} value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={`${INPUT} resize-none`} />
                        ) : (
                          <input type={f.type ?? 'text'} value={form[f.key] ?? ''} disabled={f.disabled} required={f.required} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={f.disabled ? DISABLED : INPUT} />
                        )}
                        {f.hint && <span className="text-[11px] text-slate-400">{f.hint}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">{savedAt ? `Last saved on ${savedAt}` : 'Changes are saved to your account'}</p>
                    <button type="submit" className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/10 hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </Panel>
            )}

            {activeSection === 'security' && (
              <Panel id="security">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0"><Lock className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Security & Access</h2>
                    <p className="text-sm font-medium text-slate-500">Manage credentials and review where you are signed in.</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs border border-slate-200/60 shrink-0"><Key className="w-5 h-5 text-indigo-500" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">Account Password</h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-600 border border-amber-200">Coming soon</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Password sign-in is not enabled yet, so passwords can't be changed here.</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setIsPasswordModalOpen(true)} className="px-5 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-brand hover:text-brand transition-all shadow-xs shrink-0">Change Password</button>
                  </div>

                  <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs border border-slate-200/60 shrink-0"><Smartphone className="w-5 h-5 text-emerald-500" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-600 border border-amber-200">Coming soon</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Two-factor authentication will require a 6-digit code on every sign-in once it is available.</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-slate-300 opacity-60 cursor-not-allowed shrink-0" role="switch" aria-checked={false} aria-disabled="true">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-xs" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Device Sessions</h4>
                    <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">{device.mobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}</div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 flex items-center gap-2">{device.label}<span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">Current</span></p>
                          <p className="text-[11px] text-slate-400">Active now</p>
                        </div>
                      </div>
                      <button onClick={() => setIsSignOutModalOpen(true)} className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline">Sign out</button>
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            {activeSection === 'notifications' && (
              <Panel id="notifications">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0"><Bell className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
                      <p className="text-sm font-medium text-slate-500">{cfg.notifDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setAllNotifications(true)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Enable All</button>
                    <button type="button" onClick={() => setAllNotifications(false)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Mute All</button>
                  </div>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  {cfg.notifications.map(item => {
                    const on = isOn(item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{item.title}</span>
                            {item.badge && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand/10 text-brand">{item.badge}</span>}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                        </div>
                        <div onClick={() => toggleNotification(item.id)} className={`relative inline-block w-12 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${on ? 'bg-brand' : 'bg-slate-300'}`} role="switch" aria-checked={on}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${on ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between p-4 bg-slate-50/40 rounded-xl border border-dashed border-slate-200 gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 text-sm">Email & SMS Notifications</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600">Coming soon</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Email and SMS delivery isn't available yet. Notifications appear in your in-app inbox.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-slate-300 opacity-60 cursor-not-allowed shrink-0" role="switch" aria-checked={false} aria-disabled="true"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-xs" /></div>
                  </div>
                </div>
              </Panel>
            )}

            {activeSection === 'policies' && (
              <Panel id="policies">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Platform Policies & Governance</h2>
                      <p className="text-sm font-medium text-slate-500">Review the terms, privacy guidelines and conduct standards that apply to your account.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => navigate(`/policies?role=${cfg.policyRole}`)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-brand text-xs font-bold rounded-xl border border-slate-200/80 transition-all shrink-0">
                    Open Legal Hub <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div><span className="font-bold">Governance Notice:</span> {cfg.governance}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {policies.map(policy => (
                      <div key={policy.id} onClick={() => setSelectedPolicy(policy)} className="bg-slate-50/60 hover:bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:border-brand/40 transition-all flex items-center justify-between gap-4 cursor-pointer group">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-xs">{policyIcon(policy.id)}</div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors truncate">{policy.title}</h4>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold shrink-0">v{policy.version || '1.0'}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{policy.tagline}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-brand group-hover:underline hidden sm:inline">Read Policy</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">Updated in accordance with NDPA 2023 & statutory guidelines</div>
                </div>
              </Panel>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Change password modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPasswordModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSavePassword} className="p-6 space-y-4">
                {(['current', 'newPass', 'confirmPass'] as const).map(k => (
                  <div key={k} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">{k === 'current' ? 'Current Password' : k === 'newPass' ? 'New Password' : 'Confirm New Password'}</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} value={passwordForm[k]} onChange={e => setPasswordForm({ ...passwordForm, [k]: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm" placeholder="••••••••••••" />
                      {k === 'current' && (
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700">Password requirements:</p>
                  <p>• At least 8 characters</p>
                  <p>• Contains a number or symbol</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
                  <button type="submit" className="w-1/2 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:brightness-105 transition-all flex items-center justify-center gap-2 text-sm">Update Password <CheckCircle2 className="w-4 h-4" /></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Policy viewer (read-only) */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPolicy(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{policyIcon(selectedPolicy.id)}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedPolicy.title}</h3>
                    <p className="text-xs text-slate-500">Version {selectedPolicy.version} · Last updated {selectedPolicy.lastUpdated}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedPolicy(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
                <p className="text-slate-600 font-medium italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">{selectedPolicy.tagline}</p>
                {selectedPolicy.sections.map((section, idx) => (
                  <div key={section.id || idx} className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">{section.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button type="button" onClick={() => { const slug = selectedPolicy.slug; setSelectedPolicy(null); navigate(`/policies/${slug}?role=${cfg.policyRole}`); }} className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  Open in dedicated page <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => setSelectedPolicy(null)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign out modal */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSignOutModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><LogOut className="w-8 h-8" /></div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Sign Out of {cfg.portalName}</h2>
              <p className="text-sm text-slate-500 mb-6">Are you sure you want to end your session?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsSignOutModalOpen(false)} className="py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
                <button onClick={signOut} className="py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-sm">Sign Out</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
