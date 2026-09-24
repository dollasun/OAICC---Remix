import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Clock, 
  FileCheck,
  Send,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import LegalLayout from './LegalLayout';
import { useToast } from '../../context/ToastContext';

export default function DataPrivacy() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Privacy Controls State
  const [sharingPrefs, setSharingPrefs] = useState({
    counselorAccess: true,
    parentInsights: true,
    anonymizedResearch: false,
    guidanceRecommendations: true,
  });

  // Deletion Request Form State
  const [deletionForm, setDeletionForm] = useState({
    email: '',
    role: 'student',
    reason: 'Graduated or finished counseling',
    confirmText: '',
  });
  const [deletionSubmitted, setDeletionSubmitted] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  const tableOfContents = [
    { id: 'sec-governance', label: '1. Data Governance & Architecture' },
    { id: 'sec-interactive-portal', label: '2. Interactive Privacy Rights Hub' },
    { id: 'sec-sharing-controls', label: '3. Data Sharing Toggles' },
    { id: 'sec-deletion-request', label: '4. Erasure & Deletion Request' },
    { id: 'sec-subprocessors', label: '5. Authorized Sub-Processors' },
    { id: 'sec-incident', label: '6. Incident Response & 72h Notice' },
    { id: 'sec-compliance', label: '7. Certifications & Legal Badges' },
  ];

  const handleToggleSharing = (key: keyof typeof sharingPrefs) => {
    setSharingPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast('Privacy preferences updated successfully.', 'success');
      return next;
    });
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportPayload = {
        exportMetadata: {
          platform: 'OAICC Career Counseling Platform',
          exportDate: new Date().toISOString(),
          formatVersion: '2.4',
        },
        profileSummary: {
          accountStatus: 'Active',
          role: 'Student / User',
          privacyTier: 'Protected Educational Record (FERPA compliant)',
          sharingPreferences: sharingPrefs,
        },
        assessmentRecords: {
          status: 'Completed',
          sectionsEvaluated: ['Interests', 'Strengths', 'Work Style', 'Subject Signals'],
          primaryClusters: ['Technology & Digital', 'Engineering & Technical Trades'],
          industryFitIndex: 88.4,
        },
        counselingRecords: {
          sessionsCount: 3,
          actionPlansDocumented: 2,
          lastSessionDate: '2026-03-20',
        },
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `OAICC_Data_Archive_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
      showToast('Data archive generated and downloaded successfully.', 'success');
    }, 900);
  };

  const handleDeletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionForm.email) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    const ticketId = `DEL-${Math.floor(100000 + Math.random() * 900000)}`;
    setDeletionSubmitted(ticketId);
    showToast(`Request submitted. Tracking reference: ${ticketId}`, 'success');
  };

  return (
    <LegalLayout
      title="Data Privacy & Governance"
      subtitle="Complete transparency into our data architecture, encryption standards, and self-service privacy rights for students, educators, and parents."
      lastUpdated="March 24, 2026"
      readTime="8 min"
      activeTab="data-privacy"
      tableOfContents={tableOfContents}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        {/* Top Highlight Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand/10 via-brand/5 to-transparent border border-brand/20 dark:border-brand/30">
          <div className="flex items-center gap-2 mb-2 text-brand font-bold text-sm">
            <Lock className="w-5 h-5" /> Student Data Governance Charter
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            OAICC operates as an educational data custodian. We treat all career discovery signals, interest responses, and counseling case notes as confidential records. We never monetize, aggregate for external sale, or share student data with non-essential third parties.
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-governance" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">1.</span> Data Governance & Tenant Isolation Architecture
          </h2>
          <p className="text-sm leading-relaxed">
            Our platform utilizes logical tenant isolation for educational institutions and individual student profiles:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-brand" /> Strict Database Partitioning
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                School student cohorts are stored with scoped tenant keys. No student data leaks across districts or outside authorized counseling rosters.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> End-to-End Cryptography
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                All data is encrypted in transit using TLS 1.3 with Perfect Forward Secrecy and encrypted at rest with hardware-backed AES-256 keys.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Portal */}
        <section id="sec-interactive-portal" className="scroll-mt-40 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">2.</span> Interactive Privacy Rights Hub
          </h2>
          <p className="text-sm leading-relaxed">
            You hold total sovereignty over your educational data. Use the self-service actions below to manage or export your records directly:
          </p>

          {/* Export Tool */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-brand" /> Download My Personal Data Archive
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                  Generate a structured machine-readable JSON archive containing your account profile, psychometric quiz scores, career fit indices, and counseling session logs.
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-brand/10 hover:shadow flex items-center gap-2 shrink-0 self-start sm:self-center"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Preparing Archive...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Export Data Archive
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Data Sharing Toggles */}
        <section id="sec-sharing-controls" className="scroll-mt-40 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">3.</span> Live Data Sharing & Visibility Preferences
          </h2>
          <p className="text-sm leading-relaxed">
            Configure how your assessment data is shared with internal stakeholders within OAICC:
          </p>

          <div className="space-y-3">
            {/* Toggle 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Share Career Assessment with Assigned School Counselor
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows your counselor to view your interest and strength quiz scores prior to counseling sessions.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={sharingPrefs.counselorAccess}
                  onChange={() => handleToggleSharing('counselorAccess')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Share Milestone Insights with Linked Parent / Sponsor
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows linked guardians to view your primary career clusters and scheduled counseling appointments.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={sharingPrefs.parentInsights}
                  onChange={() => handleToggleSharing('parentInsights')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            {/* Toggle 3 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Contribute Anonymized Assessment Metrics to Research
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Helps calibrate psychometric question balance. Completely de-identified; contains no names or emails.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={sharingPrefs.anonymizedResearch}
                  onChange={() => handleToggleSharing('anonymizedResearch')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Section 4: Deletion & Right to be Forgotten Form */}
        <section id="sec-deletion-request" className="scroll-mt-40 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">4.</span> Right to Erasure & Account Deletion Request
          </h2>
          <p className="text-sm leading-relaxed">
            In compliance with GDPR Article 17, FERPA, and CCPA, users or their legal guardians may request permanent purge of their personal records:
          </p>

          {deletionSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Data Deletion Request Queued
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 mb-3">
                Your request has been received under ticket ID <code className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 rounded font-mono font-bold">{deletionSubmitted}</code>. A verification confirmation has been dispatched to <strong>{deletionForm.email}</strong>.
              </p>
              <div className="text-xs text-emerald-700 dark:text-emerald-400">
                Purge SLA: Permanent removal from active database systems within 30 days.
              </div>
              <button
                onClick={() => setDeletionSubmitted(null)}
                className="mt-4 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleDeletionSubmit} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={deletionForm.email}
                    onChange={(e) => setDeletionForm({ ...deletionForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Account Role *
                  </label>
                  <select
                    value={deletionForm.role}
                    onChange={(e) => setDeletionForm({ ...deletionForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent / Sponsor</option>
                    <option value="counselor">Counselor</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reason for Request
                </label>
                <select
                  value={deletionForm.reason}
                  onChange={(e) => setDeletionForm({ ...deletionForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand"
                >
                  <option value="Graduated">Graduated or completed counseling journey</option>
                  <option value="Transferring">Transferring to a non-participating institution</option>
                  <option value="ConsentWithdrawn">Withdrawing parental / personal consent</option>
                  <option value="Duplicate">Duplicate or test account</option>
                  <option value="Other">Other (specify to DPO)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Verification email will be sent before purging.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Submit Erasure Request
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Section 5: Authorized Sub-Processors */}
        <section id="sec-subprocessors" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">5.</span> Authorized Technical Sub-Processors
          </h2>
          <p className="text-sm leading-relaxed">
            OAICC engages a limited set of vetted technical sub-processors under rigorous Data Protection Addendums:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                <tr>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Sub-Processor</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Role & Purpose</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Hosting Jurisdiction</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Data Transferred</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Google Cloud Platform</td>
                  <td className="p-3">Core hosting, compute, encrypted storage</td>
                  <td className="p-3">United States & EU</td>
                  <td className="p-3 text-slate-500">Encrypted application database</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Firebase Authentication</td>
                  <td className="p-3">Secure authentication tokens & OAuth SSO</td>
                  <td className="p-3">United States</td>
                  <td className="p-3 text-slate-500">Email, UID, hashed credentials</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Transactional Mail Delivery</td>
                  <td className="p-3">Password resets & counseling reminders</td>
                  <td className="p-3">United States</td>
                  <td className="p-3 text-slate-500">Recipient email & meeting time only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Incident Response */}
        <section id="sec-incident" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">6.</span> Incident Response & Guaranteed 72-Hour Notice
          </h2>
          <p className="text-sm leading-relaxed">
            In the event of a confirmed data incident affecting identifiable student records, OAICC maintains a written Incident Response Plan. We pledge to notify affected institutional administrators and state regulators within <strong>72 hours</strong> of confirmation, detailing the scope, remedial measures taken, and technical countermeasures deployed.
          </p>
        </section>

        {/* Section 7: Badges */}
        <section id="sec-compliance" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">7.</span> Privacy Certifications & Legal Assurances
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <ShieldCheck className="w-6 h-6 text-brand mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">FERPA Ready</div>
              <div className="text-[11px] text-slate-500">Educational Records Safe</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <FileCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">COPPA Guard</div>
              <div className="text-[11px] text-slate-500">Minor Consent Standard</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <Lock className="w-6 h-6 text-violet-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">GDPR Compliant</div>
              <div className="text-[11px] text-slate-500">Articles 15-22 Enforced</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <EyeOff className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Zero Ad Sales</div>
              <div className="text-[11px] text-slate-500">100% Non-Commercial</div>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
