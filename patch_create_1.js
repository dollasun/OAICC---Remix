const fs = require('fs');
const file = 'src/components/Dashboard/Admin/CreateCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update formData
code = code.replace(
  `    skills: ['Software testing and quality assurance', 'Problem-solving skills'],\n    subjects: ['Computer Science', 'Mathematics'],`,
  `    skills: ['Software testing and quality assurance', 'Problem-solving skills'],\n    duties: ['Design, build, and deploy scalable software and cloud system architectures.'],\n    subjects: ['Computer Science', 'Mathematics'],\n    careerPaths: [\n      { tag: 'Education', duration: '1-4 years', title: 'Foundation & Preparation', description: 'Build strong foundational knowledge.', milestones: ['Complete relevant high school courses'] }\n    ],`
);

// Add state for new inputs
code = code.replace(
  `  const [bgImage, setBgImage] = useState<string | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);`,
  `  const [bgImage, setBgImage] = useState<string | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);\n\n  const [newSkill, setNewSkill] = useState('');\n  const [newDuty, setNewDuty] = useState('');\n  const [newSubject, setNewSubject] = useState('');\n  const [newMilestones, setNewMilestones] = useState<{ [key: number]: string }>({});`
);

fs.writeFileSync(file, code);
