import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Eye, 
  Database, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import LegalLayout from './LegalLayout';

export default function PrivacyPolicy() {
  const [searchQuery, setSearchQuery] = useState('');

  const tableOfContents = [
    { id: 'sec-overview', label: '1. Privacy Commitment & Scope' },
    { id: 'sec-collection', label: '2. Information We Collect' },
    { id: 'sec-usage', label: '3. How We Use Student Data' },
    { id: 'sec-sharing', label: '4. No Sale & Sharing Rules' },
    { id: 'sec-roles', label: '5. Role-Based Visibility (Who Sees What)' },
    { id: 'sec-minors', label: '6. Children & Student Privacy (COPPA/FERPA)' },
    { id: 'sec-security', label: '7. Data Security & Encryption' },
    { id: 'sec-retention', label: '8. Retention & Graduation Purging' },
    { id: 'sec-rights', label: '9. Your Rights & Data Portability' },
    { id: 'sec-changes', label: '10. Changes & Contact' },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How OAICC collects, safeguards, and respects personal and educational assessment data across our counseling platform."
      lastUpdated="March 24, 2026"
      readTime="11 min"
      activeTab="privacy"
      tableOfContents={tableOfContents}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        {/* Core Privacy Promise Callout */}
        <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Our Golden Student Data Guarantee
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
            OAICC was built on an uncompromising principle: <strong>We do not sell student data</strong>, we do not build commercial behavioral advertising profiles on minors, and we only use assessment signals to guide students toward fulfilling careers and educational opportunities.
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-overview" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">1.</span> Privacy Commitment & Scope
          </h2>
          <p className="text-sm leading-relaxed">
            This Privacy Policy describes how OAICC (“we”, “us”, or “platform”) collects, processes, and protects personal information obtained from students, parents, guardians, teachers, counselors, and school administrators across our web portals, assessments, and guidance modules.
          </p>
          <p className="text-sm leading-relaxed">
            By accessing OAICC, you consent to the data practices described in this policy. For specialized tools to download or delete your records, visit our interactive{' '}
            <Link to="/data-privacy" className="text-brand font-bold hover:underline">
              Data Privacy & Rights Portal
            </Link>
            .
          </p>
        </section>

        {/* Section 2 */}
        <section id="sec-collection" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">2.</span> Information We Collect
          </h2>
          <p className="text-sm leading-relaxed">
            We collect only the minimum necessary data to provide comprehensive career counseling and psychometric insights:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand" /> Account & Demographic Data
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Full name, email address, password hashes, school affiliation, grade level, graduation year, and optional parent/sponsor linkage.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand" /> Assessment & Career Signals
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Responses to interests, strengths, work-style quizzes, subject affinity ratings, RIASEC clusters, and calculated industry fit scores.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-brand" /> Counselor Interactions
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Session booking history, counselor notes, agreed action plans, college shortlist goals, and feedback ratings.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-brand" /> Technical & Session Logs
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                IP address, browser type, device identifiers, essential session cookies, and timestamped audit logs for security integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="sec-usage" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">3.</span> How We Use Student Data
          </h2>
          <p className="text-sm leading-relaxed">
            Every piece of data collected is processed strictly for educational and guidance purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Calculating industry fit indices and matching students with suitable vocational and higher education pathways;</li>
            <li>Enabling assigned certified school counselors to review strengths before scheduled 1-on-1 advisory sessions;</li>
            <li>Providing parents and authorized guardians with visibility into their student’s career growth milestones;</li>
            <li>Aggregating anonymized cohort analytics for school administrators (e.g., % of cohort interested in STEM careers);</li>
            <li>Platform stability, fraud prevention, and session continuity.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="sec-sharing" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">4.</span> Strict Non-Sale & Data Sharing Limitations
          </h2>
          <p className="text-sm leading-relaxed">
            OAICC does not sell, rent, or lease personal student records or assessment results to commercial brokers, advertisers, or third parties under any circumstances.
          </p>
          <p className="text-sm leading-relaxed">
            Data is only shared with trusted technical sub-processors under strict Data Protection Agreements (DPAs) that fulfill our privacy requirements (such as Google Cloud Platform for hosting and encrypted database storage).
          </p>
        </section>

        {/* Section 5 */}
        <section id="sec-roles" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">5.</span> Role-Based Visibility (Who Sees What)
          </h2>
          <p className="text-sm leading-relaxed">
            To ensure complete transparency, our platform implements strict role-based access control (RBAC):
          </p>
          
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                <tr>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Role</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Viewable Data</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Restrictions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-semibold text-brand">Student</td>
                  <td className="p-3">Full personal profile, all assessment scores, personalized career matches, counseling session history.</td>
                  <td className="p-3 text-slate-500">Cannot view other students’ answers or counselor private case notes.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand">Counselor</td>
                  <td className="p-3">Assigned student assessment scores, career goals, session history, scheduled calendar appointments.</td>
                  <td className="p-3 text-slate-500">Only accessible for students assigned to their specific counseling roster.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand">Parent / Sponsor</td>
                  <td className="p-3">Linked child’s high-level career clusters, strengths summary, counselor session dates.</td>
                  <td className="p-3 text-slate-500">Requires verified student/school consent link; no access to other students.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand">School Admin</td>
                  <td className="p-3">Aggregated institutional metrics (e.g. cluster trends), counselor caseload distribution.</td>
                  <td className="p-3 text-slate-500">Restricted to enrolled school roster only.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6 */}
        <section id="sec-minors" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">6.</span> Children & Student Privacy (COPPA & FERPA)
          </h2>
          <p className="text-sm leading-relaxed">
            We adhere rigorously to the Family Educational Rights and Privacy Act (FERPA) and the Children’s Online Privacy Protection Act (COPPA). When educational institutions license OAICC, the school or district acts as the agent authorized to provide consent for educational data collection under COPPA.
          </p>
          <p className="text-sm leading-relaxed">
            Parents maintain the right under FERPA to inspect their child's educational records maintained on our platform, request corrections, or request that their child's account be removed.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-security" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">7.</span> Data Security & Cryptographic Safeguards
          </h2>
          <p className="text-sm leading-relaxed">
            We employ industry-leading technical and physical controls:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">AES-256 Encryption</span>
              All database records and file attachments are encrypted at rest using AES-256 standard.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">TLS 1.3 in Transit</span>
              All communications between your device and OAICC servers utilize encrypted HTTPS protocols.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Automated Audit Trails</span>
              Every counselor or admin access event is recorded in immutable security logs.
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="sec-retention" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">8.</span> Retention & Graduation Purging Schedule
          </h2>
          <p className="text-sm leading-relaxed">
            Student records are maintained during active enrollment to facilitate multi-year career progress tracking. Unless an account is actively maintained by an adult learner or requested by the institution, identifiable student assessment records are scheduled for automated archiving and cryptographic de-identification within 24 months of high school graduation.
          </p>
        </section>

        {/* Section 9 */}
        <section id="sec-rights" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">9.</span> Your Privacy Rights & Self-Service Data Portability
          </h2>
          <p className="text-sm leading-relaxed">
            Regardless of your geographic location, OAICC provides all users with universal data agency:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li><strong>Right to Access:</strong> View all stored records directly in your student or counselor dashboard.</li>
            <li><strong>Right to Data Portability:</strong> Export your assessment results and counselor summaries in standard JSON or PDF format at any time.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal or academic details.</li>
            <li><strong>Right to Erasure (Be Forgotten):</strong> Request permanent deletion of your profile and history via our Data Privacy Portal.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="sec-changes" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">10.</span> Changes to this Policy & Contact
          </h2>
          <p className="text-sm leading-relaxed">
            If we make material changes to how student data is processed, we will provide prominent advance notice on the platform and via email to registered school contacts and parent accounts.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1">
            <p><strong>OAICC Data Protection Office</strong></p>
            <p>Email: <a href="mailto:privacy@oaicc.org" className="text-brand font-medium hover:underline">privacy@oaicc.org</a></p>
            <p>Direct Inquiries: <Link to="/data-privacy" className="text-brand font-medium hover:underline">Submit a Data Rights Request</Link></p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
