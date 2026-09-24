import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Cookie, 
  ShieldCheck, 
  Sliders, 
  X, 
  Check, 
  Info, 
  Lock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCookies, CookiePreferences } from '../../context/CookieContext';

export default function CookieConsentBanner() {
  const { 
    preferences, 
    hasConsented, 
    isModalOpen, 
    acceptAll, 
    acceptEssentialOnly, 
    savePreferences, 
    openModal, 
    closeModal 
  } = useCookies();

  const [tempPrefs, setTempPrefs] = useState<CookiePreferences>(preferences);

  // Sync temp prefs when modal opens
  React.useEffect(() => {
    setTempPrefs(preferences);
  }, [preferences, isModalOpen]);

  const handleSaveModal = () => {
    savePreferences(tempPrefs);
  };

  return (
    <>
      {/* Floating Bottom Banner (Shown only when no consent has been given yet) */}
      <AnimatePresence>
        {!hasConsented && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 pointer-events-auto"
            role="region"
            aria-label="Cookie consent banner"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-5 sm:p-6 text-slate-800 dark:text-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand shrink-0">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      We value your privacy
                    </h3>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" /> Student Safe
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    OAICC uses essential cookies to ensure secure authentication and optional cookies to remember your assessment progress and refine career recommendations. We <strong className="text-slate-800 dark:text-slate-200">never sell student data</strong>.
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <Link to="/cookies" className="text-brand hover:underline font-semibold flex items-center gap-0.5">
                      Cookie Policy <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span aria-hidden="true">·</span>
                    <Link to="/privacy" className="text-brand hover:underline font-semibold flex items-center gap-0.5">
                      Privacy Policy <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span aria-hidden="true">·</span>
                    <Link to="/data-privacy" className="text-brand hover:underline font-semibold flex items-center gap-0.5">
                      Data Privacy <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-brand/10 hover:shadow active:scale-[0.98] flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Accept All
                    </button>
                    <button
                      onClick={acceptEssentialOnly}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={openModal}
                      className="px-3 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5" /> Customize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Cookie Preferences Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Cookie & Tracking Preferences
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage how OAICC uses cookies to safeguard security and enhance guidance.
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close preferences"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Categories */}
              <div className="p-6 overflow-y-auto space-y-4">
                {/* 1. Essential */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Strictly Necessary Cookies
                      </h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Always Active
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Essential for secure authentication, session state, preventing cross-site request forgery (CSRF), and maintaining role isolation between students, counselors, and schools. These cannot be disabled.
                  </p>
                </div>

                {/* 2. Functional & Preferences */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-brand" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Functional & Preferences
                      </h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPrefs.functional}
                        onChange={(e) => setTempPrefs({ ...tempPrefs, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Remembers your UI preferences, such as Dark Mode selection, font size, language settings, and dashboard layout states.
                  </p>
                </div>

                {/* 3. Guidance & Assessment Personalization */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Career Guidance & Assessment Memory
                      </h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPrefs.guidance}
                        onChange={(e) => setTempPrefs({ ...tempPrefs, guidance: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Preserves in-progress career quiz drafts if you disconnect, saves filtered career industries, and allows counselors to review pre-session responses efficiently.
                  </p>
                </div>

                {/* 4. Analytics & Performance */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-violet-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Analytics & Platform Diagnostics
                      </h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPrefs.analytics}
                        onChange={(e) => setTempPrefs({ ...tempPrefs, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Collects aggregated, strictly de-identified metrics on page load times, question response latency, and navigation bottlenecks to keep the student platform fast and reliable.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/cookies"
                  onClick={closeModal}
                  className="text-xs text-slate-500 hover:text-brand font-medium underline"
                >
                  Read full Cookie Policy
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      acceptAll();
                      closeModal();
                    }}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleSaveModal}
                    className="px-5 py-2 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-brand/10 hover:shadow"
                  >
                    Save My Choices
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
