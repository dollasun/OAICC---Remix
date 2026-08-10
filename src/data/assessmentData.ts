export type Section = {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
};

export type Question = {
  id: string;
  sectionId: string;
  order: number;
  questionText: string;
  use: "Core" | "Optional";
  primaryCluster: string;
  secondaryCluster: string;
  algorithmSignal: string;
  relatedSubjects: string[];
  counsellorPrompt: string;
  responseType: "likert_5";
  isActive: boolean;
};

export type CareerCluster = {
  id: string;
  name: string;
  studentFriendlyMeaning: string;
  relatedIndustries: string[];
  usefulSubjects: string[];
  exampleCareers: string[];
  counsellorPrompt: string;
};

export type Industry = {
  id: string;
  name: string;
  careers: string[];
};

export const INITIAL_INDUSTRIES: Industry[] = [
  { id: 'ind_01', name: 'Accountancy, banking and finance', careers: ['Chartered Accountant', 'Actuary', 'Compliance Officer', 'Corporate Investment Banker', 'Financial Risk Analyst', 'Insurance Underwriter', 'Retail Banker', 'Tax Adviser'] },
  { id: 'ind_02', name: 'Business, consulting and management', careers: ['Business Analyst', 'Management Consultant', 'Project Manager', 'Risk Manager', 'Operations Manager', 'Business Development Manager'] },
  { id: 'ind_03', name: 'Charity and voluntary work', careers: ['Charity Officer', 'Volunteer Coordinator', 'Fundraiser', 'International Aid Worker', 'Community Development Worker'] },
  { id: 'ind_04', name: 'Creative arts and design', careers: ['Graphic Designer', 'Illustrator', 'Animator', 'Interior Designer', 'Fashion Designer', 'Photographer'] },
  { id: 'ind_05', name: 'Energy and utilities', careers: ['Energy Engineer', 'Petroleum Engineer', 'Geoscientist', 'Nuclear Engineer', 'Water Engineer'] },
  { id: 'ind_06', name: 'Engineering and manufacturing', careers: ['Mechanical Engineer', 'Chemical Engineer', 'Electrical Engineer', 'Manufacturing Engineer', 'Structural Engineer', 'CAD Technician', 'Quality Manager'] },
  { id: 'ind_07', name: 'Environment and agriculture', careers: ['Environmental Consultant', 'Agricultural Consultant', 'Nature Conservation Officer', 'Farm Manager', 'Horticulturist'] },
  { id: 'ind_08', name: 'Healthcare', careers: ['Adult Nurse', 'Anaesthetist', 'Cardiologist', 'Midwife', 'Paramedic', 'Physiotherapist', 'Dentist', 'Clinical Scientist'] },
  { id: 'ind_09', name: 'Hospitality and events management', careers: ['Event Manager', 'Hotel Manager', 'Restaurant Manager', 'Chef', 'Catering Manager'] },
  { id: 'ind_10', name: 'Information technology', careers: ['Software Engineer', 'Data Scientist', 'Cyber Security Analyst', 'Database Administrator', 'Machine Learning Engineer', 'Network Engineer', 'Penetration Tester', 'IT Consultant'] },
  { id: 'ind_11', name: 'Law', careers: ['Solicitor', 'Barrister', 'Paralegal', 'Legal Executive', 'Company Secretary'] },
  { id: 'ind_12', name: 'Law enforcement and security', careers: ['Police Officer', 'Detective', 'Intelligence Analyst', 'Security Manager', 'Border Force Officer'] },
  { id: 'ind_13', name: 'Leisure, sport and tourism', careers: ['Personal Trainer', 'Sports Coach', 'Fitness Centre Manager', 'Tourism Officer', 'Travel Agent'] },
  { id: 'ind_14', name: 'Marketing, advertising and PR', careers: ['Marketing Executive', 'Digital Marketer', 'PR Officer', 'Advertising Account Executive', 'Copywriter'] },
  { id: 'ind_15', name: 'Media and internet', careers: ['Journalist', 'Broadcast Presenter', 'Content Creator', 'Social Media Manager', 'Video Editor'] },
  { id: 'ind_16', name: 'Property and construction', careers: ['Architect', 'Quantity Surveyor', 'Building Surveyor', 'Estate Agent', 'Town Planner'] },
  { id: 'ind_17', name: 'Public services and administration', careers: ['Civil Servant', 'Local Government Officer', 'Policy Officer', 'Diplomat'] },
  { id: 'ind_18', name: 'Recruitment and HR', careers: ['HR Officer', 'Recruitment Consultant', 'Training and Development Officer', 'Career Adviser'] },
  { id: 'ind_19', name: 'Retail', careers: ['Retail Manager', 'Merchandiser', 'Visual Merchandiser', 'Buyer'] },
  { id: 'ind_20', name: 'Sales', careers: ['Sales Executive', 'Account Manager', 'Sales Representative', 'Medical Sales Representative'] },
  { id: 'ind_21', name: 'Science and pharmaceuticals', careers: ['Research Scientist', 'Pharmacologist', 'Biotechnologist', 'Clinical Research Associate', 'Toxicologist'] },
  { id: 'ind_22', name: 'Social care', careers: ['Social Worker', 'Care Manager', 'Youth Worker', 'Probation Officer'] },
  { id: 'ind_23', name: 'Teacher training and education', careers: ['Primary School Teacher', 'Secondary School Teacher', 'Special Educational Needs Teacher', 'Education Administrator', 'Early Years Teacher'] },
  { id: 'ind_24', name: 'Transport and logistics', careers: ['Logistics Manager', 'Supply Chain Analyst', 'Warehouse Manager', 'Freight Forwarder', 'Customs Officer', 'Air Traffic Controller', 'Procurement Manager'] },
];

export const INITIAL_CLUSTERS: CareerCluster[] = [
  {
    id: 'Health & Care',
    name: 'Health & Care',
    studentFriendlyMeaning: 'Careers focused on helping people stay healthy, recover, or live better.',
    relatedIndustries: ['Healthcare', 'Social care', 'Science and pharmaceuticals'],
    usefulSubjects: ['Biology', 'Chemistry', 'Health Education', 'Physical Education', 'English'],
    exampleCareers: ['Doctor', 'nurse', 'pharmacist', 'medical lab scientist', 'physiotherapist', 'public health officer'],
    counsellorPrompt: 'Ask whether they prefer medical environments, therapy, or community care.'
  },
  {
    id: 'Science & Research',
    name: 'Science & Research',
    studentFriendlyMeaning: 'Careers that ask why things happen and use evidence to solve problems.',
    relatedIndustries: ['Science and pharmaceuticals', 'Environment and agriculture', 'Professional, scientific and technical'],
    usefulSubjects: ['Biology', 'Chemistry', 'Physics', 'Agriculture', 'Mathematics'],
    exampleCareers: ['Scientist', 'laboratory technologist', 'researcher', 'environmental analyst', 'quality officer'],
    counsellorPrompt: 'Ask which science topics excite them most.'
  },
  {
    id: 'Technology & Digital',
    name: 'Technology & Digital',
    studentFriendlyMeaning: 'Careers using computers, apps, data, online tools, or digital problem-solving.',
    relatedIndustries: ['Information technology', 'Media and internet', 'Telecommunications'],
    usefulSubjects: ['Mathematics', 'Computer Studies', 'Physics', 'English'],
    exampleCareers: ['Software developer', 'data analyst', 'cybersecurity analyst', 'product designer', 'IT support'],
    counsellorPrompt: 'Ask if they have tried coding, design apps, spreadsheets, or online research.'
  },
  {
    id: 'Engineering, Manufacturing & Technical Trades',
    name: 'Engineering, Manufacturing & Technical Trades',
    studentFriendlyMeaning: 'Careers that design, build, fix, operate, or improve machines and products.',
    relatedIndustries: ['Engineering and manufacturing', 'Technical trades', 'Energy and utilities'],
    usefulSubjects: ['Physics', 'Mathematics', 'Technical Drawing', 'Basic Electricity', 'Metal Work', 'Wood Work'],
    exampleCareers: ['Engineer', 'technician', 'mechanic', 'welder', 'electrician', 'manufacturing supervisor'],
    counsellorPrompt: 'Ask whether the interest is machines, buildings, electronics, or crafts.'
  },
  {
    id: 'Business, Management & Entrepreneurship',
    name: 'Business, Management & Entrepreneurship',
    studentFriendlyMeaning: 'Careers that plan, organise, lead, solve business problems, or build ventures.',
    relatedIndustries: ['Business, consulting and management', 'Entrepreneurship', 'Administrative and support services'],
    usefulSubjects: ['Commerce', 'Economics', 'Mathematics', 'English', 'Office Practice'],
    exampleCareers: ['Business analyst', 'entrepreneur', 'operations officer', 'consultant', 'project coordinator'],
    counsellorPrompt: 'Ask if they prefer planning, leading, or keeping things orderly.'
  },
  {
    id: 'Finance, Accounting & Banking',
    name: 'Finance, Accounting & Banking',
    studentFriendlyMeaning: 'Careers focused on money, accounts, budgets, banking, insurance, and financial decisions.',
    relatedIndustries: ['Accountancy, banking and finance', 'Financial and insurance services'],
    usefulSubjects: ['Accounting', 'Commerce', 'Economics', 'Mathematics', 'English'],
    exampleCareers: ['Accountant', 'banker', 'financial analyst', 'auditor', 'insurance officer'],
    counsellorPrompt: 'Ask what kind of number work they enjoy: money, data, puzzles, or business.'
  },
  {
    id: 'Law, Governance & Public Service',
    name: 'Law, Governance & Public Service',
    studentFriendlyMeaning: 'Careers focused on rules, fairness, rights, public decisions, and civic life.',
    relatedIndustries: ['Law', 'Public services and administration', 'Government', 'International organisations'],
    usefulSubjects: ['Government', 'Civic Education', 'Literature', 'History', 'English', 'CRS/IRS'],
    exampleCareers: ['Lawyer', 'policy officer', 'civil servant', 'compliance officer', 'diplomat'],
    counsellorPrompt: 'Ask if they like debate, policy, law, politics, or community leadership.'
  },
  {
    id: 'Education & Training',
    name: 'Education & Training',
    studentFriendlyMeaning: 'Careers that help others learn, grow, understand, and build confidence.',
    relatedIndustries: ['Teacher training and education', 'Training', 'Youth development'],
    usefulSubjects: ['English', 'Mathematics', 'favourite teaching subject', 'Civic Education'],
    exampleCareers: ['Teacher', 'tutor', 'trainer', 'education officer', 'learning designer'],
    counsellorPrompt: 'Ask whether they prefer teaching children, peers, or groups.'
  },
  {
    id: 'Creative Arts, Design & Media',
    name: 'Creative Arts, Design & Media',
    studentFriendlyMeaning: 'Careers that create visuals, stories, performances, designs, brands, or content.',
    relatedIndustries: ['Creative arts and design', 'Media and internet', 'Advertising and PR'],
    usefulSubjects: ['Visual Art', 'Music', 'Literature', 'English', 'Computer Studies'],
    exampleCareers: ['Graphic designer', 'content creator', 'journalist', 'filmmaker', 'animator', 'fashion designer'],
    counsellorPrompt: 'Ask them to show examples of things they have made.'
  },
  {
    id: 'Marketing, Sales & Customer Experience',
    name: 'Marketing, Sales & Customer Experience',
    studentFriendlyMeaning: 'Careers that persuade, sell, promote, explain products, and understand customers.',
    relatedIndustries: ['Marketing, advertising and PR', 'Sales', 'Retail'],
    usefulSubjects: ['Commerce', 'Economics', 'English', 'Mathematics', 'Office Practice'],
    exampleCareers: ['Marketer', 'sales executive', 'brand officer', 'customer success officer', 'retail manager'],
    counsellorPrompt: 'Ask whether they enjoy helping, selling, solving complaints, or promoting.'
  },
  {
    id: 'Hospitality, Events & Tourism',
    name: 'Hospitality, Events & Tourism',
    studentFriendlyMeaning: 'Careers that host people, plan experiences, manage events, travel, food, or guest services.',
    relatedIndustries: ['Hospitality and events management', 'Leisure, sport and tourism'],
    usefulSubjects: ['Food and Nutrition', 'Home Management', 'Tourism', 'English', 'Geography'],
    exampleCareers: ['Event planner', 'hotel manager', 'chef', 'tourism officer', 'guest relations officer'],
    counsellorPrompt: 'Ask if they like food, hotels, events, travel, or guest relations.'
  },
  {
    id: 'Environment, Agriculture & Sustainability',
    name: 'Environment, Agriculture & Sustainability',
    studentFriendlyMeaning: 'Careers that care for nature, animals, food systems, land, water, or climate.',
    relatedIndustries: ['Environment and agriculture', 'Agriculture, forestry and fishing', 'Water and waste'],
    usefulSubjects: ['Agriculture', 'Biology', 'Geography', 'Chemistry', 'Animal Husbandry', 'Fisheries'],
    exampleCareers: ['Agronomist', 'farmer', 'vet support worker', 'environmental officer', 'sustainability analyst'],
    counsellorPrompt: 'Ask whether they prefer animals, plants, land, water, or climate topics.'
  },
  {
    id: 'Transport, Logistics & Vehicles',
    name: 'Transport, Logistics & Vehicles',
    studentFriendlyMeaning: 'Careers that move people, goods, vehicles, supplies, and systems safely and efficiently.',
    relatedIndustries: ['Transport and logistics', 'Automotive trades', 'Supply chain'],
    usefulSubjects: ['Geography', 'Mathematics', 'Physics', 'Auto Mechanical Work', 'Data Processing'],
    exampleCareers: ['Logistics officer', 'supply chain analyst', 'driver operations manager', 'aviation officer', 'auto technician'],
    counsellorPrompt: 'Ask if they prefer vehicles, planning routes, supply chains, or travel operations.'
  },
  {
    id: 'Social Impact & Community Support',
    name: 'Social Impact & Community Support',
    studentFriendlyMeaning: 'Careers that support people, communities, charities, vulnerable groups, or social change.',
    relatedIndustries: ['Charity and voluntary work', 'Social care', 'Public services'],
    usefulSubjects: ['Civic Education', 'Government', 'CRS/IRS', 'English', 'Health Education'],
    exampleCareers: ['Social worker', 'NGO officer', 'community worker', 'counsellor', 'youth support officer'],
    counsellorPrompt: 'Ask what kind of problem in society they care about.'
  },
  {
    id: 'Sports, Fitness & Recreation',
    name: 'Sports, Fitness & Recreation',
    studentFriendlyMeaning: 'Careers involving sport, fitness, coaching, recreation, health, or performance.',
    relatedIndustries: ['Leisure, sport and tourism', 'Healthcare', 'Education'],
    usefulSubjects: ['Physical Education', 'Biology', 'Health Education', 'English'],
    exampleCareers: ['Coach', 'fitness trainer', 'sports therapist', 'PE teacher', 'recreation coordinator'],
    counsellorPrompt: 'Ask whether they like playing, coaching, health, or sport business.'
  },
  {
    id: 'Construction, Real Estate & Built Environment',
    name: 'Construction, Real Estate & Built Environment',
    studentFriendlyMeaning: 'Careers that shape buildings, land, housing, facilities, and construction projects.',
    relatedIndustries: ['Property and construction', 'Real estate', 'Technical trades'],
    usefulSubjects: ['Technical Drawing', 'Building Construction', 'Mathematics', 'Physics', 'Geography'],
    exampleCareers: ['Architect', 'quantity surveyor', 'estate officer', 'builder', 'facilities officer'],
    counsellorPrompt: 'Ask whether they notice buildings, layout, beauty, cost, or construction.'
  },
  {
    id: 'Security, Safety & Investigations',
    name: 'Security, Safety & Investigations',
    studentFriendlyMeaning: 'Careers that protect people, investigate issues, enforce rules, or manage risk.',
    relatedIndustries: ['Law enforcement and security', 'Public safety', 'Compliance'],
    usefulSubjects: ['Government', 'Civic Education', 'English', 'Physical Education', 'History'],
    exampleCareers: ['Police officer', 'investigator', 'safety officer', 'compliance assistant', 'security analyst'],
    counsellorPrompt: 'Ask whether they prefer law, emergency response, security, or compliance.'
  },
  {
    id: 'People, HR & Administration',
    name: 'People, HR & Administration',
    studentFriendlyMeaning: 'Careers that organise people, records, offices, recruitment, staff support, and processes.',
    relatedIndustries: ['Recruitment and HR', 'Administration', 'Business support'],
    usefulSubjects: ['Office Practice', 'English', 'Commerce', 'Data Processing', 'Mathematics'],
    exampleCareers: ['HR assistant', 'recruiter', 'administrator', 'office manager', 'training coordinator'],
    counsellorPrompt: 'Ask if order and accuracy give them satisfaction.'
  }
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 'interests', name: 'Interests', description: 'What you enjoy doing.', icon: 'Heart', order: 1, isActive: true, isSystem: true, createdAt: new Date().toISOString() },
  { id: 'strengths', name: 'Strengths', description: 'What you are good at.', icon: 'Zap', order: 2, isActive: true, isSystem: true, createdAt: new Date().toISOString() },
  { id: 'work-style', name: 'Work Style', description: 'How you like to work.', icon: 'Briefcase', order: 3, isActive: true, isSystem: true, createdAt: new Date().toISOString() },
  { id: 'subject-signals', name: 'Subject Signals', description: 'Your academic strengths.', icon: 'BookOpen', order: 4, isActive: true, isSystem: true, createdAt: new Date().toISOString() }
];

export const NIGERIAN_SUBJECTS = [
  'Mathematics', 'English Language', 'Literature in English', 'Biology', 'Chemistry', 'Physics', 
  'Agricultural Science', 'Economics', 'Commerce', 'Accounting', 'Government', 'Civic Education', 
  'History', 'Geography', 'CRS', 'IRS', 'Computer Studies', 'Data Processing', 'Technical Drawing', 
  'Building Construction', 'Basic Electricity', 'Metal Work', 'Wood Work', 'Auto Mechanical Work', 
  'Food and Nutrition', 'Home Management', 'Visual Art', 'Music', 'Physical Education', 
  'Health Education', 'Further Mathematics', 'French', 'Nigerian Language', 'Office Practice', 
  'Marketing', 'Animal Husbandry', 'Fisheries', 'Tourism', 'Book Keeping', 'Insurance'
];

