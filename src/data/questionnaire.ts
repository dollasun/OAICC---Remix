export const intakeQuestions = [
  {
    id: 'P1',
    area: 'Class / school level',
    question: 'Which class are you currently in?',
    options: ['JSS3', 'SS1', 'SS2', 'SS3', 'Other'],
    type: 'single'
  },
  {
    id: 'P2',
    area: 'Subject stage',
    question: 'Have you already chosen a subject division or track?',
    options: ['Not yet', 'Science', 'Business', 'Arts/Social Science', 'Technical/Trade', 'Not sure'],
    type: 'single'
  },
  {
    id: 'P3',
    area: 'Favourite subjects',
    question: 'Which subjects do you enjoy most right now?',
    options: ['Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Government', 'Literature', 'Accounting', 'Commerce', 'Computer Studies', 'Technical Drawing', 'Physical Education', 'Fine Art', 'Other'],
    type: 'multiple'
  },
  {
    id: 'P4',
    area: 'Difficult subjects',
    question: 'Which subjects feel hardest or most stressful for you?',
    options: ['Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Government', 'Literature', 'Accounting', 'Commerce', 'Computer Studies', 'Technical Drawing', 'Physical Education', 'Fine Art', 'Other'],
    type: 'multiple'
  },
  {
    id: 'P5',
    area: 'Activities',
    question: 'What clubs, chores, hobbies, sports, church/mosque/community activities, or projects do you do?',
    type: 'text'
  },
  {
    id: 'P6',
    area: 'Current ideas',
    question: 'Do you already have any career ideas?',
    options: ['Yes', 'No', 'Maybe', 'Family suggested one', 'Friends suggested one'],
    type: 'single'
  },
  {
    id: 'P7',
    area: 'Biggest pressure',
    question: 'What makes career or subject choices confusing for you?',
    options: ['Parents/family', 'Friends', 'Money', 'Prestige', 'I do not know options', 'I fear choosing wrong'],
    type: 'single'
  },
  {
    id: 'P8',
    area: 'Exposure level',
    question: 'Have you spoken to anyone who works in careers you like?',
    options: ['Yes', 'No', 'Not sure'],
    type: 'single'
  },
  {
    id: 'P9',
    area: 'Support needed',
    question: 'What would help you most now?',
    options: ['Understand myself', 'Choose subjects', 'Learn careers', 'Speak to mentor', 'Explain to parents', 'Prepare for exams'],
    type: 'single'
  },
  {
    id: 'P10',
    area: 'Consent/check-in',
    question: 'Do you agree that OAICC can use your answers to suggest career paths and support conversations?',
    options: ['Yes', 'Parent/guardian needed', 'School-led'],
    type: 'single'
  }
];

export const coreAssessmentQuestions = [
  // Interests (I01 - I20 are core, I21-I24 are optional - we'll just include all and mark optional)
  { id: 'I01', section: 'Interests', use: 'Core', text: 'I enjoy solving number puzzles, calculations, or money-related problems.', primaryCluster: 'Accountancy, banking and finance', secondaryCluster: 'Business, consulting and management' },
  { id: 'I02', section: 'Interests', use: 'Core', text: 'I like finding out why things happen in science, nature, or the human body.', primaryCluster: 'Science and pharmaceuticals', secondaryCluster: 'Healthcare' },
  { id: 'I03', section: 'Interests', use: 'Core', text: 'I enjoy helping classmates understand a topic or assignment.', primaryCluster: 'Teacher training and education', secondaryCluster: 'Charity and voluntary work' },
  { id: 'I04', section: 'Interests', use: 'Core', text: 'I like drawing, designing, music, acting, writing stories, or creating content.', primaryCluster: 'Creative arts and design', secondaryCluster: 'Marketing, advertising and PR' },
  { id: 'I05', section: 'Interests', use: 'Core', text: 'I enjoy fixing, building, assembling, or taking things apart to understand them.', primaryCluster: 'Engineering and manufacturing', secondaryCluster: 'Property and construction' },
  { id: 'I06', section: 'Interests', use: 'Core', text: 'I like using phones, computers, apps, or online tools to solve problems or create things.', primaryCluster: 'Information technology', secondaryCluster: 'Creative arts and design' },
  { id: 'I07', section: 'Interests', use: 'Core', text: 'I enjoy organising class activities, group work, events, or tasks for others.', primaryCluster: 'Business, consulting and management', secondaryCluster: 'Recruitment and HR' },
  { id: 'I08', section: 'Interests', use: 'Core', text: 'I like explaining ideas to people and convincing them to try something good.', primaryCluster: 'Marketing, advertising and PR', secondaryCluster: 'Business, consulting and management' },
  { id: 'I09', section: 'Interests', use: 'Core', text: 'I care about animals, farming, clean water, climate, food, or the environment.', primaryCluster: 'Environment and agriculture', secondaryCluster: 'Science and pharmaceuticals' },
  { id: 'I10', section: 'Interests', use: 'Core', text: 'I like caring for people when they are sick, sad, confused, or in need.', primaryCluster: 'Healthcare', secondaryCluster: 'Charity and voluntary work' },
  { id: 'I11', section: 'Interests', use: 'Core', text: 'I enjoy talking about fairness, rules, rights, leadership, or what is happening in society.', primaryCluster: 'Public services and administration', secondaryCluster: 'Law enforcement and security' },
  { id: 'I12', section: 'Interests', use: 'Core', text: 'I like investigating clues, checking facts, and finding the real reason behind a problem.', primaryCluster: 'Law enforcement and security', secondaryCluster: 'Science and pharmaceuticals' },
  { id: 'I13', section: 'Interests', use: 'Core', text: 'I enjoy sports, fitness, coaching, movement, or helping people stay active.', primaryCluster: 'Leisure, sport and tourism', secondaryCluster: 'Healthcare' },
  { id: 'I14', section: 'Interests', use: 'Core', text: 'I enjoy reading, writing, speaking, languages, stories, or presenting ideas.', primaryCluster: 'Creative arts and design', secondaryCluster: 'Public services and administration' },
  { id: 'I15', section: 'Interests', use: 'Core', text: 'I like business ideas, buying and selling, saving money, or thinking about profit.', primaryCluster: 'Business, consulting and management', secondaryCluster: 'Accountancy, banking and finance' },
  { id: 'I16', section: 'Interests', use: 'Core', text: 'I am interested in how goods, vehicles, deliveries, flights, or transport systems move.', primaryCluster: 'Transport and logistics', secondaryCluster: 'Engineering and manufacturing' },
  { id: 'I17', section: 'Interests', use: 'Core', text: 'I enjoy welcoming guests, planning parties, food, travel, or making people comfortable.', primaryCluster: 'Hospitality and events management', secondaryCluster: 'Marketing, advertising and PR' },
  { id: 'I18', section: 'Interests', use: 'Core', text: 'I like practical subjects where I can make, repair, cook, design, or produce something.', primaryCluster: 'Engineering and manufacturing', secondaryCluster: 'Hospitality and events management' },
  { id: 'I19', section: 'Interests', use: 'Core', text: 'I enjoy being the person who takes charge when a group is confused.', primaryCluster: 'Business, consulting and management', secondaryCluster: 'Public services and administration' },
  { id: 'I20', section: 'Interests', use: 'Core', text: 'I like asking questions, searching online, comparing information, and learning new things.', primaryCluster: 'Science and pharmaceuticals', secondaryCluster: 'Information technology' },
  { id: 'I21', section: 'Interests', use: 'Optional', text: 'I enjoy making videos, social media posts, posters, podcasts, or school announcements.', primaryCluster: 'Creative arts and design', secondaryCluster: 'Marketing, advertising and PR' },
  { id: 'I22', section: 'Interests', use: 'Optional', text: 'I like keeping records, arranging files, making lists, or tracking tasks until they are done.', primaryCluster: 'Recruitment and HR', secondaryCluster: 'Accountancy, banking and finance' },
  { id: 'I23', section: 'Interests', use: 'Optional', text: 'I am curious about buildings, roads, houses, land, estate, or how spaces are designed.', primaryCluster: 'Property and construction', secondaryCluster: 'Engineering and manufacturing' },
  { id: 'I24', section: 'Interests', use: 'Optional', text: 'I like helping people settle arguments or understand each other better.', primaryCluster: 'Charity and voluntary work', secondaryCluster: 'Recruitment and HR' },
  
  // Strengths
  { id: 'S01', section: 'Strengths', use: 'Core', text: 'I can explain my thoughts clearly when I speak or write.', primaryCluster: 'Creative arts and design', secondaryCluster: 'Public services and administration' },
  { id: 'S02', section: 'Strengths', use: 'Core', text: 'I notice small mistakes in writing, numbers, designs, or instructions.', primaryCluster: 'Accountancy, banking and finance', secondaryCluster: 'Recruitment and HR' },
  { id: 'S03', section: 'Strengths', use: 'Core', text: 'I learn new topics quickly when someone explains them well.', primaryCluster: 'Science and pharmaceuticals', secondaryCluster: 'Teacher training and education' },
  { id: 'S04', section: 'Strengths', use: 'Core', text: 'I am good at solving problems step by step.', primaryCluster: 'Information technology', secondaryCluster: 'Engineering and manufacturing' },
  { id: 'S05', section: 'Strengths', use: 'Core', text: 'I work well in a group and can cooperate with different types of people.', primaryCluster: 'Recruitment and HR', secondaryCluster: 'Charity and voluntary work' },
  { id: 'S06', section: 'Strengths', use: 'Core', text: 'I can listen carefully when someone is explaining a problem.', primaryCluster: 'Healthcare', secondaryCluster: 'Charity and voluntary work' },
  { id: 'S07', section: 'Strengths', use: 'Core', text: 'I can use a phone, computer, or tablet confidently for schoolwork or projects.', primaryCluster: 'Information technology', secondaryCluster: 'Recruitment and HR' },
  { id: 'S08', section: 'Strengths', use: 'Core', text: 'I can organise my time when I have homework, chores, and other activities.', primaryCluster: 'Business, consulting and management', secondaryCluster: 'Recruitment and HR' },
  { id: 'S09', section: 'Strengths', use: 'Core', text: 'I can speak in front of classmates when I prepare well.', primaryCluster: 'Teacher training and education', secondaryCluster: 'Marketing, advertising and PR' },
  { id: 'S10', section: 'Strengths', use: 'Core', text: 'I can make something look attractive, clear, or well-designed.', primaryCluster: 'Creative arts and design', secondaryCluster: 'Marketing, advertising and PR' },
  { id: 'S11', section: 'Strengths', use: 'Core', text: 'I can follow instructions carefully and finish tasks properly.', primaryCluster: 'Engineering and manufacturing', secondaryCluster: 'Recruitment and HR' },
  { id: 'S12', section: 'Strengths', use: 'Core', text: 'I can stay calm and continue when work is hard or there is pressure.', primaryCluster: 'Healthcare', secondaryCluster: 'Law enforcement and security' },
  { id: 'S13', section: 'Strengths', use: 'Core', text: 'I can understand charts, tables, numbers, or patterns when I take my time.', primaryCluster: 'Accountancy, banking and finance', secondaryCluster: 'Information technology' },
  { id: 'S14', section: 'Strengths', use: 'Core', text: 'I can imagine how something will look before it is built, drawn, or arranged.', primaryCluster: 'Property and construction', secondaryCluster: 'Creative arts and design' },
  { id: 'S15', section: 'Strengths', use: 'Core', text: 'I can use my hands carefully to make, fix, cook, sew, build, or repair things.', primaryCluster: 'Engineering and manufacturing', secondaryCluster: 'Hospitality and events management' },
  { id: 'S16', section: 'Strengths', use: 'Core', text: 'I can find useful information when I need to understand something.', primaryCluster: 'Science and pharmaceuticals', secondaryCluster: 'Information technology' },
  { id: 'S17', section: 'Strengths', use: 'Optional', text: 'I can encourage people and make them feel included.', primaryCluster: 'Charity and voluntary work', secondaryCluster: 'Recruitment and HR' },
  { id: 'S18', section: 'Strengths', use: 'Optional', text: 'I can negotiate, persuade, or get people interested in an idea.', primaryCluster: 'Marketing, advertising and PR', secondaryCluster: 'Business, consulting and management' },
  { id: 'S19', section: 'Strengths', use: 'Optional', text: 'I can remember important details, names, stories, or instructions.', primaryCluster: 'Public services and administration', secondaryCluster: 'Recruitment and HR' },
  { id: 'S20', section: 'Strengths', use: 'Optional', text: 'I can make quick decisions when something needs attention.', primaryCluster: 'Law enforcement and security', secondaryCluster: 'Business, consulting and management' },

  // Work Style
  { id: 'W01', section: 'Work Style', use: 'Core', text: 'I prefer learning by doing practical activities, not only by reading notes.', primaryCluster: 'Engineering and manufacturing', secondaryCluster: 'Information technology' },
  { id: 'W02', section: 'Work Style', use: 'Core', text: 'I enjoy working with people more than working alone all the time.', primaryCluster: 'Charity and voluntary work', secondaryCluster: 'Marketing, advertising and PR' },
  { id: 'W03', section: 'Work Style', use: 'Core', text: 'I enjoy quiet independent work where I can think deeply.', primaryCluster: 'Science and pharmaceuticals', secondaryCluster: 'Information technology' },
  { id: 'W04', section: 'Work Style', use: 'Core', text: 'I like clear rules, steps, and expectations before I start a task.', primaryCluster: 'Recruitment and HR', secondaryCluster: 'Accountancy, banking and finance' },
  { id: 'W05', section: 'Work Style', use: 'Core', text: 'I like freedom to try new ideas, designs, or ways of doing things.', primaryCluster: 'Creative arts and design', secondaryCluster: 'Business, consulting and management' },
  { id: 'W06', section: 'Work Style', use: 'Core', text: 'I like work that helps people or makes a positive difference in the community.', primaryCluster: 'Charity and voluntary work', secondaryCluster: 'Healthcare' },
  { id: 'W07', section: 'Work Style', use: 'Core', text: 'I like outdoor, field, movement, or active work more than sitting in one place all day.', primaryCluster: 'Environment and agriculture', secondaryCluster: 'Leisure, sport and tourism' },
  { id: 'W08', section: 'Work Style', use: 'Core', text: 'I like work where safety, protection, rules, or discipline matter.', primaryCluster: 'Law enforcement and security', secondaryCluster: 'Public services and administration' },
  { id: 'W09', section: 'Work Style', use: 'Optional', text: 'I enjoy work that involves travel, movement, vehicles, or different locations.', primaryCluster: 'Transport and logistics', secondaryCluster: 'Hospitality and events management' },
  { id: 'W10', section: 'Work Style', use: 'Optional', text: 'I like work where I can be around business owners, customers, or the public.', primaryCluster: 'Marketing, advertising and PR', secondaryCluster: 'Business, consulting and management' },
  { id: 'W11', section: 'Work Style', use: 'Optional', text: 'I enjoy being trusted with responsibility and making decisions for a group.', primaryCluster: 'Business, consulting and management', secondaryCluster: 'Public services and administration' },
  { id: 'W12', section: 'Work Style', use: 'Optional', text: 'I like work that involves food, guests, events, travel, or celebration.', primaryCluster: 'Hospitality and events management', secondaryCluster: 'Creative arts and design' },

  // Subject Signals
  { id: 'SB01', section: 'Subject Signals', use: 'Core', text: 'My stronger subjects include Mathematics, Accounting, Economics, or Commerce.', primaryCluster: 'Accountancy, banking and finance', secondaryCluster: 'Business, consulting and management' },
  { id: 'SB02', section: 'Subject Signals', use: 'Core', text: 'My stronger subjects include Biology, Chemistry, Physics, Agriculture, or Health Education.', primaryCluster: 'Science and pharmaceuticals', secondaryCluster: 'Healthcare' },
  { id: 'SB03', section: 'Subject Signals', use: 'Core', text: 'My stronger subjects include English, Literature, Government, History, CRS/IRS, or Languages.', primaryCluster: 'Public services and administration', secondaryCluster: 'Creative arts and design' },
  { id: 'SB04', section: 'Subject Signals', use: 'Core', text: 'My stronger subjects include Computer Studies, Data Processing, or technology-related work.', primaryCluster: 'Information technology', secondaryCluster: 'Recruitment and HR' },
  { id: 'SB05', section: 'Subject Signals', use: 'Core', text: 'My stronger subjects include Technical Drawing, Building Construction, Basic Electricity, Metal Work, Wood Work, or auto-related subjects.', primaryCluster: 'Engineering and manufacturing', secondaryCluster: 'Property and construction' },
  { id: 'SB06', section: 'Subject Signals', use: 'Core', text: 'My stronger activities include Sports, Physical Education, fitness, dance, or active performance.', primaryCluster: 'Leisure, sport and tourism', secondaryCluster: 'Healthcare' },
];

export const clusters = [
  'Accountancy, banking and finance',
  'Business, consulting and management',
  'Charity and voluntary work',
  'Creative arts and design',
  'Energy and utilities',
  'Engineering and manufacturing',
  'Environment and agriculture',
  'Healthcare',
  'Hospitality and events management',
  'Information technology',
  'Law',
  'Law enforcement and security',
  'Leisure, sport and tourism',
  'Marketing, advertising and PR',
  'Media and internet',
  'Property and construction',
  'Public services and administration',
  'Recruitment and HR',
  'Retail',
  'Sales',
  'Science and pharmaceuticals',
  'Social care',
  'Teacher training and education',
  'Transport and logistics'
];
