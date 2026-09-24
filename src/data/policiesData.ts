import { UserRole } from '../types';

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
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
}

export const POLICIES: PolicyDocument[] = [
  // 1. Website and Platform Terms
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
        content: 'These Terms of Use and User Agreement ("Terms") govern access to and use of the OAICC website, student and adult dashboards, career library, questionnaires, assessments, matching tools, counselling and mentorship features, scheduling tools, communications, events, content, pilots, and any related digital or offline service made available by OAICC (collectively, the "Services"). By creating an account, clicking an acceptance box, accessing the Services, participating through a school, or otherwise using OAICC, you agree to these Terms and the policies incorporated by reference. If you are accepting on behalf of a school, organisation, parent, guardian or other person, you represent that you have authority to do so.'
      },
      {
        id: 'terms-sec-2',
        title: '2. Eligibility, Minors and Authority',
        content: 'OAICC serves students, including children and young people. A "child" for OAICC safeguarding purposes generally means a person under 18, subject to applicable law.\n\n• A student under 18 must use OAICC with the appropriate involvement, permission or authority of a parent, legal guardian, school or other authorised adult where required by law or OAICC policy.\n• Where consent is the legal basis for processing a child\'s personal data, OAICC will obtain and, where required, take reasonable steps to verify the consent of a parent or legal guardian, subject to statutory exceptions.\n• A school that registers or uploads students represents that it has lawful authority to do so and must cooperate with OAICC where direct parental or guardian consent is additionally required.\n• OAICC may refuse or restrict access where age, authority or consent cannot reasonably be verified.'
      },
      {
        id: 'terms-sec-3',
        title: '3. Account Types and Role-Based Access',
        content: 'OAICC may provide different access rights to students, parents/guardians, school representatives, counsellors, mentors, administrators, staff, partners and service providers. Features and information visible to each role may differ. Users must not attempt to obtain privileges or data outside their authorised role.'
      },
      {
        id: 'terms-sec-4',
        title: '4. Purpose and Scope of the Services',
        content: 'OAICC is designed to help students understand interests, strengths and skills; explore industries and careers; view education and training pathways; obtain career counselling or mentorship; schedule sessions; and make better-informed educational and career decisions. Features may change as OAICC develops.'
      },
      {
        id: 'terms-sec-5',
        title: '5. Career Matching, Profiling and Automated Tools',
        content: 'OAICC may analyse questionnaire responses, subject choices, skills, strengths, interests, stated preferences and other profile information to generate industry-fit scores, career-fit results, suggested careers, pathway previews or educational guidance.\n\n• Results are indicators and guidance, not diagnoses, promises, rankings of personal worth, or final decisions.\n• Results may be affected by incomplete, inaccurate, misunderstood or changing information and by the design or weighting of the assessment.\n• OAICC does not intend to make solely automated decisions that produce legal or similarly significant effects on students.\n• Users may ask for explanation or human review of a result through OAICC\'s support or counselling channels.'
      },
      {
        id: 'terms-sec-6',
        title: '6. Educational and Career Information Disclaimer',
        content: 'Career descriptions, salary examples, professional ranks, entry requirements, course information, subject recommendations, labour-market information and educational pathways are provided for general guidance. Requirements can differ by institution, jurisdiction, employer, professional body and year, and may change without notice. Users should independently verify high-impact information before relying on it.'
      },
      {
        id: 'terms-sec-7',
        title: '7. Counsellors, Mentors and Professional Scope',
        content: 'OAICC may facilitate contact with counsellors or mentors. Their role is to provide career and educational guidance within the scope stated on OAICC. Unless expressly stated and separately agreed, use of OAICC does not create a lawyer-client, doctor-patient, therapist-client, financial-adviser, immigration-consultant or other regulated professional relationship.'
      },
      {
        id: 'terms-sec-8',
        title: '8. No Emergency or Crisis Service',
        content: 'OAICC is not an emergency service and is not designed to monitor users continuously. If a person is in immediate danger, faces abuse, is at risk of self-harm or harm to others, or requires urgent medical or mental-health assistance, contact local emergency services, an appropriate child-protection authority, a qualified health professional, a parent/guardian or another trusted responsible adult.'
      },
      {
        id: 'terms-sec-9',
        title: '9. User Accounts and Security',
        content: 'Provide accurate registration information and keep it reasonably up to date. Keep passwords, access codes and authentication methods confidential. Do not share an account except where OAICC expressly permits managed access. Notify OAICC promptly of suspected unauthorised access.'
      },
      {
        id: 'terms-sec-10',
        title: '10. Acceptable Conduct',
        content: 'Users must comply with the Acceptable Use Policy. Prohibited conduct includes harassment, bullying, grooming, exploitation, fraud, impersonation, unauthorised access, malicious code, scraping without permission, misuse of student data, unlawful discrimination, sexual or abusive content, and conduct that threatens safety or platform integrity.'
      },
      {
        id: 'terms-sec-11',
        title: '11. Parent, Guardian and School Responsibilities',
        content: 'Ensure there is an appropriate legal basis and authority for student participation and any information supplied to OAICC. Provide accurate information to the best of your knowledge. Explain the programme to the student in an age-appropriate way. Cooperate with safeguarding, privacy and account-verification requests.'
      },
      {
        id: 'terms-sec-12',
        title: '12. Communications, Notifications and Electronic Acceptance',
        content: 'OAICC may send service communications by email, platform notification, SMS, school channels or other contact methods provided by the user. Where law permits, electronic acceptance, electronic records and electronic communications may be used to evidence agreement, consent or notice.'
      },
      {
        id: 'terms-sec-13',
        title: '13. Sessions, Attendance and Recording',
        content: 'Session availability is not guaranteed. Users should attend scheduled sessions on time and provide reasonable notice when cancellation is necessary. A session will not be audio- or video-recorded by OAICC unless users are given appropriate notice and a lawful basis exists.'
      },
      {
        id: 'terms-sec-14',
        title: '14. User Content and Permissions',
        content: 'Users retain rights they lawfully hold in their User Content. You grant OAICC a limited, non-exclusive permission to host, store, copy, display, transmit, analyse and otherwise process User Content only as reasonably necessary to provide, secure, administer, support and improve the Services.'
      },
      {
        id: 'terms-sec-15',
        title: '15. OAICC Intellectual Property',
        content: 'OAICC and its licensors retain their rights in the platform, brand, logos, questionnaires, career taxonomies, explanatory content, design, text, graphics, databases, software and other materials. Schools and students may use platform outputs for their own educational and counselling purposes.'
      },
      {
        id: 'terms-sec-16',
        title: '16. Fees, Payments, Taxes and Pricing',
        content: 'Some OAICC services may be free, pilot-funded, school-funded, sponsored or paid. Before a consumer completes a paid transaction, OAICC will disclose, in clear and understandable language, the material service description, total price, payment frequency, renewal terms, cancellation and refund conditions.'
      },
      {
        id: 'terms-sec-17',
        title: '17. Cancellations, Refunds and Service Problems',
        content: 'Cancellations and refunds are governed by the Complaints, Consumer Protection, Cancellation and Refund Policy and any specific purchase terms shown before payment. Nothing in an OAICC refund rule limits a remedy that a consumer is entitled to under mandatory law.'
      },
      {
        id: 'terms-sec-18',
        title: '18. Suspension, Investigation and Termination',
        content: 'OAICC may warn, restrict, suspend or terminate an account where reasonably necessary to address a policy breach, safeguarding risk, fraud, unauthorised access, legal obligation, security incident, repeated non-payment, abuse of other users or material operational risk.'
      },
      {
        id: 'terms-sec-19',
        title: '19. Limitation of Liability',
        content: 'To the fullest extent permitted by applicable law, OAICC is not liable for indirect, incidental or consequential loss arising solely from a user\'s reliance on non-binding career suggestions, third-party information, unauthorised user conduct, or events outside OAICC\'s reasonable control.'
      },
      {
        id: 'terms-sec-20',
        title: '20. Governing Law and Dispute Resolution',
        content: 'These Terms are governed by the laws of the Federal Republic of Nigeria, subject to mandatory rights that may apply to a user in another jurisdiction. Users are encouraged to use OAICC\'s complaint process first.'
      }
    ],
    legalFramework: [
      'Federal Competition and Consumer Protection Act 2018 (Nigeria)',
      'Nigeria Data Protection Act 2023 and GAID 2025',
      'Child Rights Act 2003 and applicable state child-protection legislation',
      'General Data Protection Regulation (EU) 2016/679 where territorial scope applies'
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
    noticeBanner: 'Children and students: OAICC is designed for students and may process children\'s personal data. OAICC applies enhanced safeguards, data minimisation, role-based access and age-appropriate transparency, and obtains parental or guardian consent where consent is the applicable legal basis and law requires it.',
    sections: [
      {
        id: 'priv-sec-1',
        title: '1. Scope of This Policy',
        content: 'This Privacy Policy explains how OAICC processes personal data through its website, accounts, career questionnaires, career library, matching tools, counselling and mentorship services, session scheduling, school programmes, communications, events, pilots and related services. It applies to students, parents and guardians, school representatives, counsellors, mentors, staff, applicants, partners, website visitors and other individuals whose personal data OAICC processes.'
      },
      {
        id: 'priv-sec-2',
        title: '2. Who Is Responsible for Your Personal Data',
        content: 'OAICC will usually act as a data controller when it decides why and how personal data is processed for its own platform, programme, account, safety and service purposes. In some school or institutional arrangements, OAICC may process specified student information on documented instructions from a school or partner and may therefore act as a data processor for that processing.\n\nController details: OruAikiIse Ltd, trading as OAICC – OruAikiIse Careers Counselling\nAddress: Brownstone Cluster 2, Kunsela Road, Ikate, Lagos\nPrivacy/DPO email: privacy@oaiccglobal.com'
      },
      {
        id: 'priv-sec-3',
        title: '3. Data Protection Principles',
        content: 'OAICC adheres to core data protection principles:\n• Lawfulness, fairness and transparency.\n• Purpose limitation: information is collected for specified and legitimate purposes.\n• Data minimisation: seeking only information reasonably necessary for the relevant purpose.\n• Accuracy: keeping important information accurate and up to date.\n• Storage limitation: identifiable data is not kept longer than reasonably necessary.\n• Integrity and confidentiality: technical and organisational safeguards.\n• Accountability: documented data-protection responsibilities.'
      },
      {
        id: 'priv-sec-4',
        title: '4. Categories of Personal Data We Process',
        content: 'Depending on your role, we process:\n\n• Student Data: Name, date of birth, year group, school, curriculum, subjects/grades where required, interests, strengths, assessment responses, career-match scores, counselling session metadata, parent contact, safeguarding notes where relevant.\n• Parent/Guardian Data: Name, relationship to student, email, phone number, consent and communication records, billing records where applicable.\n• School Data: School name, address, contact details of school leads, student participation rosters.\n• Counsellor/Mentor Data: Profile, biography, expertise, verified qualifications, session records, feedback.\n• Technical Data: IP address, device information, login logs, session security cookies.'
      },
      {
        id: 'priv-sec-5',
        title: '5. Children\'s Privacy and Age-Appropriate Design',
        content: 'Because OAICC serves minors, we take special precautions:\n• Use clear, age-appropriate notices and explanations.\n• Collect only information reasonably needed for career guidance.\n• Restrict student data access to authorised roles.\n• Avoid behavioural advertising to children and never sell children\'s personal data.\n• Allow parents/guardians and students to exercise applicable privacy rights.\n• Apply safeguarding escalation where privacy information indicates credible risk of harm.'
      },
      {
        id: 'priv-sec-6',
        title: '6. Career Matching and Automated Calculations',
        content: 'OAICC uses automated calculations to score questionnaire responses and produce career or industry suggestions. OAICC does not intend to subject students to solely automated decisions producing legal or similarly significant effects. Users may request explanation or human review through our counselling channels.'
      },
      {
        id: 'priv-sec-7',
        title: '7. Who We Share Personal Data With',
        content: 'Personal data is shared only on a strictly controlled basis with:\n• Authorised OAICC staff and assigned counsellors/mentors.\n• Parents/guardians where authorised and appropriate.\n• Participating school representatives.\n• Vetted infrastructure providers (hosting, authentication, communications) under written data processing agreements.\n• Safeguarding or regulatory authorities where legally required.\n\nOAICC DOES NOT SELL STUDENT PERSONAL DATA.'
      },
      {
        id: 'priv-sec-8',
        title: '8. Data Retention and Security',
        content: 'Identifiable data is retained only as long as necessary for the educational programme, account management, and statutory audit obligations. Security controls include role-based least-privilege permissions, encryption in transit and at rest, multi-factor authentication for administrators, and continuous audit monitoring.'
      },
      {
        id: 'priv-sec-9',
        title: '9. Your Rights and How to Exercise Them',
        content: 'You have rights to be informed, access personal data, request correction, request erasure, restrict processing, data portability, and withdraw consent where applicable. Under the Nigeria Data Protection Act, requests will be addressed without undue delay and within 30 days. Send requests to privacy@oaiccglobal.com.'
      },
      {
        id: 'priv-sec-10',
        title: '10. Personal Data Breaches',
        content: 'OAICC will document, assess, contain and remediate suspected data breaches. Where statutory risk thresholds are met under the Nigeria Data Protection Act, notifications will be made to the Nigeria Data Protection Commission within 72 hours of awareness, and high-risk notifications sent to affected persons.'
      }
    ],
    legalFramework: [
      'Nigeria Data Protection Act 2023 and GAID 2025',
      'Child Rights Act 2003 and applicable state child-protection laws',
      'General Data Protection Regulation (EU) 2016/679 where applicable'
    ]
  },

  // 3. Student-Friendly Privacy Notice (For Students)
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
        content: 'OAICC helps you learn about your interests, strengths, school subjects and different careers. We may ask you questions so we can show you career ideas and help you talk to a counsellor or mentor.'
      },
      {
        id: 'stu-sec-2',
        title: 'What information do we use?',
        content: 'We may use things like your name, age, school year, subjects, interests, skills and answers to career questions. We also keep information needed to make your account work safely.'
      },
      {
        id: 'stu-sec-3',
        title: 'What do we do with your answers?',
        content: 'We use your answers to work out which industries or careers could be interesting for you. A high or low score does not mean you are smart or not smart, and it does not decide your future. It is only a guide to help you explore!'
      },
      {
        id: 'stu-sec-4',
        title: 'Who can see my information?',
        content: 'Only people who need it for your OAICC programme should be able to see it, such as authorised OAICC staff, your school where appropriate, your parent or guardian, and a counsellor or mentor working with you. We also use trusted technology companies to help the platform work. We NEVER sell your information to advertisers.'
      },
      {
        id: 'stu-sec-5',
        title: 'Can I ask questions about my information?',
        content: 'Yes! You can ask what information we have, tell us if something is wrong, or ask us about your career results. Depending on the law and your situation, you may also be able to ask us to delete or limit how we use information. You can contact privacy@oaiccglobal.com or ask a trusted adult to help you.'
      },
      {
        id: 'stu-sec-6',
        title: 'What if I tell someone something that means I might not be safe?',
        content: 'We try to respect your privacy, but if we think you or another person may be in serious danger, we may need to tell a responsible adult or safeguarding authority so someone can help. We will only share what is reasonably needed to keep you safe.'
      },
      {
        id: 'stu-sec-7',
        title: 'What should I do if something online makes me uncomfortable?',
        content: 'Stop the conversation immediately, do not send private or intimate photos or information, and tell a trusted adult or OAICC right away. You can contact safeguarding@oaiccglobal.com. If someone is in immediate danger, contact the emergency services.'
      }
    ]
  },

  // 4. Website Cookie Notice
  {
    id: 'cookies',
    slug: 'cookies',
    title: 'Website Cookie Notice',
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
    noticeBanner: 'Because OAICC provides services to children and young people, we take a privacy-protective approach to cookies. We do not use behavioural advertising cookies to target children.',
    sections: [
      {
        id: 'cook-sec-1',
        title: '1. Purpose',
        content: 'This Cookie and Tracking Technologies Policy explains how OAICC uses cookies, local storage, pixels, software development kits and similar technologies (collectively, "cookies") on its website and platform.'
      },
      {
        id: 'cook-sec-2',
        title: '2. What Cookies Are',
        content: 'Cookies are small data files or identifiers stored or accessed on a device. Some are necessary for a website to function; others may support preferences, analytics, performance or other optional purposes.'
      },
      {
        id: 'cook-sec-3',
        title: '3. Cookie Categories',
        content: '• Strictly Necessary Cookies: Essential functions such as login, authentication, security, session continuity, load balancing, fraud prevention and consent storage. Used without optional consent where permitted by law.\n• Functional or Preference Cookies: Remember choices such as language, display preferences (Dark Mode) or non-essential settings.\n• Analytics and Performance Cookies: Help OAICC understand platform usage, identify errors and measure performance. Configured to minimise unnecessary personal data.\n• Advertising and Targeting Cookies: OAICC DOES NOT intend to use behavioural advertising cookies to target children.'
      },
      {
        id: 'cook-sec-4',
        title: '4. Cookie Consent and User Choice',
        content: 'Where OAICC uses cookies that require consent, users are given an opportunity to Accept optional cookies, Reject optional cookies, or Manage their preferences. Rejecting optional cookies will not prevent users from accessing essential platform functions.'
      },
      {
        id: 'cook-sec-5',
        title: '5. Browser Controls and Contact',
        content: 'Users may also control or delete cookies using their browser settings. Questions about cookies or tracking may be sent to info@oaiccglobal.com.'
      }
    ],
    legalFramework: [
      'Nigeria Data Protection Act 2023 and GAID 2025',
      'General Data Protection Regulation (EU) 2016/679 and ePrivacy rules',
      'Federal Competition and Consumer Protection Act 2018'
    ]
  },

  // 5. Child Safeguarding and Student Protection Policy
  {
    id: 'safeguarding',
    slug: 'safeguarding',
    title: 'Child Safeguarding and Student Protection Policy',
    shortTitle: 'Child Safeguarding',
    tagline: 'Minimum safeguarding standards for all adults, counsellors, mentors, and programmes on OAICC.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
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
        title: '1. Purpose and Scope',
        content: 'OAICC is committed to protecting children and young people who use its platform or participate in its programmes. This policy sets minimum safeguarding standards for founders, employees, contractors, volunteers, counsellors, mentors, school contacts, partners and any other adult who interacts with students through OAICC.'
      },
      {
        id: 'safe-sec-2',
        title: '2. Safeguarding Principles',
        content: '• The safety and welfare of the child take priority over convenience, reputation or programme targets.\n• Children should be treated with dignity, respect and without discrimination.\n• Adults must maintain clear professional boundaries.\n• Information should be shared only with those who need it for safeguarding, legal or support purposes.\n• A child should not be promised absolute confidentiality where safety may require escalation.'
      },
      {
        id: 'safe-sec-3',
        title: '3. Professional Boundaries for Adults',
        content: 'Adults interacting with students through OAICC must not:\n• Engage in romantic, sexual, flirtatious or sexually suggestive communication.\n• Request sexual, intimate or unnecessary photographs, videos or personal information.\n• Groom, manipulate, shame, threaten, blackmail or exploit a student.\n• Ask a student to keep communications or meetings secret from OAICC, parent or school.\n• Create emotional or financial dependency through gifts, money or personal favours.\n• Arrange unauthorised private meetings or transport.\n• Move communications to a private personal social media channel.'
      },
      {
        id: 'safe-sec-4',
        title: '4. One-to-One Sessions and Communications',
        content: 'Student communication must occur through approved channels. One-to-one sessions must be scheduled through approved processes with parent or school notification where appropriate. Routine recording is prohibited without defined lawful basis and consent.'
      },
      {
        id: 'safe-sec-5',
        title: '5. Responding to a Disclosure and Reporting',
        content: 'If a student discloses a safeguarding concern: stay calm, listen without judgement, do not promise secrecy, ask only minimal non-leading questions needed for immediate risk, and record the student\'s words factually. Escalate promptly to the Designated Safeguarding Lead at safeguarding@oaiccglobal.com.'
      }
    ],
    legalFramework: [
      'Child Rights Act 2003 and applicable state child-protection laws',
      'Nigeria Data Protection Act 2023 and GAID 2025'
    ]
  },

  // 6. Acceptable Use Policy
  {
    id: 'acceptable-use',
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    shortTitle: 'Acceptable Use',
    tagline: 'Rules for safe and responsible use of OAICC for students, schools, counsellors, and guests.',
    platform: 'OAICC - OruAikiIse Careers Counselling',
    legalEntity: 'OruAikiIse Ltd',
    website: 'oaiccglobal.com',
    effectiveDate: 'September 2026',
    lastUpdated: 'September 2026',
    version: '1.0',
    contactEmail: 'abuse@oaiccglobal.com',
    registeredAddress: 'Brownstone Cluster 2, Kunsela Road, Ikate, Lagos',
    applicableRoles: ['student', 'counselor', 'school', 'teacher', 'admin'],
    noticeBanner: 'Use OAICC for legitimate educational and career-guidance purposes. Bullying, harassment, data scraping, and unauthorized access are strictly prohibited.',
    sections: [
      {
        id: 'aup-sec-1',
        title: '1. Purpose and Scope',
        content: 'This Acceptable Use Policy applies to everyone using or accessing OAICC, including students, parents/guardians, schools, counsellors, mentors, administrators, contractors and partners. Use OAICC for legitimate educational, career-guidance, mentoring, counselling, programme and administrative purposes.'
      },
      {
        id: 'aup-sec-2',
        title: '2. Prohibited Harmful Conduct',
        content: 'Prohibited actions include: bullying, harassment, threats, stalking, coercion, grooming, sexual exploitation, sexualised communication with minors, encouraging self-harm or violence, hate-based abuse, doxxing, impersonating another person, or using OAICC to facilitate unlawful activity.'
      },
      {
        id: 'aup-sec-3',
        title: '3. Security and Technical Misuse',
        content: 'Do not access, test or probe accounts or APIs without authorisation. Do not bypass authentication or rate limits. Do not introduce malware or denial-of-service traffic. Do not scrape, crawl, harvest or bulk-download personal data or protected assessment content without written authorisation.'
      },
      {
        id: 'aup-sec-4',
        title: '4. Student-Specific Rules',
        content: 'Students must: not share passwords with friends; not arrange secret meetings with adults met through OAICC; not send intimate images; report any uncomfortable contact immediately to a trusted adult or safeguarding@oaiccglobal.com; and use respectful language without bullying.'
      },
      {
        id: 'aup-sec-5',
        title: '5. Reporting Abuse and Enforcement',
        content: 'Report platform abuse to abuse@oaiccglobal.com. Report child-safety concerns to safeguarding@oaiccglobal.com. OAICC may remove content, warn users, reset credentials, suspend or terminate accounts, and make reports to law enforcement where necessary.'
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
    noticeBanner: 'Applicable specifically to Counsellors, Mentors, and Guidance Advisors. Acceptance of this Code is a mandatory condition of professional practice on the platform.',
    sections: [
      {
        id: 'cc-sec-1',
        title: '1. Purpose and Role Distinction',
        content: 'This Code sets minimum standards for counsellors, mentors and other guidance professionals who interact with students through OAICC. A counsellor provides structured career and educational guidance within the scope approved by OAICC. Neither role authorises medical, psychological, legal, immigration, financial or other regulated advice.'
      },
      {
        id: 'cc-sec-2',
        title: '2. Competence, Credentials and Honesty',
        content: 'Provide truthful and current information about qualifications, experience and registrations. Work only within your competence and OAICC-assigned role. Correct material errors promptly and cooperate with supervision and verification.'
      },
      {
        id: 'cc-sec-3',
        title: '3. Student-Centred Practice and No Outcome Guarantees',
        content: 'Treat students with dignity and respect. Use clear, age-appropriate language. Avoid stereotyping based on gender, disability, ethnicity, religion or socioeconomic status. Do not promise or imply guaranteed admission, employment, scholarships, earnings or visa outcomes. Do not present career-match scores as destiny.'
      },
      {
        id: 'cc-sec-4',
        title: '4. Professional Boundaries and Prohibitions',
        content: 'Strictly prohibited: romantic or sexual communication with students; sexual jokes or comments; secret meetings or hidden channels; unnecessary exchange of personal phone numbers, private social media handles or home addresses; gifts, loans or favours; transport outside approved programmes.'
      },
      {
        id: 'cc-sec-5',
        title: '5. Confidentiality, AI Tools and Private Data',
        content: 'Student information is confidential. Share only what is reasonably necessary through approved systems. DO NOT paste identifiable or confidential student information into public AI tools, translation services or third-party note-taking apps without OAICC approval.'
      },
      {
        id: 'cc-sec-6',
        title: '6. Conflicts of Interest and Solicitation',
        content: 'Disclose actual or potential conflicts. Do not request private payments, tips, gifts or donations from students outside approved channels. Do not recruit students for private services without written permission.'
      },
      {
        id: 'cc-sec-7',
        title: '7. Breach, Suspension and Continuing Obligations',
        content: 'OAICC may restrict, suspend or remove a counsellor/mentor for safeguarding concerns, boundary violations, dishonesty or breach of this Code. Confidentiality and safeguarding duties continue after leaving the platform.'
      }
    ]
  },

  // 8. Parent/Guardian Notice and Consent (For Parents)
  {
    id: 'parent-consent',
    slug: 'parent-consent',
    title: 'Parent/Guardian Notice and Consent',
    shortTitle: 'Parent Consent Notice',
    tagline: 'Consent, authority, and age-appropriate information for parents and legal guardians.',
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
        content: 'OAICC helps students explore interests, strengths, skills, industries, careers and education pathways through questionnaires, career-match indicators, career library articles, and 1-on-1 guidance sessions.'
      },
      {
        id: 'pc-sec-2',
        title: '2. Information OAICC May Use',
        content: 'Student identity, age/year group, school, subjects, hobbies, skills, strengths, career preferences, questionnaire answers, session booking history, parent contact details, and safeguarding information if a safety concern arises.'
      },
      {
        id: 'pc-sec-3',
        title: '3. Career Matching Is Guidance, Not a Final Decision',
        content: 'Results are indicators to spark exploration. They do not decide your child\'s intelligence, value, or future career success. We encourage students to discuss choices with parents, guardians, and educators.'
      },
      {
        id: 'pc-sec-4',
        title: '4. Privacy Rights and Withdrawal of Consent',
        content: 'Parents and guardians may request access to student records, request corrections, or withdraw consent at any time by contacting privacy@oaiccglobal.com. We do not sell student data.'
      },
      {
        id: 'pc-sec-5',
        title: '5. Core and Optional Consents',
        content: 'Core consent covers educational guidance and account management. Optional consents (such as marketing updates, promotional photography, or session recording) are strictly separate and never pre-checked.'
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
        content: 'When an educational institution enrols student cohorts onto OAICC, the school confirms:\n• The school has lawful authority to provide student roster data to OAICC for career guidance.\n• The school has provided required notices to students and parents/guardians and obtained any necessary consents.\n• The school will not upload information unnecessary for the programme.\n• The school has identified designated privacy and safeguarding contacts.'
      },
      {
        id: 'sa-sec-2',
        title: '2. Changes in Status and Safeguarding Restrictions',
        content: 'The school will promptly inform OAICC of withdrawal of authority, student departure, safeguarding restrictions, or material inaccuracies that affect participation.'
      },
      {
        id: 'sa-sec-3',
        title: '3. Data Controller / Processor Allocations',
        content: 'In school arrangements, OAICC may act as data processor for school-directed records and as independent controller for platform security and guidance delivery. The signed institutional agreement governs specific terms.'
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
        content: 'OAICC aims to provide clear information, reasonable service quality, transparent pricing and accessible complaint handling. We will not penalise a user for making a genuine complaint or exercising a legal right.'
      },
      {
        id: 'cr-sec-2',
        title: '2. Cancellation and Rescheduling Standards',
        content: 'A consumer may request cancellation of an advance booking. OAICC does not impose a blanket "no refund under any circumstances" rule. Where OAICC or an assigned professional cancels a session, a reschedule or full refund will be provided.'
      },
      {
        id: 'cr-sec-3',
        title: '3. How to Make a Complaint and Timelines',
        content: 'Send complaints to complaints@oaiccglobal.com. We acknowledge complaints within 3 business days and provide substantive responses within 15 business days. Urgent safeguarding complaints are escalated immediately.'
      },
      {
        id: 'cr-sec-4',
        title: '4. External Escalation',
        content: 'If an issue cannot be resolved internally, consumers may approach the Federal Competition and Consumer Protection Commission (FCCPC) or the Nigeria Data Protection Commission (NDPC).'
      }
    ],
    legalFramework: [
      'Federal Competition and Consumer Protection Act 2018',
      'Nigeria Data Protection Act 2023'
    ]
  }
];

export function getPoliciesForRole(role: UserRole | 'all'): PolicyDocument[] {
  if (role === 'all') return POLICIES;
  return POLICIES.filter((p) => p.applicableRoles.includes(role));
}

export function getPolicyBySlug(slug: string): PolicyDocument | undefined {
  const normalized = slug.toLowerCase().trim();
  if (normalized === 'terms-and-conditions' || normalized === 'terms-of-use' || normalized === 'terms') {
    return POLICIES.find((p) => p.slug === 'terms');
  }
  if (normalized === 'privacy-policy' || normalized === 'privacy') {
    return POLICIES.find((p) => p.slug === 'privacy');
  }
  if (normalized === 'cookie-policy' || normalized === 'cookie-notice' || normalized === 'cookies') {
    return POLICIES.find((p) => p.slug === 'cookies');
  }
  return POLICIES.find((p) => p.slug === normalized || p.id === normalized);
}
