export type UserRole = 'admin' | 'student' | 'school' | 'counselor' | 'parent' | 'teacher';

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  class: string;
  school: string;
  relationship: string;
  avatar?: string;
  status: 'active' | 'pending';
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  date: string;
  status?: string;
}

export interface UserProfile {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  location: string;
  phone: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}
