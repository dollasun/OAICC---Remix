
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
  get: (initialData: any) => getStoredData(STORAGE_KEY_CAREERS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_CAREERS, data),
};

export const forumsStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_FORUMS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_FORUMS, data),
};

export const forumCategoriesStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_FORUM_CATEGORIES, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_FORUM_CATEGORIES, data),
};

export const mentorsStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_MENTORS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_MENTORS, data),
};

export const eventsStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_EVENTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_EVENTS, data),
};

export const counselorsStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_COUNSELORS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_COUNSELORS, data),
};

export const counselorRequestsStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_COUNSELOR_REQUESTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_COUNSELOR_REQUESTS, data),
};

export const studentsStorage = {
  get: (initialData: any = [
    { id: 1, name: 'Osayuki Yuki', email: 'osayuki.a+1@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s1/100/100', career: 'Software Engineering', class: 'SS3', gender: 'Male' },
    { id: 2, name: 'Oyindamola Olambiwooninu', email: 'ooolambiwooninu@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s2/100/100', career: 'Medicine', class: 'SS2', gender: 'Female' },
    { id: 3, name: 'Favour Aina', email: 'favouraina@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s3/100/100', career: 'Product Design', class: 'SS3', gender: 'Female' },
    { id: 4, name: 'Adebayo Samuel', email: 'adebayo@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s4/100/100', career: 'Data Science', class: 'SS2', gender: 'Male' },
    { id: 5, name: 'Chioma Okeke', email: 'chioma@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s5/100/100', career: 'Law', class: 'SS3', gender: 'Female' },
    { id: 6, name: 'Tunde Bakare', email: 'tunde@gmail.com', counselorId: 1, avatar: 'https://picsum.photos/seed/s6/100/100', career: 'Engineering', class: 'SS1', gender: 'Male' },
  ]) => getStoredData(STORAGE_KEY_STUDENTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_STUDENTS, data),
};

export const adminUsersStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_ADMIN_USERS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_ADMIN_USERS, data),
};

export const adminRolesStorage = {
  get: (initialData: any) => getStoredData(STORAGE_KEY_ADMIN_ROLES, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_ADMIN_ROLES, data),
};

export const savedCareersStorage = {
  get: (initialData: any = []) => getStoredData(STORAGE_KEY_SAVED_CAREERS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_SAVED_CAREERS, data),
};

export const notificationsStorage = {
  get: (initialData: any = []) => getStoredData(STORAGE_KEY_NOTIFICATIONS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_NOTIFICATIONS, data),
};

export const registeredEventsStorage = {
  get: (initialData: any = []) => getStoredData(STORAGE_KEY_REGISTERED_EVENTS, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_REGISTERED_EVENTS, data),
};

export const interestQuizStorage = {
  get: (initialData: any = []) => getStoredData(STORAGE_KEY_INTEREST_QUIZ, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_INTEREST_QUIZ, data),
};

export const strengthQuizStorage = {
  get: (initialData: any = []) => getStoredData(STORAGE_KEY_STRENGTH_QUIZ, initialData),
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
      date: '2024-10-25',
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
      date: '2024-10-26',
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
      date: '2024-10-27',
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
      date: '2024-10-28',
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
      date: '2024-10-29',
      time: '04:00 PM',
      type: 'Virtual',
      link: 'https://zoom.us/j/321654987',
      status: 'Upcoming'
    }
  ]) => getStoredData(STORAGE_KEY_COUNSELING_SESSIONS, initialData),
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
  ]) => getStoredData(STORAGE_KEY_MESSAGES, initialData),
  save: (data: any) => saveStoredData(STORAGE_KEY_MESSAGES, data),
};
