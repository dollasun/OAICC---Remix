/**
 * Who is signed in to the School, Teacher or Parent portal, as a person other features can use
 * (messaging, events). Returns null when nobody of that role is signed in.
 */
import { schoolStorage } from './storage';
import { fullName, parentsStore, sessionStore, studentsStore, teachersStore } from './schoolData';

export type PortalUserRole = 'school' | 'teacher' | 'parent';

export interface PortalIdentity {
  role: PortalUserRole;
  id: string;
  name: string;
  schoolId?: string;
}

export function currentIdentity(role: PortalUserRole): PortalIdentity | null {
  const session = sessionStore.get();
  if (!session || session.role !== role) return null;

  if (role === 'school') {
    const school = schoolStorage.get();
    return school && school.id === session.userId ? { role, id: school.id, name: school.name, schoolId: school.id } : null;
  }
  if (role === 'teacher') {
    const t = teachersStore.get(session.userId);
    return t ? { role, id: t.id, name: fullName(t) || t.email, schoolId: t.schoolId } : null;
  }
  const p = parentsStore.get(session.userId);
  if (!p) return null;
  // A parent belongs to the school they were invited by, or else their children's school.
  const childSchool = studentsStore.all().find(s => s.parentIds.includes(p.id) && s.schoolId)?.schoolId;
  return { role, id: p.id, name: fullName(p) || p.email, schoolId: p.schoolId ?? childSchool };
}
