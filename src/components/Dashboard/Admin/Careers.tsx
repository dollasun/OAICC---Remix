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

const initialCareers = [
  { 
    id: 1, 
    name: 'Estate Agent(Sales)', 
    category: 'Sales', 
    mentors: 0, 
    date: '2026-07-10', 
    videos: 0, 
    articles: 1, 
    resources: 1,
    image: 'https://picsum.photos/seed/estate/100/100',
    skills: ['Communication skills', 'Negotiation', 'Property Valuation', 'Client Relations', 'Sales', 'Marketing', 'Real Estate Law', 'Closing Deals'],
    description: 'Help clients buy, sell, and rent properties.'
  },
  { 
    id: 2, 
    name: 'Medical Sales Representative(Sales)', 
    category: 'Sales', 
    mentors: 0, 
    date: '2026-07-10', 
    videos: 0, 
    articles: 1, 
    resources: 1,
    image: 'https://picsum.photos/seed/medical/100/100',
    skills: ['Customer service', 'Medical Knowledge', 'Sales Pitching', 'Product Demos', 'B2B Sales', 'Relationship Building', 'Healthcare Compliance', 'Market Analysis'],
    description: 'Promote and sell medical products and equipment.'
  },
  { 
    id: 3, 
    name: 'Recruitment Consultant(Sales)', 
    category: 'Sales', 
    mentors: 0, 
    date: '2026-07-10', 
    videos: 0, 
    articles: 1, 
    resources: 1,
    image: 'https://picsum.photos/seed/recruitment/100/100',
    skills: ['Customer service', 'Candidate Sourcing', 'Interviewing', 'Talent Acquisition', 'Negotiation', 'Client Relationship', 'Business Development'],
    description: 'Match candidates to temporary or permanent jobs.'
  },
  { 
    id: 4, 
    name: 'Electrical Engineer(Transport & Logistics)', 
    category: 'Transport and Logistics', 
    mentors: 0, 
    date: '2026-07-10', 
    videos: 0, 
    articles: 1, 
    resources: 1,
    image: 'https://picsum.photos/seed/electrical/100/100',
    skills: ['Analytical skills', 'Electrical Systems', 'Power Distribution', 'Logistics Planning', 'Troubleshooting', 'Project Management', 'CAD Design'],
    description: 'Design and manage electrical systems for transport networks.'
  },
  { 
    id: 5, 
    name: 'Graphic Designer(CAD)', 
    category: 'Creative Arts and Design', 
    mentors: 0, 
    date: '2026-07-09', 
    videos: 0, 
    articles: 1, 
    resources: 1,
    image: 'https://picsum.photos/seed/graphic/100/100',
    skills: ['Adaptability', 'CAD Software', 'Graphic Design', '3D Modeling', 'Creative Thinking', 'Typography'],
    description: 'Create visual designs using computer-aided design software.'
  },
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

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      const updated = careers.filter(c => c.id !== id);
      setCareers(updated);
      careersStorage.save(updated);
      showToast('Career deleted successfully!');
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
          <h1 className="text-3xl font-bold text-slate-900">Career Library</h1>
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
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CAREER</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">TOP SKILLS</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CATEGORY</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">MENTORS</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">DATE CREATED</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCareers.map((career) => {
                const skillsList = getSkillsForCareer(career);
                return (
                  <tr key={career.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
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
                    <td className="px-8 py-6">
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
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-500">{career.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-500">{career.mentors || 0}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{formatDate(career.date)}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/careers/edit/${career.id}`)}
                          className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(career.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
