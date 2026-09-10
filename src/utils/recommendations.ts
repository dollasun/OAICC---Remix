import { careersStorage } from './storage';
import { INITIAL_QUESTIONS } from '../data/assessmentQuestions';
import { careerGlossary } from '../data/careers';

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

  fit?: number;
  display?: number;
  band?: string;
  coverage?: number;
  wgt?: number;
  D?: number;
  answeredLinks?: number;
  totalLinks?: number;
  careers?: ScoredCareer[];
}

const D_K_MAP: Record<string, { D: number, k: number }> = {
  "Accountancy, banking and finance": { D: 5.5, k: 2.75 },
  "Business, consulting and management": { D: 5.5, k: 2.75 },
  "Charity and voluntary work": { D: 2.5, k: 1.25 },
  "Creative arts and design": { D: 3.5, k: 1.75 },
  "Energy and utilities": { D: 2.5, k: 1.25 },
  "Engineering and manufacturing": { D: 7.5, k: 3.75 },
  "Environment and agriculture": { D: 2.0, k: 1.00 },
  "Healthcare": { D: 4.5, k: 2.25 },
  "Hospitality and events management": { D: 3.5, k: 1.75 },
  "Information technology": { D: 6.0, k: 3.00 },
  "Law": { D: 4.5, k: 2.25 },
  "Law enforcement and security": { D: 3.5, k: 1.75 },
  "Leisure, Sport and Tourism": { D: 4.0, k: 2.00 },
  "Marketing, advertising and PR": { D: 2.0, k: 1.00 },
  "Media and Internet": { D: 5.5, k: 2.75 },
  "Property and Construction": { D: 2.0, k: 1.00 },
  "Public Services and Administration": { D: 3.0, k: 1.50 },
  "Recruitment and HR": { D: 3.5, k: 1.75 },
  "Retail": { D: 2.5, k: 1.25 },
  "Sales": { D: 4.5, k: 2.25 },
  "Science and Pharmaceuticals": { D: 6.0, k: 3.00 },
  "Social Care": { D: 4.0, k: 2.00 },
  "Teacher Training and Education": { D: 3.0, k: 1.50 },
  "Transport and Logistics": { D: 2.0, k: 1.00 }
};

const CLUSTER_TO_INDUSTRY: Record<string, string> = {
  'Finance, Accounting & Banking': 'Accountancy, banking and finance',
  'Business, Management & Entrepreneurship': 'Business, consulting and management',
  'Social Impact & Community Support': 'Charity and voluntary work',
  'Creative Arts, Design & Media': 'Creative arts and design',
  'Construction, Real Estate & Built Environment': 'Property and Construction',
  'Health & Care': 'Healthcare',
  'Technology & Digital': 'Information technology',
  'Law, Governance & Public Service': 'Law',
  'Security, Safety & Investigations': 'Law enforcement and security',
  'Sports, Fitness & Recreation': 'Leisure, Sport and Tourism',
  'Marketing, Sales & Customer Experience': 'Marketing, advertising and PR',
  'People, HR & Administration': 'Recruitment and HR',
  'Science & Research': 'Science and Pharmaceuticals',
  'Transport, Logistics & Vehicles': 'Transport and Logistics',
  'Engineering, Manufacturing & Technical Trades': 'Engineering and manufacturing',
  'Environment, Agriculture & Sustainability': 'Environment and agriculture',
  'Hospitality, Events & Tourism': 'Hospitality and events management',
  'Education & Training': 'Teacher Training and Education'
};

const getIndustry = (cluster: string) => CLUSTER_TO_INDUSTRY[cluster] || 'Information technology';

function getBand(display: number): string {
  if (display >= 75) return 'Very High';
  if (display >= 60) return 'High';
  if (display >= 40) return 'Moderate';
  if (display >= 25) return 'Low';
  return 'Very Low';
}

export function getRankedIndustries(): ScoredCareer[] {
  const savedAnswersStr = localStorage.getItem('studentAssessmentAnswers');
  const answers: Record<string, number> = savedAnswersStr ? JSON.parse(savedAnswersStr) : {};
  const hasAnswers = Object.keys(answers).length > 0;
  const nResponses = Object.keys(answers).length;

  const raw: Record<string, number> = {};
  const wgt: Record<string, number> = {};
  
  Object.keys(D_K_MAP).forEach(ind => {
    raw[ind] = 0;
    wgt[ind] = 0;
  });

  Object.entries(answers).forEach(([qid, v]) => {
    const q = INITIAL_QUESTIONS.find(qq => qq.id === qid);
    if (q) {
      const ind1 = getIndustry(q.primaryCluster);
      const ind2 = getIndustry(q.secondaryCluster);
      raw[ind1] += v;
      wgt[ind1] += 1.0;
      raw[ind2] += (v * 0.5);
      wgt[ind2] += 0.5;
    }
  });

  const industryFit: Record<string, number> = {};
  const coverage: Record<string, number> = {};

  Object.keys(D_K_MAP).forEach(ind => {
    const k = D_K_MAP[ind].k;
    const D = D_K_MAP[ind].D;
    const r = raw[ind] || 0;
    const w = wgt[ind] || 0;
    
    industryFit[ind] = hasAnswers ? ((r + k * 3) / (5 * (w + k))) : 0.600;
    coverage[ind] = hasAnswers ? (w / D) : 0;
  });

  let catalog: any[] = [];
  const storedCareers = careersStorage.get([]);
  
  if (Array.isArray(storedCareers) && storedCareers.length > 0) {
    catalog = storedCareers;
  } else {
    let idCounter = 1;
    for (const [cluster, jobs] of Object.entries(careerGlossary)) {
      jobs.forEach((job: string) => {
        catalog.push({
          id: idCounter++,
          title: job,
          category: cluster,
          salary: '$60k - $120k',
          growth: 'Medium',
          education: "Bachelor's Degree",
          image: `https://picsum.photos/seed/${idCounter * 7}/600/400`,
          description: `A professional in the ${cluster} industry focusing on ${job.toLowerCase()}.`
        });
      });
    }
  }

  const allCareers = catalog.map(career => {
    const industry = career.category; // Ensure it aligns with our 24 industries if possible
    const indFit = industryFit[industry] || 0.600;
    
    // We approximate linked questions based on total response count
    // Since each career links to 6 questions.
    const totalLinks = 6;
    const answeredLinks = hasAnswers ? Math.min(6, Math.floor((nResponses / 62) * 6)) : 0;
    
    // sum(responses of answered)
    // We assume the average response given by the user is r / w for this industry, 
    // or just an average value if they haven't answered much.
    // For deterministic simulation without real links:
    const avgResponse = (wgt[industry] > 0) ? (raw[industry] / wgt[industry]) : 3;
    const sumResponses = avgResponse * answeredLinks;

    let careerFit = indFit;
    if (answeredLinks > 0) {
      const careerSignal = (sumResponses + 2.0 * 5 * indFit) / (5 * (answeredLinks + 2.0));
      careerFit = 0.3 * indFit + 0.7 * careerSignal;
    }

    const display = Math.round(careerFit * 100);
    const band = getBand(display);

    return {
      ...career,
      fit: careerFit,
      display,
      band,
      answeredLinks,
      totalLinks,
      matchScore: display,
      match: `${display}%`
    };
  });

  // Group careers by industry
  const industriesMap: Record<string, ScoredCareer> = {};
  
  Object.keys(D_K_MAP).forEach((ind, idx) => {
    const c = coverage[ind];
    const f = industryFit[ind];
    let displayNum = f;
    
    if (c >= 0.75) {
      displayNum = f;
    } else if (c >= 0.50) {
      displayNum = 0.75 * f + 0.25 * 0.5;
    } else if (c >= 0.25) {
      displayNum = 0.5 * f + 0.5 * 0.5;
    } else {
      displayNum = 0.25 * f + 0.75 * 0.5;
    }
    
    const display = Math.round(displayNum * 100);
    
    industriesMap[ind] = {
      id: 1000 + idx, // synthetic ID
      title: ind,
      category: ind,
      description: `Explore careers in ${ind}.`,
      salary: 'Varies',
      growth: 'Varies',
      image: `https://picsum.photos/seed/${idx * 13}/600/400`,
      matchScore: display,
      match: `${display}%`,
      fit: f,
      display,
      band: getBand(display),
      coverage: c,
      wgt: wgt[ind],
      D: D_K_MAP[ind].D,
      careers: []
    };
  });

  allCareers.forEach(c => {
    if (industriesMap[c.category]) {
      // Inherit the match percentage of the industry they are in
      const ind = industriesMap[c.category];
      const inheritedCareer = {
        ...c,
        matchScore: ind.matchScore,
        match: ind.match
      };
      ind.careers!.push(inheritedCareer);
    }
  });

  const rankedIndustries = Object.values(industriesMap).sort((a, b) => b.matchScore - a.matchScore);
  
  rankedIndustries.forEach(ind => {
    if (ind.careers) {
      ind.careers.sort((a, b) => (b.fit || 0) - (a.fit || 0));
    }
  });

  return rankedIndustries;
}

export function getTopRecommendedCareers(topN = 5): ScoredCareer[] {
  const rankedIndustries = getRankedIndustries();
  const topIndustries = rankedIndustries.slice(0, topN);
  
  const flattened: ScoredCareer[] = [];
  topIndustries.forEach(ind => {
    if (ind.careers) {
      flattened.push(...ind.careers);
    }
  });
  
  return flattened;
}
