const fs = require('fs');
const file = 'src/components/Dashboard/Admin/EditCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update state declaration
code = code.replace(
  `  const [bgImage, setBgImage] = useState<string | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);`,
  `  const [bgImage, setBgImage] = useState<string | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);\n\n  const [newSkill, setNewSkill] = useState('');\n  const [newDuty, setNewDuty] = useState('');\n  const [newSubject, setNewSubject] = useState('');\n  const [newMilestones, setNewMilestones] = useState<{ [key: number]: string }>({});`
);

code = code.replace(
  `    skills: [] as string[],\n    subjects: [] as string[],`,
  `    skills: [] as string[],\n    duties: [] as string[],\n    subjects: [] as string[],\n    careerPaths: [] as any[],`
);

// Update useEffect
code = code.replace(
  `        skills: career.skills || ['Software testing and quality assurance', 'Problem-solving skills'],\n        subjects: career.subjects || ['Computer Science', 'Mathematics'],\n        salaries: career.salaries || [`,
  `        skills: career.skills || ['Software testing and quality assurance', 'Problem-solving skills'],\n        duties: career.duties || ['Design, build, and deploy scalable software and cloud system architectures.'],\n        subjects: career.subjects || ['Computer Science', 'Mathematics'],\n        careerPaths: career.careerPaths || [\n          { tag: 'Education', duration: '1-4 years', title: 'Foundation & Preparation', description: 'Build strong foundational knowledge.', milestones: ['Complete relevant high school courses'] }\n        ],\n        salaries: career.salaries || [`
);

// Add handler functions
const handlers = `
  const handleAddArrayItem = (field: 'skills' | 'duties' | 'subjects', value: string, setter: (val: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim()) && formData[field].length < 10) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter('');
    }
  };

  const handleRemoveArrayItem = (field: 'skills' | 'duties' | 'subjects', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleAddCareerPath = () => {
    setFormData({
      ...formData,
      careerPaths: [
        ...formData.careerPaths,
        { tag: 'Education', duration: '', title: '', description: '', milestones: [] }
      ]
    });
  };

  const handleRemoveCareerPath = (index: number) => {
    setFormData({
      ...formData,
      careerPaths: formData.careerPaths.filter((_, i) => i !== index)
    });
  };

  const handleUpdateCareerPath = (index: number, field: string, value: string) => {
    const newPaths = [...formData.careerPaths];
    newPaths[index] = { ...newPaths[index], [field]: value };
    setFormData({ ...formData, careerPaths: newPaths });
  };

  const handleAddMilestone = (pathIndex: number) => {
    const milestone = newMilestones[pathIndex];
    if (milestone && milestone.trim()) {
      const newPaths = [...formData.careerPaths];
      newPaths[pathIndex].milestones.push(milestone.trim());
      setFormData({ ...formData, careerPaths: newPaths });
      setNewMilestones({ ...newMilestones, [pathIndex]: '' });
    }
  };

  const handleRemoveMilestone = (pathIndex: number, milestoneIndex: number) => {
    const newPaths = [...formData.careerPaths];
    newPaths[pathIndex].milestones = newPaths[pathIndex].milestones.filter((_, i) => i !== milestoneIndex);
    setFormData({ ...formData, careerPaths: newPaths });
  };
`;

code = code.replace(
  `  const handleAddSalary = () => {`,
  handlers + `\n  const handleAddSalary = () => {`
);

fs.writeFileSync(file, code);
