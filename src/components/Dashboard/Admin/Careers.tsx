import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
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
  ArrowUpRight,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careersStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import BulkActionBar from '../../Common/BulkActionBar';
import BulkDeleteModal from '../../Common/BulkDeleteModal';
import BulkUploadModal from './BulkUploadModal';
import UploadResultModal from './UploadResultModal';

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
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isUploadResultModalOpen, setIsUploadResultModalOpen] = useState(false);
  const [bulkUploadResults, setBulkUploadResults] = useState<{ created: number[], updated: number[] } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'created' | 'updated' | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const data = careersStorage.get([]);
    setCareers(data);
  }, []);

  const filteredCareers = careers.filter(c => {
    if (activeFilter === 'created') return bulkUploadResults?.created.includes(c.id);
    if (activeFilter === 'updated') return bulkUploadResults?.updated.includes(c.id);

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

  const handleBulkUpload = (file: File, category: string) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const created: number[] = [];
        const updated: number[] = [];
        
        let newCareers = [...careers];

        data.forEach(item => {
          const existingIndex = newCareers.findIndex(c => c.name.toLowerCase() === (item.name || '').toLowerCase());
          const skills = item.skills ? item.skills.split(';').map((s: string) => s.trim()) : [];
          
          if (existingIndex !== -1) {
            newCareers[existingIndex] = { ...newCareers[existingIndex], ...item, category, skills };
            updated.push(newCareers[existingIndex].id);
          } else {
            const newCareer = {
              ...item,
              title: item.name, // the student portal reads `title`
              mentors: 0,
              videoItems: [],
              articleItems: [],
              linkItems: [],
              id: Math.max(...newCareers.map(c => c.id), 0) + 1,
              category,
              skills,
              date: new Date().toISOString().split('T')[0],
              videos: 0,
              articles: 0,
              resources: 0,
              image: 'https://picsum.photos/seed/' + Math.random() + '/100/100'
            };
            newCareers.push(newCareer);
            created.push(newCareer.id);
          }
        });

        setCareers(newCareers);
        careersStorage.save(newCareers);
        setBulkUploadResults({ created, updated });
        setIsBulkUploadModalOpen(false);
        setIsUploadResultModalOpen(true);
      }
    });
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
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
          >
            Bulk Career Upload
          </button>
          <button 
            onClick={() => navigate('/admin/careers/create')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5" /> Create Career
          </button>
        </div>
      </div>
      
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onUpload={handleBulkUpload}
      />

      <UploadResultModal
        isOpen={isUploadResultModalOpen}
        onClose={() => setIsUploadResultModalOpen(false)}
        createdCount={bulkUploadResults?.created.length || 0}
        updatedCount={bulkUploadResults?.updated.length || 0}
        onFilter={(filter) => {
          setActiveFilter(filter);
        }}
      />

      {activeFilter && (
        <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-brand">
            Showing <span className="font-bold">{activeFilter === 'created' ? 'Created' : 'Updated'}</span> careers
          </p>
          <button 
            onClick={() => { setActiveFilter(null); setBulkUploadResults(null); }}
            className="text-brand font-bold text-sm hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Careers', value: careers.length.toString(), icon: Briefcase, color: 'text-brand', bg: 'bg-brand/10' },
          { label: 'Total Videos', value: careers.reduce((acc, c) => acc + (c.videos || 0), 0).toString(), icon: Video, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Total Articles', value: careers.reduce((acc, c) => acc + (c.articles || 0), 0).toString(), icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Total Resources', value: careers.reduce((acc, c) => acc + (c.resources || 0), 0).toString(), icon: LinkIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
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
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <select 
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-4 focus:ring-brand/10 appearance-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Career">Career</option>
            <option value="Top Skills">Top Skills</option>
            <option value="Category">Category</option>
          </select>
        </div>
      </div>

      {/* Careers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
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
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors group ${
                        isSelected ? 'bg-brand/[0.04] dark:bg-brand/[0.08]' : ''
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
                            <p className="font-bold text-slate-900 dark:text-white">{career.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                <Video className="w-3 h-3" /> {career.videos || 0}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                <FileText className="w-3 h-3" /> {career.articles || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {skillsList && skillsList.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300">
                              {skillsList[0]}
                            </span>
                            {skillsList.length > 1 && (
                              <span className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-lg">
                                +{skillsList.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">-</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{career.category}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{career.mentors || 0}</span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(career.date)}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/careers/edit/${career.id}`)}
                            title="Edit career"
                            className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-all dark:hover:text-brand dark:hover:bg-brand/20"
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
