import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Lock, 
  ShieldCheck, 
  Cookie, 
  UserCheck, 
  Heart, 
  School, 
  Scale, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  ExternalLink, 
  Printer, 
  X, 
  BookOpen, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PolicyDocument, getPoliciesForRole } from '../../data/policiesData';
import { UserRole } from '../../types';

export interface PlatformPoliciesSectionProps {
  userRole: UserRole;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const ROLE_META: Record<UserRole, { label: string; description: string; accentColor: string }> = {
  student: {
    label: 'Student',
    description: 'Policies defining student privacy, career test guidance, safeguarding, and acceptable platform conduct.',
    accentColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
  },
  counselor: {
    label: 'Counselor & Mentor',
    description: 'Professional ethics, counselor code of conduct, child safeguarding, and advisory standards.',
    accentColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30'
  },
  parent: {
    label: 'Parent & Guardian',
    description: 'Parental notice & consent, child safety, fee & refund transparency, and personal data rights.',
    accentColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
  },
  teacher: {
    label: 'Teacher',
    description: 'Classroom advisory responsibilities, student safeguarding protocols, and acceptable platform usage.',
    accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
  },
  school: {
    label: 'School / Institution',
    description: 'Institutional agreements, cohort data authority, student safeguarding compliance, and consumer protection.',
    accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
  },
  admin: {
    label: 'System Administrator',
    description: 'Full statutory governance, compliance frameworks, regulatory policies, and administrative standards.',
    accentColor: 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800'
  }
};

export default function PlatformPoliciesSection({
  userRole,
  isOpen,
  onToggle,
  className = ''
}: PlatformPoliciesSectionProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);
  const [activeModalSection, setActiveModalSection] = useState<string>('');

  // Fetch policies strictly pertaining to this specific user role
  const rolePolicies = useMemo(() => {
    return getPoliciesForRole(userRole);
  }, [userRole]);

  // Filter policies based on search query
  const filteredPolicies = useMemo(() => {
    if (!searchQuery.trim()) return rolePolicies;
    const q = searchQuery.toLowerCase().trim();
    return rolePolicies.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.shortTitle.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.sections.some(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
    );
  }, [rolePolicies, searchQuery]);

  const roleInfo = ROLE_META[userRole] || ROLE_META.student;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all ${className}`}>
        {/* Accordion Header */}
        <button 
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Platform Policies</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {rolePolicies.length} Documents
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Legal agreements, privacy notices, and terms applicable to your {roleInfo.label} account
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Accordion Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-6 sm:p-8 space-y-6 bg-slate-50/40 dark:bg-slate-900/40">
                {/* Role Scope Banner & Search Bar */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Applicable Policy Scope
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {roleInfo.label} View
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {roleInfo.description} Only policies directly relevant to your role are presented here.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter policies..."
                        className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/policies?role=${userRole}`)}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1.5 whitespace-nowrap border border-indigo-100 dark:border-indigo-900/40"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Legal Hub</span>
                    </button>
                  </div>
                </div>

                {/* Policies List / Grid */}
                {filteredPolicies.length === 0 ? (
                  <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching policies found</h4>
                    <p className="text-xs text-slate-500 mt-1">Try clearing your search term to see all {rolePolicies.length} applicable policies.</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPolicies.map((policy) => {
                      const sectionsCount = policy.sections?.length || 0;
                      return (
                        <div 
                          key={policy.id}
                          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-all flex flex-col justify-between shadow-xs group"
                        >
                          <div className="space-y-3">
                            {/* Card Top: Icon & Metadata */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/60">
                                  {getPolicyIcon(policy.id)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                    {policy.title}
                                  </h4>
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                    <span>Version {policy.version}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{policy.lastUpdated}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{sectionsCount} sections</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold tracking-wide text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-sm shrink-0 border border-emerald-200 dark:border-emerald-800/40">
                                In Effect
                              </span>
                            </div>

                            {/* Tagline / Summary */}
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {policy.tagline}
                            </p>

                            {/* Key Sections Preview */}
                            {policy.sections && policy.sections.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                  Key Provisions:
                                </p>
                                <div className="space-y-0.5">
                                  {policy.sections.slice(0, 2).map((sec) => (
                                    <div key={sec.id} className="text-[11px] text-slate-600 dark:text-slate-400 truncate flex items-center gap-1.5">
                                      <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                                      <span className="truncate">{sec.title}</span>
                                    </div>
                                  ))}
                                  {policy.sections.length > 2 && (
                                    <div className="text-[10px] text-slate-500 dark:text-slate-500 italic pl-2.5">
                                      +{policy.sections.length - 2} more detailed sections
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPolicy(policy);
                                setActiveModalSection(policy.sections[0]?.id || '');
                              }}
                              className="flex-1 py-2 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Read In-App</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/policies/${policy.slug}?role=${userRole}`)}
                              title="Open full page document"
                              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Statutory Governance & Safeguarding Assurance */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Compliance: Nigeria Data Protection Act 2023 · Child Rights Act · FCCPA 2018
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-medium">
                    <a href="mailto:info@oaiccglobal.com" className="hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Inquiries: info@oaiccglobal.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* In-App Full Policy Reader Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPolicy(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-10"
            >
              {/* Modal Top Bar */}
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                    {getPolicyIcon(selectedPolicy.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        OAICC Platform Policy
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Role: {roleInfo.label}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedPolicy.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Version {selectedPolicy.version}</span>
                      <span aria-hidden="true">·</span>
                      <span>Effective {selectedPolicy.effectiveDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>Last Updated {selectedPolicy.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    type="button"
                    onClick={handlePrint}
                    title="Print Document"
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      const slug = selectedPolicy.slug;
                      setSelectedPolicy(null);
                      navigate(`/policies/${slug}?role=${userRole}`);
                    }}
                    title="Open Full Page View"
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedPolicy(null)}
                    title="Close"
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Notice Banner if policy has one */}
              {selectedPolicy.noticeBanner && (
                <div className="px-6 py-3.5 bg-amber-50/90 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{selectedPolicy.noticeBanner}</p>
                </div>
              )}

              {/* Scrollable Document Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Policy Tagline Intro */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedPolicy.tagline}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Entity:</span> {selectedPolicy.legalEntity}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Platform:</span> {selectedPolicy.platform}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Contact:</span> {selectedPolicy.contactEmail}
                    </div>
                  </div>
                </div>

                {/* Table of Contents jump strip */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Table of Contents ({selectedPolicy.sections.length} Sections)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPolicy.sections.map((sec, idx) => (
                      <a
                        key={sec.id}
                        href={`#modal-${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(`modal-${sec.id}`);
                          el?.scrollIntoView({ behavior: 'smooth' });
                          setActiveModalSection(sec.id);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                          activeModalSection === sec.id
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        {idx + 1}. {sec.title.replace(/^\d+\.\s*/, '')}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Sections Rendered */}
                <div className="space-y-6 pt-2">
                  {selectedPolicy.sections.map((sec) => (
                    <div 
                      key={sec.id} 
                      id={`modal-${sec.id}`} 
                      className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3 scroll-mt-6"
                    >
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                        <span>{sec.title}</span>
                      </h3>
                      <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed space-y-2 font-normal">
                        {sec.content}
                      </div>

                      {sec.subsections && sec.subsections.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                          {sec.subsections.map((sub, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{sub.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                                {sub.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Legal Framework Reference */}
                {selectedPolicy.legalFramework && selectedPolicy.legalFramework.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Governing Statutory Framework
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1">
                      {selectedPolicy.legalFramework.map((law, lIdx) => (
                        <li key={lIdx}>{law}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Official Contact Info Box */}
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Questions regarding this policy or data safeguarding?
                    </p>
                    <p>
                      Official Inquiries: <a href={`mailto:${selectedPolicy.contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{selectedPolicy.contactEmail}</a>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Registered Address: {selectedPolicy.registeredAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const slug = selectedPolicy.slug;
                      setSelectedPolicy(null);
                      navigate(`/policies/${slug}?role=${userRole}`);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    Open Full Document
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Applicable to: <strong className="text-slate-700 dark:text-slate-300">{roleInfo.label}</strong> accounts
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPolicy(null)}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
