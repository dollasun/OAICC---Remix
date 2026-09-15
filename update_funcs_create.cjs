const fs = require('fs');
const file = 'src/components/Dashboard/Admin/CreateCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

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
