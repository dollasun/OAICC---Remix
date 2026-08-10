
const STORAGE_KEY_CAREERS = 'app_careers';
const STORAGE_KEY_FORUMS = 'app_forums';
const STORAGE_KEY_FORUM_CATEGORIES = 'app_forum_categories';
const STORAGE_KEY_MENTORS = 'app_mentors';
const STORAGE_KEY_EVENTS = 'app_events';
const STORAGE_KEY_COUNSELORS = 'app_counselors';
const STORAGE_KEY_COUNSELOR_REQUESTS = 'app_counselor_requests';
const STORAGE_KEY_STUDENTS = 'app_students';
const STORAGE_KEY_ADMIN_USERS = 'app_admin_users';
const STORAGE_KEY_ADMIN_ROLES = 'app_admin_roles';
const STORAGE_KEY_SAVED_CAREERS = 'app_saved_careers';
const STORAGE_KEY_NOTIFICATIONS = 'app_notifications';
const STORAGE_KEY_REGISTERED_EVENTS = 'app_registered_events';
const STORAGE_KEY_INTEREST_QUIZ = 'app_interest_quiz';
const STORAGE_KEY_STRENGTH_QUIZ = 'app_strength_quiz';
const STORAGE_KEY_COUNSELING_SESSIONS = 'app_counseling_sessions';
const STORAGE_KEY_MESSAGES = 'app_messages';
const STORAGE_KEY_STUDENT_MESSAGES = 'app_student_messages';

export const getStoredData = (key: string, initialData: any) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
};

export const saveStoredData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const careersStorage = {
  get: (initialData: any = [
    {
      id: 1,
      title: 'Software Engineering',
      description: 'Design, develop, and maintain software systems and applications.',
      category: 'Technology',
      image: 'https://picsum.photos/seed/software/800/600',
      salaries: [
        { country: 'United States', currency: '$', min: '80,000', max: '150,000' },
        { country: 'Nigeria', currency: '₦', min: '5,000,000', max: '15,000,000' }
      ],
      salaryMin: '5,000,000',
      salaryMax: '150,000',
      demand: 'High',
      growth: '22%',
      skills: ['Problem Solving', 'Coding', 'System Design'],
      subjects: ['Mathematics', 'Further Maths', 'Physics']
    },
    {
      id: 2,
      title: 'Medicine & Surgery',
      description: 'Diagnose and treat illnesses, perform surgeries, and promote health.',
      category: 'Healthcare',
      image: 'https://picsum.photos/seed/medicine/800/600',
      salaries: [
        { country: 'United States', currency: '$', min: '150,000', max: '400,000' },
        { country: 'Nigeria', currency: '₦', min: '3,000,000', max: '10,000,000' }
      ],
      salaryMin: '3,000,000',
      salaryMax: '400,000',
      demand: 'Very High',
      growth: '15%',
      skills: ['Critical Thinking', 'Empathy', 'Dexterity'],
      subjects: ['Biology', 'Chemistry', 'Physics']
    },
    {
      id: 3,
      title: 'Product Design',
      description: 'Create user-centered designs for digital and physical products.',
      category: 'Design',
      image: 'https://picsum.photos/seed/design/800/600',
      salaries: [
        { country: 'United States', currency: '$', min: '70,000', max: '130,000' },
        { country: 'Nigeria', currency: '₦', min: '4,000,000', max: '12,000,000' }
      ],
      salaryMin: '4,000,000',
      salaryMax: '130,000',
      demand: 'High',
      growth: '18%',
      skills: ['UI/UX', 'Visual Design', 'User Research'],
      subjects: ['Fine Arts', 'Mathematics', 'English']
    }
  ]) => getStoredData(STORAGE_KEY_CAREERS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_CAREERS, data),
};

export const forumsStorage = {
  get: (initialData: any = [
    {
      id: 1,
      categoryId: 1,
      title: 'How to start with React?',
      author: 'Osayuki Yuki',
      replies: 15,
      views: 120,
      lastActivity: '2h ago',
      content: 'I am new to web development and I want to learn React. Where should I start?'
    },
    {
      id: 2,
      categoryId: 2,
      title: 'Best medical schools in Nigeria',
      author: 'Chioma Okeke',
      replies: 8,
      views: 85,
      lastActivity: '5h ago',
      content: 'Can anyone recommend the best universities for medicine in Nigeria?'
    }
  ]) => getStoredData(STORAGE_KEY_FORUMS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_FORUMS, data),
};

export const forumCategoriesStorage = {
  get: (initialData: any = [
    { id: 1, name: 'Technology', description: 'Discuss everything tech', topics: 45, posts: 120 },
    { id: 2, name: 'Healthcare', description: 'Medical and health related discussions', topics: 30, posts: 85 },
    { id: 3, name: 'Arts & Design', description: 'Creative discussions', topics: 25, posts: 60 }
  ]) => getStoredData(STORAGE_KEY_FORUM_CATEGORIES, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_FORUM_CATEGORIES, data),
};

const rawDefaultMentors = [
  { id: 1, name: 'Mason Elpi', email: 'elpi@example.com', role: 'Design', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m1/100/100' },
  { id: 2, name: 'Amanda Lance', email: 'lance@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m2/100/100' },
  { id: 3, name: 'Bolu Ahmed', email: 'bolu@example.com', role: 'Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m3/100/100' },
  { id: 4, name: 'Lilian Okoh', email: 'lilian@example.com', role: 'Real Estate', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m4/100/100' },
  { id: 5, name: 'John Chidiebere', email: 'john@example.com', role: 'Software Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m5/100/100' },
  { id: 6, name: 'Adeola Bisoye', email: 'adeola@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m6/100/100' },
  { id: 7, name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Marketing', date: 'Feb 12, 2023 10:15 AM', avatar: 'https://picsum.photos/seed/m7/100/100' },
  { id: 8, name: 'Michael Chen', email: 'michael@example.com', role: 'Finance', date: 'Mar 5, 2023 2:30 PM', avatar: 'https://picsum.photos/seed/m8/100/100' },
  { id: 9, name: 'Elena Rodriguez', email: 'elena@example.com', role: 'Law', date: 'Apr 20, 2023 9:45 AM', avatar: 'https://picsum.photos/seed/m9/100/100' },
  { id: 10, name: 'David Smith', email: 'david@example.com', role: 'Architecture', date: 'May 15, 2023 11:20 AM', avatar: 'https://picsum.photos/seed/m10/100/100' },
  { id: 11, name: 'Priya Sharma', email: 'priya@example.com', role: 'Data Science', date: 'Jun 8, 2023 3:10 PM', avatar: 'https://picsum.photos/seed/m11/100/100' },
  { id: 12, name: 'James Wilson', email: 'james@example.com', role: 'Psychology', date: 'Jul 22, 2023 1:55 PM', avatar: 'https://picsum.photos/seed/m12/100/100' },
  { id: 13, name: 'Isabella Garcia', email: 'isabella@example.com', role: 'Education', date: 'Aug 14, 2023 10:05 AM', avatar: 'https://picsum.photos/seed/m13/100/100' },
  { id: 14, name: 'Robert Taylor', email: 'robert@example.com', role: 'Business', date: 'Sep 30, 2023 4:40 PM', avatar: 'https://picsum.photos/seed/m14/100/100' },
  { id: 15, name: 'Sophie Martin', email: 'sophie@example.com', role: 'Journalism', date: 'Oct 18, 2023 12:25 PM', avatar: 'https://picsum.photos/seed/m15/100/100' },
  { id: 16, name: 'William Brown', email: 'william@example.com', role: 'Agriculture', date: 'Nov 5, 2023 8:50 AM', avatar: 'https://picsum.photos/seed/m16/100/100' },
  { id: 17, name: 'Olivia White', email: 'olivia@example.com', role: 'Hospitality', date: 'Dec 12, 2023 2:15 PM', avatar: 'https://picsum.photos/seed/m17/100/100' },
  { id: 18, name: 'Lucas Moore', email: 'lucas@example.com', role: 'Sports Management', date: 'Jan 25, 2024 11:30 AM', avatar: 'https://picsum.photos/seed/m18/100/100' },
  { id: 19, name: 'Noah Garcia', email: 'noah@example.com', role: 'Civil Engineering', date: 'Feb 10, 2024 9:00 AM', avatar: 'https://picsum.photos/seed/m19/100/100' },
  { id: 20, name: 'Mia Martinez', email: 'mia@example.com', role: 'Pharmacy', date: 'Feb 15, 2024 2:30 PM', avatar: 'https://picsum.photos/seed/m20/100/100' },
  { id: 21, name: 'Ethan Robinson', email: 'ethan@example.com', role: 'Cybersecurity', date: 'Feb 20, 2024 11:45 AM', avatar: 'https://picsum.photos/seed/m21/100/100' },
  { id: 22, name: 'Ava Clark', email: 'ava@example.com', role: 'Human Resources', date: 'Mar 1, 2024 10:20 AM', avatar: 'https://picsum.photos/seed/m22/100/100' },
  { id: 23, name: 'Liam Rodriguez', email: 'liam@example.com', role: 'Mechanical Engineering', date: 'Mar 5, 2024 3:15 PM', avatar: 'https://picsum.photos/seed/m23/100/100' },
  { id: 24, name: 'Charlotte Lewis', email: 'charlotte@example.com', role: 'Public Relations', date: 'Mar 10, 2024 1:00 PM', avatar: 'https://picsum.photos/seed/m24/100/100' },
  { id: 25, name: 'Benjamin Lee', email: 'benjamin@example.com', role: 'Artificial Intelligence', date: 'Mar 15, 2024 9:30 AM', avatar: 'https://picsum.photos/seed/m25/100/100' },
  { id: 26, name: 'Amelia Walker', email: 'amelia@example.com', role: 'Environmental Science', date: 'Mar 20, 2024 4:45 PM', avatar: 'https://picsum.photos/seed/m26/100/100' },
  { id: 27, name: 'James Hall', email: 'james.h@example.com', role: 'Real Estate Development', date: 'Mar 25, 2024 11:00 AM', avatar: 'https://picsum.photos/seed/m27/100/100' },
  { id: 28, name: 'Harper Young', email: 'harper@example.com', role: 'Veterinary Medicine', date: 'Apr 1, 2024 2:15 PM', avatar: 'https://picsum.photos/seed/m28/100/100' },
  { id: 29, name: 'Alexander King', email: 'alex@example.com', role: 'Aerospace Engineering', date: 'Apr 5, 2024 10:30 AM', avatar: 'https://picsum.photos/seed/m29/100/100' },
  { id: 30, name: 'Evelyn Wright', email: 'evelyn@example.com', role: 'Interior Design', date: 'Apr 10, 2024 3:50 PM', avatar: 'https://picsum.photos/seed/m30/100/100' }
];

const defaultMentors = rawDefaultMentors.map((m, index) => ({
  ...m,
  image: m.avatar,
  expertise: m.role,
  bio: `Professional mentor specializing in ${m.role}. With years of practical industry experience, I am committed to supporting students and aspiring professionals in their career journeys.`,
  students: 10 + (index % 11),
  rating: parseFloat((4.5 + (index % 6) * 0.1).toFixed(1)),
  linkedin: `https://linkedin.com/in/${m.name.toLowerCase().replace(/\s+/g, '')}`,
  twitter: `https://twitter.com/${m.name.toLowerCase().replace(/\s+/g, '')}`,
  website: `https://${m.name.toLowerCase().replace(/\s+/g, '')}.dev`
}));

export const mentorsStorage = {
  get: (initialData: any = defaultMentors) => {
    const backup = (!initialData || initialData.length === 0) ? defaultMentors : initialData;
    const data = getStoredData(STORAGE_KEY_MENTORS, backup);
    if (!data || data.length === 0) {
      saveStoredData(STORAGE_KEY_MENTORS, backup);
      return backup;
    }
    return data;
  },
  save: (data: any) => saveStoredData(STORAGE_KEY_MENTORS, data),
};

export const eventsStorage = {
  get: (initialData: any = [
    {
      id: 1,
      title: 'Tech Career Fair 2026',
      career: 'Software Engineering',
      mentor: 'John Chidiebere',
      date: '2026-03-15',
      time: '10:00 AM',
      image: 'https://picsum.photos/seed/e1/800/400',
      registeredCount: 320,
      attendedCount: 0
    },
    {
      id: 2,
      title: 'Medical Seminar: Future of Surgery',
      career: 'Medicine',
      mentor: 'Amanda Lance',
      date: '2026-03-20',
      time: '02:00 PM',
      image: 'https://picsum.photos/seed/e2/800/400',
      registeredCount: 150,
      attendedCount: 0
    },
    {
      id: 3,
      title: 'Creative Arts & Design Workshop',
      career: 'Product Design',
      mentor: 'Mason Elpi',
      date: '2026-03-25',
      time: '11:00 AM',
      image: 'https://picsum.photos/seed/e3/800/400',
      registeredCount: 85,
      attendedCount: 0
    },
    {
      id: 4,
      title: 'Engineering Innovation Summit',
      career: 'Engineering',
      mentor: 'Bolu Ahmed',
      date: '2026-04-05',
      time: '09:00 AM',
      image: 'https://picsum.photos/seed/e4/800/400',
      registeredCount: 200,
      attendedCount: 0
    },
    {
      id: 5,
      title: 'Financial Literacy for Young Adults',
      career: 'Finance',
      mentor: 'Sarah Jenkins',
      date: '2026-04-10',
      time: '04:00 PM',
      image: 'https://picsum.photos/seed/e5/800/400',
      registeredCount: 120,
      attendedCount: 0
    },
    {
      id: 6,
      title: 'Law School Admissions Talk',
      career: 'Law',
      mentor: 'Barrister Okoro',
      date: '2026-04-15',
      time: '01:00 PM',
      image: 'https://picsum.photos/seed/e6/800/400',
      registeredCount: 95,
      attendedCount: 0
    },
    {
      id: 7,
      title: 'Architecture & Urban Planning',
      career: 'Architecture',
      mentor: 'Adeola Bisoye',
      date: '2026-04-20',
      time: '10:00 AM',
      image: 'https://picsum.photos/seed/e7/800/400',
      registeredCount: 75,
      attendedCount: 0
    },
    {
      id: 8,
      title: 'Data Science & Analytics Workshop',
      career: 'Software Engineering',
      mentor: 'John Chidiebere',
      date: '2026-04-25',
      time: '03:00 PM',
      image: 'https://picsum.photos/seed/e8/800/400',
      registeredCount: 180,
      attendedCount: 0
    }
  ]) => getStoredData(STORAGE_KEY_EVENTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_EVENTS, data),
};

export const counselorsStorage = {
  get: (initialData: any = [
    {
      id: 1,
      name: 'Mr. Alfred Funmbi',
      email: 'alfred@oaicc.com',
      students: 45,
      sessions: 120,
      image: 'https://picsum.photos/seed/c1/100/100',
      specialization: 'Career Counseling'
    },
    {
      id: 2,
      name: 'Mrs. Janet Okon',
      email: 'janet@oaicc.com',
      students: 38,
      sessions: 95,
      image: 'https://picsum.photos/seed/c2/100/100',
      specialization: 'Academic Advising'
    }
  ]) => getStoredData(STORAGE_KEY_COUNSELORS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_COUNSELORS, data),
};

export const counselorRequestsStorage = {
  get: (initialData: any = [
    { id: 1, studentName: 'Osayuki Yuki', studentEmail: 'osayuki@gmail.com', date: '2024-10-20', status: 'Pending' },
    { id: 2, studentName: 'Chioma Okeke', studentEmail: 'chioma@gmail.com', date: '2024-10-21', status: 'Approved' }
  ]) => getStoredData(STORAGE_KEY_COUNSELOR_REQUESTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_COUNSELOR_REQUESTS, data),
};

export const studentsStorage = {
  get: (initialData: any = [
    { id: 1, name: 'Osayuki Yuki', email: 'osayuki.a+1@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s1/100/100', career: 'Software Engineering', class: 'SS3', gender: 'Male', school: 'The Seaside School' },
    { id: 2, name: 'Oyindamola Olambiwooninu', email: 'ooolambiwooninu@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s2/100/100', career: 'Medicine', class: 'SS2', gender: 'Female', school: 'The Seaside School' },
    { id: 3, name: 'Favour Aina', email: 'favouraina@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s3/100/100', career: 'Product Design', class: 'SS3', gender: 'Female', school: 'The Seaside School' },
    { id: 4, name: 'Adebayo Samuel', email: 'adebayo@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s4/100/100', career: 'Data Science', class: 'SS2', gender: 'Male', school: 'The Seaside School' },
    { id: 5, name: 'Chioma Okeke', email: 'chioma@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s5/100/100', career: 'Law', class: 'SS3', gender: 'Female', school: 'The Seaside School' },
    { id: 6, name: 'Tunde Bakare', email: 'tunde@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s6/100/100', career: 'Engineering', class: 'SS1', gender: 'Male', school: 'The Seaside School' },
    { id: 7, name: 'Sarah Johnson', email: 'sarah@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s7/100/100', career: 'Architecture', class: 'SS2', gender: 'Female', school: 'The Seaside School' },
    { id: 8, name: 'Michael Chen', email: 'michael@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s8/100/100', career: 'Finance', class: 'SS3', gender: 'Male', school: 'The Seaside School' },
  ]) => {
    const data = getStoredData(STORAGE_KEY_STUDENTS, initialData);
    return data.length === 0 ? initialData : data;
  },
  save: (data: any) => saveStoredData(STORAGE_KEY_STUDENTS, data),
};

export const adminUsersStorage = {
  get: (initialData: any = [
    { id: 1, name: 'Admin User', email: 'admin@oaicc.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Jane Doe', email: 'jane@oaicc.com', role: 'Content Manager', status: 'Active' }
  ]) => getStoredData(STORAGE_KEY_ADMIN_USERS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_ADMIN_USERS, data),
};

export const adminRolesStorage = {
  get: (initialData: any = [
    { id: 1, name: 'Super Admin', permissions: ['all'] },
    { id: 2, name: 'Content Manager', permissions: ['careers.manage', 'forums.manage', 'events.manage'] }
  ]) => getStoredData(STORAGE_KEY_ADMIN_ROLES, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_ADMIN_ROLES, data),
};

export const savedCareersStorage = {
  get: (initialData: any = [1, 2]) => getStoredData(STORAGE_KEY_SAVED_CAREERS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_SAVED_CAREERS, data),
};

export const notificationsStorage = {
  get: (initialData: any = [
    { id: 1, title: 'Session Reminder', message: 'Your session with Mr. Alfred starts in 30 minutes.', time: '30m ago', read: false },
    { id: 2, title: 'New Event', message: 'A new Tech Career Fair has been added.', time: '2h ago', read: true }
  ]) => getStoredData(STORAGE_KEY_NOTIFICATIONS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_NOTIFICATIONS, data),
};

export const registeredEventsStorage = {
  get: (initialData: any = [1]) => getStoredData(STORAGE_KEY_REGISTERED_EVENTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_REGISTERED_EVENTS, data),
};

export const interestQuizStorage = {
  get: (initialData: any = [
    { id: 1, question: 'Do you enjoy solving complex mathematical problems?', options: ['Yes', 'No', 'Sometimes'], category: 'Analytical' },
    { id: 2, question: 'Do you like working with people to solve their problems?', options: ['Yes', 'No', 'Sometimes'], category: 'Social' }
  ]) => getStoredData(STORAGE_KEY_INTEREST_QUIZ, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_INTEREST_QUIZ, data),
};

export const strengthQuizStorage = {
  get: (initialData: any = [
    { id: 1, question: 'I am good at explaining difficult concepts to others.', options: ['Strongly Agree', 'Agree', 'Disagree'], category: 'Communication' },
    { id: 2, question: 'I can stay focused on a task for a long period of time.', options: ['Strongly Agree', 'Agree', 'Disagree'], category: 'Focus' }
  ]) => getStoredData(STORAGE_KEY_STRENGTH_QUIZ, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_STRENGTH_QUIZ, data),
};

export const counselingSessionsStorage = {
  get: (initialData: any = [
    {
      id: 1,
      counselorId: 1,
      counselorName: 'Mr. Alfred Funmbi',
      studentId: 1,
      studentName: 'Osayuki Yuki',
      studentImage: 'https://picsum.photos/seed/s1/100/100',
      title: 'Career Path Review',
      date: '2026-03-15',
      time: '10:00 AM',
      type: 'Virtual',
      link: 'https://zoom.us/j/123456789',
      status: 'Upcoming'
    },
    {
      id: 2,
      counselorId: 1,
      counselorName: 'Mr. Alfred Funmbi',
      studentId: 2,
      studentName: 'Oyindamola Olambiwooninu',
      studentImage: 'https://picsum.photos/seed/s2/100/100',
      title: 'University Application Strategy',
      date: '2026-03-16',
      time: '02:00 PM',
      type: 'Virtual',
      link: 'https://zoom.us/j/987654321',
      status: 'Upcoming'
    },
    {
      id: 3,
      counselorId: 1,
      counselorName: 'Mr. Alfred Funmbi',
      studentId: 3,
      studentName: 'Favour Aina',
      studentImage: 'https://picsum.photos/seed/s3/100/100',
      title: 'Design Portfolio Feedback',
      date: '2026-03-17',
      time: '11:30 AM',
      type: 'Virtual',
      link: 'https://zoom.us/j/456123789',
      status: 'Upcoming'
    },
    {
      id: 4,
      counselorId: 1,
      counselorName: 'Mr. Alfred Funmbi',
      studentId: 4,
      studentName: 'Adebayo Samuel',
      studentImage: 'https://picsum.photos/seed/s4/100/100',
      title: 'Data Science Roadmap',
      date: '2026-03-18',
      time: '09:00 AM',
      type: 'Virtual',
      link: 'https://zoom.us/j/789123456',
      status: 'Upcoming'
    },
    {
      id: 5,
      counselorId: 1,
      counselorName: 'Mr. Alfred Funmbi',
      studentId: 5,
      studentName: 'Chioma Okeke',
      studentImage: 'https://picsum.photos/seed/s5/100/100',
      title: 'Law School Requirements',
      date: '2026-03-19',
      time: '04:00 PM',
      type: 'Virtual',
      link: 'https://zoom.us/j/321654987',
      status: 'Upcoming'
    }
  ]) => {
    const data = getStoredData(STORAGE_KEY_COUNSELING_SESSIONS, initialData);
    return data.length === 0 ? initialData : data;
  },
  save: (data: any) => saveStoredData(STORAGE_KEY_COUNSELING_SESSIONS, data),
};

export const messagesStorage = {
  get: (initialData: any = [
    {
      id: 1,
      name: 'Osayuki Yuki',
      lastMessage: 'I have some questions about the software engineering curriculum.',
      time: '2m ago',
      unread: 1,
      image: 'https://picsum.photos/seed/s1/100/100',
      online: true,
      messages: [
        { id: 1, sender: 'student', text: 'Hello Mr. Alfred, I just wanted to ask about the next steps for my software engineering application.', time: '10:00 AM' },
        { id: 2, sender: 'counselor', text: 'Hi Osayuki! We\'ll discuss that in our session today at 10:00 AM. Make sure you have your transcripts ready.', time: '10:15 AM' },
        { id: 3, sender: 'student', text: 'I have some questions about the software engineering curriculum.', time: '3:30 PM' }
      ]
    },
    {
      id: 2,
      name: 'Oyindamola Olambiwooninu',
      lastMessage: 'When is our next meeting scheduled?',
      time: '1h ago',
      unread: 0,
      image: 'https://picsum.photos/seed/s2/100/100',
      online: false,
      messages: [
        { id: 1, sender: 'student', text: 'When is our next meeting scheduled?', time: '11:00 AM' }
      ]
    },
    {
      id: 3,
      name: 'Favour Aina',
      lastMessage: 'Thank you for the session today, it was really helpful!',
      time: '3h ago',
      unread: 0,
      image: 'https://picsum.photos/seed/s3/100/100',
      online: true,
      messages: [
        { id: 1, sender: 'student', text: 'Thank you for the session today, it was really helpful!', time: '9:00 AM' }
      ]
    },
    {
      id: 4,
      name: 'Adebayo Samuel',
      lastMessage: 'I have updated my career interests to Data Science.',
      time: '5h ago',
      unread: 1,
      image: 'https://picsum.photos/seed/s4/100/100',
      online: false,
      messages: [
        { id: 1, sender: 'student', text: 'I have updated my career interests to Data Science.', time: '8:30 AM' }
      ]
    }
  ]) => {
    const data = getStoredData(STORAGE_KEY_MESSAGES, initialData);
    return data.length === 0 ? initialData : data;
  },
  save: (data: any) => saveStoredData(STORAGE_KEY_MESSAGES, data),
};

export const studentMessagesStorage = {
  get: (initialData: any = [
    {
      id: 1,
      name: 'Mr. Alfred Funmbi',
      role: 'Counselor',
      lastMessage: 'Hi Bolu! Make sure you have your transcripts ready for our session.',
      time: '10:15 AM',
      unread: 1,
      image: 'https://picsum.photos/seed/c1/100/100',
      online: true,
      messages: [
        { id: 1, sender: 'student', text: 'Hello Mr. Alfred, I just wanted to ask about the next steps for my software engineering application.', time: '10:00 AM' },
        { id: 2, sender: 'contact', text: 'Hi Bolu! Make sure you have your transcripts ready for our session today.', time: '10:15 AM' }
      ]
    },
    {
      id: 2,
      name: 'Dr. Sarah Ojo',
      role: 'School Admin',
      lastMessage: 'The internship submission deadline is next Friday at 4:00 PM.',
      time: '11:25 AM',
      unread: 0,
      image: 'https://picsum.photos/seed/admin1/100/100',
      online: true,
      messages: [
        { id: 1, sender: 'contact', text: 'Welcome Bolu! Your SSS3 profile and career assessment accounts have been verified.', time: '9:00 AM' },
        { id: 2, sender: 'student', text: 'Thank you Dr. Sarah! When is the deadline for submitting the internship form?', time: '11:10 AM' },
        { id: 3, sender: 'contact', text: 'The internship submission deadline is next Friday at 4:00 PM.', time: '11:25 AM' }
      ]
    },
    {
      id: 3,
      name: 'Mrs. Kemi Ahmed',
      role: 'Parent',
      lastMessage: 'Hi Bolu, how did your meeting with Mr. Alfred go today?',
      time: '2:15 PM',
      unread: 1,
      image: 'https://picsum.photos/seed/parent1/100/100',
      online: false,
      messages: [
        { id: 1, sender: 'contact', text: 'Hi Bolu, how did your meeting with Mr. Alfred go today?', time: '2:15 PM' }
      ]
    },
    {
      id: 4,
      name: 'Mr. Mason Biyi',
      role: 'Teacher',
      lastMessage: 'Great submission on your STEM robotics assignment Bolu! Keep up the good work.',
      time: 'Yesterday',
      unread: 0,
      image: 'https://picsum.photos/seed/teacher1/100/100',
      online: false,
      messages: [
        { id: 1, sender: 'contact', text: 'Great submission on your STEM robotics assignment Bolu! Keep up the good work.', time: '1:00 PM' },
        { id: 2, sender: 'student', text: 'Thank you Mr. Mason! I really enjoyed working on it.', time: '1:15 PM' }
      ]
    }
  ]) => {
    const data = getStoredData(STORAGE_KEY_STUDENT_MESSAGES, initialData);
    return data.length === 0 ? initialData : data;
  },
  save: (data: any) => saveStoredData(STORAGE_KEY_STUDENT_MESSAGES, data),
};
