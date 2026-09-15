const fs = require('fs');

let code = fs.readFileSync('src/components/Dashboard/Admin/Careers.tsx', 'utf8');

const sampleCareers = `const initialCareers = [
  { 
    id: 1, 
    name: 'Software Engineering', 
    category: 'Technology', 
    mentors: 5, 
    date: '2026-07-10', 
    videos: 3, 
    articles: 2, 
    resources: 4,
    image: 'https://picsum.photos/seed/se/100/100',
    skills: ['Problem-solving', 'Programming', 'System Design', 'Algorithms', 'Teamwork', 'Cloud Computing'],
    description: 'Design, develop, and maintain software systems and applications.'
  },
  { 
    id: 2, 
    name: 'Data Scientist', 
    category: 'Technology', 
    mentors: 3, 
    date: '2026-07-11', 
    videos: 4, 
    articles: 5, 
    resources: 2,
    image: 'https://picsum.photos/seed/ds/100/100',
    skills: ['Statistical Analysis', 'Machine Learning', 'Python', 'Data Visualization', 'SQL'],
    description: 'Analyze complex data sets to help organizations make decisions.'
  },
  { 
    id: 3, 
    name: 'Medical Doctor', 
    category: 'Healthcare', 
    mentors: 12, 
    date: '2026-07-12', 
    videos: 5, 
    articles: 8, 
    resources: 10,
    image: 'https://picsum.photos/seed/md/100/100',
    skills: ['Clinical Knowledge', 'Empathy', 'Decision Making', 'Patient Care', 'Anatomy'],
    description: 'Diagnose and treat illnesses and injuries in patients.'
  },
  { 
    id: 4, 
    name: 'UX/UI Designer', 
    category: 'Design', 
    mentors: 4, 
    date: '2026-07-13', 
    videos: 6, 
    articles: 3, 
    resources: 5,
    image: 'https://picsum.photos/seed/ux/100/100',
    skills: ['Wireframing', 'Prototyping', 'User Research', 'Visual Design', 'Figma'],
    description: 'Create intuitive and visually appealing digital experiences.'
  },
  { 
    id: 5, 
    name: 'Mechanical Engineer', 
    category: 'Engineering', 
    mentors: 7, 
    date: '2026-07-14', 
    videos: 2, 
    articles: 4, 
    resources: 3,
    image: 'https://picsum.photos/seed/me/100/100',
    skills: ['CAD Software', 'Thermodynamics', 'Materials Science', 'Project Management'],
    description: 'Design and manufacture mechanical systems and devices.'
  },
  { 
    id: 6, 
    name: 'Financial Analyst', 
    category: 'Finance', 
    mentors: 6, 
    date: '2026-07-15', 
    videos: 1, 
    articles: 6, 
    resources: 4,
    image: 'https://picsum.photos/seed/fa/100/100',
    skills: ['Financial Modeling', 'Excel', 'Data Analysis', 'Risk Management', 'Accounting'],
    description: 'Guide businesses in making investment decisions.'
  },
  { 
    id: 7, 
    name: 'Digital Marketer', 
    category: 'Marketing', 
    mentors: 2, 
    date: '2026-07-16', 
    videos: 8, 
    articles: 5, 
    resources: 6,
    image: 'https://picsum.photos/seed/dm/100/100',
    skills: ['SEO', 'Content Strategy', 'Social Media Management', 'Analytics', 'Copywriting'],
    description: 'Develop and manage digital marketing campaigns.'
  },
  { 
    id: 8, 
    name: 'Registered Nurse', 
    category: 'Healthcare', 
    mentors: 15, 
    date: '2026-07-17', 
    videos: 7, 
    articles: 9, 
    resources: 12,
    image: 'https://picsum.photos/seed/rn/100/100',
    skills: ['Patient Monitoring', 'Medical Terminology', 'Compassion', 'Triage'],
    description: 'Provide and coordinate patient care and educate patients.'
  },
  { 
    id: 9, 
    name: 'Architect', 
    category: 'Architecture', 
    mentors: 4, 
    date: '2026-07-18', 
    videos: 3, 
    articles: 2, 
    resources: 7,
    image: 'https://picsum.photos/seed/arc/100/100',
    skills: ['Architectural Design', 'AutoCAD', 'Building Codes', 'Spatial Awareness'],
    description: 'Design new buildings and the spaces around them.'
  },
  { 
    id: 10, 
    name: 'Lawyer', 
    category: 'Legal', 
    mentors: 8, 
    date: '2026-07-19', 
    videos: 5, 
    articles: 6, 
    resources: 8,
    image: 'https://picsum.photos/seed/law/100/100',
    skills: ['Legal Research', 'Litigation', 'Contract Drafting', 'Negotiation', 'Public Speaking'],
    description: 'Advise and represent clients in legal matters.'
  }
];`;

const startIndex = code.indexOf('const initialCareers = [');
const endIndex = code.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + sampleCareers + code.substring(endIndex);
  fs.writeFileSync('src/components/Dashboard/Admin/Careers.tsx', code);
  console.log("Updated Careers.tsx");
} else {
  console.log("Failed to find initialCareers");
}
