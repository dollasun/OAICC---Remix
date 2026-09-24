import React, { useState } from 'react';
import { 
  Cookie, 
  Lock, 
  Sliders, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  RotateCcw,
  ExternalLink,
  Laptop
} from 'lucide-react';
import LegalLayout from './LegalLayout';
import { useCookies, CookiePreferences } from '../../context/CookieContext';
import { useToast } from '../../context/ToastContext';

export default function CookiePolicy() {
  const { preferences, savePreferences, acceptAll, resetConsent } = useCookies();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state for in-page preference manager
  const [pagePrefs, setPagePrefs] = useState<CookiePreferences>(preferences);

  React.useEffect(() => {
    setPagePrefs(preferences);
  }, [preferences]);

  const handleSaveInPage = () => {
    savePreferences(pagePrefs);
    showToast('Cookie preferences updated and applied.', 'success');
  };

  const handleAcceptAllInPage = () => {
    acceptAll();
    showToast('All cookies accepted.', 'success');
  };

  const tableOfContents = [
    { id: 'sec-what-are-cookies', label: '1. What Are Cookies?' },
    { id: 'sec-preference-manager', label: '2. In-Page Cookie Manager' },
    { id: 'sec-categories', label: '3. Categories of Cookies We Use' },
    { id: 'sec-cookie-table', label: '4. Inventory Table of Cookies' },
    { id: 'sec-browser-settings', label: '5. Managing Cookies in Your Browser' },
    { id: 'sec-contact', label: '6. Questions & Contact' },
  ];

  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Understand the cookies and local storage technologies OAICC uses to secure your sessions, remember guidance progress, and improve our services."
      lastUpdated="March 24, 2026"
      readTime="7 min"
      activeTab="cookies"
      tableOfContents={tableOfContents}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        {/* Top Notice */}
        <div className="p-6 rounded-2xl bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30">
          <div className="flex items-center gap-2 mb-2 text-brand font-bold text-sm">
            <Cookie className="w-5 h-5" /> Plain-Language Cookie Disclosure
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            OAICC uses cookies strictly to keep students and counselors securely logged in, remember preferences like Dark Mode, and prevent assessment progress from disappearing if a student’s wifi drops. <strong>We do not use advertising or tracking cookies from third-party ad networks.</strong>
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-what-are-cookies" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">1.</span> What Are Cookies and Local Storage?
          </h2>
          <p className="text-sm leading-relaxed">
            Cookies are small text files placed on your computer or mobile device by websites that you visit. They are widely used to make websites work efficiently, authenticate secure sessions, and provide anonymized usage insights.
          </p>
          <p className="text-sm leading-relaxed">
            Alongside traditional HTTP cookies, OAICC utilizes HTML5 LocalStorage and SessionStorage to cache career filter states and assessment drafts without sending unnecessary payload overhead over the internet.
          </p>
        </section>

        {/* Section 2: Interactive In-Page Manager */}
        <section id="sec-preference-manager" className="scroll-mt-40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-brand">2.</span> In-Page Cookie Settings Manager
            </h2>
            <button
              onClick={resetConsent}
              className="text-xs text-slate-500 hover:text-brand font-semibold flex items-center gap-1 transition-colors"
              title="Reset cookie consent"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
            </button>
          </div>
          <p className="text-sm leading-relaxed">
            You can modify your consent settings anytime right from this policy page:
          </p>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            {/* Category 1: Essential */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Strictly Necessary Cookies</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Required
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Critical for user sign-in tokens, CSRF protection, and role permissions. Cannot be toggled off.
                </p>
              </div>
              <div className="text-xs text-slate-400 font-bold px-2 py-1 shrink-0">Always Active</div>
            </div>

            {/* Category 2: Functional */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sliders className="w-4 h-4 text-brand" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Functional & Theme Preferences</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Remembers your display theme (Light / Dark mode), interface zoom, and font sizing.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={pagePrefs.functional}
                  onChange={(e) => setPagePrefs({ ...pagePrefs, functional: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            {/* Category 3: Guidance & Assessment Memory */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Career Guidance & Assessment Memory</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Saves quiz answer progress locally if network disconnects and retains applied career filters.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={pagePrefs.guidance}
                  onChange={(e) => setPagePrefs({ ...pagePrefs, guidance: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            {/* Category 4: Analytics */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Analytics & Performance Diagnostics</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Collects de-identified assessment load times and screen latency to help our engineers optimize speed.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={pagePrefs.analytics}
                  onChange={(e) => setPagePrefs({ ...pagePrefs, analytics: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            {/* Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={handleAcceptAllInPage}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all"
              >
                Accept All Cookies
              </button>
              <button
                onClick={handleSaveInPage}
                className="px-5 py-2 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-brand/10 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Categories description */}
        <section id="sec-categories" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">3.</span> Categories of Cookies We Use
          </h2>
          <p className="text-sm leading-relaxed">
            Unlike commercial media sites that load hundreds of marketing beacons, OAICC deploys a lean footprint designed specifically for high-reliability educational counseling.
          </p>
        </section>

        {/* Section 4: Inventory Table */}
        <section id="sec-cookie-table" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">4.</span> Comprehensive Inventory of OAICC Cookies
          </h2>
          
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                <tr>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Cookie / Storage Key</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Category</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Purpose</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Lifespan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-mono font-semibold text-brand">oaicc_auth_session</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Strictly Necessary</td>
                  <td className="p-3">Maintains authenticated session token between student/counselor and API server.</td>
                  <td className="p-3 text-slate-500">Session (expires on close)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-brand">oaicc_csrf_token</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Strictly Necessary</td>
                  <td className="p-3">Prevents Cross-Site Request Forgery attacks on counselor booking and form actions.</td>
                  <td className="p-3 text-slate-500">24 hours</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-brand">oaicc_cookie_consent_v1</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Strictly Necessary</td>
                  <td className="p-3">Stores your explicit cookie consent preferences so we don't prompt repeatedly.</td>
                  <td className="p-3 text-slate-500">12 months</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-brand">oaicc_theme_mode</td>
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">Functional</td>
                  <td className="p-3">Remembers user preference for Light Mode or Dark Mode.</td>
                  <td className="p-3 text-slate-500">Persistent (Local)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-brand">oaicc_assessment_draft</td>
                  <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">Guidance Memory</td>
                  <td className="p-3">Caches student quiz responses in browser storage to safeguard against disconnects.</td>
                  <td className="p-3 text-slate-500">Cleared on submit</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-brand">oaicc_perf_metrics</td>
                  <td className="p-3 font-semibold text-violet-600 dark:text-violet-400">Analytics</td>
                  <td className="p-3">De-identified latency timings to detect slow network connections during counseling.</td>
                  <td className="p-3 text-slate-500">30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Browser Settings */}
        <section id="sec-browser-settings" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">5.</span> How to Manage Cookies in Your Web Browser
          </h2>
          <p className="text-sm leading-relaxed">
            Most web browsers allow you to manage cookie settings through their preferences. Please note that disabling Strictly Necessary cookies may prevent you from logging in to your student or counselor account:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Google Chrome</span>
              Settings &rarr; Privacy and security &rarr; Third-party cookies &rarr; Manage exceptions.
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Apple Safari</span>
              Preferences &rarr; Privacy &rarr; Manage Website Data & Block all cookies.
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Mozilla Firefox</span>
              Settings &rarr; Privacy & Security &rarr; Enhanced Tracking Protection.
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Microsoft Edge</span>
              Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies.
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="sec-contact" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">6.</span> Questions & Contact
          </h2>
          <p className="text-sm leading-relaxed">
            If you have questions regarding our use of cookies or tracking technologies, please contact our team at{' '}
            <a href="mailto:privacy@oaicc.org" className="text-brand font-medium hover:underline">
              privacy@oaicc.org
            </a>
            .
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
