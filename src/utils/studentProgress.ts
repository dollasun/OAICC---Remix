import { INITIAL_QUESTIONS } from '../data/assessmentQuestions';
import { getTopRecommendedCareers } from './recommendations';
import { careersStorage, savedCareersStorage } from './storage';
import { progressStore, sessionStore } from './schoolData';

/**
 * The student portal keeps quiz answers and saved careers in shared browser storage. This copies
 * the signed-in student's current state onto their own record so a school can report on it later.
 */
export function snapshotStudentProgress(studentId: string) {
  let answers: Record<string, number> = {};
  try { answers = JSON.parse(localStorage.getItem('studentAssessmentAnswers') || '{}'); } catch { /* ignore */ }
  const answered = Object.keys(answers).length;

  const recommended = answered > 0
    ? getTopRecommendedCareers(5)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5)
        .map(c => ({ title: c.title, category: c.category, match: Math.round(c.matchScore) }))
    : [];

  const catalog = careersStorage.get([]) as { id: number; title: string; category?: string }[];
  const favourites = (savedCareersStorage.get([]) as (number | { id: number; title?: string; category?: string })[])
    .map(entry => {
      const id = typeof entry === 'number' ? entry : entry.id;
      const found = catalog.find(c => c.id === id);
      const title = found?.title ?? (typeof entry === 'object' ? entry.title : undefined);
      return title ? { title, category: found?.category ?? (typeof entry === 'object' ? entry.category : '') ?? '' } : null;
    })
    .filter((f): f is { title: string; category: string } => f !== null);

  progressStore.save({
    studentId, updatedAt: new Date().toISOString(), assessmentAnswered: answered,
    assessmentTotal: INITIAL_QUESTIONS.length, recommended, favourites,
  });
}

/** Snapshot for whoever is signed in as a student (no-op otherwise). */
export function snapshotCurrentStudent() {
  const s = sessionStore.get();
  if (s?.role === 'student') snapshotStudentProgress(s.userId);
}
