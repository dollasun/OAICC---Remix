import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Briefcase,
  Video,
  FileText,
  Link as LinkIcon,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careersStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import BulkActionBar from '../../Common/BulkActionBar';
import BulkDeleteModal from '../../Common/BulkDeleteModal';

const initialCareers = [
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
];

const getSkillsForCareer = (career: any) => {
  if (career.skills && career.skills.length > 0) {
    return career.skills;
  }
  const name = (career.name || career.title || '').toLowerCase();
  if (name.includes('estate') || name.includes('realty')) {
    return ['Communication skills', 'Negotiation', 'Property Valuation', 'Client Relations', 'Sales', 'Marketing', 'Real Estate Law', 'Closing Deals'];
  }
  if (name.includes('medical sales') || name.includes('pharmaceutical sales')) {
    return ['Customer service', 'Medical Knowledge', 'Sales Pitching', 'Product Demos', 'B2B Sales', 'Relationship Building', 'Compliance', 'Market Analysis'];
  }
  if (name.includes('recruitment') || name.includes('hr') || name.includes('talent')) {
    return ['Customer service', 'Candidate Sourcing', 'Interviewing', 'Talent Acquisition', 'Negotiation', 'Client Relationship', 'Business Development'];
  }
  if (name.includes('electrical engineer') || name.includes('electronics')) {
    return ['Analytical skills', 'Electrical Systems', 'Power Distribution', 'Logistics Planning', 'Troubleshooting', 'Project Management', 'CAD Design'];
  }
  if (name.includes('graphic') || name.includes('designer') || name.includes('creative')) {
    return ['Adaptability', 'CAD Software', 'Graphic Design', '3D Modeling', 'Creative Thinking', 'Typography'];
  }
  if (name.includes('software') || name.includes('programmer') || name.includes('developer')) {
    return ['Problem Solving', 'Coding', 'System Design', 'Git', 'Cloud Computing', 'Database Management', 'Testing', 'Agile'];
  }
  if (name.includes('medicine') || name.includes('doctor') || name.includes('surgeon')) {
    return ['Critical Thinking', 'Empathy', 'Dexterity', 'Anatomy', 'Clinical Skills', 'Emergency Care', 'Pharmacology'];
  }
  if (name.includes('engineer')) {
    return ['Problem Solving', 'Analytical skills', 'CAD Design', 'Project Management', 'Mathematics', 'Physics', 'Engineering Design'];
  }
  return ['Professional skills', 'Communication', 'Teamwork', 'Problem Solving'];
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // ignore
  }
  return dateStr;
};

export default function AdminCareers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [careers, setCareers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('All');

  const [selectedCareerIds, setSelectedCareerIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const data = careersStorage.get(initialCareers);
    setCareers(data);
  }, []);

  const filteredCareers = careers.filter(c => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const skills = getSkillsForCareer(c);

    if (searchColumn === 'Career') {
      return c.name.toLowerCase().includes(query);
    }
    if (searchColumn === 'Top Skills') {
      return skills.some(skill => skill.toLowerCase().includes(query));
    }
    if (searchColumn === 'Category') {
      return c.category.toLowerCase().includes(query);
    }
    
    // Default or 'All'
    return c.name.toLowerCase().includes(query) || 
           c.category.toLowerCase().includes(query) ||
           skills.some(skill => skill.toLowerCase().includes(query));
  });

  const isAllSelected = filteredCareers.length > 0 && filteredCareers.every(c => selectedCareerIds.includes(c.id));
  const isIndeterminate = selectedCareerIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCareerIds([]);
    } else {
      setSelectedCareerIds(filteredCareers.map(c => c.id));
    }
  };

  const toggleSelectCareer = (id: number) => {
    setSelectedCareerIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePromptSingleDelete = (career: any) => {
    setItemsToDelete([career]);
    setIsDeleteModalOpen(true);
  };

  const handlePromptBulkDelete = () => {
    const selected = careers.filter(c => selectedCareerIds.includes(c.id));
    setItemsToDelete(selected);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    try {
      const idsToDelete = new Set(itemsToDelete.map(c => c.id));
      const updated = careers.filter(c => !idsToDelete.has(c.id));
      setCareers(updated);
      careersStorage.save(updated);
      setSelectedCareerIds(prev => prev.filter(id => !idsToDelete.has(id)));
      showToast(`Successfully deleted ${itemsToDelete.length} career${itemsToDelete.length === 1 ? '' : 's'}!`);
      setIsDeleteModalOpen(false);
      setItemsToDelete([]);
    } finally {
      setIsDeleting(false);
    }
  };

  const getSearchPlaceholder = () => {
    switch (searchColumn) {
      case 'Career':
        return 'Search by career name...';
      case 'Top Skills':
        return 'Search by top skills...';
      case 'Category':
        return 'Search by category...';
      default:
        return 'Search careers by name, skills or category...';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Career Library</h1>
            {selectedCareerIds.length > 0 && (
              <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-lg">
                {selectedCareerIds.length} selected
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium mt-1">Manage career paths, resources, and educational content.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/careers/create')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Create Career
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Careers', value: careers.length.toString(), icon: Briefcase, color: 'text-brand', bg: 'bg-brand/10' },
          { label: 'Total Videos', value: careers.reduce((acc, c) => acc + (c.videos || 0), 0).toString(), icon: Video, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Total Articles', value: careers.reduce((acc, c) => acc + (c.articles || 0), 0).toString(), icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Total Resources', value: careers.reduce((acc, c) => acc + (c.resources || 0), 0).toString(), icon: LinkIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={getSearchPlaceholder()} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select 
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:ring-4 focus:ring-brand/10 appearance-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Career">Career</option>
            <option value="Top Skills">Top Skills</option>
            <option value="Category">Category</option>
          </select>
        </div>
      </div>

      {/* Careers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all visible careers"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer transition-all accent-brand"
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CAREER</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">TOP SKILLS</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CATEGORY</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">MENTORS</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">DATE CREATED</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCareers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center text-sm font-medium text-slate-400">
                    No careers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCareers.map((career) => {
                  const skillsList = getSkillsForCareer(career);
                  const isSelected = selectedCareerIds.includes(career.id);
                  return (
                    <tr 
                      key={career.id} 
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? 'bg-brand/[0.04]' : ''
                      }`}
                    >
                      <td className="px-6 py-6 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${career.name}`}
                          checked={isSelected}
                          onChange={() => toggleSelectCareer(career.id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer transition-all accent-brand"
                        />
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <img src={career.image} alt={career.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-900">{career.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Video className="w-3 h-3" /> {career.videos || 0}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <FileText className="w-3 h-3" /> {career.articles || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {skillsList && skillsList.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700">
                              {skillsList[0]}
                            </span>
                            {skillsList.length > 1 && (
                              <span className="px-2.5 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded-lg">
                                +{skillsList.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">-</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-500">{career.category}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-500">{career.mentors || 0}</span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-slate-500">{formatDate(career.date)}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/careers/edit/${career.id}`)}
                            title="Edit career"
                            className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handlePromptSingleDelete(career)}
                            title="Delete career"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCareerIds.length}
        totalCount={filteredCareers.length}
        itemLabel="career"
        onClearSelection={() => setSelectedCareerIds([])}
        onSelectAll={() => setSelectedCareerIds(filteredCareers.map(c => c.id))}
        onDeleteSelected={handlePromptBulkDelete}
        isDeleting={isDeleting}
      />

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setItemsToDelete([]);
          }
        }}
        onConfirm={handleConfirmDelete}
        itemCount={itemsToDelete.length}
        itemType="Career"
        items={itemsToDelete.map(c => ({
          id: c.id,
          name: c.name,
          category: c.category,
          image: c.image
        }))}
        isDeleting={isDeleting}
      />
    </div>
  );
}
