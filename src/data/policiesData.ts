import { UserRole } from '../types';

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

export interface PolicyVersionRecord {
  version: string;
  updatedAt: string;
  updatedBy: string;
  changeSummary: string;
  sections: PolicySection[];
  noticeBanner?: string;
  effectiveDate?: string;
}

export interface PolicyDocument {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  platform: string;
  legalEntity: string;
  website: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  contactEmail: string;
  registeredAddress: string;
  applicableRoles: UserRole[];
  noticeBanner?: string;
  sections: PolicySection[];
  legalFramework?: string[];
  isHidden?: boolean;
  versionHistory?: PolicyVersionRecord[];
}

export const POLICIES: PolicyDocument[] = [
  // 1. Website and Platform Terms (Terms of Use Policy)
  {
    id: 'terms',
    slug: 'terms',
    title: 'Website and Platform Terms',
    shortTitle: 'Terms of Use',
    tagline: 'Terms of Use and User Agreement governing access to the OAICC platform and services.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'info@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos, Nigeria',
    applicableRoles: ['student', 'counselor', 'parent', 'school', 'teacher', 'admin'],
    noticeBanner: 'Important: OAICC provides career guidance and educational decision-support. It does not guarantee academic, admission, employment, scholarship, licensing, immigration, earnings or career outcomes, and it is not an emergency, medical, mental-health, legal or financial service.',
    sections: [
      {
        id: 'terms-sec-1',
        title: '1. Agreement to These Terms',
        content: `These Terms of Use and User Agreement ("Terms") govern access to and use of the OAICC website, student and adult dashboards, career library, questionnaires, assessments, matching tools, counselling and mentorship features, scheduling tools, communications, events, content, pilots, and any related digital or offline service made available by OAICC (collectively, the "Services").

By creating an account, clicking an acceptance box, accessing the Services, participating through a school, or otherwise using OAICC, you agree to these Terms and the policies incorporated by reference. If you are accepting on behalf of a school, organisation, parent, guardian or other person, you represent that you have authority to do so.

If you do not agree, do not use the Services. Separate written school, partnership, counselling, sponsorship or enterprise agreements may supplement these Terms. If there is a conflict, the specifically negotiated written agreement governs for the subject matter it covers, except where law requires otherwise.`
      },
      {
        id: 'terms-sec-2',
        title: '2. Eligibility, Minors and Authority',
        content: `OAICC serves students, including children and young people. A "child" for OAICC safeguarding purposes generally means a person under 18, subject to applicable law.

• A student under 18 must use OAICC with the appropriate involvement, permission or authority of a parent, legal guardian, school or other authorised adult where required by law or OAICC policy.
• Where consent is the legal basis for processing a child's personal data, OAICC will obtain and, where required, take reasonable steps to verify the consent of a parent or legal guardian, subject to statutory exceptions.
• A school that registers or uploads students represents that it has lawful authority to do so and must cooperate with OAICC where direct parental or guardian consent is additionally required.
• OAICC may refuse or restrict access where age, authority or consent cannot reasonably be verified.`
      },
      {
        id: 'terms-sec-3',
        title: '3. Account Types and Role-Based Access',
        content: `OAICC may provide different access rights to students, parents/guardians, school representatives, counsellors, mentors, administrators, staff, partners and service providers. Features and information visible to each role may differ. Users must not attempt to obtain privileges or data outside their authorised role.`
      },
      {
        id: 'terms-sec-4',
        title: '4. Purpose and Scope of the Services',
        content: `OAICC is designed to help students understand interests, strengths and skills; explore industries and careers; view education and training pathways; obtain career counselling or mentorship; schedule sessions; and make better-informed educational and career decisions.

Features may change as OAICC develops. OAICC may add, modify, suspend or retire a feature for safety, legal, technical, operational or programme reasons. Where a material paid feature is withdrawn, OAICC will address affected consumers consistently with applicable law and the applicable purchase terms.`
      },
      {
        id: 'terms-sec-5',
        title: '5. Career Matching, Profiling and Automated Tools',
        content: `OAICC may analyse questionnaire responses, subject choices, skills, strengths, interests, stated preferences and other profile information to generate industry-fit scores, career-fit results, suggested careers, pathway previews or educational guidance.

• Results are indicators and guidance, not diagnoses, promises, rankings of personal worth, or final decisions.
• Results may be affected by incomplete, inaccurate, misunderstood or changing information and by the design or weighting of the assessment.
• OAICC does not intend to make solely automated decisions that produce legal or similarly significant effects on students.
• Users may ask for explanation or human review of a result through OAICC's support or counselling channels.
• OAICC may adjust algorithms, question banks, weights, taxonomies and career content as evidence, curricula, labour-market information or programme design changes.`
      },
      {
        id: 'terms-sec-6',
        title: '6. Educational and Career Information Disclaimer',
        content: `Career descriptions, salary examples, professional ranks, entry requirements, course information, subject recommendations, labour-market information and educational pathways are provided for general guidance. Requirements can differ by institution, jurisdiction, employer, professional body and year, and may change without notice.

Users should independently verify high-impact information with the relevant school, university, examination body, professional regulator, employer, scholarship provider or other authoritative source before relying on it.`
      },
      {
        id: 'terms-sec-7',
        title: '7. Counsellors, Mentors and Professional Scope',
        content: `OAICC may facilitate contact with counsellors or mentors. Their role is to provide career and educational guidance within the scope stated on OAICC. Unless expressly stated and separately agreed, use of OAICC does not create a lawyer-client, doctor-patient, therapist-client, financial-adviser, immigration-consultant or other regulated professional relationship.

• Counsellors and mentors must comply with OAICC's safeguarding and conduct requirements.
• OAICC may verify credentials or references where appropriate but does not guarantee that every statement made by a third-party professional remains current after verification.
• Users should report inappropriate conduct promptly.
• OAICC may reassign, suspend or remove a counsellor or mentor for safeguarding, conduct, competence, availability, legal or operational reasons.`
      },
      {
        id: 'terms-sec-8',
        title: '8. No Emergency or Crisis Service',
        content: `OAICC is not an emergency service and is not designed to monitor users continuously. If a person is in immediate danger, faces abuse, is at risk of self-harm or harm to others, or requires urgent medical or mental-health assistance, contact local emergency services, an appropriate child-protection authority, a qualified health professional, a parent/guardian or another trusted responsible adult.

Where OAICC becomes aware of a credible safeguarding risk, it may take reasonable protective steps, including contacting a parent, school, safeguarding authority or emergency service, subject to applicable law and the circumstances.`
      },
      {
        id: 'terms-sec-9',
        title: '9. User Accounts and Security',
        content: `• Provide accurate registration information and keep it reasonably up to date.
• Keep passwords, access codes and authentication methods confidential.
• Do not share an account except where OAICC expressly permits managed access.
• Notify OAICC promptly of suspected unauthorised access, compromise or impersonation.
• OAICC may require password resets, identity checks, multi-factor authentication or other security measures.

You are responsible for activity reasonably attributable to your account until you notify OAICC of compromise, except to the extent the activity results from OAICC's own breach of duty or another matter for which liability cannot lawfully be excluded.`
      },
      {
        id: 'terms-sec-10',
        title: '10. Acceptable Conduct',
        content: `Users must comply with the Acceptable Use Policy. Prohibited conduct includes harassment, bullying, grooming, exploitation, fraud, impersonation, unauthorised access, malicious code, scraping without permission, misuse of student data, unlawful discrimination, sexual or abusive content, and conduct that threatens safety or platform integrity.`
      },
      {
        id: 'terms-sec-11',
        title: '11. Parent, Guardian and School Responsibilities',
        content: `• Ensure there is an appropriate legal basis and authority for student participation and any information supplied to OAICC.
• Provide accurate information to the best of your knowledge.
• Explain the programme to the student in an age-appropriate way.
• Notify OAICC if authority, consent, school status or student participation changes.
• Avoid sharing more personal or sensitive information than is reasonably necessary.
• Cooperate with safeguarding, privacy and account-verification requests.`
      },
      {
        id: 'terms-sec-12',
        title: '12. Communications, Notifications and Electronic Acceptance',
        content: `OAICC may send service communications by email, platform notification, SMS, school channels or other contact methods provided by the user. These may include verification messages, session reminders, account notices, safety notices, policy updates and programme communications. Marketing communications will be handled separately where required by law.

Where law permits, electronic acceptance, electronic records and electronic communications may be used to evidence agreement, consent or notice. OAICC may retain the date, time, account, user role, policy version and other reasonable audit information associated with acceptance.`
      },
      {
        id: 'terms-sec-13',
        title: '13. Sessions, Attendance and Recording',
        content: `Session availability is not guaranteed. Users should attend scheduled sessions on time and provide reasonable notice when cancellation is necessary. OAICC may reschedule or cancel sessions due to counsellor availability, safety, technology, school scheduling or other reasonable circumstances.

A session will not be audio- or video-recorded by OAICC unless users are given appropriate notice and a lawful basis exists. Where consent is required, OAICC will not begin recording unless and until the required consent has been obtained. Unauthorised recording by users is prohibited where it violates law, privacy, safeguarding rules or OAICC policy.`
      },
      {
        id: 'terms-sec-14',
        title: '14. User Content and Permissions',
        content: `Users may submit profile information, questionnaire responses, messages, feedback, documents, images or other material ("User Content"). You retain rights you lawfully hold in your User Content.

You grant OAICC a limited, non-exclusive permission to host, store, copy, display, transmit, analyse and otherwise process User Content only as reasonably necessary to provide, secure, administer, support and improve the Services, comply with law, address complaints and meet safeguarding obligations, subject to the Privacy Policy.

You must not submit content you do not have the right to provide or content that unlawfully infringes privacy, confidentiality, copyright, trade marks or other rights.`
      },
      {
        id: 'terms-sec-15',
        title: '15. OAICC Intellectual Property',
        content: `OAICC and its licensors retain their rights in the platform, brand, logos, questionnaires, career taxonomies, explanatory content, design, text, graphics, databases, software and other materials. Except as expressly permitted, users may not reproduce, sell, republish, scrape, reverse engineer, create derivative works from, or commercially exploit OAICC materials.

Schools and students may use platform outputs for their own educational and counselling purposes, subject to any additional licence terms displayed with specific content.`
      },
      {
        id: 'terms-sec-16',
        title: '16. Feedback',
        content: `If you voluntarily provide suggestions or feedback, OAICC may use that feedback to improve its services without an obligation to compensate you, provided OAICC does not publicly identify you without an appropriate basis.`
      },
      {
        id: 'terms-sec-17',
        title: '17. Fees, Payments, Taxes and Pricing',
        content: `Some OAICC services may be free, pilot-funded, school-funded, sponsored or paid. Before a consumer completes a paid transaction, OAICC will disclose, in clear and understandable language, the material service description, total price or applicable charges, payment frequency, renewal terms where applicable, cancellation and refund conditions, and any material restrictions.

OAICC will not rely on a term that unlawfully removes or restricts mandatory consumer rights. Payment processing may be performed by a third-party provider under its own security and privacy terms.`
      },
      {
        id: 'terms-sec-18',
        title: '18. Cancellations, Refunds and Service Problems',
        content: `Cancellations and refunds are governed by the Complaints, Consumer Protection, Cancellation and Refund Policy and any specific purchase terms shown before payment. Nothing in an OAICC refund rule limits a remedy that a consumer is entitled to under mandatory law.

Where OAICC is unable to provide a paid service, or where applicable law gives the consumer a cancellation or refund right, OAICC will provide the remedy required by law.`
      },
      {
        id: 'terms-sec-19',
        title: '19. Pilot, Beta and Pre-Release Features',
        content: `OAICC may test pilot, beta or pre-release features with selected schools or users. Such features may be incomplete, changed or withdrawn during testing. OAICC will still use reasonable care and maintain applicable safeguarding, privacy and consumer protections. Pilot users are encouraged to report errors, unexpected results and usability concerns. Experimental or pilot outputs should not be relied upon as the sole basis for significant educational or career decisions.`
      },
      {
        id: 'terms-sec-20',
        title: '20. Third-Party Services and Links',
        content: `The Services may rely on third-party hosting, email, authentication, analytics, scheduling, videoconferencing, payment, storage or other providers and may link to external resources. OAICC does not control third-party websites or independently guarantee their availability, accuracy or practices. Third-party services are generally governed by their own terms and privacy notices. OAICC is not responsible for matters outside its reasonable control, but this does not affect any responsibility OAICC is required to retain under applicable law.`
      },
      {
        id: 'terms-sec-21',
        title: '21. Availability, Maintenance and Service Changes',
        content: `OAICC aims to provide reliable access but may experience maintenance, upgrades, outages, internet failures, vendor failures, cyber incidents or other interruptions. OAICC may temporarily limit functionality to investigate faults, protect users or data, comply with law, or maintain security.

Where an interruption materially affects a paid consumer service, OAICC will consider appropriate rescheduling, remediation, credit or refund consistent with the circumstances and applicable law.`
      },
      {
        id: 'terms-sec-22',
        title: '22. Events Beyond Reasonable Control',
        content: `OAICC will not be responsible for delay or failure caused by events genuinely beyond its reasonable control, such as widespread network failure, natural disaster, epidemic, civil disturbance, government restriction, major cloud-provider outage or comparable event, to the extent permitted by law. OAICC will use reasonable efforts to mitigate material effects and resume affected services.`
      },
      {
        id: 'terms-sec-23',
        title: '23. Suspension, Investigation and Termination',
        content: `OAICC may warn, restrict, suspend or terminate an account where reasonably necessary to address a policy breach, safeguarding risk, fraud, unauthorised access, legal obligation, security incident, repeated non-payment, abuse of other users or material operational risk. Immediate action may be taken where delay could expose a child, user, OAICC or personal data to harm.

Where appropriate and safe, OAICC may provide notice and an opportunity to explain or appeal. OAICC may preserve relevant records where required for safeguarding, legal claims, investigations, audit or regulatory compliance.`
      },
      {
        id: 'terms-sec-24',
        title: '24. Disclaimers and Standard of Care',
        content: `OAICC will use reasonable care and skill in providing Services. To the extent permitted by law, OAICC does not warrant that every feature will always be uninterrupted, error-free, compatible with every device, or that every third-party or career data point will remain current.

Nothing in these Terms excludes any statutory guarantee, duty, remedy or liability that cannot lawfully be excluded or limited.`
      },
      {
        id: 'terms-sec-25',
        title: '25. Limitation of Liability',
        content: `To the fullest extent permitted by applicable law, OAICC is not liable for indirect, incidental or consequential loss arising solely from a user's reliance on non-binding career suggestions, third-party information, unauthorised user conduct, or events outside OAICC's reasonable control. Any limitation will be interpreted narrowly and will not apply where prohibited by law.

Subject always to any liability, remedy or consumer right that cannot lawfully be excluded or limited, OAICC does not exclude or limit liability for fraud, fraudulent misrepresentation, wilful misconduct, gross negligence where it cannot lawfully be limited, death or personal injury caused by negligence where applicable, breach of non-excludable consumer rights, or any other liability that applicable law requires OAICC to bear.`
      },
      {
        id: 'terms-sec-26',
        title: '26. Responsibility for Misuse',
        content: `To the extent permitted by applicable law, a user may be responsible for reasonably foreseeable loss caused by that user's fraudulent, unlawful or deliberate misuse of OAICC or deliberate infringement of another person's rights.`
      },
      {
        id: 'terms-sec-27',
        title: '27. Consumer Rights',
        content: `Nothing in these Terms is intended to waive rights under the Federal Competition and Consumer Protection Act 2018 or other mandatory consumer-protection law. OAICC will provide material information in clear language before a paid transaction and maintain a reasonable complaint and redress process.`
      },
      {
        id: 'terms-sec-28',
        title: '28. Privacy and Safeguarding',
        content: `Personal data is handled under the Privacy Policy, Cookie Policy, Child Safeguarding and Student Protection Policy, and Parent/Guardian/School Consent and Student Privacy Notice, as applicable. Those documents form part of the overall rules for using OAICC.`
      },
      {
        id: 'terms-sec-29',
        title: '29. Changes to These Terms',
        content: `OAICC may update these Terms to reflect changes in law, Services, technology, risk or operating practices. Material changes will be communicated by reasonable means. Where fresh consent or acceptance is legally required, OAICC will obtain it rather than treating silence as consent.`
      },
      {
        id: 'terms-sec-30',
        title: '30. Governing Law and Dispute Resolution',
        content: `These Terms are governed by the laws of the Federal Republic of Nigeria, subject to mandatory rights that may apply to a user in another jurisdiction. Users are encouraged to use OAICC's complaint process first. Nothing prevents a person from approaching a competent court, regulator, consumer authority, data protection authority or safeguarding authority where legally entitled to do so.`
      },
      {
        id: 'terms-sec-31',
        title: '31. General Legal Provisions',
        content: `• Severability: if a provision is unenforceable, the remaining provisions continue to the extent legally possible.
• No waiver: failure to enforce a provision once does not permanently waive it.
• Assignment: OAICC may transfer these Terms as part of a lawful reorganisation, merger, sale or transfer of the service, subject to applicable user and data-protection rights. Users may not transfer an account without permission.
• Entire agreement: these Terms, incorporated policies and any applicable written service agreement form the agreement concerning use of OAICC.
• Headings are for convenience and do not limit interpretation.
• Provisions that by their nature should survive account closure, including intellectual property, confidentiality, lawful record retention, dispute and liability provisions, may continue to apply.`
      },
      {
        id: 'terms-sec-32',
        title: '32. Contact',
        content: `General/legal enquiries: info@oaiccglobal.com
Complaints: complaints@oaiccglobal.com
Privacy: privacy@oaiccglobal.com
Safeguarding: safeguarding@oaiccglobal.com
Registered address: Brownstone Cluster 2, Kunsela Road, Ikate, Lagos, Nigeria`
      }
    ],
    legalFramework: [
      'Federal Competition and Consumer Protection Act 2018 (Nigeria), including mandatory consumer rights relating to disclosure, fair dealing and service quality.',
      'Nigeria Data Protection Act 2023 and the Nigeria Data Protection Act General Application and Implementation Directive (GAID) 2025.',
      'Child Rights Act 2003 and applicable state child-protection legislation and safeguarding requirements.',
      'General Data Protection Regulation (EU) 2016/679 where its territorial scope applies to OAICC processing.'
    ]
  },

  // 2. Privacy Policy
  {
    id: 'privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    shortTitle: 'Privacy Policy',
    tagline: 'How OAICC Collects, Uses and Protects Personal Data across our guidance and counselling services.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'Oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'privacy@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['student', 'counselor', 'parent', 'school', 'teacher', 'admin'],
    noticeBanner: "Children and students: OAICC is designed for students and may process children's personal data. OAICC applies enhanced safeguards, data minimisation, role-based access and age-appropriate transparency, and obtains parental or guardian consent where consent is the applicable legal basis and law requires it.",
    sections: [
      {
        id: 'priv-sec-1',
        title: '1. Scope of This Policy',
        content: `This Privacy Policy explains how OAICC processes personal data through its website, accounts, career questionnaires, career library, matching tools, counselling and mentorship services, session scheduling, school programmes, communications, events, pilots and related services.

It applies to students, parents and guardians, school representatives, counsellors, mentors, staff, applicants, partners, website visitors and other individuals whose personal data OAICC processes.`
      },
      {
        id: 'priv-sec-2',
        title: '2. Who Is Responsible for Your Personal Data',
        content: `OAICC will usually act as a data controller when it decides why and how personal data is processed for its own platform, programme, account, safety and service purposes. In some school or institutional arrangements, OAICC may process specified student information on documented instructions from a school or partner and may therefore act as a data processor for that processing. The applicable school or service agreement should clarify the parties' roles.

Controller/contact details: OruAikiIse Ltd, trading as OAICC – OruAikiIse Careers Counselling
Legal entity: OruAikiIse Ltd
Address: Brownstone Cluster 2, Kunsela Road, Ikate, Lagos
Privacy/DPO email: privacy@oaiccglobal.com
Telephone: TBD`
      },
      {
        id: 'priv-sec-3',
        title: '3. Data Protection Principles',
        content: `• Lawfulness, fairness and transparency.
• Purpose limitation: information is collected for specified and legitimate purposes.
• Data minimisation: OAICC seeks only information reasonably necessary for the relevant purpose.
• Accuracy: reasonable steps are taken to keep important information accurate and up to date.
• Storage limitation: identifiable data is not kept longer than reasonably necessary.
• Integrity and confidentiality: appropriate technical and organisational safeguards are used.
• Accountability: OAICC documents and reviews its data-protection responsibilities.`
      },
      {
        id: 'priv-sec-4',
        title: '4. Categories of Personal Data We May Process',
        content: `4.1 Student data:
• Identity and profile information, such as name, age/date of birth, preferred name and profile image where enabled.
• School, class/year group, curriculum, location and educational information.
• Subjects, grades or academic information where the programme requires them.
• Interests, hobbies, skills, strengths, preferences and self-assessment responses.
• Career interests, industry preferences, career-match scores and pathway results.
• Counselling and mentorship scheduling, session metadata, notes or follow-up information where appropriate.
• Parent/guardian details and consent or authority records.
• Messages, feedback, support requests and safeguarding information where relevant.
• Account, login, device, security and usage information.

4.2 Parent and guardian data:
• Name and relationship to student.
• Email address, phone number and other contact information.
• Consent, authorisation and communication records.
• Billing or transaction information where applicable.
• Complaints, requests, feedback and support history.

4.3 School and institutional data:
• School name, address and programme information.
• Names, work contact details and roles of school contacts.
• Student participation lists supplied under an appropriate legal basis.
• Programme administration, reporting and support communications.

4.4 Counsellor and mentor data:
• Identity and contact details.
• Profile, biography, expertise, education, qualifications and professional information.
• Verification, references or checks where appropriate and lawful.
• Availability, session records, communications and feedback.
• Account, usage, security and administrative records.

4.5 Technical and online data:
• IP address and approximate network-derived location.
• Browser, operating system, device and session information.
• Login attempts, authentication events and security logs.
• Pages/features used, timestamps, error logs and performance information.
• Cookie and similar technology data as described in the Cookie Policy.

4.6 Payment and transaction data:
Where OAICC uses a third-party payment processor, payment card information will ordinarily be processed directly by that provider rather than stored by OAICC. The information OAICC itself receives will depend on the payment arrangement in use.`
      },
      {
        id: 'priv-sec-5',
        title: '5. Sensitive or Special-Category Information',
        content: `OAICC does not seek sensitive personal data unless it is genuinely necessary for a lawful purpose such as safeguarding, accessibility, legal compliance or appropriately tailored support. Users should not submit medical records, religious beliefs, political opinions, biometric data, sexual-life information or other highly sensitive information unless OAICC specifically requests it for a clear purpose.

Where sensitive information is processed, OAICC will identify an appropriate legal condition, restrict access and apply enhanced safeguards.`
      },
      {
        id: 'priv-sec-6',
        title: '6. Where Personal Data Comes From',
        content: `• Directly from the individual through registration, questionnaires, messages, sessions, feedback and support requests.
• From a parent or guardian.
• From a participating school or authorised school representative.
• From an assigned counsellor or mentor in connection with providing the service.
• From service providers that support authentication, hosting, payments, communications, analytics or security.
• From publicly available professional sources where OAICC verifies counsellor, mentor, school or career information and the use is lawful.

Where OAICC receives personal data indirectly, it will provide required privacy information unless a lawful exception applies.`
      },
      {
        id: 'priv-sec-7',
        title: '7. Why We Process Data and Our Lawful Bases',
        content: `The exact lawful basis depends on the activity. OAICC does not rely on consent where another basis is more appropriate merely to make processing appear optional:

• Account creation and authentication: Contract / legitimate interests / consent where appropriate — Create accounts, verify access, prevent misuse and administer the service.
• Student career questionnaire and matching: Consent, contract, legitimate interests or another lawful basis depending on the programme and age/authority arrangements — Generate guidance, career-fit outputs and pathway information.
• Counselling and mentorship: Contract, consent, legitimate interests, vital interests, legal obligation or another lawful basis applicable to the particular processing — Provide sessions, notes, follow-up and student support.
• School programme administration: Contract, legitimate interests, consent or another lawful basis — Coordinate participation, reporting, schedules and support.
• Safeguarding and safety: Legal obligation, vital interests, legitimate interests, public-interest or other lawful ground as applicable — Protect students, respond to disclosures and manage risk.
• Payments and accounting: Contract and legal obligation — Process transactions, invoices, refunds, tax/accounting records.
• Security and fraud prevention: Legitimate interests and legal obligation where applicable — Protect accounts, users, personal data and platform integrity.
• Marketing: Consent or legitimate interests where lawful — Send optional news or promotions; children will not receive inappropriate direct marketing.
• Legal claims and regulatory compliance: Legal obligation / legitimate interests — Respond to regulators, complaints, disputes, audits and legal claims.`
      },
      {
        id: 'priv-sec-8',
        title: '8. Consent',
        content: `Where OAICC relies on consent, the request will be presented in clear language and will require affirmative action. Silence, inactivity or a pre-ticked box will not be treated as consent where prohibited. Consent can be withdrawn, and withdrawal will not make earlier lawful processing unlawful.

Where a data subject is a child or lacks legal capacity and OAICC relies on consent under Nigerian law, OAICC will obtain parental or legal-guardian consent and apply an age/consent verification mechanism appropriate to the risk, subject to statutory exceptions. If GDPR Article 8 applies, the applicable EU/EEA Member State age threshold for child consent to information-society services will also be respected.`
      },
      {
        id: 'priv-sec-9',
        title: "9. Children's Privacy and Age-Appropriate Design",
        content: `• Use clear, age-appropriate notices and explanations where possible.
• Collect only information reasonably needed for the service.
• Use privacy-protective defaults for students where practicable.
• Restrict student data to authorised roles.
• Avoid behavioural advertising to children and do not sell children's personal data.
• Treat profiling and new technologies involving children as higher-risk processing requiring enhanced review.
• Allow parents/guardians and students to raise privacy questions and exercise applicable rights.
• Apply safeguarding escalation where privacy information indicates a credible risk of harm.`
      },
      {
        id: 'priv-sec-10',
        title: '10. Career Matching, Profiling and Automated Processing',
        content: `OAICC may use automated calculations to score questionnaire responses and produce career or industry suggestions. OAICC will take reasonable steps to document the logic and methodology used for career-matching tools at an appropriate level, test for unreasonable or discriminatory outcomes, and review material changes to algorithms, scoring or weighting.

OAICC does not intend to subject students to solely automated decisions producing legal or similarly significant effects. Where applicable law provides a right regarding automated decision-making, users may request information, human intervention, correction or challenge through the privacy contact.`
      },
      {
        id: 'priv-sec-11',
        title: '11. Data Protection Impact Assessments and Privacy by Design',
        content: `OAICC will assess privacy risk when introducing materially new technology, profiling, large-scale processing, sensitive information, systematic monitoring or processing involving vulnerable users such as children. Where a Data Protection Impact Assessment is legally required, OAICC will conduct and document it before or as required for the processing and address identified risks.`
      },
      {
        id: 'priv-sec-12',
        title: '12. Who We May Share Personal Data With',
        content: `• Authorised OAICC staff and administrators on a need-to-know basis.
• Parents/guardians where they are authorised and disclosure is appropriate.
• Participating schools or authorised school representatives where lawfully permitted.
• Assigned counsellors or approved mentors to the extent needed to provide guidance.
• Hosting, cloud, authentication, email, communications, scheduling, videoconferencing, analytics, cybersecurity and technical service providers.
• Payment processors and financial service providers where a paid service is used.
• Professional advisers, auditors and insurers where necessary and subject to confidentiality.
• Regulators, courts, law enforcement, child-protection or safeguarding authorities where legally required or appropriately necessary to protect a person.
• A successor or transaction counterparty in a lawful merger, reorganisation, investment or transfer, subject to confidentiality, due diligence and applicable data-protection requirements.

OAICC DOES NOT SELL STUDENT PERSONAL DATA.`
      },
      {
        id: 'priv-sec-13',
        title: '13. Service Providers and Data Processing Agreements',
        content: `OAICC will seek to use processors that provide sufficient guarantees of appropriate technical and organisational safeguards. Where required, OAICC will enter into written data-processing terms addressing instructions, confidentiality, security, sub-processing, assistance with rights, incident notification, deletion/return and audit or assurance measures.`
      },
      {
        id: 'priv-sec-14',
        title: '14. International Data Transfers',
        content: `OAICC may use service providers in countries outside Nigeria or outside the user's jurisdiction. Before making a restricted international transfer, OAICC will identify and document a lawful transfer mechanism or exception and appropriate safeguards as required by the Nigeria Data Protection Act/GAID and, where applicable, the GDPR. Users may contact OAICC for further information about applicable safeguards.`
      },
      {
        id: 'priv-sec-15',
        title: '15. Data Retention',
        content: `OAICC retains identifiable personal data only for as long as reasonably necessary for the purpose for which it was collected and to meet safeguarding, legal, accounting, audit, dispute, security and regulatory obligations. OAICC maintains retention practices designed to ensure that identifiable personal data is not retained for longer than reasonably necessary, subject to applicable legal, safeguarding, accounting, security and dispute-resolution requirements.

• Active account and student profile data: generally retained while the account/programme is active and for a justified period afterwards to support continuity, requests and disputes.
• Consent and acceptance records: retained for the period necessary to demonstrate authority and compliance.
• Financial records: retained for the period required by tax, accounting and other applicable law.
• Security logs: retained for a proportionate period based on security and investigation needs.
• Safeguarding records: retained under a separately approved safeguarding retention rule reflecting the seriousness of the concern, legal requirements and the interests of the child.
• Data subject request and complaint records: retained long enough to demonstrate proper handling and manage related legal or regulatory issues.

When retention is no longer justified, OAICC will securely delete, destroy or irreversibly anonymise the information, subject to technical backup cycles and lawful preservation requirements.`
      },
      {
        id: 'priv-sec-16',
        title: '16. Anonymised and Aggregated Information',
        content: `OAICC may use genuinely anonymised or aggregated information for statistics, programme evaluation, research, reporting, funding evidence and service improvement. OAICC will take reasonable steps to ensure such outputs do not reasonably identify an individual. Pseudonymised information remains personal data where re-identification remains reasonably possible.`
      },
      {
        id: 'priv-sec-17',
        title: '17. Security',
        content: `OAICC takes reasonable steps to protect personal data against unauthorised access, loss, misuse, alteration, disclosure or destruction. The security measures used by OAICC reflect the nature of the information processed, the risks associated with the processing, the available technology and the stage of development of the platform.

Current and developing safeguards include:
• Password-protected user accounts;
• Role-based access to platform information;
• Access controls designed to limit personal data to authorised users;
• Secure hosting and platform infrastructure;
• Authentication and account-security controls;
• Confidentiality obligations for persons who are authorised to access personal data;
• Logging or monitoring of security-related activity where available;
• Back-up and recovery arrangements where supported by OAICC's service providers; and
• Periodic review and improvement of privacy and security measures as the platform develops.

No website, platform, transmission method or electronic storage system can be guaranteed to be completely secure. OAICC therefore cannot guarantee absolute security but will take reasonable steps to identify and respond to material security risks. Users are responsible for keeping passwords and credentials confidential.`
      },
      {
        id: 'priv-sec-18',
        title: '18. Personal Data Breaches',
        content: `OAICC will document, assess, contain and remediate suspected personal data breaches. Where a breach is likely to result in risk to individuals, OAICC will make required regulatory notifications within the applicable statutory period. Under the Nigeria Data Protection Act, notification to the Nigeria Data Protection Commission is required within 72 hours of awareness where the statutory risk threshold is met. Where a breach is likely to create a high risk to an affected person, OAICC will communicate with that person where required by law.`
      },
      {
        id: 'priv-sec-19',
        title: '19. Your Rights',
        content: `• Right to be informed about processing.
• Right of access to applicable personal data and processing information.
• Right to correct inaccurate or incomplete data.
• Right to request erasure where legal conditions are met.
• Right to restrict processing in applicable circumstances.
• Right to object to certain processing.
• Right to data portability where applicable.
• Right to withdraw consent where processing is based on consent.
• Rights relating to qualifying automated decision-making and profiling.
• Right to lodge a complaint with the Nigeria Data Protection Commission or another competent supervisory authority where applicable.

Rights are subject to applicable legal conditions and may be limited where disclosure would adversely affect another person's rights, where OAICC must retain information by law, or where another lawful exception applies.`
      },
      {
        id: 'priv-sec-20',
        title: '20. How to Exercise a Privacy Right',
        content: `Send a request to privacy@oaiccglobal.com. OAICC may ask for information reasonably necessary to verify identity, parental/guardian authority or representative authority. OAICC will respond to valid requests without undue delay and within any timeframe required by applicable data protection law. Where additional time is lawfully permitted because of the complexity or number of requests, OAICC will provide any notice required by law.

OAICC will not normally charge for a reasonable rights request. A fee or refusal may apply only where permitted by law, for example for manifestly unfounded or excessive requests. OAICC will explain the basis for any lawful refusal.`
      },
      {
        id: 'priv-sec-21',
        title: '21. Parent/Guardian and Student Rights',
        content: `The way privacy rights are exercised for a child depends on age, maturity, legal capacity, applicable law and the circumstances. OAICC will consider the child's own rights and interests as well as lawful parental or guardian authority. A parent or school does not automatically have unrestricted access to every communication if disclosure would be unlawful or create a safeguarding risk.`
      },
      {
        id: 'priv-sec-22',
        title: '22. Marketing and Communications',
        content: `OAICC may send operational messages necessary for the service, such as verification, password reset, session, safety and policy notices. Optional marketing or promotional communications will be sent only where a lawful basis exists. Users may opt out of non-essential marketing. OAICC will not intentionally direct inappropriate behavioural marketing to children.`
      },
      {
        id: 'priv-sec-23',
        title: '23. Session Notes, Audio/Video and Communications',
        content: `OAICC may retain limited session administration or counselling notes where reasonably necessary for continuity, safeguarding, quality or legal purposes. OAICC will not record audio or video merely because a digital tool makes recording technically possible. If recording is proposed, users will be told the purpose, access, retention and lawful basis in advance, and consent will be obtained where required.`
      },
      {
        id: 'priv-sec-24',
        title: '24. Cookies and Similar Technologies',
        content: `OAICC uses cookies and similar technologies as described in the Cookie Policy. Non-essential technologies will be activated only with consent where required. Where consent is required for non-essential cookies or similar technologies, that consent will be obtained separately from acceptance of this Privacy Policy and will be managed as described in the Cookie Policy.`
      },
      {
        id: 'priv-sec-25',
        title: '25. Third-Party Links',
        content: `OAICC may link to external websites and services. Their privacy practices are outside OAICC's control unless they act as OAICC processors. Users should review the privacy notices of third-party sites they choose to visit.`
      },
      {
        id: 'priv-sec-26',
        title: '26. Business Changes',
        content: `If OAICC undergoes a merger, restructuring, investment, asset transfer or change of control, personal data may be disclosed for lawful due diligence and transferred where necessary, subject to confidentiality and applicable data-protection requirements. OAICC will provide notice where required by law and will not use the transaction to remove existing mandatory privacy rights.`
      },
      {
        id: 'priv-sec-27',
        title: '27. Complaints and Regulators',
        content: `Privacy complaints may be sent to info@oaiccglobal.com. OAICC will investigate and respond fairly. Individuals may also complain to the Nigeria Data Protection Commission or, where applicable, another competent supervisory authority.`
      },
      {
        id: 'priv-sec-28',
        title: '28. Changes to This Policy',
        content: `OAICC may update this Privacy Policy when services, vendors, data practices or legal requirements change. Material changes will be communicated by reasonable means. Where a new processing purpose requires consent, OAICC will seek new consent rather than relying solely on a policy update.`
      }
    ],
    legalFramework: [
      "Nigeria Data Protection Act 2023, including transparency, children's consent, data-subject rights, security and breach-notification requirements.",
      'Nigeria Data Protection Act General Application and Implementation Directive (GAID) 2025, including accountability and implementation requirements.',
      "General Data Protection Regulation (EU) 2016/679 where applicable, including transparency, children's consent, security, DPIA, international transfer and data-subject rights provisions.",
      'Child Rights Act 2003 and applicable state child-protection laws where relevant to student safety and privacy.'
    ]
  },

  // 3. Cookies and Tracking Technology Policy
  {
    id: 'cookies',
    slug: 'cookies',
    title: 'Cookies and Tracking Technology Policy',
    shortTitle: 'Cookie Policy',
    tagline: 'How OAICC uses cookies, local storage, and similar technologies on its website and platform.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'Oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'info@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['student', 'counselor', 'parent', 'school', 'teacher', 'admin'],
    noticeBanner: "Website Cookie Notice: Because OAICC provides services to children and young people, we take a privacy-protective approach to cookies and tracking technologies. We do not use behavioural advertising cookies to target children.",
    sections: [
      {
        id: 'cook-sec-1',
        title: '1. Purpose',
        content: `This Cookie and Tracking Technologies Policy explains how OAICC uses cookies, local storage, pixels, software development kits and similar technologies (collectively, "cookies") on its website and platform.`
      },
      {
        id: 'cook-sec-2',
        title: '2. What Cookies Are',
        content: `Cookies are small data files or identifiers stored or accessed on a device. Some are necessary for a website to function; others may support preferences, analytics, performance or other optional purposes.`
      },
      {
        id: 'cook-sec-3',
        title: '3. Cookie Categories',
        content: `3.1 Strictly necessary cookies:
These support essential functions such as login, authentication, security, session continuity, load balancing, fraud prevention and consent-preference storage. Where law permits, these may be used without optional consent because the service cannot reasonably operate without them.

3.2 Functional or preference cookies:
These remember choices such as language, display preferences or non-essential settings. Where required by law, they will not be set until the user consents.

3.3 Analytics and performance cookies:
These help OAICC understand how the platform is used, identify errors, measure performance and improve features. OAICC will take reasonable steps to configure analytics to minimise unnecessary personal data and, where feasible, reduce or mask identifiable information. Consent will be obtained where required.

3.4 Advertising and targeting cookies:
OAICC does not intend to use behavioural advertising cookies to target children. If OAICC introduces advertising or targeting technologies in the future, we will update this Policy, assess the privacy and child-safety implications, and obtain any consent required by applicable law before using them.`
      },
      {
        id: 'cook-sec-4',
        title: '4. Cookies and Similar Technologies Used by OAICC',
        content: `OAICC may use cookies and similar technologies that are necessary to operate, secure and improve the website and platform.

At this stage, OAICC has not completed a formal inventory of all cookies and similar technologies that may be generated by the platform or by third-party services integrated into it. We therefore do not publish an individual cookie list in this Policy until that information has been verified.

OAICC will not intentionally use non-essential cookies or tracking technologies in a manner that requires consent without first providing users with appropriate information and obtaining consent where required by applicable law.

4.1 Cookie Consent and User Choice:
Where OAICC uses cookies or similar technologies that require consent, users will be given an appropriate opportunity to:
• Accept optional cookies;
• Reject optional cookies;
• Manage their preferences; and
• Withdraw or change previously given consent.
Rejecting optional cookies should not prevent users from accessing essential platform functions. Strictly necessary technologies may continue to operate where they are required for the platform to function securely.

4.2 Future Cookie Inventory:
OAICC intends to maintain an accurate record of cookies and similar technologies used by the platform. Once technically verified, this Policy may be updated with cookie names, provider, purpose, category, duration and consent requirements.

4.3 Browser Controls:
Users may also control or delete cookies using their browser settings. Disabling certain technologies may affect the availability or proper operation of some platform functions.`
      },
      {
        id: 'cook-sec-5',
        title: '5. Consent and the Cookie Banner',
        content: `Where consent is legally required, OAICC will not activate non-essential cookies until the appropriate consent has been obtained. Users will be given a genuine choice to accept or reject optional cookies. Optional cookie categories will not be pre-selected where affirmative consent is required. OAICC will maintain appropriate records of cookie preferences where necessary and will provide a reasonable way for users to withdraw or change their consent.`
      },
      {
        id: 'cook-sec-6',
        title: '6. Children and Young Users',
        content: `Because OAICC provides services to children and young people, we take a privacy-protective approach to cookies and similar technologies.

OAICC aims to minimise unnecessary tracking of child users and does not intentionally use children's personal information for behavioural advertising or unrelated commercial profiling.

Where optional cookies or similar technologies require consent, OAICC will use appropriate privacy-protective defaults and will obtain any consent or parent/guardian authorisation required by applicable law. Where a child accesses OAICC through a participating school, parent, guardian or other authorised adult, OAICC will apply the appropriate consent, authorisation and safeguarding requirements relevant to that arrangement.

Strictly necessary cookies may still be used where required to provide essential platform functions such as secure login, authentication, session management and account security.`
      },
      {
        id: 'cook-sec-7',
        title: '7. Third-Party Technologies',
        content: `Some OAICC features may rely on third-party providers, including authentication, hosting, communications, analytics, scheduling, payment or security services. Where these providers use cookies or similar technologies, OAICC will take reasonable steps to ensure that appropriate information and consent mechanisms are provided where required by applicable law.`
      },
      {
        id: 'cook-sec-8',
        title: '8. Managing Cookie Preferences',
        content: `Where OAICC provides optional cookies or similar technologies that require user consent, users will be given an appropriate way to manage or change their preferences.

Where available, cookie preferences may be accessed through a "Cookie Settings" or similar link on the website.

Users may also manage, block or delete cookies through their browser settings. However, blocking or disabling certain strictly necessary cookies may affect essential platform functions, including secure login, authentication, session management and account security.

Withdrawing consent for optional cookies will not affect any processing that was lawful before consent was withdrawn.`
      },
      {
        id: 'cook-sec-9',
        title: '9. Global Privacy Signals and Browser Controls',
        content: `Where OAICC operates in a jurisdiction that legally requires recognition of browser-based opt-out or privacy signals, OAICC will implement the applicable requirement. Otherwise, OAICC may treat such signals as a preference indicator where technically feasible.`
      },
      {
        id: 'cook-sec-10',
        title: '10. Changes to This Policy',
        content: `OAICC will update this Policy when it introduces, removes or materially changes cookies or similar technologies.`
      },
      {
        id: 'cook-sec-11',
        title: '11. Contact',
        content: `Questions about cookies or tracking may be sent to info@oaiccglobal.com.`
      }
    ],
    legalFramework: [
      'Nigeria Data Protection Act 2023 and GAID 2025.',
      'General Data Protection Regulation (EU) 2016/679 where applicable, together with applicable ePrivacy/cookie rules in the relevant jurisdiction.',
      'Federal Competition and Consumer Protection Act 2018 where representations about website practices form part of consumer dealings.'
    ]
  },

  // 4. Child Safeguarding and Student Protection Policy
  {
    id: 'safeguarding',
    slug: 'safeguarding',
    title: 'Child Safeguarding and Student Protection Policy',
    shortTitle: 'Child Safeguarding',
    tagline: 'For Online and Programme Activities across OAICC and associated educational initiatives.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'Oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'safeguarding@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['student', 'counselor', 'parent', 'school', 'teacher', 'admin'],
    noticeBanner: 'Immediate danger: OAICC is not an emergency service. If a child is in immediate danger, contact the appropriate local emergency service, child-protection authority, parent/guardian or other responsible authority without waiting for OAICC to respond.',
    sections: [
      {
        id: 'safe-sec-1',
        title: '1. Purpose',
        content: `OAICC is committed to protecting children and young people who use its platform or participate in its programmes. This policy sets minimum safeguarding standards for founders, employees, contractors, volunteers, counsellors, mentors, school contacts, partners and any other adult who interacts with students through OAICC.`
      },
      {
        id: 'safe-sec-2',
        title: '2. Scope',
        content: `This policy applies to online and offline OAICC activities, including account creation, questionnaires, counselling, mentorship, messages, video or audio sessions, school pilots, events, workshops, social media interactions arranged by OAICC and any activity where an adult gains access to a student because of OAICC.`
      },
      {
        id: 'safe-sec-3',
        title: '3. Definitions',
        content: `• Child/student: generally a person under 18 for safeguarding purposes, subject to applicable law and programme context.
• Safeguarding concern: any information suggesting actual or potential abuse, neglect, exploitation, grooming, bullying, self-harm, harm to others, serious online risk or inappropriate adult conduct.
• Designated Safeguarding Lead (DSL): the person appointed by OAICC to receive, coordinate and escalate safeguarding concerns.
• Adult in a position of trust: any adult whose OAICC role gives access, authority or influence over a student.`
      },
      {
        id: 'safe-sec-4',
        title: '4. Safeguarding Principles',
        content: `• The safety and welfare of the child take priority over convenience, reputation or programme targets.
• Children should be treated with dignity, respect and without discrimination.
• Interventions should be proportionate, trauma-aware and focused on reducing harm.
• Adults must maintain clear professional boundaries.
• Information should be shared only with those who need it for safeguarding, legal or support purposes.
• A child should not be promised absolute confidentiality where safety may require escalation.
• Concerns should be recorded factually and acted upon promptly.
• Retaliation against a person who raises a genuine safeguarding concern is prohibited.`
      },
      {
        id: 'safe-sec-5',
        title: '5. Safer Recruitment and Onboarding',
        content: `OAICC will apply risk-appropriate screening and onboarding measures for individuals who interact with children. Depending on the role, applicable law and available verification mechanisms, these measures may include identity verification, qualification or professional-registration checks, references, safeguarding declarations, background checks, interviews and safeguarding induction.

No screening process guarantees future behaviour. Screening must be combined with supervision, role-based access, reporting channels, clear boundaries and prompt response to concerns.`
      },
      {
        id: 'safe-sec-6',
        title: '6. Professional Boundaries',
        content: `Adults interacting with students through OAICC must not:
• Engage in romantic, sexual, flirtatious or sexually suggestive communication with a student.
• Request sexual, intimate or unnecessary photographs, videos or personal information.
• Groom, manipulate, shame, threaten, blackmail or exploit a student.
• Ask a student to keep communications or meetings secret from OAICC, a parent/guardian or school for an improper purpose.
• Create emotional or financial dependency through gifts, money, personal favours or preferential treatment.
• Arrange unauthorised private meetings or transport.
• Move communications to a private personal channel contrary to OAICC rules.
• Share personal contact information unnecessarily.
• Make discriminatory, degrading, violent or abusive remarks.
• Use a student's image, story or personal information for publicity without the required authority and consent.
• Engage in any conduct that would reasonably undermine the safety, dignity or trust of a student.`
      },
      {
        id: 'safe-sec-7',
        title: '7. Approved Communications',
        content: `Student communication should occur through OAICC, school-managed, parent-approved or otherwise authorised channels. Adults should use professional accounts where available and avoid disappearing-message features for substantive student communication unless specifically approved for a documented reason.

OAICC may set time-of-day, channel, group-chat, parent-copy or school-copy rules based on age, programme and risk. Counsellors and mentors must follow the stricter of OAICC rules, school rules and applicable law.`
      },
      {
        id: 'safe-sec-8',
        title: '8. One-to-One Sessions',
        content: `• One-to-one sessions must be scheduled through approved processes where possible.
• A parent/guardian or school may be notified of scheduling where appropriate to the programme and age.
• The session should occur in an appropriate professional setting and should not include sexualised, coercive or unnecessarily intrusive discussion.
• Adults must not pressure a student to disclose personal experiences unrelated to legitimate career/educational support.
• If a student discloses a safeguarding concern, the adult should listen, avoid leading questions, explain the limits of confidentiality and escalate appropriately.
• A session may be ended immediately if behaviour, content, identity or technology creates a safety concern.`
      },
      {
        id: 'safe-sec-9',
        title: '9. Recording Sessions and Screenshots',
        content: `OAICC does not permit routine recording simply for convenience. Audio/video recording, screenshots or transcripts involving students must have a defined purpose, lawful basis, appropriate notice, access controls and retention period. Where consent is required, the necessary consent must be obtained before recording. Personal recordings by counsellors, mentors or students are prohibited where they breach privacy, confidentiality, safeguarding rules or law.`
      },
      {
        id: 'safe-sec-10',
        title: '10. Online Safety and Platform Features',
        content: `• Student profiles should expose only information necessary for the relevant feature.
• Direct messaging, search, favourites, session booking and profile visibility should be risk-assessed before enabling them for minors.
• Adults should not be able to browse student information without a legitimate role.
• OAICC will maintain or develop proportionate reporting and escalation arrangements appropriate to the platform features in use. Where a technical blocking or reporting feature is not available, users should report concerns through OAICC's designated safeguarding or support channels.
• Links or files sent to students should be relevant and reasonably safe.
• Known high-risk defects affecting student safety should be prioritised for remediation.`
      },
      {
        id: 'safe-sec-11',
        title: '11. Responding to a Disclosure',
        content: `1. Stay calm and listen without expressing disbelief or blame.
2. Do not promise secrecy. Explain that information may need to be shared to help keep the student safe.
3. Ask only minimal, non-leading questions needed to understand immediate risk.
4. Do not investigate the alleged perpetrator yourself.
5. Record the student's own words as accurately as possible, including date, time and context.
6. Escalate promptly to the Designated Safeguarding Lead or emergency/child-protection authority where urgency requires.
7. Preserve relevant messages or platform records without unnecessary circulation.
8. Continue to treat the student respectfully and avoid retaliation or stigma.`
      },
      {
        id: 'safe-sec-12',
        title: '12. Immediate Risk and Emergency Escalation',
        content: `Where there is a reasonable belief of immediate or serious danger, OAICC may contact emergency services, law enforcement, a child-protection authority, school safeguarding personnel, a parent/guardian or another appropriate responsible person. The exact response will depend on location, urgency, the alleged source of harm and applicable law. If notifying a parent or guardian could reasonably increase the risk of harm, OAICC will consider the circumstances carefully and, where feasible, seek appropriate safeguarding or legal guidance before disclosure.`
      },
      {
        id: 'safe-sec-13',
        title: '13. Self-Harm, Suicide or Threats of Harm',
        content: `OAICC is not a crisis service. A counsellor, mentor or staff member who receives credible information of imminent self-harm, suicide risk or serious harm to another person must escalate immediately under OAICC's safeguarding procedure and, where necessary, contact emergency or responsible authorities. Career guidance should not continue as though the disclosure were routine.`
      },
      {
        id: 'safe-sec-14',
        title: '14. Allegations Against Staff, Counsellors or Mentors',
        content: `An allegation against an OAICC-associated adult must be escalated to the safeguarding lead and an appropriate senior decision-maker who is not implicated. OAICC may suspend access or contact while facts are assessed. OAICC should avoid prejudging guilt, preserve evidence, protect the child from retaliation and make any required external report.`
      },
      {
        id: 'safe-sec-15',
        title: '15. Bullying, Harassment and Peer-to-Peer Harm',
        content: `OAICC prohibits bullying, harassment, sexual harassment, threats, hate-based abuse and coercion between students. Peer-to-peer conduct can still be a safeguarding issue. OAICC may restrict communication, involve a school/parent, preserve evidence and escalate depending on severity.`
      },
      {
        id: 'safe-sec-16',
        title: '16. Confidentiality and Information Sharing',
        content: `Safeguarding information is confidential but not absolutely secret. OAICC may share relevant information where necessary and lawful to protect a child, comply with law, obtain professional advice or cooperate with authorities. Disclosure should be limited to what is reasonably necessary and documented.`
      },
      {
        id: 'safe-sec-17',
        title: '17. Safeguarding Records',
        content: `Safeguarding records should be factual, dated, access-restricted and stored separately or with enhanced controls where appropriate. OAICC should document what was reported, by whom, actions taken, reasons for key decisions, disclosures made and follow-up. Retention should be determined by legal requirements, seriousness, ongoing risk and the interests of the child.

OAICC will take reasonable steps to ensure safeguarding records are factual, dated, appropriately access-restricted and handled separately or with additional confidentiality controls where practicable. Records may include the concern reported, source of the report, actions taken, reasons for key decisions, disclosures made and relevant follow-up.`
      },
      {
        id: 'safe-sec-18',
        title: '18. Schools, Parents and Partners',
        content: `OAICC works with parents, legal guardians, schools and other authorised partners to support safe student participation.

Where a student participates through a parent/guardian or school account, OAICC may rely on the relevant parent, guardian or authorised school representative to confirm that they have appropriate authority to facilitate the student's participation and provide relevant information to OAICC. Where parent or guardian consent is required by applicable law or the relevant OAICC programme, the responsible parent, guardian or school must ensure that the required consent has been obtained.

Participating schools, parents and partners are expected to:
• Provide accurate information relevant to the student's participation;
• Notify OAICC of any safeguarding restriction or known risk that may materially affect safe participation;
• Cooperate with reasonable safeguarding enquiries or protective measures;
• Avoid sharing unnecessary sensitive information about a student; and
• Inform OAICC if their authority, consent arrangements or the student's participation changes.

OAICC's reliance on a parent, guardian, school or partner does not remove OAICC's own safeguarding responsibilities. OAICC may act independently where it becomes aware of a credible risk to a child. Where there is a conflict between ordinary participation arrangements and the immediate safety or welfare of a child, safeguarding considerations will take priority.`
      },
      {
        id: 'safe-sec-19',
        title: '19. Safeguarding Training and Supervision',
        content: `OAICC will provide role-appropriate safeguarding induction to persons with student-facing responsibilities and will seek to provide refresher guidance as the programme develops. Serious incidents, near misses and material platform changes will be reviewed for safeguarding lessons where appropriate.`
      },
      {
        id: 'safe-sec-20',
        title: '20. Reporting a Concern',
        content: `Safeguarding Lead: TBD
Email: safeguarding@oaiccglobal.com
Telephone: TBD
Alternative escalation contact: info@oaiccglobal.com
Emergency services/child-protection authority: use the appropriate authority for the child's location.`
      },
      {
        id: 'safe-sec-21',
        title: '21. Non-Retaliation and Malicious Reports',
        content: `OAICC prohibits retaliation against a person who raises a safeguarding concern in good faith. Deliberately false or malicious allegations may themselves violate OAICC policy, but a report should not be treated as malicious merely because it is unsubstantiated.`
      },
      {
        id: 'safe-sec-22',
        title: '22. Breaches of This Policy',
        content: `A breach may result in removal from a session, restriction or suspension of platform access, removal from a counsellor/mentor role, termination of a contractual relationship, notification to a school/parent, regulatory or professional referral, reporting to authorities or other proportionate action.`
      },
      {
        id: 'safe-sec-23',
        title: '23. Review',
        content: `OAICC will review this Policy periodically and, where appropriate, following a serious safeguarding incident, material platform change or relevant legal or regulatory development.`
      }
    ],
    legalFramework: [
      'Child Rights Act 2003 and applicable state child-protection laws.',
      "Nigeria Data Protection Act 2023 and GAID 2025 for children's personal data and safeguarding-related processing.",
      'Other applicable laws relating to violence, exploitation, cyber conduct and mandatory reporting, depending on the facts and location.'
    ]
  },

  // 5. Acceptable Use Policy
  {
    id: 'acceptable-use',
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    shortTitle: 'Acceptable Use',
    tagline: 'Rules for Safe and Responsible Use of OAICC for students, schools, counsellors, and guests.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'Oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'info@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['student', 'counselor', 'parent', 'school', 'teacher', 'admin'],
    noticeBanner: 'Use OAICC for legitimate educational and career-guidance purposes. Bullying, harassment, data scraping, and unauthorized access are strictly prohibited.',
    sections: [
      {
        id: 'aup-sec-1',
        title: '1. Purpose and Scope',
        content: `This Acceptable Use Policy applies to everyone using or accessing OAICC, including students, parents/guardians, schools, counsellors, mentors, administrators, contractors and partners. It applies to accounts, messages, uploads, sessions, comments, forms, career tools, profiles, integrations and any other OAICC feature.`
      },
      {
        id: 'aup-sec-2',
        title: '2. General Standard',
        content: `Use OAICC for legitimate educational, career-guidance, mentoring, counselling, programme and administrative purposes. Treat other users respectfully, protect confidential information and do not interfere with platform safety or operation.`
      },
      {
        id: 'aup-sec-3',
        title: '3. Prohibited Harmful Conduct',
        content: `• Bullying, harassment, threats, intimidation, stalking or coercion.
• Grooming, sexual exploitation, sexualised communication with minors or solicitation of intimate material.
• Encouraging self-harm, suicide, violence or dangerous challenges.
• Hate-based abuse or unlawful discrimination.
• Doxxing, blackmail, extortion or unauthorised disclosure of private information.
• Impersonating another person or falsely claiming authority, credentials or school affiliation.
• Using OAICC to facilitate trafficking, exploitation, abuse or other unlawful activity.`
      },
      {
        id: 'aup-sec-4',
        title: '4. Prohibited Content',
        content: `• Child sexual abuse material or exploitative content involving minors.
• Pornographic or sexually explicit content unrelated to a legitimate safeguarding report.
• Content that threatens, harasses or incites violence.
• Malware, malicious code, credential-stealing links or deceptive files.
• Unlawfully obtained personal data, confidential records or examination materials.
• Material that infringes copyright, trade marks, privacy or other rights.
• Fraudulent, deceptive or materially misleading content.

Where prohibited material is submitted as evidence of abuse or for a legitimate safeguarding report, users should use the designated reporting channel and avoid further distribution.`
      },
      {
        id: 'aup-sec-5',
        title: '5. Security and Technical Misuse',
        content: `• Do not access, test or probe accounts, databases, APIs or systems without authorisation.
• Do not bypass authentication, rate limits, role permissions or security controls.
• Do not introduce malware, denial-of-service traffic or automated attacks.
• Do not scrape, crawl, harvest or bulk-download personal data or protected content without written authorisation.
• Do not reverse engineer or interfere with the platform except to the extent a mandatory law permits it.
• Do not use compromised credentials, automated account creation or identity manipulation.
• Report suspected security vulnerabilities responsibly to info@oaiccglobal.com and do not exploit, publicly disclose or use them to access information without authorisation.`
      },
      {
        id: 'aup-sec-6',
        title: '6. Privacy and Personal Data',
        content: `• Access personal data only when your OAICC role authorises it.
• Do not copy student data to personal devices, spreadsheets or messaging apps unless OAICC has approved the workflow and appropriate safeguards are in place.
• Do not disclose another user's information publicly or to unauthorised persons.
• Do not upload unnecessary sensitive information.
• Do not use OAICC data to profile, market to or target children for unrelated commercial purposes.
• Delete local copies when OAICC instructs you to do so and retention is not legally required.`
      },
      {
        id: 'aup-sec-7',
        title: '7. Student-Specific Rules',
        content: `• Keep your password and access codes private and do not share them with unauthorised persons.
• Do not arrange secret meetings with adults you meet through OAICC.
• Do not send intimate images or sensitive personal information in response to a request.
• Tell a trusted adult or OAICC if another user makes you uncomfortable or asks you to keep inappropriate contact secret.
• Use respectful language and do not bully or impersonate other students.`
      },
      {
        id: 'aup-sec-8',
        title: '8. Counsellor, Mentor and Adult Rules',
        content: `Adults with access to students must also comply with the Child Safeguarding and Student Protection Policy and the Counsellor and Mentor Code of Conduct. A breach involving a minor may lead to immediate suspension while the concern is assessed.`
      },
      {
        id: 'aup-sec-9',
        title: '9. Commercial Use and Solicitation',
        content: `Users may not use OAICC to advertise unrelated businesses, recruit students into unauthorised programmes, solicit money, collect donations, sell products, conduct pyramid or investment schemes, or divert users to unrelated personal or commercial services without OAICC's written approval.`
      },
      {
        id: 'aup-sec-10',
        title: '10. Spam, Automation and Artificial Intelligence',
        content: `Do not use bots, scripts or automated tools to send unsolicited messages, create fake accounts, manipulate rankings, scrape content or overload OAICC. Where the use of AI-assisted tools in connection with OAICC is permitted, users remain responsible for checking outputs, protecting confidential information and complying with professional, privacy and safeguarding obligations.`
      },
      {
        id: 'aup-sec-11',
        title: '11. Academic Integrity',
        content: `Users must not use OAICC to facilitate examination cheating, impersonation, forged credentials or dishonest academic submissions.`
      },
      {
        id: 'aup-sec-12',
        title: '12. Intellectual Property',
        content: `Do not copy, sell, republish or commercially exploit OAICC questionnaires, career content, designs, databases or other protected material except as expressly permitted. Do not upload content that you know unlawfully infringes another person's intellectual property.`
      },
      {
        id: 'aup-sec-13',
        title: '13. Reporting Abuse or Misuse',
        content: `General platform abuse, misuse or security concerns may be reported to info@oaiccglobal.com.

Child-safety or safeguarding concerns should be reported to safeguarding@oaiccglobal.com.

If a child or other person is in immediate danger, users should contact the appropriate emergency service, child-protection authority or other responsible authority for the person's location rather than waiting for OAICC to respond.`
      },
      {
        id: 'aup-sec-14',
        title: '14. Investigation and Evidence Preservation',
        content: `OAICC may review relevant account, communication and security records where reasonably necessary to investigate a report, protect users, maintain security or comply with law. OAICC may preserve records that would otherwise be deleted where required for a safeguarding investigation, dispute, regulatory request or legal claim.`
      },
      {
        id: 'aup-sec-15',
        title: '15. Enforcement',
        content: `Depending on the severity, circumstances, history and level of risk, OAICC may remove content, warn a user, limit access to a feature, reset credentials, restrict communications, suspend or terminate an account, remove a counsellor or mentor, notify a school or parent/guardian where appropriate and lawful, make a professional or regulatory referral, or contact law enforcement or child-protection authorities.

OAICC may take immediate protective action where delay could expose a person, child, system or personal data to harm.

Where appropriate, lawful and safe to do so, OAICC may provide the affected user with an explanation of the action taken and an opportunity to raise a concern or appeal.`
      },
      {
        id: 'aup-sec-16',
        title: '16. No Retaliation',
        content: `A user must not retaliate against another person for reporting a genuine concern, participating in an investigation or exercising a legal right.`
      },
      {
        id: 'aup-sec-17',
        title: '17. Changes',
        content: `OAICC may update this Policy to address new platform features, risks, laws or abuse patterns. Material changes will be communicated where appropriate.`
      },
      {
        id: 'aup-sec-18',
        title: '18. Role and Access Restrictions',
        content: `Users must only access features and information made available to their authorised OAICC role.

Users must not attempt to bypass age restrictions, parental or school controls, safeguarding measures, approval requirements, role permissions or other access restrictions.

A parent, school, counsellor, mentor or administrator must not use their access privileges to view, obtain or disclose student information for purposes unrelated to their authorised OAICC role.`
      }
    ]
  },

  // 6. Student-Friendly Privacy Notice (For Students)
  {
    id: 'student-privacy',
    slug: 'student-privacy',
    title: 'Student-Friendly Privacy Notice',
    shortTitle: 'Student Privacy Notice',
    tagline: 'A clear, simple guide explaining how OAICC looks after your information and keeps you safe.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'privacy@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['student', 'admin'],
    noticeBanner: 'Designed specifically for students: Easy-to-read answers about your quiz results, account, and privacy rights.',
    sections: [
      {
        id: 'stu-sec-1',
        title: 'Hi! What is OAICC?',
        content: `OAICC helps you learn about your interests, strengths, school subjects and different careers. We may ask you questions so we can show you career ideas and help you talk to a counsellor or mentor.`
      },
      {
        id: 'stu-sec-2',
        title: 'What information do we use?',
        content: `We may use things like your name, age, school year, subjects, interests, skills and answers to career questions. We also keep information needed to make your account work safely.`
      },
      {
        id: 'stu-sec-3',
        title: 'What do we do with your answers?',
        content: `We use your answers to work out which industries or careers could be interesting for you. A high or low score does not mean you are smart or not smart, and it does not decide your future. It is only a guide to help you explore!`
      },
      {
        id: 'stu-sec-4',
        title: 'Who can see my information?',
        content: `Only people who need it for your OAICC programme should be able to see it, such as authorised OAICC staff, your school where appropriate, your parent or guardian, and a counsellor or mentor working with you. We also use trusted technology companies to help the platform work. We NEVER sell your information to advertisers.`
      },
      {
        id: 'stu-sec-5',
        title: 'Can I ask questions about my information?',
        content: `Yes! You can ask what information we have, tell us if something is wrong, or ask us about your career results. Depending on the law and your situation, you may also be able to ask us to delete or limit how we use information. You can contact privacy@oaiccglobal.com or ask a trusted adult to help you.`
      },
      {
        id: 'stu-sec-6',
        title: 'What if I tell someone something that means I might not be safe?',
        content: `We try to respect your privacy, but if we think you or another person may be in serious danger, we may need to tell a responsible adult or safeguarding authority so someone can help. We will only share what is reasonably needed to keep you safe.`
      },
      {
        id: 'stu-sec-7',
        title: 'What should I do if something online makes me uncomfortable?',
        content: `Stop the conversation immediately, do not send private or intimate photos or information, and tell a trusted adult or OAICC right away. You can contact safeguarding@oaiccglobal.com. If someone is in immediate danger, contact the emergency services.`
      }
    ]
  },

  // 7. Counsellor and Mentor Code of Conduct (For Counselors)
  {
    id: 'counselor-code',
    slug: 'counselor-code',
    title: 'Counsellor and Mentor Code of Conduct',
    shortTitle: 'Counsellor Code of Conduct',
    tagline: 'Professional, ethical, and safeguarding standards for guidance professionals on OAICC.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'safeguarding@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['counselor', 'admin'],
    noticeBanner: 'Professional Standards: Every counsellor and mentor on OAICC must comply with child safeguarding, professional boundaries, and confidentiality rules.',
    sections: [
      {
        id: 'cc-sec-1',
        title: '1. Professional Standing & Competence',
        content: `Counsellors and mentors must provide guidance solely within their areas of training and competence. Do not offer legal, psychiatric, financial or immigration advice unless independently registered and separately engaged under formal terms.`
      },
      {
        id: 'cc-sec-2',
        title: '2. Professional Boundaries with Minors',
        content: `• Maintain clear, objective, and professional relationships with students at all times.
• No private social media friending, personal gifts, or secret channels.
• Communications must take place via official OAICC or school-sanctioned channels.
• In-person meetings are prohibited unless explicitly approved in advance by OAICC and the parent or school.`
      },
      {
        id: 'cc-sec-3',
        title: '3. Mandatory Safeguarding Reporting',
        content: `If a student discloses abuse, neglect, exploitation, or self-harm risk, the counsellor must record the disclosure factually without leading questions and escalate immediately to safeguarding@oaiccglobal.com.`
      }
    ],
    legalFramework: [
      'Child Rights Act 2003',
      'Nigeria Data Protection Act 2023',
      'Code of Ethics for Professional Guidance Counselors'
    ]
  },

  // 8. Parent/Guardian Consent & Student Privacy Notice (For Parents)
  {
    id: 'parent-consent',
    slug: 'parent-consent',
    title: 'Parent/Guardian Consent & Student Privacy Notice',
    shortTitle: 'Parent Consent Notice',
    tagline: 'Clear information for parents and sponsors on child privacy, data rights, and consent options.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'privacy@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['parent', 'admin'],
    noticeBanner: 'Important for Parents and Legal Guardians: How OAICC protects your child, what data is collected, and how to manage parental permissions.',
    sections: [
      {
        id: 'pc-sec-1',
        title: '1. What OAICC Does for Your Child',
        content: `OAICC helps students explore interests, strengths, skills, industries, careers and education pathways through questionnaires, career-match indicators, career library articles, and 1-on-1 guidance sessions.`
      },
      {
        id: 'pc-sec-2',
        title: '2. Information OAICC May Use',
        content: `Student identity, age/year group, school, subjects, hobbies, skills, strengths, career preferences, questionnaire answers, session booking history, parent contact details, and safeguarding information if a safety concern arises.`
      },
      {
        id: 'pc-sec-3',
        title: '3. Career Matching Is Guidance, Not a Final Decision',
        content: `Results are indicators to spark exploration. They do not decide your child's intelligence, value, or future career success. We encourage students to discuss choices with parents, guardians, and educators.`
      },
      {
        id: 'pc-sec-4',
        title: '4. Privacy Rights and Withdrawal of Consent',
        content: `Parents and guardians may request access to student records, request corrections, or withdraw consent at any time by contacting privacy@oaiccglobal.com. We do not sell student data.`
      },
      {
        id: 'pc-sec-5',
        title: '5. Core and Optional Consents',
        content: `Core consent covers educational guidance and account management. Optional consents (such as marketing updates, promotional photography, or session recording) are strictly separate and never pre-checked.`
      }
    ],
    legalFramework: [
      'Nigeria Data Protection Act 2023',
      'Child Rights Act 2003',
      'General Data Protection Regulation (EU) 2016/679 Article 8'
    ]
  },

  // 9. School Authority Confirmation & Student Data Agreement (For Schools)
  {
    id: 'school-authority',
    slug: 'school-authority',
    title: 'School Authority Confirmation & Student Data Agreement',
    shortTitle: 'School Authority Agreement',
    tagline: 'Authority confirmation, student roster representations, and compliance standards for participating schools.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'info@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['school', 'admin'],
    noticeBanner: 'Institutional Agreement: Where a school enrols or uploads students, the school confirms lawful authority, required parental notices, and safeguarding contact designation.',
    sections: [
      {
        id: 'sa-sec-1',
        title: '1. School Representations & Authority',
        content: `When an educational institution enrols student cohorts onto OAICC, the school confirms:
• The school has lawful authority to provide student roster data to OAICC for career guidance.
• The school has provided required notices to students and parents/guardians and obtained any necessary consents.
• The school will not upload information unnecessary for the programme.
• The school has identified designated privacy and safeguarding contacts.`
      },
      {
        id: 'sa-sec-2',
        title: '2. Changes in Status and Safeguarding Restrictions',
        content: `The school will promptly inform OAICC of withdrawal of authority, student departure, safeguarding restrictions, or material inaccuracies that affect participation.`
      },
      {
        id: 'sa-sec-3',
        title: '3. Data Controller / Processor Allocations',
        content: `In school arrangements, OAICC may act as data processor for school-directed records and as independent controller for platform security and guidance delivery. The signed institutional agreement governs specific terms.`
      }
    ]
  },

  // 10. Complaints, Consumer Protection, Cancellation and Refund Policy
  {
    id: 'complaints-refunds',
    slug: 'complaints-refunds',
    title: 'Complaints, Cancellation and Refund Policy',
    shortTitle: 'Complaints & Refunds',
    tagline: 'Fair treatment, redress, consumer rights, and transparent cancellation standards.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'complaints@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['parent', 'school', 'admin'],
    noticeBanner: 'Mandatory consumer rights: This policy does not remove or reduce any remedy a consumer has under the Federal Competition and Consumer Protection Act 2018 or other applicable laws.',
    sections: [
      {
        id: 'cr-sec-1',
        title: '1. Our Commitment to Fair Dealing',
        content: `OAICC aims to provide clear information, reasonable service quality, transparent pricing and accessible complaint handling. We will not penalise a user for making a genuine complaint or exercising a legal right.`
      },
      {
        id: 'cr-sec-2',
        title: '2. Cancellation and Rescheduling Standards',
        content: `A consumer may request cancellation of an advance booking. OAICC does not impose a blanket "no refund under any circumstances" rule. Where OAICC or an assigned professional cancels a session, a reschedule or full refund will be provided.`
      },
      {
        id: 'cr-sec-3',
        title: '3. How to Make a Complaint and Timelines',
        content: `Send complaints to complaints@oaiccglobal.com. We acknowledge complaints within 3 business days and provide substantive responses within 15 business days. Urgent safeguarding complaints are escalated immediately.`
      },
      {
        id: 'cr-sec-4',
        title: '4. External Escalation',
        content: `If an issue cannot be resolved internally, consumers may approach the Federal Competition and Consumer Protection Commission (FCCPC) or the Nigeria Data Protection Commission (NDPC).`
      }
    ],
    legalFramework: [
      'Federal Competition and Consumer Protection Act 2018',
      'Nigeria Data Protection Act 2023'
    ]
  }
];

const POLICIES_STORAGE_KEY = 'oaicc_managed_policies_v1';

export function getAllManagedPolicies(): PolicyDocument[] {
  if (typeof window === 'undefined') return POLICIES;
  const stored = localStorage.getItem(POLICIES_STORAGE_KEY);
  if (!stored) {
    const initialized = POLICIES.map((p) => ({
      ...p,
      isHidden: false,
      versionHistory: [
        {
          version: p.version || '1.0',
          updatedAt: p.lastUpdated || 'September 2026',
          updatedBy: 'OAICC Legal Governance',
          changeSummary: 'Initial policy baseline publication and statutory compliance framework.',
          sections: p.sections,
          noticeBanner: p.noticeBanner,
          effectiveDate: p.effectiveDate
        }
      ]
    }));
    try {
      localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(initialized));
      return initialized;
    } catch {
      return initialized;
    }
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return POLICIES;
  } catch {
    return POLICIES;
  }
}

export function saveManagedPolicies(policies: PolicyDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(policies));
    window.dispatchEvent(new Event('oaicc-policies-updated'));
  } catch (e) {
    console.error('Failed to save policies to localStorage', e);
  }
}

export function getPoliciesForRole(role: UserRole | 'all', includeHidden: boolean = false): PolicyDocument[] {
  const all = getAllManagedPolicies();
  const filteredByRole = role === 'all' ? all : all.filter((p) => p.applicableRoles.includes(role));
  if (includeHidden || role === 'admin') {
    return filteredByRole;
  }
  return filteredByRole.filter((p) => !p.isHidden);
}

export function getPolicyBySlug(slug: string): PolicyDocument | undefined {
  const all = getAllManagedPolicies();
  const normalized = slug.toLowerCase().trim();
  if (normalized === 'terms-and-conditions' || normalized === 'terms-of-use' || normalized === 'terms') {
    return all.find((p) => p.slug === 'terms');
  }
  if (normalized === 'privacy-policy' || normalized === 'privacy') {
    return all.find((p) => p.slug === 'privacy');
  }
  if (normalized === 'cookie-policy' || normalized === 'cookie-notice' || normalized === 'cookies') {
    return all.find((p) => p.slug === 'cookies');
  }
  if (normalized === 'safeguarding' || normalized === 'child-safeguarding' || normalized === 'child-protection') {
    return all.find((p) => p.slug === 'safeguarding');
  }
  if (normalized === 'acceptable-use' || normalized === 'acceptable-use-policy' || normalized === 'aup') {
    return all.find((p) => p.slug === 'acceptable-use');
  }
  return all.find((p) => p.slug === normalized || p.id === normalized);
}

export function updateManagedPolicy(
  id: string,
  updatedData: Partial<PolicyDocument>,
  changeSummary: string = 'Policy terms revised',
  updatedBy: string = 'Super Admin'
): PolicyDocument {
  const all = getAllManagedPolicies();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Policy with id ${id} not found`);

  const current = all[index];
  const newVersion = updatedData.version || incrementVersion(current.version || '1.0');
  const nowStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const historyRecord: PolicyVersionRecord = {
    version: newVersion,
    updatedAt: nowStr,
    updatedBy: updatedBy,
    changeSummary: changeSummary,
    sections: updatedData.sections || current.sections,
    noticeBanner: updatedData.noticeBanner !== undefined ? updatedData.noticeBanner : current.noticeBanner,
    effectiveDate: updatedData.effectiveDate || current.effectiveDate
  };

  const updated: PolicyDocument = {
    ...current,
    ...updatedData,
    version: newVersion,
    lastUpdated: nowStr,
    versionHistory: [historyRecord, ...(current.versionHistory || [])]
  };

  all[index] = updated;
  saveManagedPolicies(all);
  return updated;
}

export function togglePolicyVisibility(id: string): PolicyDocument {
  const all = getAllManagedPolicies();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Policy with id ${id} not found`);

  const current = all[index];
  const updated: PolicyDocument = {
    ...current,
    isHidden: !current.isHidden
  };

  all[index] = updated;
  saveManagedPolicies(all);
  return updated;
}

export function incrementVersion(ver: string, type: 'minor' | 'major' = 'minor'): string {
  const parts = ver.split('.');
  const major = parseInt(parts[0] || '1', 10);
  const minor = parseInt(parts[1] || '0', 10);
  if (type === 'major') {
    return `${major + 1}.0`;
  }
  return `${major}.${minor + 1}`;
}
