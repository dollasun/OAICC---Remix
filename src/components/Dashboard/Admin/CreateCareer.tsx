import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  Plus, 
  X, 
  Upload, 
  Video, 
  FileText, 
  Link as LinkIcon,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careersStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import RichTextEditor from '../../Common/RichTextEditor';
import AdminArticleViewModal from './AdminArticleViewModal';
import { getArticleReaction } from '../../../utils/articleReactions';

export default function AdminCreateCareer() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'basic' | 'resources'>('basic');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [viewingArticle, setViewingArticle] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMilestones, setNewMilestones] = useState<{ [key: number]: string }>({});

  const [formData, setFormData] = useState({
    step: '',
    category: 'Science',
    about: '',
    skills: ['Software testing and quality assurance', 'Problem-solving skills'],
    responsibilities: [
      'Design, build, and deploy scalable software and cloud system architectures.',
      'Conduct code reviews, automated testing, and continuous integration workflows.'
    ],
    subjects: ['Computer Science', 'Mathematics'],
    pathway: [
      {
        type: 'education',
        duration: '1-4 years',
        step: 'Foundation & Preparation',
        description: 'Build strong foundational knowledge in STEM, business, or humanities electives.',
        milestones: ['Complete relevant high school courses', 'Participate in extracurricular clubs']
      }
    ],
    salaries: [
      { country: 'United States', currency: '$', min: '100,000', max: '500,000' }
    ]
  });

  const countries = [
    { name: 'United States', currency: '$' },
    { name: 'Nigeria', currency: '₦' },
    { name: 'United Kingdom', currency: '£' },
    { name: 'European Union', currency: '€' },
    { name: 'Ghana', currency: 'GH₵' },
    { name: 'Kenya', currency: 'KSh' },
    { name: 'South Africa', currency: 'R' }
  ];


  const handleAddArrayItem = (field: 'skills' | 'responsibilities' | 'subjects', value: string, setter: (val: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim()) && formData[field].length < 10) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter('');
    }
  };

  const handleRemoveArrayItem = (field: 'skills' | 'responsibilities' | 'subjects', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleAddCareerPath = () => {
    setFormData({
      ...formData,
      pathway: [
        ...formData.pathway,
        { type: 'education', duration: '', step: '', description: '', milestones: [] }
      ]
    });
  };

  const handleRemoveCareerPath = (index: number) => {
    setFormData({
      ...formData,
      pathway: formData.pathway.filter((_, i) => i !== index)
    });
  };

  const handleUpdateCareerPath = (index: number, field: string, value: string) => {
    const newPaths = [...formData.pathway];
    newPaths[index] = { ...newPaths[index], [field]: value };
    setFormData({ ...formData, pathway: newPaths });
  };

  const handleAddMilestone = (pathIndex: number) => {
    const milestone = newMilestones[pathIndex];
    if (milestone && milestone.trim()) {
      const newPaths = [...formData.pathway];
      newPaths[pathIndex].milestones.push(milestone.trim());
      setFormData({ ...formData, pathway: newPaths });
      setNewMilestones({ ...newMilestones, [pathIndex]: '' });
    }
  };

  const handleRemoveMilestone = (pathIndex: number, milestoneIndex: number) => {
    const newPaths = [...formData.pathway];
    newPaths[pathIndex].milestones = newPaths[pathIndex].milestones.filter((_, i) => i !== milestoneIndex);
    setFormData({ ...formData, pathway: newPaths });
  };

  const handleAddSalary = () => {
    setFormData({
      ...formData,
      salaries: [...formData.salaries, { country: 'United States', currency: '$', min: '', max: '' }]
    });
  };

  const handleRemoveSalary = (index: number) => {
    if (formData.salaries.length > 1) {
      setFormData({
        ...formData,
        salaries: formData.salaries.filter((_, i) => i !== index)
      });
    }
  };

  const handleSalaryChange = (index: number, field: string, value: string) => {
    const newSalaries = [...formData.salaries];
    if (field === 'country') {
      const country = countries.find(c => c.name === value);
      newSalaries[index] = { ...newSalaries[index], country: value, currency: country?.currency || '$' };
    } else if (field === 'min' || field === 'max') {
      // Remove everything except digits
      const digits = value.replace(/\D/g, '');
      // Format with commas
      const formattedValue = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      newSalaries[index] = { ...newSalaries[index], [field]: formattedValue };
    } else {
      newSalaries[index] = { ...newSalaries[index], [field]: value };
    }
    setFormData({ ...formData, salaries: newSalaries });
  };

  const [resources, setResources] = useState({
    videos: [
      { id: 'v1', title: 'Tech design requirements', ownedBy: 'James Brown', thumbnail: 'https://picsum.photos/seed/v1/400/200', url: 'https://youtube.com/watch?v=1' },
      { id: 'v2', title: 'Tech design requirements', ownedBy: 'James Brown', thumbnail: 'https://picsum.photos/seed/v2/400/200', url: 'https://youtube.com/watch?v=2' },
      { id: 'v3', title: 'Tech design requirements', ownedBy: 'James Brown', thumbnail: 'https://picsum.photos/seed/v3/400/200', url: 'https://youtube.com/watch?v=3' }
    ],
    articles: [
      { id: 'a1', title: 'Tech design requirements', author: 'James Brown', thumbnail: 'https://picsum.photos/seed/a1/400/200', about: 'Detailed summary about this article...', readTimeMinutes: 5, readTime: '5 mins read' },
      { id: 'a2', title: 'Tech design requirements', author: 'James Brown', thumbnail: 'https://picsum.photos/seed/a2/400/200', about: 'Detailed summary about this article...', readTimeMinutes: 8, readTime: '8 mins read' },
      { id: 'a3', title: 'Tech design requirements', author: 'James Brown', thumbnail: 'https://picsum.photos/seed/a3/400/200', about: 'Detailed summary about this article...', readTimeMinutes: 12, readTime: '12 mins read' }
    ],
    links: [
      { id: 'l1', title: 'Tech design requirements', url: 'www.weblink.com', thumbnail: 'https://picsum.photos/seed/l1/400/200', type: 'Opportunity', from: 'Coursera' },
      { id: 'l2', title: 'Tech design requirements', url: 'www.weblink.com', thumbnail: 'https://picsum.photos/seed/l2/400/200', type: 'Opportunity', from: 'Coursera' },
      { id: 'l3', title: 'Tech design requirements', url: 'www.weblink.com', thumbnail: 'https://picsum.photos/seed/l3/400/200', type: 'Opportunity', from: 'Coursera' }
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'video' | 'article' | 'resource' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalData, setModalData] = useState<any>({});
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = (type: 'video' | 'article' | 'resource', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setModalData(item ? {
      ...item,
      readTimeMinutes: item.readTimeMinutes || (item.readTime ? parseInt(item.readTime) : 5),
      readTime: item.readTime || `${item.readTimeMinutes || 5} mins read`
    } : {
      step: '',
      url: '',
      ownedBy: '',
      author: '',
      about: '',
      readTimeMinutes: 5,
      readTime: '5 mins read',
      type: 'Opportunity',
      from: '',
      thumbnail: null
    });
    setIsModalOpen(true);
  };

  const handleSaveResource = () => {
    const typeKey = modalType === 'video' ? 'videos' : modalType === 'article' ? 'articles' : 'links';
    
    let processedData = { ...modalData };
    if (modalType === 'article') {
      const minutes = modalData.readTimeMinutes ? Number(modalData.readTimeMinutes) : 5;
      processedData = {
        ...processedData,
        readTimeMinutes: minutes,
        readTime: modalData.readTime || `${minutes} mins read`
      };
    }

    const newResource = {
      ...processedData,
      id: editingItem ? editingItem.id : `${modalType}-${Date.now()}`,
      thumbnail: modalData.thumbnail || `https://picsum.photos/seed/${Date.now()}/400/200`
    };

    if (editingItem) {
      setResources({
        ...resources,
        [typeKey]: resources[typeKey].map(r => r.id === editingItem.id ? newResource : r)
      });
    } else {
      setResources({
        ...resources,
        [typeKey]: [...resources[typeKey], newResource]
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteResource = (type: 'videos' | 'articles' | 'links', id: string) => {
    setResources({
      ...resources,
      [type]: resources[type].filter(r => r.id !== id)
    });
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!formData.title) {
      alert('Please enter a career title');
      return;
    }

    const currentCareers = careersStorage.get([]);
    const newCareer = {
      id: Date.now(),
      name: formData.title,
      category: formData.category,
      mentors: 0,
      date: new Date().toLocaleString(),
      videos: resources.videos.length,
      articles: resources.articles.length,
      resources: resources.links.length,
      articleItems: resources.articles,
      articlesList: resources.articles,
      image: bgImage || 'https://picsum.photos/seed/new/100/100',
      description: formData.about,
      salaries: formData.salaries,
      skills: formData.skills,
      responsibilities: formData.responsibilities,
      subjects: formData.subjects,
      pathway: formData.pathway,
      salaryMin: formData.salaries[0]?.min || '100,000',
      salaryMax: formData.salaries[0]?.max || '500,000'
    };

    careersStorage.save([...currentCareers, newCareer]);
    showToast('Career path created successfully!');
    navigate('/admin/careers');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      <button 
        onClick={() => navigate('/admin/careers')}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Create a New Career</h1>
        <p className="text-slate-500 font-medium mt-1">Fill in the details to add a new career path to the library.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm mb-10 w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('basic')}
          className={`px-12 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'basic' ? 'bg-brand text-white shadow-sm shadow-brand/5' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Basic Info
        </button>
        <button 
          onClick={() => setActiveTab('resources')}
          className={`px-12 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'resources' ? 'bg-brand text-white shadow-sm shadow-brand/5' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Add Resources
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'basic' ? (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            {/* Background Image Upload */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Background Image</h3>
              <div 
                onClick={handleImageClick}
                className="relative h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand/50 hover:bg-slate-100/50 transition-all group overflow-hidden"
              >
                {bgImage ? (
                  <>
                    <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <Camera className="w-8 h-8 text-brand" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-sm font-medium mt-1">PNG, JPG or GIF (max. 10MB)</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Basic Details */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-slate-900">Career details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Career Title</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Software Engineering"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Career Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Technology">Technology</option>
                    <option value="Creative">Creative</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">About</label>
                <textarea 
                  rows={6}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Write a detailed summary about this career so the student would be able to understand what the career is about..."
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none"
                />
              </div>

              
              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 ml-1">Top Skills</label>
                    <p className="text-xs text-slate-500 ml-1">Add up to 10 skills</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-100">
                      {skill} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem('skills', i)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Project Management"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('skills', newSkill, setNewSkill);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAddArrayItem('skills', newSkill, setNewSkill)}
                    className="px-6 py-3 bg-brand text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/90 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
              </div>

              {/* Duties */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 ml-1">Key Duties & Responsibilities</label>
                    <p className="text-xs text-slate-500 ml-1">Add key responsibilities for this career</p>
                  </div>
                </div>
                <div className="space-y-2 mb-2">
                  {formData.responsibilities.map((duty, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl flex items-start justify-between gap-4 border border-slate-100">
                      <p className="text-sm font-medium text-slate-700">{duty}</p>
                      <button onClick={() => handleRemoveArrayItem('responsibilities', i)} className="text-slate-400 hover:text-red-500 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="e.g. Design, build, and deploy scalable software..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('responsibilities', newResponsibility, setNewResponsibility);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAddArrayItem('responsibilities', newResponsibility, setNewResponsibility)}
                    className="px-6 py-3 bg-brand text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/90 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Duty
                  </button>
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 ml-1">Top Subject Required</label>
                    <p className="text-xs text-slate-500 ml-1">Add up to 10 subjects</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.subjects.map((subject, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-100">
                      {subject} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem('subjects', i)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('subjects', newSubject, setNewSubject);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAddArrayItem('subjects', newSubject, setNewSubject)}
                    className="px-6 py-3 bg-brand text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/90 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>
              </div>

              {/* Career Path Section */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Career Path Configuration</h3>
                    <p className="text-xs text-slate-500">Add stages to the career path timeline</p>
                  </div>
                  <button 
                    onClick={handleAddCareerPath}
                    className="flex items-center gap-2 text-brand font-bold hover:bg-brand/5 px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" /> Add Stage
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.pathway.map((path, index) => (
                    <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                      <button 
                        onClick={() => handleRemoveCareerPath(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Tag</label>
                          <select 
                            value={path.type}
                            onChange={(e) => handleUpdateCareerPath(index, 'type', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                          >
                            <option value="education">Education</option>
                            <option value="professional">Professional</option>
                            <option value="vocation">Vocation</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Duration (e.g. 1-4 years)</label>
                          <input 
                            type="text" 
                            value={path.duration}
                            onChange={(e) => handleUpdateCareerPath(index, 'duration', e.target.value)}
                            placeholder="e.g. 1-4 years"
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Stage Title</label>
                          <input 
                            type="text" 
                            value={path.step}
                            onChange={(e) => handleUpdateCareerPath(index, 'step', e.target.value)}
                            placeholder="e.g. Foundation & Preparation"
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Stage Description</label>
                          <textarea 
                            value={path.description}
                            onChange={(e) => handleUpdateCareerPath(index, 'description', e.target.value)}
                            placeholder="Brief description of this stage..."
                            rows={2}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none" 
                          />
                        </div>
                        
                        {/* Milestones */}
                        <div className="space-y-2 pt-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Key Milestones</label>
                          <div className="space-y-2 mb-2">
                            {path.milestones.map((milestone, mIndex) => (
                              <div key={mIndex} className="p-3 bg-white rounded-xl flex items-center justify-between gap-4 border border-slate-100">
                                <p className="text-sm font-medium text-slate-700">{milestone}</p>
                                <button onClick={() => handleRemoveMilestone(index, mIndex)} className="text-slate-400 hover:text-red-500 shrink-0">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newMilestones[index] || ''}
                              onChange={(e) => setNewMilestones({ ...newMilestones, [index]: e.target.value })}
                              placeholder="e.g. Complete relevant high school courses"
                              className="flex-1 px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddMilestone(index);
                                }
                              }}
                            />
                            <button 
                              onClick={() => handleAddMilestone(index)}
                              className="px-4 py-3 bg-brand/10 text-brand rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/20 transition-all shrink-0"
                            >
                              <Plus className="w-4 h-4" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Average Salary</h3>
                    <p className="text-xs text-slate-500">Add salary estimates across countries</p>
                  </div>
                  <button 
                    onClick={handleAddSalary}
                    className="flex items-center gap-2 text-brand font-bold hover:bg-brand/5 px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" /> Add
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.salaries.map((salary, index) => (
                    <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                      {formData.salaries.length > 1 && (
                        <button 
                          onClick={() => handleRemoveSalary(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
                          <select 
                            value={salary.country}
                            onChange={(e) => handleSalaryChange(index, 'country', e.target.value)}
                            className="w-full px-6 py-4 bg-white border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                          >
                            {countries.map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Minimum ({salary.currency})</label>
                          <input 
                            type="text" 
                            value={salary.min}
                            onChange={(e) => handleSalaryChange(index, 'min', e.target.value)}
                            placeholder="e.g. 100,000"
                            className="w-full px-6 py-4 bg-white border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Maximum ({salary.currency})</label>
                          <input 
                            type="text" 
                            value={salary.max}
                            onChange={(e) => handleSalaryChange(index, 'max', e.target.value)}
                            placeholder="e.g. 500,000"
                            className="w-full px-6 py-4 bg-white border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="flex justify-end gap-4 pt-8">
                <button 
                  onClick={() => navigate('/admin/careers')}
                  className="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="px-10 py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="resources"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Videos Section */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-6 h-6 text-brand" /> Videos
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Videos have to be based on the career you are creating.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal('video')}
                  className="p-3 bg-brand/10 text-brand rounded-xl hover:bg-brand/20 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.videos.map((video) => (
                  <div key={video.id} className="group relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{video.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Owned by - {video.ownedBy}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal('video', video)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteResource('videos', video.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div 
                  onClick={() => handleOpenModal('video')}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Click to upload or drag and drop</p>
                  <p className="text-[10px] font-bold text-brand mt-2">Click to add a URL</p>
                </div>
              </div>
            </div>

            {/* Articles Section */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-500" /> Articles
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Articles have to be based on the career you are creating.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal('article')}
                  className="p-3 bg-indigo-50 text-indigo-500 rounded-xl hover:bg-indigo-100 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.articles.map((article) => {
                  const rx = getArticleReaction(article.id);
                  const readTimeLabel = article.readTime || (article.readTimeMinutes ? `${article.readTimeMinutes} mins read` : '5 mins read');
                  return (
                    <div key={article.id} className="group relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-all flex flex-col justify-between">
                      <div className="relative">
                        <img src={article.thumbnail} alt={article.title} className="w-full h-32 object-cover" />
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand" /> {readTimeLabel}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{article.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Author - {article.author}</p>
                        </div>
                        {/* Student Feedback (Likes & Dislikes) */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/60">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100" title="Student Likes (Thumbs Up)">
                            <ThumbsUp className="w-3 h-3 fill-emerald-500 text-emerald-600" /> {rx.likes}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100" title="Student Dislikes (Thumbs Down)">
                            <ThumbsDown className="w-3 h-3 fill-rose-500 text-rose-600" /> {rx.dislikes}
                          </span>
                          <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {rx.likes + rx.dislikes} votes
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button"
                          onClick={() => setViewingArticle(article)}
                          className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm"
                          title="View Article & Reactions"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleOpenModal('article', article)}
                          className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm"
                          title="Edit Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteResource('articles', article.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors shadow-sm"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div 
                  onClick={() => handleOpenModal('article')}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Click to upload or drag and drop</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">PDF (max. 500x400px)</p>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <LinkIcon className="w-6 h-6 text-emerald-500" /> Resources
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Resources have to be based on the career you are creating.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal('resource')}
                  className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-100 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.links.map((link) => (
                  <div key={link.id} className="group relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <img src={link.thumbnail} alt={link.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{link.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Web Link: {link.url}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal('resource', link)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteResource('links', link.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div 
                  onClick={() => handleOpenModal('resource')}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Add Resources</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 text-center">You haven't added any links yet!</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8">
              <button 
                onClick={() => setActiveTab('basic')}
                className="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleCreate}
                className="px-10 py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-105 transition-all flex items-center gap-2"
              >
                Create Career <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {editingItem ? 'Edit' : 'Add'} {modalType === 'video' ? 'Video URL' : modalType === 'article' ? 'Article' : 'Resources'}
                    </h3>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
                      {modalType === 'article' ? 'Provide article details, rich-text overview, and reading time.' : 'Fill in the details'}
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {modalType === 'resource' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Resource Type</label>
                      <select 
                        value={modalData.type}
                        onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                      >
                        <option value="Opportunity">Opportunity</option>
                        <option value="Course">Course</option>
                        <option value="Tool">Tool</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                    <input 
                      type="text"
                      value={modalData.title}
                      onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                      placeholder="Enter Title"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700"
                    />
                  </div>

                  {modalType === 'video' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Paste Video URL</label>
                      <input 
                        type="text"
                        value={modalData.url}
                        onChange={(e) => setModalData({ ...modalData, url: e.target.value })}
                        placeholder="URL"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700"
                      />
                    </div>
                  )}

                  {/* About Section - Rich Text Input Field for Articles */}
                  {modalType === 'article' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700 ml-1">About</label>
                        <span className="text-xs text-slate-400 font-medium">Rich text formatting</span>
                      </div>
                      <RichTextEditor 
                        value={modalData.about || ''}
                        onChange={(val) => setModalData({ ...modalData, about: val })}
                        placeholder="Write a detailed summary about this article..."
                        minHeight="150px"
                      />
                    </div>
                  )}

                  {modalType === 'resource' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Website Link</label>
                      <input 
                        type="text"
                        value={modalData.url}
                        onChange={(e) => setModalData({ ...modalData, url: e.target.value })}
                        placeholder="Enter Website Link"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Upload a Thumbnail (JPG/GIF/PNG only)</label>
                    <div 
                      onClick={() => modalFileInputRef.current?.click()}
                      className="relative h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand/50 transition-all overflow-hidden group"
                    >
                      {modalData.thumbnail ? (
                        <img src={modalData.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt="Thumbnail" />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-400">Select Thumbnail</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={modalFileInputRef} 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setModalData({ ...modalData, thumbnail: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      {modalType === 'video' ? 'Owned by' : modalType === 'article' ? 'Author' : 'From'}
                    </label>
                    <input 
                      type="text"
                      value={modalData.ownedBy || modalData.author || modalData.from}
                      onChange={(e) => setModalData({ 
                        ...modalData, 
                        [modalType === 'video' ? 'ownedBy' : modalType === 'article' ? 'author' : 'from']: e.target.value 
                      })}
                      placeholder={modalType === 'video' ? 'Enter Owner Name' : modalType === 'article' ? 'Enter Author Name' : 'What Resources is from?'}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700"
                    />
                  </div>

                  {/* Estimated time of read in minutes - Beneath about, after author, the last field */}
                  {modalType === 'article' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-brand" />
                          Time of read (in minutes)
                        </label>
                        <span className="text-xs text-brand font-bold bg-brand/10 px-2 py-0.5 rounded-md">
                          Unit: Minutes
                        </span>
                      </div>
                      <div className="relative">
                        <input 
                          type="number"
                          min="1"
                          max="180"
                          value={modalData.readTimeMinutes ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1);
                            setModalData({ 
                              ...modalData, 
                              readTimeMinutes: val,
                              readTime: val ? `${val} mins read` : ''
                            });
                          }}
                          placeholder="Enter time in minutes (e.g. 5, 10, or 20)"
                          className="w-full pl-5 pr-24 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 text-sm"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-200/70 px-3 py-1.5 rounded-lg pointer-events-none">
                          Minutes
                        </div>
                      </div>

                      {/* Quick Preset Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs text-slate-400 font-medium">Quick select:</span>
                        {[3, 5, 10, 15, 20].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setModalData({
                              ...modalData,
                              readTimeMinutes: mins,
                              readTime: `${mins} mins read`
                            })}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              Number(modalData.readTimeMinutes) === mins
                                ? 'bg-brand text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            {mins} mins
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Input the estimated reading time figure. It will appear on the article as "{modalData.readTimeMinutes || 5} mins read".
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveResource}
                      className="flex-1 py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Article View Modal */}
      <AdminArticleViewModal
        isOpen={!!viewingArticle}
        onClose={() => setViewingArticle(null)}
        article={viewingArticle}
        careerTitle={formData.title}
        careerCategory={formData.category}
        onEdit={(art) => handleOpenModal('article', art)}
      />
    </div>
  );
}
