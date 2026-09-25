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
  ExternalLink, 
  X, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { PolicyDocument, getPoliciesForRole } from '../../data/policiesData';
import { UserRole } from '../../types';

export interface PlatformPoliciesSectionProps {
  userRole: UserRole;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function PlatformPoliciesSection({
  userRole,
  isOpen,
  onToggle,
  className = ''
}: PlatformPoliciesSectionProps) {
  const navigate = useNavigate();
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);

  // Fetch policies strictly pertaining to this specific user role
  const rolePolicies = useMemo(() => {
    return getPoliciesForRole(userRole);
  }, [userRole]);

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

  return (
    <>
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all ${className}`}>
        {/* Accordion Header */}
        <button 
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Platform Policies</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {rolePolicies.length}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Review the terms, privacy guidelines, and conduct standards applicable to your account
              </p>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Simplified Accordion Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-100 dark:border-slate-800"
            >
              <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                {/* Simplified Policy Rows */}
                <div className="space-y-2.5">
                  {rolePolicies.map((policy) => (
                    <div 
                      key={policy.id}
                      onClick={() => setSelectedPolicy(policy)}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand/40 dark:hover:border-brand/40 hover:shadow-sm transition-all flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/60">
                          {getPolicyIcon(policy.id)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand transition-colors truncate">
                            {policy.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
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

                {/* Simple Footer Link */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Updated in accordance with NDPA 2023 & statutory guidelines</span>
                  <button 
                    type="button"
                    onClick={() => navigate(`/policies?role=${userRole}`)}
                    className="text-brand font-bold hover:underline flex items-center gap-1"
                  >
                    Legal Hub <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simplified, Clean Policy Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getPolicyIcon(selectedPolicy.id)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedPolicy.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Version {selectedPolicy.version} · Last updated {selectedPolicy.lastUpdated}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedPolicy(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Policy Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="text-slate-600 dark:text-slate-400 font-medium italic bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedPolicy.tagline}
                </p>

                {selectedPolicy.sections.map((section, idx) => (
                  <div key={section.id || idx} className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {section.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const slug = selectedPolicy.slug;
                    setSelectedPolicy(null);
                    navigate(`/policies/${slug}?role=${userRole}`);
                  }}
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                >
                  Open in dedicated page <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPolicy(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
