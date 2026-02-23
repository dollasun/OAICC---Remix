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

const initialCareers = [
  { 
    id: 1, 
    name: 'Product Design', 
    category: 'Creative', 
    mentors: 15, 
    date: 'Jan 6, 2022 4:26 PM', 
    videos: 25, 
    articles: 12, 
    resources: 20,
    image: 'https://picsum.photos/seed/design/100/100',
    description: 'Create visual concepts to communicate ideas that inspire and inform.'
  },
  { 
    id: 2, 
    name: 'Medicine', 
    category: 'Science', 
    mentors: 15, 
    date: 'Jan 6, 2022 4:26 PM', 
    videos: 18, 
    articles: 30, 
    resources: 15,
    image: 'https://picsum.photos/seed/medicine/100/100',
    description: 'Diagnose and treat illnesses to improve patient health and well-being.'
  },
  { 
    id: 3, 
    name: 'Engineering', 
    category: 'Science', 
    mentors: 15, 
    date: 'Jan 6, 2022 4:26 PM', 
    videos: 40, 
    articles: 25, 
    resources: 35,
    image: 'https://picsum.photos/seed/engineering/100/100',
    description: 'Apply scientific and mathematical principles to design and build structures and systems.'
  },
  { 
    id: 4, 
    name: 'Real Estate', 
    category: 'Business', 
    mentors: 15, 
    date: 'Jan 6, 2022 4:26 PM', 
    videos: 12, 
    articles: 10, 
    resources: 8,
    image: 'https://picsum.photos/seed/estate/100/100',
    description: 'Help clients buy, sell, and rent properties.'
  },
  { 
    id: 5, 
    name: 'Software Engineering', 
    category: 'Technology', 
    mentors: 15, 
    date: 'Jan 6, 2022 4:26 PM', 
    videos: 55, 
    articles: 40, 
    resources: 60,
    image: 'https://picsum.photos/seed/software/100/100',
    description: 'Design, develop, and maintain software systems and applications.'
  },
];

export default function AdminCareers() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const data = careersStorage.get(initialCareers);
    setCareers(data);
  }, []);

  const filteredCareers = careers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(careers.map(c => c.category))];

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      const updated = careers.filter(c => c.id !== id);
      setCareers(updated);
      careersStorage.save(updated);
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
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
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
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
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
            placeholder="Search careers by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 outline-none focus:ring-4 focus:ring-brand/10 appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Careers Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Mentors</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Created</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCareers.map((career) => (
                <tr key={career.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={career.image} alt={career.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-slate-900">{career.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Video className="w-3 h-3" /> {career.videos}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <FileText className="w-3 h-3" /> {career.articles}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-slate-600">{career.category}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-bold text-slate-900">{career.mentors}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">{career.date}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/admin/careers/edit/${career.id}`)}
                        className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(career.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
