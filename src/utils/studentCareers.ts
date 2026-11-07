/**
 * A student's career interests as other people (their school, teacher or parent) see them: the top
 * recommendations and saved favourites recorded on that student's own progress, enriched with the
 * career library's details. This deliberately does not read the browser's live quiz answers, which
 * belong to whoever is signed in rather than to the student being viewed.
 */
import { careersStorage } from './storage';
import { progressStore } from './schoolData';

export interface CareerInterest {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Match with the student's assessment; absent for a saved career outside their top matches. */
  matchScore?: number;
  isFavorited: boolean;
  salary: string;
  growth: string;
  education: string;
  image: string;
}

interface LibraryCareer {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  salary?: string;
  growth?: string;
  education?: string;
  image?: string;
}

export function careerInterestsFor(studentId?: string): CareerInterest[] {
  const progress = studentId ? progressStore.get(studentId) : undefined;
  if (!progress) return [];

  const library = (careersStorage.get([]) as LibraryCareer[]) ?? [];
  const byTitle = new Map(library.map(c => [String(c.title ?? c.name ?? '').toLowerCase(), c]));
  const favourites = new Set(progress.favourites.map(f => f.title.toLowerCase()));

  const enrich = (title: string, category: string, matchScore?: number): CareerInterest => {
    const c = byTitle.get(title.toLowerCase());
    return {
      id: `${studentId}-${title}`,
      title,
      category,
      description: c?.description || `A career in ${category.toLowerCase()} focused on the work of a ${title.toLowerCase()}.`,
      matchScore,
      isFavorited: favourites.has(title.toLowerCase()),
      salary: c?.salary || 'Varies by employer',
      growth: c?.growth || 'Medium',
      education: c?.education || "Bachelor's Degree",
      image: c?.image || `https://picsum.photos/seed/${encodeURIComponent(title)}/600/400`,
    };
  };

  const recommended = progress.recommended.map(r => enrich(r.title, r.category, r.match));
  const recommendedTitles = new Set(recommended.map(r => r.title.toLowerCase()));
  const savedOnly = progress.favourites
    .filter(f => !recommendedTitles.has(f.title.toLowerCase()))
    .map(f => enrich(f.title, f.category));
  return [...recommended, ...savedOnly];
}

/** Assessment completion for the same student, for "x of y questions answered" summaries. */
export function assessmentProgressFor(studentId?: string) {
  const p = studentId ? progressStore.get(studentId) : undefined;
  return p ? { answered: p.assessmentAnswered, total: p.assessmentTotal } : { answered: 0, total: 0 };
}
