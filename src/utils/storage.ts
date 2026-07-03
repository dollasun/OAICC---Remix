
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

export const mentorsStorage = {
  get: (initialData: any = [
    {
      id: 1,
      name: 'Mason Biyi',
      role: 'Senior Software Engineer at Google',
      expertise: 'Software Engineering',
      image: 'https://picsum.photos/seed/m1/100/100',
      students: 12,
      rating: 4.9,
      bio: 'Passionate about mentoring the next generation of engineers.',
      linkedin: 'https://linkedin.com/in/masonbiyi',
      twitter: 'https://twitter.com/masonbiyi',
      website: 'https://masonbiyi.dev'
    },
    {
      id: 2,
      name: 'Dr. Sarah Alabi',
      role: 'Consultant Surgeon',
      expertise: 'Medicine',
      image: 'https://picsum.photos/seed/m2/100/100',
      students: 8,
      rating: 4.8,
      bio: 'Helping medical students navigate their career paths.',
      linkedin: 'https://linkedin.com/in/drsarahalabi',
      twitter: '',
      website: 'https://drsarahalabi.com'
    }
  ]) => getStoredData(STORAGE_KEY_MENTORS, initialData),
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
