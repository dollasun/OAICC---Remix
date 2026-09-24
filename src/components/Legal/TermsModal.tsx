import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { POLICIES } from '../../data/policiesData';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptAndClose?: () => void;
  defaultTab?: 'terms' | 'privacy';
}

export default function TermsModal({ 
  isOpen, 
  onClose, 
  onAcceptAndClose,
  defaultTab = 'terms'
}: TermsModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, isOpen]);

  const termsDoc = POLICIES.find(p => p.id === 'terms');
  const privacyDoc = POLICIES.find(p => p.id === 'privacy');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col font-sans"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand">
                  {activeTab === 'terms' ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
                    {activeTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    OAICC Platform Agreement · Version 1.0
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher - Strictly Only Terms and Privacy */}
            <div className="px-6 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-6 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'terms'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" /> Terms of Use
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'privacy'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Privacy Policy
              </button>
            </div>

            {/* Document Body - Clean, direct, simple session */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {activeTab === 'terms' ? (
                <div className="space-y-6">
                  {termsDoc?.sections.map((sec) => (
                    <div key={sec.id} className="space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {sec.title}
                      </h4>
                      <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {privacyDoc?.sections.map((sec) => (
                    <div key={sec.id} className="space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {sec.title}
                      </h4>
                      <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs">
                <Link
                  to={activeTab === 'terms' ? '/policies/terms' : '/policies/privacy'}
                  target="_blank"
                  className="text-brand hover:underline font-bold flex items-center gap-1.5"
                >
                  Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all"
                >
                  Close
                </button>
                {onAcceptAndClose && (
                  <button
                    type="button"
                    onClick={onAcceptAndClose}
                    className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-brand/10 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept & Continue
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
