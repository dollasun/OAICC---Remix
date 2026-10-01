import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  ShieldCheck, 
  ChevronRight, 
  Camera, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  LogOut, 
  Key, 
  Smartphone, 
  FileText, 
  ExternalLink, 
  AlertCircle, 
  Check, 
  Sparkles, 
  Cookie, 
  UserCheck, 
  Heart, 
  School, 
  Scale, 
  Globe, 
  Clock, 
  Laptop, 
  Sliders
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { PolicyDocument, getPoliciesForRole } from '../../../data/policiesData';
import AdminPolicyModal from './AdminPolicyModal';

type SettingsSection = 'personal' | 'security' | 'notifications' | 'policies';

export default function AdminSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active section in 1x3 grid
  const initialSection = (searchParams.get('tab') as SettingsSection) || 'personal';
  const [activeSection, setActiveSection] = useState<SettingsSection>(
    ['personal', 'security', 'notifications', 'policies'].includes(initialSection) 
      ? initialSection 
      : 'personal'
  );

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);

  // Profile state
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/admin/200/200');
  const [personalForm, setPersonalForm] = useState({
    firstName: 'Bolu',
    lastName: 'Ahmed',
    email: 'boluahmed@oaicc.com',
    phone: '+234 812 345 6789',
    role: 'Super Administrator',
    department: 'Platform Operations & Strategy',
    timezone: 'Africa/Lagos (WAT, UTC+1)',
    bio: 'Overseeing OAICC career guidance operations, mentor partnerships, and counselor verification across institutions.'
  });

  // Security state
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    forumPosts: true,
    mentorApplications: true,
    counselorRegistrations: true,
    eventRegistrations: true,
    systemUpdates: true,
    securityAlerts: true,
    weeklyDigest: false,
    smsAlerts: false
  });

  // Admin Policies with live sync
  const [adminPolicies, setAdminPolicies] = useState<PolicyDocument[]>(() => getPoliciesForRole('admin'));

  useEffect(() => {
    const handlePoliciesUpdated = () => {
      setAdminPolicies(getPoliciesForRole('admin'));
    };
    window.addEventListener('oaicc-policies-updated', handlePoliciesUpdated);
    return () => window.removeEventListener('oaicc-policies-updated', handlePoliciesUpdated);
  }, []);

  // Fixed Scroll & Sticky Header detection
  const profileCardRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [profileCardHeight, setProfileCardHeight] = useState(140);
  const [headerOffset, setHeaderOffset] = useState(73);
  const [isSticky, setIsSticky] = useState(false);

  // Measure dashboard header dynamically
  useEffect(() => {
    const updateHeaderOffset = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderOffset(header.offsetHeight);
      }
    };
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);
    return () => window.removeEventListener('resize', updateHeaderOffset);
  }, []);

  // Measure profile card height dynamically
  useEffect(() => {
    if (!profileCardRef.current) return;
    const updateHeight = () => {
      if (profileCardRef.current) {
        setProfileCardHeight(profileCardRef.current.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(profileCardRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect when profile card reaches the top and becomes fixed
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${headerOffset}px 0px 0px 0px`
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerOffset]);

  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section);
    setSearchParams(section === 'personal' ? {} : { tab: section });
    if (isSticky) {
      window.scrollTo({
        top: sentinelRef.current ? sentinelRef.current.offsetTop - headerOffset : 0,
        behavior: 'smooth'
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        showToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Personal information updated successfully!');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirmPass) {
      showToast('Passwords do not match or are empty');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ current: '', newPass: '', confirmPass: '' });
    showToast('Password changed successfully! Next login requires new credentials.');
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast('Notification preference updated');
  };

  const handleToggleAllNotifications = (enable: boolean) => {
    setNotifications({
      forumPosts: enable,
      mentorApplications: enable,
      counselorRegistrations: enable,
      eventRegistrations: enable,
      systemUpdates: enable,
      securityAlerts: true, // Keep critical security alerts enabled
      weeklyDigest: enable,
      smsAlerts: enable
    });
    showToast(enable ? 'All notifications enabled' : 'Optional notifications disabled');
  };

  const getPolicyIcon = (id: string) => {
    switch (id) {
      case 'terms':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'privacy':
        return <Lock className="w-5 h-5 text-emerald-500" />;
      case 'student-privacy':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'cookies':
        return <Cookie className="w-5 h-5 text-orange-500" />;
      case 'safeguarding':
        return <ShieldCheck className="w-5 h-5 text-rose-500" />;
      case 'acceptable-use':
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      case 'counselor-code':
        return <UserCheck className="w-5 h-5 text-purple-500" />;
      case 'parent-consent':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'school-authority':
        return <School className="w-5 h-5 text-cyan-500" />;
      case 'complaints-refunds':
        return <Scale className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const sectionsConfig: {
    id: SettingsSection;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: 'personal',
      label: 'Personal Information',
      description: 'Profile identity & contact info',
      icon: User
    },
    {
      id: 'security',
      label: 'Security & Access',
      description: 'Password, 2FA & sessions',
      icon: Lock,
      badge: is2FAEnabled ? '2FA Active' : undefined
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Alerts, digests & system notices',
      icon: Bell
    },
    {
      id: 'policies',
      label: 'Platform Policies',
      description: 'Legal terms & compliance',
      icon: ShieldCheck,
      badge: `${adminPolicies.length} Docs`
    }
  ];

  const asideTop = headerOffset + profileCardHeight + 16;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your administrative profile, security policies, and system preferences.</p>
      </div>

      {/* Sentinel marker right before the profile card to trigger fixed state */}
      <div ref={sentinelRef} className="h-0 w-full pointer-events-none -mb-6" />

      {/* Profile Summary Banner - Becomes FIXED when user scrolls past header */}
      <div 
        ref={profileCardRef}
        style={{ top: `${headerOffset}px` }}
        className={`sticky z-30 transition-all duration-200 ${
          isSticky 
            ? 'bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 pb-4 -my-2' 
            : 'pt-0 pb-0'
        }`}
      >
        <div className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isSticky 
            ? 'border-slate-200 dark:border-slate-800 shadow-md ring-1 ring-slate-900/5' 
            : 'border-slate-100 dark:border-slate-800 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img 
                src={avatarUrl} 
                alt={personalForm.firstName} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm group-hover:opacity-80 transition-all"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/40 backdrop-blur-xs text-white">
                <Camera className="w-6 h-6" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {personalForm.firstName} {personalForm.lastName}
                </h2>
                <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold uppercase tracking-wider">
                  {personalForm.role}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">{personalForm.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-medium mt-3">
                <span>Department: {personalForm.department}</span>
                <span>•</span>
                <span>Joined Jan 2022</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Verified Admin
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsSignOutModalOpen(true)}
            className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* 1x3 Grid Container: 1 col on left (navigation titles), 3 cols on right (content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ================= COLUMN 1 (Left 1-col navigation - FIXED on scroll) ================= */}
        <aside 
          style={{ top: `${asideTop}px` }}
          className="lg:col-span-1 space-y-4 lg:sticky z-20 transition-all duration-200 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Settings Navigation
            </p>
            <nav className="space-y-1.5" aria-label="Settings Sections">
              {sectionsConfig.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-brand/10 text-brand shadow-xs border border-brand/20 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 border border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-brand text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block text-sm truncate leading-tight">
                          {section.label}
                        </span>
                        <span className={`block text-[11px] truncate mt-0.5 ${
                          isActive ? 'text-brand/80 font-normal' : 'text-slate-400 font-normal'
                        }`}>
                          {section.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {section.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          isActive
                            ? 'bg-brand text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {section.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-brand translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick System Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3 hidden lg:block">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Shield className="w-4 h-4 text-brand" />
              <span>Admin Security Score</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-brand h-full rounded-full w-full"></div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Account protected with 2FA, encrypted session tokens, and RBAC permissions.
            </p>
          </div>
        </aside>

        {/* ================= COLUMN 3 (Right 3-cols content) ================= */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* 1. PERSONAL INFORMATION SECTION */}
            {activeSection === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                      <p className="text-sm font-medium text-slate-500">Update your administrator profile, credentials, and workplace details.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSavePersonal} className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                      <input 
                        type="text" 
                        value={personalForm.firstName}
                        onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                      <input 
                        type="text" 
                        value={personalForm.lastName}
                        onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Work Email Address</label>
                      <input 
                        type="email" 
                        value={personalForm.email}
                        onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="tel" 
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Administrative Role</label>
                      <input 
                        type="text" 
                        disabled
                        value={personalForm.role}
                        className="w-full px-5 py-3.5 bg-slate-100/70 border border-slate-200/60 rounded-xl outline-none font-medium text-slate-500 text-sm cursor-not-allowed" 
                      />
                      <span className="text-[11px] text-slate-400">Assigned by System Master Administrator</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Department</label>
                      <input 
                        type="text" 
                        value={personalForm.department}
                        onChange={(e) => setPersonalForm({ ...personalForm, department: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 text-sm transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Operational Bio</label>
                    <textarea 
                      rows={3}
                      value={personalForm.bio}
                      onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">Last saved on September 30, 2026</p>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/10 hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* 2. SECURITY SECTION */}
            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Security & Access</h2>
                      <p className="text-sm font-medium text-slate-500">Manage credentials, two-factor authentication, and monitor active sessions.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Password Card */}
                  <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-700 shadow-xs border border-slate-200/60 shrink-0">
                        <Key className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Account Password</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Last updated 3 months ago. Strong alphanumeric with special characters.</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-5 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-brand hover:text-brand transition-all shadow-xs shrink-0 self-start sm:self-auto"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Two-Factor Authentication Card */}
                  <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-700 shadow-xs border border-slate-200/60 shrink-0">
                        <Smartphone className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            is2FAEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {is2FAEnabled ? 'Protected' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requires a 6-digit confirmation code from your authenticator app on every administrative login.
                        </p>
                      </div>
                    </div>
                    <div 
                      onClick={() => {
                        setIs2FAEnabled(!is2FAEnabled);
                        showToast(`Two-Factor Authentication ${!is2FAEnabled ? 'activated' : 'deactivated'}`);
                      }}
                      className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                        is2FAEnabled ? 'bg-brand' : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={is2FAEnabled}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                        is2FAEnabled ? 'right-1' : 'left-1'
                      }`}></div>
                    </div>
                  </div>

                  {/* Active Administrative Sessions */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Device Sessions</h4>
                    <div className="space-y-2">
                      <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Laptop className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                              Chrome on macOS (Apple Silicon)
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">Current</span>
                            </p>
                            <p className="text-[11px] text-slate-400">Lagos, Nigeria • IP 102.89.34.12 • Active Now</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">This Computer</span>
                      </div>

                      <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">OAICC Mobile Admin on iPhone 15 Pro</p>
                            <p className="text-[11px] text-slate-400">Abuja, Nigeria • IP 105.112.44.89 • Last active 2 days ago</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => showToast('Session revoked successfully')}
                          className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. NOTIFICATIONS SECTION */}
            {activeSection === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
                      <p className="text-sm font-medium text-slate-500">Configure administrative notifications, platform digests, and critical alerts.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAllNotifications(true)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Enable All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAllNotifications(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Minimal
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {[
                    {
                      id: 'mentorApplications' as const,
                      title: 'New Mentor Applications',
                      desc: 'Get notified when an industry professional applies to become an OAICC career mentor.',
                      badge: 'High Priority'
                    },
                    {
                      id: 'counselorRegistrations' as const,
                      title: 'Counselor Verification Requests',
                      desc: 'Receive alerts when school counselors submit license and credentials for verification.',
                      badge: 'High Priority'
                    },
                    {
                      id: 'forumPosts' as const,
                      title: 'Forum Flags & Moderation Alerts',
                      desc: 'Instant notice if students or mentors report a discussion thread for policy review.'
                    },
                    {
                      id: 'eventRegistrations' as const,
                      title: 'Event Registration Milestones',
                      desc: 'Alerts when upcoming webinars and career fairs reach capacity thresholds.'
                    },
                    {
                      id: 'systemUpdates' as const,
                      title: 'System & Database Updates',
                      desc: 'Weekly system health reports, automatic backup logs, and infrastructure notices.'
                    },
                    {
                      id: 'securityAlerts' as const,
                      title: 'Security Alerts & Unusual Logins',
                      desc: 'Immediate notifications for unrecognized device logins or multiple failed attempts.',
                      badge: 'Critical',
                      locked: true
                    }
                  ].map((item) => {
                    const isEnabled = notifications[item.id];
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors gap-4"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{item.title}</span>
                            {item.badge && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.badge === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-brand/10 text-brand'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                        </div>

                        <div 
                          onClick={() => {
                            if (!item.locked) {
                              handleToggleNotification(item.id);
                            }
                          }}
                          className={`relative inline-block w-12 h-6 rounded-full transition-colors shrink-0 ${
                            item.locked 
                              ? 'bg-brand cursor-not-allowed opacity-80' 
                              : isEnabled ? 'bg-brand cursor-pointer' : 'bg-slate-300 cursor-pointer'
                          }`}
                          role="switch"
                          aria-checked={isEnabled}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                            isEnabled ? 'right-1' : 'left-1'
                          }`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. PLATFORM POLICIES SECTION */}
            {activeSection === 'policies' && (
              <motion.div
                key="policies"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Platform Policies & Governance</h2>
                      <p className="text-sm font-medium text-slate-500">
                        Review binding user terms, NDPA 2023 child safeguarding guidelines, and counselor codes.
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => navigate('/policies?role=admin')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-brand text-xs font-bold rounded-xl border border-slate-200/80 transition-all shrink-0 self-start sm:self-auto"
                  >
                    Open Legal Hub <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Administrative Governance Notice:</span> All administrators have a fiduciary duty to enforce Nigerian Data Protection Act (NDPA 2023) standards, safeguard student personal identifiers, and uphold fair moderation standards.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {adminPolicies.map((policy) => (
                      <div 
                        key={policy.id}
                        onClick={() => setSelectedPolicy(policy)}
                        className="bg-slate-50/60 hover:bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:border-brand/40 transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-xs"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-xs">
                            {getPolicyIcon(policy.id)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors truncate">
                                {policy.title}
                              </h4>
                              {/* Visibility Badge */}
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                policy.isHidden
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {policy.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {policy.isHidden ? 'Hidden' : 'Visible'}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold shrink-0">
                                v{policy.version || '1.0'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {policy.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-brand group-hover:underline hidden sm:inline">
                            Manage & Edit
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                    <span>Effective: September 2026 • Registered under OruAikiIse Ltd</span>
                    <button 
                      onClick={() => navigate('/policies?role=admin')}
                      className="text-brand font-bold hover:underline"
                    >
                      View All Documents & Print Copies
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                      <p className="text-xs text-slate-500">Update your administrative login credentials</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsPasswordModalOpen(false)} 
                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPassword ? 'text' : 'password'} 
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm" 
                        placeholder="••••••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? 'text' : 'password'} 
                        value={passwordForm.newPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm" 
                        placeholder="••••••••••••" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                    <input 
                      type={showNewPassword ? 'text' : 'password'} 
                      value={passwordForm.confirmPass}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm" 
                      placeholder="••••••••••••" 
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">Password requirements:</p>
                    <p>• At least 8 characters</p>
                    <p>• Contains a number or symbol</p>
                  </div>
                  
                  <div className="pt-2 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="w-1/2 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:brightness-105 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      Update Password <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Policy Management & Editor Modal */}
      <AdminPolicyModal
        policy={selectedPolicy}
        isOpen={!!selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
        onPolicyUpdated={(updated) => {
          setSelectedPolicy(updated);
          setAdminPolicies(getPoliciesForRole('admin'));
        }}
      />

      {/* Sign Out Modal */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignOutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Sign Out of Admin Portal</h2>
              <p className="text-sm text-slate-500 mb-6">Are you sure you want to end your administrative session?</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/signin'}
                  className="py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-sm"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
