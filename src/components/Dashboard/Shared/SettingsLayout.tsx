/**
 * The standard settings layout used by every portal (it mirrors the Admin settings page): a profile
 * banner that sticks under the header, a left section navigation with an overview card, one panel per
 * section, and shared Security, Notifications and Platform Policies panels with their modals.
 * Portals supply their own Personal/profile panels; everything else looks and behaves the same.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle, Bell, Camera, Check, CheckCircle2, ChevronRight, Cookie, ExternalLink, Eye, EyeOff, FileText, Heart, Key, Laptop,
  Lock, LogOut, Scale, School as SchoolIcon, Shield, ShieldCheck, Smartphone, Sparkles, UserCheck, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { PolicyDocument, getPoliciesForRole } from '../../../data/policiesData';

export const SETTINGS_INPUT = 'w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-700 text-sm transition-all';
export const SETTINGS_INPUT_DISABLED = 'w-full px-5 py-3.5 bg-slate-100/70 border border-slate-200/60 rounded-xl outline-none font-medium text-slate-500 text-sm cursor-not-allowed';
export const SETTINGS_LABEL = 'text-xs font-bold text-slate-700 uppercase tracking-wider';

export interface SettingsNavItem { id: string; label: string; description: string; icon: React.ElementType; badge?: string }

/** Downscales an uploaded photo so it fits comfortably in localStorage. */
export function shrinkImage(file: File, max = 256): Promise<string> {
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

/* ───────────── shell ───────────── */

interface ShellProps {
  title?: string;
  subtitle: string;
  banner: {
    avatarUrl: string;
    onAvatarFile: (file: File) => void;
    name: string;
    roleLabel: string;
    email: string;
    /** Short facts shown under the email, e.g. school, joined date. */
    meta: React.ReactNode[];
    statusLabel: string;
    verified?: boolean;
  };
  nav: SettingsNavItem[];
  active: string;
  onSelect: (id: string) => void;
  summary?: { title: string; items: { label: string; value: number | string }[] };
  onSignOutClick: () => void;
  children: React.ReactNode;
}

export function SettingsShell({ title = 'Settings', subtitle, banner, nav, active, onSelect, summary, onSignOutClick, children }: ShellProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const select = (id: string) => {
    onSelect(id);
    if (isSticky) window.scrollTo({ top: sentinelRef.current ? sentinelRef.current.offsetTop - headerOffset : 0, behavior: 'smooth' });
  };
  const asideTop = headerOffset + profileCardHeight + 16;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 font-medium mt-1">{subtitle}</p>
      </div>

      <div ref={sentinelRef} className="h-0 w-full pointer-events-none -mb-6" />

      {/* Profile summary banner (sticks under the header on scroll) */}
      <div ref={profileCardRef} style={{ top: `${headerOffset}px` }} className={`sticky z-30 transition-all duration-200 ${isSticky ? 'bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 pb-4 -my-2' : 'pt-0 pb-0'}`}>
        <div className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-6 ${isSticky ? 'border-slate-200 dark:border-slate-800 shadow-md ring-1 ring-slate-900/5' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left min-w-0">
            <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()} title="Change profile photo">
              <img src={banner.avatarUrl} alt={banner.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm group-hover:opacity-80 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/40 backdrop-blur-[1px] text-white"><Camera className="w-6 h-6" /></div>
              {banner.verified && (
                <div className="absolute -bottom-1 -right-1 bg-brand text-white p-1 rounded-lg border-2 border-white dark:border-slate-900 shadow-sm" title="Verified"><CheckCircle2 className="w-4 h-4" /></div>
              )}
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) banner.onAvatarFile(f); }} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{banner.name}</h2>
                <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold uppercase tracking-wider">{banner.roleLabel}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">{banner.email || 'No email on file'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-400 font-medium mt-3">
                {banner.meta.map((m, i) => (
                  <React.Fragment key={i}>{i > 0 && <span aria-hidden>•</span>}<span className="flex items-center gap-1">{m}</span></React.Fragment>
                ))}
                {banner.meta.length > 0 && <span aria-hidden>•</span>}
                <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {banner.statusLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={onSignOutClick} className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside style={{ top: `${asideTop}px` }} className="lg:col-span-1 space-y-4 lg:sticky z-20 transition-all duration-200 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Settings Navigation</p>
            <nav className="space-y-1.5" aria-label="Settings Sections">
              {nav.map(item => {
                const Icon = item.icon;
                const on = active === item.id;
                return (
                  <button key={item.id} onClick={() => select(item.id)} aria-current={on ? 'page' : undefined}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group ${on ? 'bg-brand/10 text-brand shadow-xs border border-brand/20 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 border border-transparent font-medium'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${on ? 'bg-brand text-white shadow-xs' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'}`}><Icon className="w-4 h-4" /></div>
                      <div className="min-w-0 text-left">
                        <span className="block text-sm truncate leading-tight">{item.label}</span>
                        <span className={`block text-[11px] truncate mt-0.5 font-normal ${on ? 'text-brand/80' : 'text-slate-400'}`}>{item.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${on ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>{item.badge}</span>}
                      <ChevronRight className={`w-4 h-4 transition-transform ${on ? 'text-brand translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {summary && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3 hidden lg:block">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Shield className="w-4 h-4 text-brand" /><span>{summary.title}</span></div>
              <div className="grid grid-cols-2 gap-3">
                {summary.items.map(item => (
                  <div key={item.label}>
                    <p className="text-2xl font-bold text-slate-900 font-display">{item.value}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="lg:col-span-3 min-w-0">
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ───────────── panels ───────────── */

export function SettingsPanel({ panelKey, icon: Icon, tone = 'bg-brand/10 text-brand', title, description, actions, children }: {
  panelKey: string; icon: React.ElementType; tone?: string; title: string; description: string; actions?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <motion.div key={panelKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tone}`}><Icon className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm font-medium text-slate-500">{description}</p>
          </div>
        </div>
        {actions}
      </div>
      {children}
    </motion.div>
  );
}

/** Save row at the bottom of a form panel. */
export function SaveBar({ savedAt, label = 'Save Changes' }: { savedAt: string | null; label?: string }) {
  return (
    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
      <p className="text-xs text-slate-400 font-medium">{savedAt ? `Last saved on ${savedAt}` : 'Changes are saved to your account'}</p>
      <button type="submit" className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/10 hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-2 text-sm shrink-0">
        <Check className="w-4 h-4" /> {label}
      </button>
    </div>
  );
}

export const savedNow = () => new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

/** Describes the browser the user is on right now (the only session we can truthfully show). */
function describeDevice() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'this device';
  return { label: `${browser} on ${os}`, mobile: /iPhone|iPad|Android/.test(ua) };
}

const ComingSoon = () => <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-600 border border-amber-200">Coming soon</span>;
const DisabledSwitch = () => (
  <div className="relative inline-block w-12 h-6 rounded-full bg-slate-300 opacity-60 cursor-not-allowed shrink-0" role="switch" aria-checked={false} aria-disabled="true">
    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-xs" />
  </div>
);

/** Security & Access: password and 2FA (not available yet, stated honestly) and the current device. */
export function SecurityPanel({ onSignOutClick }: { onSignOutClick: () => void }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState({ current: '', newPass: '', confirmPass: '' });
  const device = describeDevice();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPass.length < 8 || !/[\d\W]/.test(pw.newPass)) { showToast('Use at least 8 characters including a number or symbol.', 'error'); return; }
    if (pw.newPass !== pw.confirmPass) { showToast('Passwords do not match.', 'error'); return; }
    setOpen(false);
    setPw({ current: '', newPass: '', confirmPass: '' });
    showToast('Password sign-in is not enabled yet, so no password was changed.', 'info');
  };

  return (
    <>
      <SettingsPanel panelKey="security" icon={Lock} tone="bg-indigo-50 text-indigo-500" title="Security & Access" description="Manage credentials and review where you are signed in.">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs border border-slate-200/60 shrink-0"><Key className="w-5 h-5 text-indigo-500" /></div>
              <div>
                <div className="flex items-center gap-2"><h4 className="font-bold text-slate-900 text-sm">Account Password</h4><ComingSoon /></div>
                <p className="text-xs text-slate-500 mt-0.5">Password sign-in is not enabled yet, so passwords can't be changed here.</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="px-5 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-brand hover:text-brand transition-all shadow-xs shrink-0">Change Password</button>
          </div>

          <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs border border-slate-200/60 shrink-0"><Smartphone className="w-5 h-5 text-emerald-500" /></div>
              <div>
                <div className="flex items-center gap-2"><h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4><ComingSoon /></div>
                <p className="text-xs text-slate-500 mt-0.5">Two-factor authentication will require a 6-digit code on every sign-in once it is available.</p>
              </div>
            </div>
            <DisabledSwitch />
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
              <button onClick={onSignOutClick} className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline">Sign out</button>
            </div>
          </div>
        </div>
      </SettingsPanel>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
          <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {(['current', 'newPass', 'confirmPass'] as const).map(k => (
            <div key={k} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{k === 'current' ? 'Current Password' : k === 'newPass' ? 'New Password' : 'Confirm New Password'}</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={pw[k]} onChange={e => setPw({ ...pw, [k]: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm" placeholder="••••••••••••" />
                {k === 'current' && (
                  <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide passwords' : 'Show passwords'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
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
            <button type="button" onClick={() => setOpen(false)} className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
            <button type="submit" className="w-1/2 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:brightness-105 transition-all flex items-center justify-center gap-2 text-sm">Update Password <CheckCircle2 className="w-4 h-4" /></button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export interface NotificationItem { id: string; title: string; desc: string; badge?: string }

/** Notification Preferences: one switch per in-app notification type, plus Enable/Mute all. */
export function NotificationsPanel({ description, items, isOn, onToggle, onSetAll }: {
  description: string; items: NotificationItem[]; isOn: (id: string) => boolean; onToggle: (id: string) => void; onSetAll: (enable: boolean) => void;
}) {
  return (
    <SettingsPanel panelKey="notifications" icon={Bell} tone="bg-emerald-50 text-emerald-500" title="Notification Preferences" description={description}
      actions={
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onSetAll(true)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Enable All</button>
          <button type="button" onClick={() => onSetAll(false)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Mute All</button>
        </div>
      }>
      <div className="p-6 sm:p-8 space-y-4">
        {items.map(item => {
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
              <button type="button" onClick={() => onToggle(item.id)} role="switch" aria-checked={on} aria-label={item.title}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-brand' : 'bg-slate-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-all ${on ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          );
        })}
        <div className="flex items-center justify-between p-4 bg-slate-50/40 rounded-xl border border-dashed border-slate-200 gap-4">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2"><span className="font-bold text-slate-500 text-sm">Email & SMS Notifications</span><ComingSoon /></div>
            <p className="text-xs text-slate-400 font-medium">Email and SMS delivery isn't available yet. Notifications appear in your in-app inbox.</p>
          </div>
          <DisabledSwitch />
        </div>
      </div>
    </SettingsPanel>
  );
}

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

export type PolicyRole = Parameters<typeof getPoliciesForRole>[0];

/** The policies that apply to a role, kept fresh when an admin edits them. */
export function usePolicies(role: PolicyRole) {
  const [policies, setPolicies] = useState<PolicyDocument[]>(() => getPoliciesForRole(role));
  useEffect(() => {
    const refresh = () => setPolicies(getPoliciesForRole(role));
    refresh();
    window.addEventListener('oaicc-policies-updated', refresh);
    return () => window.removeEventListener('oaicc-policies-updated', refresh);
  }, [role]);
  return policies;
}

/** Platform Policies & Governance: the role's policies with an in-page reader. */
export function PoliciesPanel({ role, governance }: { role: PolicyRole; governance: string }) {
  const navigate = useNavigate();
  const policies = usePolicies(role);
  const [selected, setSelected] = useState<PolicyDocument | null>(null);
  return (
    <>
      <SettingsPanel panelKey="policies" icon={ShieldCheck} tone="bg-indigo-50 text-indigo-500" title="Platform Policies & Governance"
        description="Review the terms, privacy guidelines and conduct standards that apply to your account."
        actions={
          <button type="button" onClick={() => navigate(`/policies?role=${role}`)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-brand text-xs font-bold rounded-xl border border-slate-200/80 transition-all shrink-0">
            Open Legal Hub <ExternalLink className="w-3.5 h-3.5" />
          </button>
        }>
        <div className="p-6 sm:p-8 space-y-4">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div><span className="font-bold">Governance Notice:</span> {governance}</div>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-2">
            {policies.map(policy => (
              <button key={policy.id} type="button" onClick={() => setSelected(policy)} className="text-left bg-slate-50/60 hover:bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:border-brand/40 transition-all flex items-center justify-between gap-4 group">
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
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">Updated in accordance with NDPA 2023 & statutory guidelines</div>
        </div>
      </SettingsPanel>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div role="dialog" aria-modal="true" aria-label={selected.title} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{policyIcon(selected.id)}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selected.title}</h3>
                    <p className="text-xs text-slate-500">Version {selected.version} · Last updated {selected.lastUpdated}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
                <p className="text-slate-600 font-medium italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">{selected.tagline}</p>
                {selected.sections.map((section, idx) => (
                  <div key={section.id || idx} className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">{section.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button type="button" onClick={() => { const slug = selected.slug; setSelected(null); navigate(`/policies/${slug}?role=${role}`); }} className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  Open in dedicated page <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => setSelected(null)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────── modals ───────────── */

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function SignOutModal({ open, onClose, portalName, onConfirm }: { open: boolean; onClose: () => void; portalName: string; onConfirm: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><LogOut className="w-8 h-8" /></div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Sign Out of {portalName}</h2>
        <p className="text-sm text-slate-500 mb-6">Are you sure you want to end your session?</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
          <button onClick={onConfirm} className="py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-sm">Sign Out</button>
        </div>
      </div>
    </Modal>
  );
}
