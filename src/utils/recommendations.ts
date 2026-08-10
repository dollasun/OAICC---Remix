import { careersStorage } from './storage';
import { INITIAL_QUESTIONS as coreAssessmentQuestions } from '../data/assessmentQuestions';

export interface ScoredCareer {
  id: number;
  title: string;
  category: string;
  description: string;
  salary: string;
  growth: string;
  education?: string;
  image: string;
  matchScore: number;
  match: string;
}

export function getTopRecommendedCareers(topN = 10): ScoredCareer[] {
  // 1. Get student assessment answers
  const savedAnswersStr = localStorage.getItem('studentAssessmentAnswers');
  const answers: Record<string, number> = savedAnswersStr ? JSON.parse(savedAnswersStr) : {};

  // 2. Compute points for each cluster
  const clusterPoints: Record<string, number> = {};
  const clusterMaxPoints: Record<string, number> = {};

  coreAssessmentQuestions.forEach(q => {
    const primary = q.primaryCluster;
    const secondary = q.secondaryCluster;
    const score = answers[q.id] || 0;

    if (primary) {
      clusterPoints[primary] = (clusterPoints[primary] || 0) + (score * 2);
      clusterMaxPoints[primary] = (clusterMaxPoints[primary] || 0) + (5 * 2);
    }
    if (secondary) {
      clusterPoints[secondary] = (clusterPoints[secondary] || 0) + (score * 1);
      clusterMaxPoints[secondary] = (clusterMaxPoints[secondary] || 0) + (5 * 1);
    }
  });

  // 3. Load careers from storage or glossary
  const storedCareers = careersStorage.get([]);
  let catalog: any[] = [];

  if (Array.isArray(storedCareers) && storedCareers.length > 0) {
    catalog = storedCareers.map((c: any) => ({
      id: c.id,
      title: c.title || c.name,
      category: c.category || 'Technology',
      description: c.description || `Explore opportunities and responsibilities in ${c.category}.`,
      salary: c.salary || `$${c.salaryMin || '60,000'} - $${c.salaryMax || '120,000'}`,
      growth: c.growth || 'High',
      education: c.education || "Bachelor's Degree",
      image: c.image || `https://picsum.photos/seed/${c.id}/600/400`
    }));
  }

  // Baseline standard careers to ensure rich recommendation options across all major sectors
  const defaultCareersList = [
    { id: 101, title: 'Software Engineering', category: 'Information technology', description: 'Design, develop, and maintain modern software systems and cloud applications.', salary: '$85,000 - $165,000', growth: '25%', image: 'https://picsum.photos/seed/software/600/400' },
    { id: 102, title: 'Medicine & Surgery', category: 'Healthcare', description: 'Diagnose and treat illnesses, perform surgeries, and promote human health and recovery.', salary: '$120,000 - $350,000', growth: '18%', image: 'https://picsum.photos/seed/medicine/600/400' },
    { id: 103, title: 'Data Scientist & AI Analyst', category: 'Information technology', description: 'Analyze complex datasets to build predictive machine learning models and actionable insights.', salary: '$90,000 - $160,000', growth: '31%', image: 'https://picsum.photos/seed/datascience/600/400' },
    { id: 104, title: 'UX / UI Product Design', category: 'Creative arts and design', description: 'Craft user-centered digital interfaces, prototype interactions, and conduct user research.', salary: '$75,000 - $135,000', growth: '22%', image: 'https://picsum.photos/seed/design/600/400' },
    { id: 105, title: 'Chartered Financial Accountant', category: 'Accountancy, banking and finance', description: 'Manage corporate financial reporting, auditing, tax strategy, and investment risk.', salary: '$80,000 - $140,000', growth: '17%', image: 'https://picsum.photos/seed/finance/600/400' },
    { id: 106, title: 'Cybersecurity Analyst', category: 'Information technology', description: 'Protect organizational infrastructure, encryption protocols, and network perimeter security.', salary: '$88,000 - $150,000', growth: '29%', image: 'https://picsum.photos/seed/cyber/600/400' },
    { id: 107, title: 'Biomedical Engineer', category: 'Engineering and manufacturing', description: 'Invent medical instruments, artificial organs, and advanced diagnostic healthcare equipment.', salary: '$82,000 - $142,000', growth: '21%', image: 'https://picsum.photos/seed/biomed/600/400' },
    { id: 108, title: 'Corporate Attorney & Legal Counsel', category: 'Law', description: 'Advise organizations on contracts, legal compliance, corporate governance, and IP.', salary: '$95,000 - $185,000', growth: '14%', image: 'https://picsum.photos/seed/law/600/400' },
    { id: 109, title: 'Sustainable Energy Engineer', category: 'Energy and utilities', description: 'Develop renewable solar, wind, and smart-grid energy systems for a greener future.', salary: '$80,000 - $138,000', growth: '24%', image: 'https://picsum.photos/seed/energy/600/400' },
    { id: 110, title: 'Architecture & Urban Planning', category: 'Property and construction', description: 'Design sustainable buildings, urban infrastructure, and functional living environments.', salary: '$72,000 - $130,000', growth: '16%', image: 'https://picsum.photos/seed/architecture/600/400' },
    { id: 111, title: 'Digital Marketing Strategist', category: 'Marketing, advertising and PR', description: 'Develop data-driven advertising campaigns, brand growth, and digital content reach.', salary: '$65,000 - $120,000', growth: '20%', image: 'https://picsum.photos/seed/marketing/600/400' },
    { id: 112, title: 'Civil & Structural Engineer', category: 'Engineering and manufacturing', description: 'Oversee structural design, bridges, roads, and large-scale public infrastructure projects.', salary: '$78,000 - $135,000', growth: '15%', image: 'https://picsum.photos/seed/civil/600/400' },
    { id: 113, title: 'Clinical Psychologist', category: 'Healthcare', description: 'Provide psychological assessment, mental health therapy, and emotional wellness support.', salary: '$75,000 - $130,000', growth: '23%', image: 'https://picsum.photos/seed/psych/600/400' },
    { id: 114, title: 'Aerospace Engineer', category: 'Engineering and manufacturing', description: 'Design and build aircraft, satellite systems, and space flight propulsion components.', salary: '$98,000 - $175,000', growth: '16%', image: 'https://picsum.photos/seed/aerospace/600/400' },
    { id: 115, title: 'Management Consultant', category: 'Business, consulting and management', description: 'Advise business executives on operational strategy, scaling, and market transformation.', salary: '$88,000 - $160,000', growth: '22%', image: 'https://picsum.photos/seed/consulting/600/400' }
  ];

  defaultCareersList.forEach(def => {
    if (!catalog.some(c => c.id === def.id || (c.title && c.title.toLowerCase() === def.title.toLowerCase()))) {
      catalog.push(def);
    }
  });

  const hasAnswers = Object.keys(answers).length > 0;

  // 4. Compute score for each career
  const scoredCareers: ScoredCareer[] = catalog.map(career => {
    const category = career.category;
    const points = clusterPoints[category] || 0;
    const maxPoints = clusterMaxPoints[category] || 1;

    let matchScore = 0;

    if (hasAnswers && points > 0) {
      const percentage = points / maxPoints;
      matchScore = Math.min(99, Math.max(68, Math.round(65 + (percentage * 34))));
    } else {
      // Deterministic scoring formula for default/unanswered baseline:
      const nameHash = (career.title || '').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), career.id || 0);
      matchScore = 76 + (nameHash % 23); // Produces distinct scores from 76% to 98%
    }

    return {
      ...career,
      matchScore,
      match: `${matchScore}%`
    };
  });

  // 5. Sort by matchScore descending (highest score first)
  scoredCareers.sort((a, b) => b.matchScore - a.matchScore);

  return scoredCareers.slice(0, topN);
}
