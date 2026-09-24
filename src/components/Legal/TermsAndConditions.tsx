import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  GraduationCap, 
  School,
  Lock,
  ExternalLink
} from 'lucide-react';
import LegalLayout from './LegalLayout';

export default function TermsAndConditions() {
  const [searchQuery, setSearchQuery] = useState('');

  const tableOfContents = [
    { id: 'sec-acceptance', label: '1. Acceptance & Eligibility' },
    { id: 'sec-accounts', label: '2. Accounts & Minor Safeguards' },
    { id: 'sec-disclaimer', label: '3. Career Guidance Disclaimer' },
    { id: 'sec-conduct', label: '4. Acceptable Use & Conduct' },
    { id: 'sec-counseling', label: '5. Counselor Engagement Protocol' },
    { id: 'sec-ip', label: '6. Intellectual Property & Quizzes' },
    { id: 'sec-privacy', label: '7. Privacy & Student Records' },
    { id: 'sec-billing', label: '8. Subscriptions & Institutional Licensing' },
    { id: 'sec-liability', label: '9. Limitation of Liability' },
    { id: 'sec-termination', label: '10. Termination & Data Deletion' },
    { id: 'sec-law', label: '11. Governing Law & Dispute Resolution' },
    { id: 'sec-contact', label: '12. Contact & Notices' },
  ];

  return (
    <LegalLayout
      title="Terms and Conditions"
      subtitle="Please read these terms carefully before accessing or using the OAICC Career Counseling & Assessment Platform."
      lastUpdated="March 24, 2026"
      readTime="9 min"
      activeTab="terms"
      tableOfContents={tableOfContents}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        {/* Executive Summary Callout */}
        <div className="p-5 rounded-2xl bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30">
          <div className="flex items-center gap-2 mb-2 text-brand font-bold text-sm">
            <Scale className="w-5 h-5" /> Executive Summary for Students, Parents & Educators
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            OAICC provides psychometric discovery assessments, career cluster mappings, and counselor booking tools. We are an educational advisory service designed to empower career exploration. We do not guarantee college admissions or employment outcomes, and we never sell your personal data.
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-acceptance" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">1.</span> Acceptance of Terms & Eligibility
          </h2>
          <p className="text-sm leading-relaxed">
            By creating an account, accessing, or using the OAICC platform (the “Service”), including web applications, assessment engines, and counselor portals provided by OAICC (“we”, “us”, or “our”), you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions.
          </p>
          <div className="space-y-2 text-sm pl-4 border-l-2 border-slate-200 dark:border-slate-800">
            <p><strong>Students Under 18:</strong> If you are under the age of 18 (or the age of majority in your jurisdiction), you must obtain permission and consent from a parent, legal guardian, or sponsoring educational institution before using the Service.</p>
            <p><strong>Educational Institutions & Counselors:</strong> Schools, districts, teachers, and certified counselors warrant that they hold the necessary authority to register student cohorts and facilitate career counseling in compliance with local educational statutes.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="sec-accounts" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">2.</span> Account Registration & Minor Safeguards
          </h2>
          <p className="text-sm leading-relaxed">
            You agree to provide true, accurate, and current information during registration. You are responsible for safeguarding your login credentials (including passwords and linked Google authentication tokens). OAICC enforces strict role-based isolation between student accounts, counselor accounts, school administrator accounts, and parent/sponsor accounts.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Account Responsibility:</span> You must immediately notify OAICC of any unauthorized access or security breach at <a href="mailto:security@oaicc.org" className="text-brand font-medium hover:underline">security@oaicc.org</a>.
          </div>
        </section>

        {/* Section 3 */}
        <section id="sec-disclaimer" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">3.</span> Career Advisory & Educational Guidance Disclaimer
          </h2>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-1">Important Guidance Notice:</strong>
              OAICC assessment results, industry fit indices, psychometric cluster scores, and counselor feedback are structured exploratory tools intended for educational and career planning guidance only. They do not constitute formal psychodiagnostic evaluations, guarantees of academic admission, job offers, or professional legal/financial guarantees.
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Career trajectories involve independent academic performance, industry conditions, and individual life choices. OAICC disclaims all liability for decisions or outcomes resulting from reliance on platform recommendations or counselor advisories.
          </p>
        </section>

        {/* Section 4 */}
        <section id="sec-conduct" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">4.</span> Acceptable Use Policy & Platform Rules
          </h2>
          <p className="text-sm leading-relaxed">
            To maintain a safe, welcoming, and productive environment for learners and professionals, you agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Submit fraudulent assessment answers or misrepresent educational achievements;</li>
            <li>Harass, abuse, intimidate, or transmit inappropriate messages to students, teachers, or counselors;</li>
            <li>Attempt to reverse engineer, scrape, crawl, or extract OAICC assessment algorithms, question sequences, or career database repositories;</li>
            <li>Bypass platform authentication, access controls, or attempt privilege escalation between roles;</li>
            <li>Share student personal records or confidential counseling notes without explicit authorization.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="sec-counseling" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">5.</span> Counselor Engagement Protocol & Session Ethics
          </h2>
          <p className="text-sm leading-relaxed">
            Counselors registered on the platform are qualified educational advisors. Both students and counselors agree to adhere to ethical counseling standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Student & Parent Rights
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Students and parents have the right to request changes in counselor assignments, review shared session goals, and request session reschedule with at least 24 hours notice.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Confidentiality Boundaries
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Advisory sessions remain private. However, counselors are mandated reporters and must notify designated school authorities if there is credible risk of self-harm or harm to others.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="sec-ip" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">6.</span> Intellectual Property & Proprietary Question Sets
          </h2>
          <p className="text-sm leading-relaxed">
            All proprietary psychometric items, career taxonomy mappings, scoring matrices (including RIASEC algorithms, D/k industry fit equations), visual illustrations, UI designs, and software code are the exclusive intellectual property of OAICC or its licensors.
          </p>
          <p className="text-sm leading-relaxed">
            Users are granted a limited, personal, non-exclusive, revocable license to access the assessments and download individual student career summary reports solely for personal educational use.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-privacy" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">7.</span> Privacy & Student Records (FERPA / COPPA)
          </h2>
          <p className="text-sm leading-relaxed">
            Our treatment of personal information is governed by our dedicated{' '}
            <Link to="/privacy" className="text-brand font-bold hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/data-privacy" className="text-brand font-bold hover:underline">
              Data Privacy Statement
            </Link>
            , which are incorporated into these Terms by reference. OAICC complies with the Family Educational Rights and Privacy Act (FERPA), the Children’s Online Privacy Protection Act (COPPA), and the European General Data Protection Regulation (GDPR).
          </p>
        </section>

        {/* Section 8 */}
        <section id="sec-billing" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">8.</span> Subscriptions, Invoicing & Institutional Licensing
          </h2>
          <p className="text-sm leading-relaxed">
            Standard student tier features are accessible free of charge through school sponsorship or personal tier. Institutional enterprise contracts (School Dashboards, District Roster Sync, Custom Counselor Workspaces) are billed according to contracted service agreements. All fees are non-refundable unless specified otherwise in written institutional contracts.
          </p>
        </section>

        {/* Section 9 */}
        <section id="sec-liability" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">9.</span> Limitation of Liability
          </h2>
          <p className="text-sm leading-relaxed">
            To the maximum extent permitted by applicable law, OAICC and its directors, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data loss, or emotional distress resulting from your access to or inability to use the platform.
          </p>
        </section>

        {/* Section 10 */}
        <section id="sec-termination" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">10.</span> Account Suspension, Termination & Data Deletion
          </h2>
          <p className="text-sm leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate our Code of Conduct or compromise platform security. You may delete your account at any time from your settings or submit a right-to-be-forgotten request through our{' '}
            <Link to="/data-privacy" className="text-brand font-bold hover:underline">
              Data Privacy Portal
            </Link>
            . Upon deletion, personal identification tokens are purged in accordance with our retention policy.
          </p>
        </section>

        {/* Section 11 */}
        <section id="sec-law" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">11.</span> Governing Law & Dispute Resolution
          </h2>
          <p className="text-sm leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of Delaware, United States, without regard to conflict of law principles. Any dispute arising under or in connection with these Terms shall first be submitted to informal mediation before binding arbitration.
          </p>
        </section>

        {/* Section 12 */}
        <section id="sec-contact" className="scroll-mt-40 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand">12.</span> Contact & Legal Notices
          </h2>
          <p className="text-sm leading-relaxed">
            For questions regarding these Terms and Conditions or to request legal notices:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1">
            <p><strong>OAICC Legal Counsel & Operations</strong></p>
            <p>Email: <a href="mailto:legal@oaicc.org" className="text-brand font-medium hover:underline">legal@oaicc.org</a></p>
            <p>Data Protection Officer: <a href="mailto:privacy@oaicc.org" className="text-brand font-medium hover:underline">privacy@oaicc.org</a></p>
            <p>Address: 500 Educational Parkway, Suite 400, San Francisco, CA 94105</p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
