import { Activity as ActivityIcon, CheckCircle2, GraduationCap, Users, type LucideIcon } from 'lucide-react';
import { activity } from '../../utils/schoolData';

export interface TrackerEntry {
  id: string;
  type: string;
  title: string;
  status: string;
  date: string;
  icon: LucideIcon;
  color: string;
  details: string;
}

const STYLE: Record<string, { icon: LucideIcon; color: string }> = {
  joined: { icon: CheckCircle2, color: 'bg-emerald-500' },
  class: { icon: GraduationCap, color: 'bg-brand' },
  onboarding: { icon: ActivityIcon, color: 'bg-indigo-500' },
  parent: { icon: Users, color: 'bg-orange-500' },
  note: { icon: Users, color: 'bg-blue-500' },
};

/** Real, logged activity for a student, shaped for the existing timeline UI. */
export function trackerEntries(studentId?: string): TrackerEntry[] {
  if (!studentId) return [];
  return activity.forStudent(studentId).map(a => ({
    id: a.id,
    type: a.type,
    title: a.title,
    status: 'Completed',
    date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    icon: STYLE[a.type]?.icon ?? ActivityIcon,
    color: STYLE[a.type]?.color ?? 'bg-slate-400',
    details: a.text ?? a.title,
  }));
}
