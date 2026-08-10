import { Question } from './assessmentData';

export const INITIAL_QUESTIONS: Question[] = [
  // SECTION 1: INTERESTS
  {
    id: 'I01', sectionId: 'interests', order: 1, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy solving number puzzles, calculations, or money-related problems.',
    primaryCluster: 'Finance, Accounting & Banking', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Numbers / money / analysis', relatedSubjects: ['Mathematics', 'Accounting', 'Economics'],
    counsellorPrompt: 'Ask what kind of number work they enjoy: money, data, puzzles, or business.'
  },
  {
    id: 'I02', sectionId: 'interests', order: 2, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like finding out why things happen in science, nature, or the human body.',
    primaryCluster: 'Science & Research', secondaryCluster: 'Health & Care',
    algorithmSignal: 'Science curiosity', relatedSubjects: ['Biology', 'Chemistry', 'Physics'],
    counsellorPrompt: 'Ask which science topics excite them most.'
  },
  {
    id: 'I03', sectionId: 'interests', order: 3, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy helping classmates understand a topic or assignment.',
    primaryCluster: 'Education & Training', secondaryCluster: 'Social Impact & Community Support',
    algorithmSignal: 'Teaching / explaining', relatedSubjects: ['English', 'favourite subject'],
    counsellorPrompt: 'Ask whether they prefer teaching children, peers, or groups.'
  },
  {
    id: 'I04', sectionId: 'interests', order: 4, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like drawing, designing, music, acting, writing stories, or creating content.',
    primaryCluster: 'Creative Arts, Design & Media', secondaryCluster: 'Marketing, Sales & Customer Experience',
    algorithmSignal: 'Creativity / expression', relatedSubjects: ['Visual Art', 'Music', 'Literature', 'English'],
    counsellorPrompt: 'Ask them to show examples of things they have made.'
  },
  {
    id: 'I05', sectionId: 'interests', order: 5, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy fixing, building, assembling, or taking things apart to understand them.',
    primaryCluster: 'Engineering, Manufacturing & Technical Trades', secondaryCluster: 'Construction, Real Estate & Built Environment',
    algorithmSignal: 'Hands-on building / repair', relatedSubjects: ['Physics', 'Technical Drawing', 'Basic Electricity'],
    counsellorPrompt: 'Ask whether the interest is machines, buildings, electronics, or crafts.'
  },
  {
    id: 'I06', sectionId: 'interests', order: 6, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like using phones, computers, apps, or online tools to solve problems or create things.',
    primaryCluster: 'Technology & Digital', secondaryCluster: 'Creative Arts, Design & Media',
    algorithmSignal: 'Digital creation / tech confidence', relatedSubjects: ['Computer Studies', 'Mathematics', 'English'],
    counsellorPrompt: 'Ask if they have tried coding, design apps, spreadsheets, or online research.'
  },
  {
    id: 'I07', sectionId: 'interests', order: 7, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy organising class activities, group work, events, or tasks for others.',
    primaryCluster: 'Business, Management & Entrepreneurship', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Organisation / coordination', relatedSubjects: ['English', 'Commerce', 'Office Practice'],
    counsellorPrompt: 'Ask if they prefer planning, leading, or keeping things orderly.'
  },
  {
    id: 'I08', sectionId: 'interests', order: 8, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like explaining ideas to people and convincing them to try something good.',
    primaryCluster: 'Marketing, Sales & Customer Experience', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Persuasion / communication', relatedSubjects: ['English', 'Commerce', 'Economics'],
    counsellorPrompt: 'Ask for examples: selling, debating, presenting, or influencing friends.'
  },
  {
    id: 'I09', sectionId: 'interests', order: 9, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I care about animals, farming, clean water, climate, food, or the environment.',
    primaryCluster: 'Environment, Agriculture & Sustainability', secondaryCluster: 'Science & Research',
    algorithmSignal: 'Nature / sustainability', relatedSubjects: ['Agriculture', 'Biology', 'Geography'],
    counsellorPrompt: 'Ask whether they prefer animals, plants, land, water, or climate topics.'
  },
  {
    id: 'I10', sectionId: 'interests', order: 10, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like caring for people when they are sick, sad, confused, or in need.',
    primaryCluster: 'Health & Care', secondaryCluster: 'Social Impact & Community Support',
    algorithmSignal: 'Care / empathy', relatedSubjects: ['Biology', 'Health Education', 'CRS/IRS'],
    counsellorPrompt: 'Ask what kind of helping feels natural: health, listening, teaching, or support.'
  },
  {
    id: 'I11', sectionId: 'interests', order: 11, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy talking about fairness, rules, rights, leadership, or what is happening in society.',
    primaryCluster: 'Law, Governance & Public Service', secondaryCluster: 'Security, Safety & Investigations',
    algorithmSignal: 'Justice / civic interest', relatedSubjects: ['Government', 'Civic Education', 'History'],
    counsellorPrompt: 'Ask if they like debate, policy, law, politics, or community leadership.'
  },
  {
    id: 'I12', sectionId: 'interests', order: 12, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like investigating clues, checking facts, and finding the real reason behind a problem.',
    primaryCluster: 'Security, Safety & Investigations', secondaryCluster: 'Science & Research',
    algorithmSignal: 'Investigation / evidence', relatedSubjects: ['Government', 'English', 'Science'],
    counsellorPrompt: 'Ask whether they prefer research, law, security, journalism, or science investigation.'
  },
  {
    id: 'I13', sectionId: 'interests', order: 13, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy sports, fitness, coaching, movement, or helping people stay active.',
    primaryCluster: 'Sports, Fitness & Recreation', secondaryCluster: 'Health & Care',
    algorithmSignal: 'Sport / fitness / coaching', relatedSubjects: ['Physical Education', 'Biology', 'Health Education'],
    counsellorPrompt: 'Ask whether they like playing, coaching, health, or sport business.'
  },
  {
    id: 'I14', sectionId: 'interests', order: 14, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy reading, writing, speaking, languages, stories, or presenting ideas.',
    primaryCluster: 'Creative Arts, Design & Media', secondaryCluster: 'Law, Governance & Public Service',
    algorithmSignal: 'Language / communication', relatedSubjects: ['English', 'Literature', 'Nigerian Language', 'French'],
    counsellorPrompt: 'Ask if they prefer creative writing, public speaking, journalism, or advocacy.'
  },
  {
    id: 'I15', sectionId: 'interests', order: 15, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like business ideas, buying and selling, saving money, or thinking about profit.',
    primaryCluster: 'Business, Management & Entrepreneurship', secondaryCluster: 'Finance, Accounting & Banking',
    algorithmSignal: 'Entrepreneurship / commerce', relatedSubjects: ['Commerce', 'Economics', 'Accounting'],
    counsellorPrompt: 'Ask whether they have sold anything or helped with a family business.'
  },
  {
    id: 'I16', sectionId: 'interests', order: 16, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I am interested in how goods, vehicles, deliveries, flights, or transport systems move.',
    primaryCluster: 'Transport, Logistics & Vehicles', secondaryCluster: 'Engineering, Manufacturing & Technical Trades',
    algorithmSignal: 'Movement / logistics', relatedSubjects: ['Geography', 'Mathematics', 'Auto Mechanical Work'],
    counsellorPrompt: 'Ask if they prefer vehicles, planning routes, supply chains, or travel operations.'
  },
  {
    id: 'I17', sectionId: 'interests', order: 17, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy welcoming guests, planning parties, food, travel, or making people comfortable.',
    primaryCluster: 'Hospitality, Events & Tourism', secondaryCluster: 'Marketing, Sales & Customer Experience',
    algorithmSignal: 'Hospitality / events', relatedSubjects: ['Food and Nutrition', 'Tourism', 'Home Management'],
    counsellorPrompt: 'Ask if they like food, hotels, events, travel, or guest relations.'
  },
  {
    id: 'I18', sectionId: 'interests', order: 18, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like practical subjects where I can make, repair, cook, design, or produce something.',
    primaryCluster: 'Engineering, Manufacturing & Technical Trades', secondaryCluster: 'Hospitality, Events & Tourism',
    algorithmSignal: 'Practical production', relatedSubjects: ['Trade Subjects', 'Technical Drawing', 'Food and Nutrition'],
    counsellorPrompt: 'Ask which practical activity they enjoy most.'
  },
  {
    id: 'I19', sectionId: 'interests', order: 19, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy being the person who takes charge when a group is confused.',
    primaryCluster: 'Business, Management & Entrepreneurship', secondaryCluster: 'Law, Governance & Public Service',
    algorithmSignal: 'Leadership', relatedSubjects: ['Government', 'Commerce', 'English'],
    counsellorPrompt: 'Ask if they lead calmly, forcefully, quietly, or by organising tasks.'
  },
  {
    id: 'I20', sectionId: 'interests', order: 20, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like asking questions, searching online, comparing information, and learning new things.',
    primaryCluster: 'Science & Research', secondaryCluster: 'Technology & Digital',
    algorithmSignal: 'Research / curiosity', relatedSubjects: ['English', 'Science', 'Computer Studies'],
    counsellorPrompt: 'Ask how they usually find answers: books, internet, experiments, people.'
  },
  {
    id: 'I21', sectionId: 'interests', order: 21, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy making videos, social media posts, posters, podcasts, or school announcements.',
    primaryCluster: 'Creative Arts, Design & Media', secondaryCluster: 'Marketing, Sales & Customer Experience',
    algorithmSignal: 'Content / media', relatedSubjects: ['English', 'Visual Art', 'Computer Studies'],
    counsellorPrompt: 'Ask whether they prefer being on camera, writing, editing, or design.'
  },
  {
    id: 'I22', sectionId: 'interests', order: 22, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I like keeping records, arranging files, making lists, or tracking tasks until they are done.',
    primaryCluster: 'People, HR & Administration', secondaryCluster: 'Finance, Accounting & Banking',
    algorithmSignal: 'Administration / detail', relatedSubjects: ['Office Practice', 'Data Processing', 'English'],
    counsellorPrompt: 'Ask if order and accuracy give them satisfaction.'
  },
  {
    id: 'I23', sectionId: 'interests', order: 23, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I am curious about buildings, roads, houses, land, estate, or how spaces are designed.',
    primaryCluster: 'Construction, Real Estate & Built Environment', secondaryCluster: 'Engineering, Manufacturing & Technical Trades',
    algorithmSignal: 'Built environment', relatedSubjects: ['Technical Drawing', 'Building Construction', 'Geography'],
    counsellorPrompt: 'Ask whether they notice buildings, layout, beauty, cost, or construction.'
  },
  {
    id: 'I24', sectionId: 'interests', order: 24, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I like helping people settle arguments or understand each other better.',
    primaryCluster: 'Social Impact & Community Support', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Mediation / people support', relatedSubjects: ['Civic Education', 'English', 'CRS/IRS'],
    counsellorPrompt: 'Ask whether they are patient with people\'s emotions and different views.'
  },

  // SECTION 2: STRENGTHS
  {
    id: 'S01', sectionId: 'strengths', order: 1, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can explain my thoughts clearly when I speak or write.',
    primaryCluster: 'Creative Arts, Design & Media', secondaryCluster: 'Law, Governance & Public Service',
    algorithmSignal: 'Communication', relatedSubjects: ['English', 'Literature'],
    counsellorPrompt: 'Ask whether they prefer speaking, writing, debating, or storytelling.'
  },
  {
    id: 'S02', sectionId: 'strengths', order: 2, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I notice small mistakes in writing, numbers, designs, or instructions.',
    primaryCluster: 'Finance, Accounting & Banking', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Accuracy / detail', relatedSubjects: ['Mathematics', 'English', 'Accounting'],
    counsellorPrompt: 'Ask what kind of mistakes they notice fastest.'
  },
  {
    id: 'S03', sectionId: 'strengths', order: 3, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I learn new topics quickly when someone explains them well.',
    primaryCluster: 'Science & Research', secondaryCluster: 'Education & Training',
    algorithmSignal: 'Fast learning', relatedSubjects: ['All subjects'],
    counsellorPrompt: 'Ask what helps them learn best: examples, practice, videos, reading.'
  },
  {
    id: 'S04', sectionId: 'strengths', order: 4, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I am good at solving problems step by step.',
    primaryCluster: 'Technology & Digital', secondaryCluster: 'Engineering, Manufacturing & Technical Trades',
    algorithmSignal: 'Problem-solving', relatedSubjects: ['Mathematics', 'Physics', 'Computer Studies'],
    counsellorPrompt: 'Ask them to describe a problem they solved recently.'
  },
  {
    id: 'S05', sectionId: 'strengths', order: 5, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I work well in a group and can cooperate with different types of people.',
    primaryCluster: 'People, HR & Administration', secondaryCluster: 'Social Impact & Community Support',
    algorithmSignal: 'Teamwork', relatedSubjects: ['English', 'Civic Education'],
    counsellorPrompt: 'Ask whether they prefer leader, organiser, supporter, or idea person.'
  },
  {
    id: 'S06', sectionId: 'strengths', order: 6, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can listen carefully when someone is explaining a problem.',
    primaryCluster: 'Health & Care', secondaryCluster: 'Social Impact & Community Support',
    algorithmSignal: 'Listening / empathy', relatedSubjects: ['English', 'CRS/IRS', 'Civic Education'],
    counsellorPrompt: 'Ask how they respond when someone is upset.'
  },
  {
    id: 'S07', sectionId: 'strengths', order: 7, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can use a phone, computer, or tablet confidently for schoolwork or projects.',
    primaryCluster: 'Technology & Digital', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Digital literacy', relatedSubjects: ['Computer Studies', 'Data Processing'],
    counsellorPrompt: 'Ask which digital tools they already use.'
  },
  {
    id: 'S08', sectionId: 'strengths', order: 8, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can organise my time when I have homework, chores, and other activities.',
    primaryCluster: 'Business, Management & Entrepreneurship', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Time management', relatedSubjects: ['All subjects'],
    counsellorPrompt: 'Ask what system they use to remember tasks.'
  },
  {
    id: 'S09', sectionId: 'strengths', order: 9, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can speak in front of classmates when I prepare well.',
    primaryCluster: 'Education & Training', secondaryCluster: 'Marketing, Sales & Customer Experience',
    algorithmSignal: 'Public speaking', relatedSubjects: ['English', 'Government', 'Literature'],
    counsellorPrompt: 'Ask if they like presentations, debate, drama, or announcements.'
  },
  {
    id: 'S10', sectionId: 'strengths', order: 10, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can make something look attractive, clear, or well-designed.',
    primaryCluster: 'Creative Arts, Design & Media', secondaryCluster: 'Marketing, Sales & Customer Experience',
    algorithmSignal: 'Design sense', relatedSubjects: ['Visual Art', 'Computer Studies'],
    counsellorPrompt: 'Ask whether they think in colours, layout, style, or storytelling.'
  },
  {
    id: 'S11', sectionId: 'strengths', order: 11, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can follow instructions carefully and finish tasks properly.',
    primaryCluster: 'Engineering, Manufacturing & Technical Trades', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Procedure / discipline', relatedSubjects: ['Trade Subjects', 'Office Practice'],
    counsellorPrompt: 'Ask whether they prefer clear instructions or freedom to create.'
  },
  {
    id: 'S12', sectionId: 'strengths', order: 12, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can stay calm and continue when work is hard or there is pressure.',
    primaryCluster: 'Health & Care', secondaryCluster: 'Security, Safety & Investigations',
    algorithmSignal: 'Resilience / pressure', relatedSubjects: ['All subjects'],
    counsellorPrompt: 'Ask what helps them manage pressure.'
  },
  {
    id: 'S13', sectionId: 'strengths', order: 13, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can understand charts, tables, numbers, or patterns when I take my time.',
    primaryCluster: 'Finance, Accounting & Banking', secondaryCluster: 'Technology & Digital',
    algorithmSignal: 'Data / numerical reasoning', relatedSubjects: ['Mathematics', 'Accounting', 'Economics'],
    counsellorPrompt: 'Ask if they prefer numbers in money, science, business, or technology.'
  },
  {
    id: 'S14', sectionId: 'strengths', order: 14, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can imagine how something will look before it is built, drawn, or arranged.',
    primaryCluster: 'Construction, Real Estate & Built Environment', secondaryCluster: 'Creative Arts, Design & Media',
    algorithmSignal: 'Spatial thinking', relatedSubjects: ['Technical Drawing', 'Visual Art', 'Building Construction'],
    counsellorPrompt: 'Ask if they like drawing plans, room layout, fashion, or objects.'
  },
  {
    id: 'S15', sectionId: 'strengths', order: 15, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can use my hands carefully to make, fix, cook, sew, build, or repair things.',
    primaryCluster: 'Engineering, Manufacturing & Technical Trades', secondaryCluster: 'Hospitality, Events & Tourism',
    algorithmSignal: 'Manual / practical skill', relatedSubjects: ['Trade Subjects', 'Food and Nutrition', 'Technical Drawing'],
    counsellorPrompt: 'Ask which hands-on activities they enjoy and practise.'
  },
  {
    id: 'S16', sectionId: 'strengths', order: 16, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I can find useful information when I need to understand something.',
    primaryCluster: 'Science & Research', secondaryCluster: 'Technology & Digital',
    algorithmSignal: 'Information search', relatedSubjects: ['English', 'Computer Studies'],
    counsellorPrompt: 'Ask what sources they trust and how they check information.'
  },
  {
    id: 'S17', sectionId: 'strengths', order: 17, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I can encourage people and make them feel included.',
    primaryCluster: 'Social Impact & Community Support', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Inclusion / support', relatedSubjects: ['Civic Education', 'CRS/IRS', 'English'],
    counsellorPrompt: 'Ask whether others come to them for advice or comfort.'
  },
  {
    id: 'S18', sectionId: 'strengths', order: 18, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I can negotiate, persuade, or get people interested in an idea.',
    primaryCluster: 'Marketing, Sales & Customer Experience', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Influence / persuasion', relatedSubjects: ['English', 'Commerce', 'Government'],
    counsellorPrompt: 'Ask if they use facts, humour, confidence, or relationships to persuade.'
  },
  {
    id: 'S19', sectionId: 'strengths', order: 19, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I can remember important details, names, stories, or instructions.',
    primaryCluster: 'Law, Governance & Public Service', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Memory / detail', relatedSubjects: ['History', 'Literature', 'English'],
    counsellorPrompt: 'Ask what kind of details they remember naturally.'
  },
  {
    id: 'S20', sectionId: 'strengths', order: 20, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I can make quick decisions when something needs attention.',
    primaryCluster: 'Security, Safety & Investigations', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Decision-making', relatedSubjects: ['Civic Education', 'Physical Education'],
    counsellorPrompt: 'Ask if quick decisions are thoughtful or impulsive.'
  },

  // SECTION 3: WORK STYLE
  {
    id: 'W01', sectionId: 'work-style', order: 1, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I prefer learning by doing practical activities, not only by reading notes.',
    primaryCluster: 'Engineering, Manufacturing & Technical Trades', secondaryCluster: 'Technology & Digital',
    algorithmSignal: 'Hands-on learning', relatedSubjects: ['Trade Subjects', 'Computer Studies', 'Technical Drawing'],
    counsellorPrompt: 'Use this to suggest practical exposure or project-based mentoring.'
  },
  {
    id: 'W02', sectionId: 'work-style', order: 2, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy working with people more than working alone all the time.',
    primaryCluster: 'Social Impact & Community Support', secondaryCluster: 'Marketing, Sales & Customer Experience',
    algorithmSignal: 'People-facing work', relatedSubjects: ['English', 'Civic Education'],
    counsellorPrompt: 'Ask what kind of people contact they enjoy.'
  },
  {
    id: 'W03', sectionId: 'work-style', order: 3, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy quiet independent work where I can think deeply.',
    primaryCluster: 'Science & Research', secondaryCluster: 'Technology & Digital',
    algorithmSignal: 'Independent focus', relatedSubjects: ['Science', 'Mathematics', 'Computer Studies'],
    counsellorPrompt: 'Ask whether independence supports focus or comes from shyness or fear.'
  },
  {
    id: 'W04', sectionId: 'work-style', order: 4, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like clear rules, steps, and expectations before I start a task.',
    primaryCluster: 'People, HR & Administration', secondaryCluster: 'Finance, Accounting & Banking',
    algorithmSignal: 'Structure / method', relatedSubjects: ['Office Practice', 'Accounting'],
    counsellorPrompt: 'Ask if they thrive with routine, checklists, and accuracy.'
  },
  {
    id: 'W05', sectionId: 'work-style', order: 5, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like freedom to try new ideas, designs, or ways of doing things.',
    primaryCluster: 'Creative Arts, Design & Media', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Innovation / creativity', relatedSubjects: ['Visual Art', 'Literature', 'Computer Studies'],
    counsellorPrompt: 'Ask what they created or changed recently.'
  },
  {
    id: 'W06', sectionId: 'work-style', order: 6, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like work that helps people or makes a positive difference in the community.',
    primaryCluster: 'Social Impact & Community Support', secondaryCluster: 'Health & Care',
    algorithmSignal: 'Purpose / service', relatedSubjects: ['Civic Education', 'CRS/IRS', 'Health Education'],
    counsellorPrompt: 'Ask what kind of problem in society they care about.'
  },
  {
    id: 'W07', sectionId: 'work-style', order: 7, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like outdoor, field, movement, or active work more than sitting in one place all day.',
    primaryCluster: 'Environment, Agriculture & Sustainability', secondaryCluster: 'Sports, Fitness & Recreation',
    algorithmSignal: 'Outdoor / active work', relatedSubjects: ['Agriculture', 'Geography', 'Physical Education'],
    counsellorPrompt: 'Ask whether they prefer field work, sport, nature, or travel.'
  },
  {
    id: 'W08', sectionId: 'work-style', order: 8, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'I like work where safety, protection, rules, or discipline matter.',
    primaryCluster: 'Security, Safety & Investigations', secondaryCluster: 'Law, Governance & Public Service',
    algorithmSignal: 'Safety / discipline', relatedSubjects: ['Civic Education', 'Government', 'Physical Education'],
    counsellorPrompt: 'Ask whether they mean law, emergency response, security, or compliance.'
  },
  {
    id: 'W09', sectionId: 'work-style', order: 9, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy work that involves travel, movement, vehicles, or different locations.',
    primaryCluster: 'Transport, Logistics & Vehicles', secondaryCluster: 'Hospitality, Events & Tourism',
    algorithmSignal: 'Mobility / travel', relatedSubjects: ['Geography', 'Tourism', 'Mathematics'],
    counsellorPrompt: 'Ask if they like planning movement or physically moving around.'
  },
  {
    id: 'W10', sectionId: 'work-style', order: 10, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I like work where I can be around business owners, customers, or the public.',
    primaryCluster: 'Marketing, Sales & Customer Experience', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Customer / public contact', relatedSubjects: ['Commerce', 'English', 'Economics'],
    counsellorPrompt: 'Ask whether they enjoy helping, selling, solving complaints, or promoting.'
  },
  {
    id: 'W11', sectionId: 'work-style', order: 11, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I enjoy being trusted with responsibility and making decisions for a group.',
    primaryCluster: 'Business, Management & Entrepreneurship', secondaryCluster: 'Law, Governance & Public Service',
    algorithmSignal: 'Responsibility / leadership', relatedSubjects: ['Government', 'Commerce', 'English'],
    counsellorPrompt: 'Ask if they lead with service, control, confidence, or planning.'
  },
  {
    id: 'W12', sectionId: 'work-style', order: 12, use: 'Optional', responseType: 'likert_5', isActive: true,
    questionText: 'I like work that involves food, guests, events, travel, or celebration.',
    primaryCluster: 'Hospitality, Events & Tourism', secondaryCluster: 'Creative Arts, Design & Media',
    algorithmSignal: 'Experience planning', relatedSubjects: ['Food and Nutrition', 'Tourism', 'Home Management'],
    counsellorPrompt: 'Ask whether they enjoy planning, cooking, hosting, or entertaining.'
  },

  // SECTION 4: SUBJECT SIGNALS
  {
    id: 'SB01', sectionId: 'subject-signals', order: 1, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'My stronger subjects include Mathematics, Accounting, Economics, or Commerce.',
    primaryCluster: 'Finance, Accounting & Banking', secondaryCluster: 'Business, Management & Entrepreneurship',
    algorithmSignal: 'Subject confidence', relatedSubjects: ['Mathematics', 'Accounting', 'Economics', 'Commerce'],
    counsellorPrompt: 'Check whether strength is interest, grades, or extra support.'
  },
  {
    id: 'SB02', sectionId: 'subject-signals', order: 2, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'My stronger subjects include Biology, Chemistry, Physics, Agriculture, or Health Education.',
    primaryCluster: 'Science & Research', secondaryCluster: 'Health & Care',
    algorithmSignal: 'Subject confidence', relatedSubjects: ['Biology', 'Chemistry', 'Physics', 'Agriculture'],
    counsellorPrompt: 'Ask which science subject feels easiest and why.'
  },
  {
    id: 'SB03', sectionId: 'subject-signals', order: 3, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'My stronger subjects include English, Literature, Government, History, CRS/IRS, or Languages.',
    primaryCluster: 'Law, Governance & Public Service', secondaryCluster: 'Creative Arts, Design & Media',
    algorithmSignal: 'Subject confidence', relatedSubjects: ['English', 'Literature', 'Government', 'History'],
    counsellorPrompt: 'Ask whether they enjoy reading, debate, writing, culture, or society.'
  },
  {
    id: 'SB04', sectionId: 'subject-signals', order: 4, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'My stronger subjects include Computer Studies, Data Processing, or technology-related work.',
    primaryCluster: 'Technology & Digital', secondaryCluster: 'People, HR & Administration',
    algorithmSignal: 'Subject confidence', relatedSubjects: ['Computer Studies', 'Data Processing'],
    counsellorPrompt: 'Ask if they use technology for creation, research, or organisation.'
  },
  {
    id: 'SB05', sectionId: 'subject-signals', order: 5, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'My stronger subjects include Technical Drawing, Building Construction, Basic Electricity, Metal Work, Wood Work, or auto-related subjects.',
    primaryCluster: 'Engineering, Manufacturing & Technical Trades', secondaryCluster: 'Construction, Real Estate & Built Environment',
    algorithmSignal: 'Subject confidence', relatedSubjects: ['Technical and Trade Subjects'],
    counsellorPrompt: 'Ask what they can already make, fix, or operate.'
  },
  {
    id: 'SB06', sectionId: 'subject-signals', order: 6, use: 'Core', responseType: 'likert_5', isActive: true,
    questionText: 'My stronger activities include Sports, Physical Education, fitness, dance, or active performance.',
    primaryCluster: 'Sports, Fitness & Recreation', secondaryCluster: 'Health & Care',
    algorithmSignal: 'Activity confidence', relatedSubjects: ['Physical Education', 'Health Education'],
    counsellorPrompt: 'Ask whether they want sport as a career, side talent, or wellness interest.'
  }
];
