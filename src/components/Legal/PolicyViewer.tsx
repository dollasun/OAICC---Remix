import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Cookie, 
  Lock, 
  Users, 
  ArrowLeft, 
  Printer, 
  Search, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  GraduationCap,
  Briefcase,
  Heart,
  School,
  BookOpen,
  Building2,
  HelpCircle
} from 'lucide-react';
import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import { useCookies } from '../../context/CookieContext';
import { POLICIES, PolicyDocument, getPoliciesForRole, getPolicyBySlug } from '../../data/policiesData';
import { UserRole } from '../../types';

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const ROLES: RoleOption[] = [
  { id: 'student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" />, description: 'Policies for student guidance, quiz data & safety' },
  { id: 'counselor', label: 'Counselor', icon: <Users className="w-3.5 h-3.5" />, description: 'Professional conduct, ethics & session guidelines' },
  { id: 'parent', label: 'Parent / Sponsor', icon: <Heart className="w-3.5 h-3.5" />, description: 'Parental consent, minor protection & billing' },
  { id: 'school', label: 'School / Institution', icon: <School className="w-3.5 h-3.5" />, description: 'Institutional agreements, rosters & authority' },
  { id: 'teacher', label: 'Teacher', icon: <Briefcase className="w-3.5 h-3.5" />, description: 'Classroom guidance, safeguarding & privacy' },
];

export default function PolicyViewer() {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openModal: openCookieModal } = useCookies();

  // Determine current slug from URL path or param
  const pathParts = location.pathname.replace(/^\//, '').split('/');
  const pathSlug = slug || (pathParts[0] !== 'policies' && pathParts[0] ? pathParts[0] : pathParts[1]) || 'terms';
  const currentSlug = pathSlug || searchParams.get('policy') || 'terms';
  const requestedPolicy = getPolicyBySlug(currentSlug);

  // Determine user role:
  // 1. Explicit query param ?role=...
  // 2. Logged-in role in localStorage ('user_role')
  // 3. Inferred role if current policy is exclusive to one role (e.g. counselor-code -> counselor)
  // 4. Default to 'student'
  const roleFromQuery = searchParams.get('role') as UserRole | null;
  const storedRole = (typeof window !== 'undefined' ? localStorage.getItem('user_role') : null) as UserRole | null;
  
  // Detect if user has a locked/known role
  const hasUserAccount = Boolean(storedRole);
  
  const inferredRole: UserRole = useMemo(() => {
    if (roleFromQuery && ROLES.some(r => r.id === roleFromQuery)) return roleFromQuery;
    if (requestedPolicy) {
      if (storedRole && requestedPolicy.applicableRoles.includes(storedRole)) return storedRole;
      const nonAdmin = requestedPolicy.applicableRoles.find(r => r !== 'admin');
      if (nonAdmin) return nonAdmin;
    }
    if (storedRole && ROLES.some(r => r.id === storedRole)) return storedRole;
    return 'student';
  }, [roleFromQuery, storedRole, requestedPolicy]);

  const [activeRole, setActiveRole] = useState<UserRole>(inferredRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  useEffect(() => {
    if (inferredRole) {
      setActiveRole(inferredRole);
    }
  }, [inferredRole]);

  // Deep linking to section anchors (e.g., #terms-sec-2)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSectionId(id);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash, requestedPolicy]);

  const [policiesVersion, setPoliciesVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setPoliciesVersion(v => v + 1);
    window.addEventListener('oaicc-policies-updated', handleUpdate);
    return () => window.removeEventListener('oaicc-policies-updated', handleUpdate);
  }, []);

  // STRICT ACCESS: Only policies that concern the active user type (filters out hidden)
  const visiblePolicies = useMemo(() => {
    return getPoliciesForRole(activeRole);
  }, [activeRole, policiesVersion]);

  // Is requested policy allowed for this specific user type?
  const isPolicyAllowedForRole = useMemo(() => {
    if (!requestedPolicy) return false;
    return visiblePolicies.some(p => p.slug === requestedPolicy.slug);
  }, [requestedPolicy, visiblePolicies]);

  // Active policy resolution: only non-null if allowed for this user type
  const activePolicy: PolicyDocument | null = useMemo(() => {
    if (requestedPolicy && isPolicyAllowedForRole) {
      return requestedPolicy;
    }
    if (!requestedPolicy) {
      return visiblePolicies[0] || null;
    }
    return null; // Forbidden/Inapplicable for this user type
  }, [requestedPolicy, isPolicyAllowedForRole, visiblePolicies]);

  // Filter sections if search query is entered
  const filteredSections = useMemo(() => {
    if (!activePolicy) return [];
    if (!searchQuery.trim()) return activePolicy.sections;
    const q = searchQuery.toLowerCase();
    return activePolicy.sections.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.content.toLowerCase().includes(q)
    );
  }, [activePolicy, searchQuery]);

  const handlePolicySelect = (policySlug: string) => {
    setSearchQuery('');
    navigate(`/policies/${policySlug}?role=${activeRole}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPolicyIcon = (policyId: string) => {
    switch (policyId) {
      case 'terms': return <FileText className="w-4 h-4" />;
      case 'privacy':
      case 'student-privacy': return <ShieldCheck className="w-4 h-4" />;
      case 'cookies': return <Cookie className="w-4 h-4" />;
      case 'safeguarding': return <AlertCircle className="w-4 h-4" />;
      case 'acceptable-use': return <Lock className="w-4 h-4" />;
      case 'counselor-code': return <Users className="w-4 h-4" />;
      case 'parent-consent': return <Heart className="w-4 h-4" />;
      case 'school-authority': return <School className="w-4 h-4" />;
      case 'complaints-refunds': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const activeRoleMeta = ROLES.find(r => r.id === activeRole) || ROLES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo size="md" />
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>Policies & Agreements</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {activeRoleMeta.label}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {activePolicy && (
              <div className="relative hidden md:block w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in this policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand rounded-xl outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                />
              </div>
            )}
            
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print policy document"
              aria-label="Print policy document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <ThemeToggle />

            <button
              onClick={() => navigate(-1)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand transition-colors px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        </div>

        {/* User Type Badge & Scoped Status Bar - Only shows the active user type */}
        <div className="bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-slate-800/60 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 text-brand font-bold text-xs">
                {activeRoleMeta.icon}
                {activeRoleMeta.label} Policies
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                · Only policies applicable to your {activeRoleMeta.label} account are shown.
              </span>
            </div>

            {/* If anonymous guest, allow selecting role if they arrived without context */}
            {!hasUserAccount && !roleFromQuery && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>View for:</span>
                <select
                  value={activeRole}
                  onChange={(e) => {
                    const newRole = e.target.value as UserRole;
                    setActiveRole(newRole);
                    const newPolicies = getPoliciesForRole(newRole);
                    const targetSlug = newPolicies[0]?.slug || 'terms';
                    navigate(`/policies/${targetSlug}?role=${newRole}`);
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs text-slate-700 dark:text-slate-200 font-medium outline-none"
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Scoped Policy Tabs - ONLY policies concerning this user type show up */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-1 sm:space-x-2 py-2">
              {visiblePolicies.map((p) => {
                const isActive = activePolicy?.slug === p.slug;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePolicySelect(p.slug)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-brand dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {getPolicyIcon(p.id)}
                    {p.shortTitle}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activePolicy ? (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-brand/5 via-slate-50 to-slate-50 dark:from-brand/10 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60 py-10 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="font-semibold text-brand">
                    {activeRoleMeta.label} Agreement
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Effective {activePolicy.effectiveDate}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> v{activePolicy.version}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 font-display">
                  {activePolicy.title}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activePolicy.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Main Document Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Sidebar: Table of Contents & Relevant Policies */}
              <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-44 print:hidden">
                {/* Table of Contents Card */}
                {activePolicy.sections.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <BookOpen className="w-4 h-4 text-brand" /> Document Sections
                    </div>
                    <nav className="space-y-1 text-xs max-h-80 overflow-y-auto pr-1">
                      {activePolicy.sections.map((sec, idx) => (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-start gap-2 ${
                            activeSectionId === sec.id
                              ? 'bg-brand/10 text-brand font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-[11px] text-slate-400 shrink-0 font-mono mt-0.5">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <span className="leading-snug line-clamp-1">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Entity Authority Metadata */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Building2 className="w-4 h-4 text-brand" /> Authority & Contact
                  </div>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Platform</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{activePolicy.platform}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Legal Entity</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{activePolicy.legalEntity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Registered Address</span>
                      <span>{activePolicy.registeredAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Direct Support</span>
                      <a href={`mailto:${activePolicy.contactEmail}`} className="text-brand font-medium hover:underline">
                        {activePolicy.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Other Policies Concerning This User - ONLY concerning policies are shown */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Policies for {activeRoleMeta.label}s
                  </div>
                  <div className="space-y-1">
                    {visiblePolicies.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePolicySelect(p.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          p.slug === activePolicy.slug
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-brand hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {getPolicyIcon(p.id)}
                          {p.shortTitle}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cookie Manager Link */}
                {activePolicy.slug === 'cookies' && (
                  <button
                    onClick={openCookieModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand text-white font-bold text-xs shadow-sm hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
                  >
                    <Cookie className="w-4 h-4" /> Manage Cookie Settings
                  </button>
                )}
              </aside>

              {/* Right Main Column: Document Body */}
              <main className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
                
                {/* Notice Banner if present */}
                {activePolicy.noticeBanner && (
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      {activePolicy.noticeBanner}
                    </div>
                  </div>
                )}

                {/* Document Sections */}
                <div className="space-y-8 divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSections.map((sec) => (
                    <section
                      key={sec.id}
                      id={sec.id}
                      className="scroll-mt-44 pt-8 first:pt-0 space-y-3"
                    >
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line space-y-2">
                        {sec.content}
                      </div>
                    </section>
                  ))}

                  {filteredSections.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No clauses matched "{searchQuery}". Try a different keyword or clear search.
                    </div>
                  )}
                </div>

                {/* Legal Framework Reference Box */}
                {activePolicy.legalFramework && activePolicy.legalFramework.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Governing Legal Framework
                    </h4>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                      {activePolicy.legalFramework.map((law, i) => (
                        <li key={i}>{law}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </main>
            </div>
          </div>
        </>
      ) : (
        /* If user attempts to view a policy that does NOT concern their user type */
        <div className="flex-1 max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Policy Not Applicable to {activeRoleMeta.label}s
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                This document is not relevant to <span className="font-semibold text-slate-900 dark:text-white">{activeRoleMeta.label}</span> accounts. Only policies concerning your specific user type are available in your portal.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handlePolicySelect(visiblePolicies[0]?.slug || 'terms')}
                className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl"
              >
                View {activeRoleMeta.label} Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-xs text-slate-400">
                OruAikiIse Ltd · Brownstone Cluster 2, Kunsela Road, Ikate, Lagos
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>Contact: info@oaiccglobal.com</span>
              <span aria-hidden="true">·</span>
              <span>Website: oaiccglobal.com</span>
              <span aria-hidden="true">·</span>
              <button onClick={openCookieModal} className="text-brand hover:underline">
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
