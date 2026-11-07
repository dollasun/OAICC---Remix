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
  /** Missing means active. */
  status?: AccountStatus;
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
/** invited = hasn't accepted yet; inactive = switched off by a platform admin (can't sign in). */
export type AccountStatus = 'invited' | 'active' | 'inactive';

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
  /** Last time this student signed in. */
  lastLoginAt?: string;
  avatar?: string;
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

/** A snapshot of one student's career-discovery progress, kept per student for school reports. */
export interface StudentProgress {
  studentId: string;
  updatedAt: string;
  assessmentAnswered: number;
  assessmentTotal: number;
  recommended: { title: string; category: string; match: number }[];
  favourites: { title: string; category: string }[];
}

export interface MentorSession {
  id: string;
  studentId: string;
  mentorId: number | string;
  mentorName: string;
  status: 'Requested' | 'Completed';
  createdAt: string;
}
