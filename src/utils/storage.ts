
const STORAGE_KEY_CAREERS = 'app_careers';
const STORAGE_KEY_FORUMS = 'app_forums';
const STORAGE_KEY_MENTORS = 'app_mentors';
const STORAGE_KEY_EVENTS = 'app_events';
const STORAGE_KEY_COUNSELORS = 'app_counselors';
const STORAGE_KEY_ADMIN_USERS = 'app_admin_users';
const STORAGE_KEY_ADMIN_ROLES = 'app_admin_roles';
const STORAGE_KEY_SAVED_CAREERS = 'app_saved_careers';
const STORAGE_KEY_NOTIFICATIONS = 'app_notifications';
const STORAGE_KEY_REGISTERED_EVENTS = 'app_registered_events';
const STORAGE_KEY_INTEREST_QUIZ = 'app_interest_quiz';
const STORAGE_KEY_STRENGTH_QUIZ = 'app_strength_quiz';

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
