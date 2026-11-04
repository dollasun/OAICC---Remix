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
  /** Where the notification should take the user when opened. */
  link?: string;
}

export interface School {
  id: string;
  name: string;
  location: string;
  schoolTypes: string[];
  /** Ranges chosen at signup, e.g. "12 - 20" and "100 - 400". */
  expectedClasses: string;
  expectedStudents: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  phone?: string;
  about?: string;
  avatar?: string;
  createdAt: string;
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  /** Teacher record id; stays empty until teachers are invited and assigned. */
  teacherId?: string;
  createdAt: string;
}

export type PortalRole = 'school' | 'teacher' | 'parent' | 'student';
export type AccountStatus = 'invited' | 'active';

export interface Session {
  role: PortalRole;
  userId: string;
}

export interface TeacherRecord {
  id: string;
  schoolId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  subject?: string;
  location?: string;
  avatar?: string;
  status: AccountStatus;
  onboarded: boolean;
  createdAt: string;
}

export interface StudentRecord {
  id: string;
  schoolId?: string;
  classId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  parentIds: string[];
  status: AccountStatus;
  onboarded: boolean;
  createdAt: string;
}

export interface ParentRecord {
  id: string;
  schoolId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  profession?: string;
  avatar?: string;
  status: AccountStatus;
  onboarded: boolean;
  createdAt: string;
}

export interface InviteRecord {
  id: string;
  token: string;
  role: 'teacher' | 'student' | 'parent';
  email: string;
  /** The pre-created account record this invite activates. */
  userId: string;
  schoolId?: string;
  classId?: string;
  invitedBy: Session;
  status: 'pending' | 'accepted' | 'revoked';
  createdAt: string;
  acceptedAt?: string;
}

export interface ActivityEntry {
  id: string;
  studentId: string;
  type: 'joined' | 'class' | 'onboarding' | 'parent' | 'note';
  title: string;
  /** For 'note' entries: who wrote it and what they wrote. */
  author?: string;
  authorRole?: string;
  text?: string;
  createdAt: string;
}

export interface InboxNotification {
  id: string;
  recipientRole: PortalRole;
  recipientId: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
