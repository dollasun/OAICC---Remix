import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Eye, 
  EyeOff, 
  Shield, 
  ShieldCheck, 
  Bell, 
  Trash2, 
  Calendar, 
  Target, 
  BarChart, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Cookie, 
  Laptop, 
  Smartphone, 
  School, 
  AlertCircle,
  Key,
  BookOpen
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { intakeQuestions } from '../../../data/questionnaire';
import { PolicyDocument, getPoliciesForRole } from '../../../data/policiesData';

type StudentSection = 'assessment' | 'personal' | 'events' | 'security' | 'notifications' | 'policies';

export default function StudentSettings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const tabParam = searchParams.get('tab');
  const initialSection: StudentSection = 
    tabParam === 'intake' || tabParam === 'assessment' 
      ? 'assessment' 
      : tabParam === 'personal'
        ? 'personal'
        : tabParam === 'events'
          ? 'events'
          : tabParam === 'security'
            ? 'security'
            : tabParam === 'notifications'
              ? 'notifications'
              : tabParam === 'policies' 
                ? 'policies' 
                : 'assessment';

  const [activeSection, setActiveSection] = useState<StudentSection>(initialSection);

  // Modals state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);

  // Profile info state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState('https://picsum.photos/seed/student/200/200');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    fullName: 'Bolu Ahmed',
    email: 'bolu.ahmed@example.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    school: 'Lagos City College',
    grade: 'Senior Secondary School (SS 2)'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mentor: true,
    sessions: true,
    system: false
  });

  // Assessment / Intake state
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem('studentIntakeAnswers');
    if (saved) {
      try {
        setIntakeAnswers(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing intake answers', err);
      }
    }
  }, []);

  const handleIntakeChange = (id: string, value: string | string[], type: string) => {
    if (type === 'multiple') {
      const current = (intakeAnswers[id] as string[]) || [];
      const valStr = value as string;
      const updatedList = current.includes(valStr)
        ? current.filter(item => item !== valStr)
        : [...current, valStr];
      const updated = { ...intakeAnswers, [id]: updatedList };
      setIntakeAnswers(updated);
      localStorage.setItem('studentIntakeAnswers', JSON.stringify(updated));
    } else {
      const updated = { ...intakeAnswers, [id]: value };
      setIntakeAnswers(updated);
      localStorage.setItem('studentIntakeAnswers', JSON.stringify(updated));
    }
    showToast('Progress saved automatically');
  };

  const answeredCount = Object.keys(intakeAnswers).filter(k => {
    const val = intakeAnswers[k];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  }).length;
  const totalQuestions = intakeQuestions.length;
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  // Student Policies (filters out hidden documents)
  const [studentPolicies, setStudentPolicies] = useState<PolicyDocument[]>(() => getPoliciesForRole('student'));

  useEffect(() => {
    const handleUpdated = () => {
      setStudentPolicies(getPoliciesForRole('student'));
    };
    window.addEventListener('oaicc-policies-updated', handleUpdated);
    return () => window.removeEventListener('oaicc-policies-updated', handleUpdated);
  }, []);

  // Fixed Scroll & Sticky Header detection
  const profileCardRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [profileCardHeight, setProfileCardHeight] = useState(140);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  // Determine scroll container & offset dynamically
  useEffect(() => {
    const updateOffset = () => {
      const mainEl = document.querySelector('main');
      if (mainEl && window.getComputedStyle(mainEl).overflowY.includes('auto')) {
        setHeaderOffset(0);
      } else {
        const header = document.querySelector('header');
        setHeaderOffset(header ? header.offsetHeight : 80);
      }
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
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
    const mainEl = document.querySelector('main');
    const isMainScroll = mainEl && window.getComputedStyle(mainEl).overflowY.includes('auto');

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        root: isMainScroll ? mainEl : null,
        threshold: 0,
        rootMargin: isMainScroll ? '0px' : `-${headerOffset}px 0px 0px 0px`
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerOffset]);

  const handleSectionChange = (section: StudentSection) => {
    setActiveSection(section);
    setSearchParams(section === 'assessment' ? {} : { tab: section });
    if (isSticky) {
      const mainEl = document.querySelector('main');
      const isMainScroll = mainEl && window.getComputedStyle(mainEl).overflowY.includes('auto');
      if (isMainScroll && mainEl) {
        mainEl.scrollTo({
          top: sentinelRef.current ? sentinelRef.current.offsetTop : 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: sentinelRef.current ? sentinelRef.current.offsetTop - headerOffset : 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    showToast(`Two-Factor Authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification preferences updated');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        showToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Personal information updated successfully!');
  };

  const getPolicyIcon = (id: string) => {
    switch (id) {
      case 'terms':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
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
      default:
        return <Shield className="w-5 h-5 text-slate-500" />;
    }
  };

  const sectionsConfig: {
    id: StudentSection;
    label: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    badge?: string;
  }[] = [
    {
      id: 'assessment',
      label: 'Student Intake Profile',
      description: 'Snapshot of where you are at',
      icon: BarChart,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badge: `${completionPercentage}%`
    },
    {
      id: 'personal',
      label: 'Personal Information',
      description: 'Name, email, and location',
      icon: User,
      iconColor: 'text-brand',
      iconBg: 'bg-brand/10'
    },
    {
      id: 'events',
      label: 'Events & Sessions',
      description: 'Upcoming events & counseling',
      icon: Calendar,
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      badge: '4 Active'
    },
    {
      id: 'security',
      label: 'Security & Password',
      description: 'Password and account protection',
      icon: Shield,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      badge: is2FAEnabled ? '2FA Active' : undefined
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Alerts, updates and messages',
      icon: Bell,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-950/40'
    },
    {
      id: 'policies',
      label: 'Platform Policies',
      description: 'Terms, privacy & safety rules',
      icon: ShieldCheck,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-950/40',
      badge: `${studentPolicies.length} Docs`
    }
  ];

  const asideTop = headerOffset + profileCardHeight + 16;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your student profile, intake questionnaire, account security, and notifications.</p>
      </div>

      {/* Sentinel marker right before the profile card */}
      <div ref={sentinelRef} className="h-0 w-full pointer-events-none -mb-6" />

      {/* Profile Header Card (Fixed/Sticky when scrolled to top) */}
      <div 
        ref={profileCardRef}
        style={{ top: `${headerOffset}px` }}
        className={`sticky z-30 transition-all duration-200 ${
          isSticky 
            ? 'bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 pb-4 -my-2' 
            : 'pt-0 pb-0'
        }`}
      >
        <div className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
          isSticky 
            ? 'border-slate-200 dark:border-slate-800 shadow-md ring-1 ring-slate-900/5' 
            : 'border-slate-100 dark:border-slate-800 shadow-sm'
        }`}>
          {/* Subtle Background Accent based on completion */}
          <div 
            className="absolute bottom-0 left-0 h-1.5 bg-brand transition-all duration-1000" 
            style={{ width: `${completionPercentage}%` }}
          />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative group cursor-pointer shrink-0" onClick={handleImageClick}>
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm group-hover:opacity-90 transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/40 backdrop-blur-xs text-white">
                  <Camera className="w-6 h-6" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{personalForm.fullName}</h2>
                  <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold uppercase tracking-wider">
                    Student
                  </span>
                </div>
                <p className="text-sm font-bold text-brand mt-0.5">Student @ {personalForm.school}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {personalForm.email}
                  </div>
                  <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {personalForm.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion Box */}
            <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 shrink-0">
                <span className="font-bold text-sm text-brand">{completionPercentage}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Profile Completion</p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0 ml-1">
                    {answeredCount} of {totalQuestions} answered
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-brand rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1x3 Grid Container: 1 col on left (navigation titles), 3 cols on right (selected content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ================= COLUMN 1 (Left 1-col navigation - FIXED on scroll) ================= */}
        <aside 
          style={{ top: `${asideTop}px` }}
          className="lg:col-span-1 space-y-4 lg:sticky z-20 transition-all duration-200 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-3">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Settings Navigation
            </p>
            <nav className="space-y-1.5" aria-label="Student Settings Sections">
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
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-brand text-white shadow-xs' 
                          : `${section.iconBg} ${section.iconColor}`
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block text-sm truncate leading-tight">
                          {section.label}
                        </span>
                        <span className={`block text-[11px] truncate mt-0.5 ${
                          isActive ? 'text-brand/80 dark:text-brand font-normal' : 'text-slate-400 dark:text-slate-500 font-normal'
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
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {section.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-brand translate-x-0.5' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Student Safeguarding & Signout Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3 hidden lg:block">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Student Protection</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Your profile is verified and protected under NDPA 2023 child data privacy regulations.
            </p>
            <button 
              onClick={() => setIsSignOutOpen(true)}
              className="w-full py-2.5 px-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-200/60 dark:border-red-900/40"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* ================= COLUMN 3 (Right 3-cols content) ================= */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* 1. STUDENT INTAKE PROFILE SECTION */}
            {activeSection === 'assessment' && (
              <motion.div
                key="assessment"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Student Intake Profile</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Provide a quick snapshot of where you are at to personalize recommendations.</p>
                    </div>
                  </div>
                  {completionPercentage === 100 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto border border-emerald-200/60 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed
                    </span>
                  )}
                </div>

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
              </motion.div>
            )}

            {/* 2. PERSONAL INFORMATION SECTION */}
            {activeSection === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Personal Information</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Update your name, contact details, and school information.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSavePersonal} className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={personalForm.fullName}
                        onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 dark:text-slate-100 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={personalForm.email}
                        onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 dark:text-slate-100 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="tel" 
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 dark:text-slate-100 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Location / City</label>
                      <input 
                        type="text" 
                        value={personalForm.location}
                        onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 dark:text-slate-100 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Registered School</label>
                      <input 
                        type="text" 
                        value={personalForm.school}
                        onChange={(e) => setPersonalForm({ ...personalForm, school: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 dark:text-slate-100 text-sm transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Current Class / Level</label>
                      <input 
                        type="text" 
                        value={personalForm.grade}
                        onChange={(e) => setPersonalForm({ ...personalForm, grade: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-slate-800 dark:text-slate-100 text-sm transition-all" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-400">All student profile records are encrypted and protected.</p>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* 3. EVENTS & SESSIONS SECTION */}
            {activeSection === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Events & Counseling Sessions</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">View your booked counseling meetings and registered webinars.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/student/counselors')}
                    className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl shadow-xs hover:brightness-105 transition-all shrink-0 self-start sm:self-auto"
                  >
                    Book New Session
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Upcoming Events */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                      Registered Workshops & Webinars
                    </h4>
                    <div className="space-y-3">
                      {[
                        { title: 'Tech Innovation Summit 2026', date: 'Oct 25, 2026', time: '10:00 AM', status: 'Registered' },
                        { title: 'Career Path & Scholarship Workshop', date: 'Nov 12, 2026', time: '2:00 PM', status: 'Upcoming' },
                      ].map((event, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-brand shadow-xs shrink-0 border border-slate-200/60 dark:border-slate-700">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{event.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{event.date} • {event.time}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                            {event.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Counseling Sessions */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                      Career Counseling Sessions
                    </h4>
                    <div className="space-y-3">
                      {[
                        { title: 'Career Exploration & Subject Choice', counselor: 'Sarah Ojo', date: 'Oct 15, 2026', status: 'Completed' },
                        { title: 'University Admissions & Portfolio Review', counselor: 'Sarah Ojo', date: 'Nov 05, 2026', status: 'Scheduled' },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-blue-500 shadow-xs shrink-0 border border-slate-200/60 dark:border-slate-700">
                              <Target className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{session.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">with Counselor {session.counselor} • {session.date}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            session.status === 'Completed' 
                              ? 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. SECURITY & PASSWORD SECTION */}
            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Security & Password</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage your student login credentials and account security.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Account Password Card */}
                  <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-700 shadow-xs border border-slate-200/60 dark:border-slate-700 shrink-0">
                        <Key className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Student Password</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last changed 3 months ago. Keep your credentials private.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:border-brand hover:text-brand transition-all shadow-xs shrink-0 self-start sm:self-auto"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Two-Factor Authentication Card */}
                  <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-700 shadow-xs border border-slate-200/60 dark:border-slate-700 shrink-0">
                        <Smartphone className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Two-Factor Authentication</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            is2FAEnabled ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200/60' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {is2FAEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add an extra layer of protection to your student account during login.</p>
                      </div>
                    </div>
                    <div 
                      onClick={handleToggle2FA}
                      className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                        is2FAEnabled ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={is2FAEnabled}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                        is2FAEnabled ? 'right-1' : 'left-1'
                      }`}></div>
                    </div>
                  </div>

                  {/* Active Login Device */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Active Device</h4>
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Current Browser Session
                          </p>
                          <p className="text-[11px] text-slate-400">Lagos, Nigeria • Active now</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 font-bold">Secure</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. NOTIFICATIONS SECTION */}
            {activeSection === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Control how and when you receive reminders, messages, and updates.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {[
                    { id: 'mentor' as const, label: 'Mentor Messages', desc: 'Real-time alerts when industry mentors send you replies or career advice' },
                    { id: 'sessions' as const, label: 'Counselor Session Reminders', desc: 'Notices 24 hours and 1 hour before scheduled 1-on-1 counseling meetings' },
                    { id: 'email' as const, label: 'Email Notifications', desc: 'Receive important updates, webinar invites, and digest emails' },
                    { id: 'push' as const, label: 'Push Notifications', desc: 'Receive quick browser alerts when new workshops or events are published' },
                    { id: 'system' as const, label: 'System Recommendations', desc: 'Weekly career matches tailored to your intake profile answers' }
                  ].map((item) => {
                    const isEnabled = notifications[item.id];
                    return (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors gap-4"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.label}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                        </div>

                        <div 
                          onClick={() => handleToggleNotification(item.id)}
                          className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                            isEnabled ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-700'
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

            {/* 6. PLATFORM POLICIES SECTION */}
            {activeSection === 'policies' && (
              <motion.div
                key="policies"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Platform Policies & Student Safety</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Review the rules, student privacy terms, and safeguarding guidelines protecting you.
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => navigate('/policies?role=student')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-brand text-xs font-bold rounded-xl border border-slate-200/80 dark:border-slate-700 transition-all shrink-0 self-start sm:self-auto"
                  >
                    Open Legal Hub <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Student Privacy Commitment:</span> OAICC does not sell your personal data. We comply strictly with the Nigeria Data Protection Act (NDPA 2023) and statutory child safeguarding standards.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {studentPolicies.map((policy) => (
                      <div 
                        key={policy.id}
                        onClick={() => setSelectedPolicy(policy)}
                        className="bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand/40 transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-xs"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-xs">
                            {getPolicyIcon(policy.id)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand transition-colors truncate">
                                {policy.title}
                              </h4>
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[10px] font-bold shrink-0">
                                v{policy.version}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {policy.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-brand group-hover:underline hidden sm:inline">
                            Read Policy
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                    <span>OAICC Career Counselling System • Updated September 2026</span>
                    <button 
                      onClick={() => navigate('/policies?role=student')}
                      className="text-brand font-bold hover:underline"
                    >
                      View All Legal Policies
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
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChangePasswordOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Change Password</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Update your student portal password</p>
                    </div>
                  </div>
                  <button onClick={() => setIsChangePasswordOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                        placeholder="••••••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                      placeholder="••••••••••••" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                      placeholder="••••••••••••" 
                    />
                  </div>
                  
                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsChangePasswordOpen(false);
                        showToast('Password updated successfully!');
                      }}
                      className="w-1/2 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:brightness-105 transition-all text-sm flex items-center justify-center gap-1.5"
                    >
                      Update Password <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Policy Reader Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPolicy(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200/80 dark:border-slate-700 shadow-xs">
                    {getPolicyIcon(selectedPolicy.id)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedPolicy.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Effective: {selectedPolicy.effectiveDate} • Version {selectedPolicy.version}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPolicy(null)} 
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedPolicy.noticeBanner && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-bold mb-1">Student Notice:</p>
                    <p>{selectedPolicy.noticeBanner}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {selectedPolicy.sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                        {section.title}
                      </h4>
                      <p className="whitespace-pre-line text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                        {section.content}
                      </p>
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-3 mt-3">
                          {section.subsections.map((sub, idx) => (
                            <div key={idx}>
                              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">{sub.title}</h5>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{sub.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Safeguarding Contact: {selectedPolicy.contactEmail}
                </span>
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Out Modal */}
      <AnimatePresence>
        {isSignOutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignOutOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <LogOut className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Sign Out?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to sign out of your student account?</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsSignOutOpen(false)}
                  className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
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
