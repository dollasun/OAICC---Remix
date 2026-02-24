import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  MessageSquare,
  Users,
  Eye,
  X,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { forumsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialForums = [
  { id: 1, title: 'General', followers: '400', posts: '100', replies: '3,988', industries: ['Media and Internet', 'Leisure', 'Art and Design'] },
  { id: 2, title: 'Science', followers: '250', posts: '60', replies: '1,200', industries: ['Medicine', 'Engineering'] },
  { id: 3, title: 'Sports', followers: '180', posts: '45', replies: '850', industries: ['Leisure', 'Fitness'] },
  { id: 4, title: 'Commercial', followers: '320', posts: '80', replies: '2,100', industries: ['Business', 'Finance'] },
  { id: 5, title: 'Arts', followers: '210', posts: '55', replies: '1,500', industries: ['Art and Design', 'Media'] },
  { id: 6, title: 'Tech', followers: '500', posts: '120', replies: '5,000', industries: ['Software Engineering', 'AI'] },
];

export default function AdminForums() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [forums, setForums] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState<any>(null);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumIndustries, setNewForumIndustries] = useState<string[]>([]);

  useEffect(() => {
    setForums(forumsStorage.get(initialForums));
  }, []);

  const handleAddForum = () => {
    if (!newForumTitle) return;
    const newForum = {
      id: Date.now(),
      title: newForumTitle,
      followers: '0',
      posts: '0',
      replies: '0',
      industries: newForumIndustries
    };
    const updated = [...forums, newForum];
    setForums(updated);
    forumsStorage.save(updated);
    setIsAddModalOpen(false);
    setNewForumTitle('');
    setNewForumIndustries([]);
    showToast('Forum category created successfully!');
  };

  const handleAddIndustry = (industry: string, isEdit: boolean) => {
    if (!industry || industry === 'Industries') return;
    if (isEdit) {
      if (!selectedForum.industries.includes(industry)) {
        setSelectedForum({
          ...selectedForum,
          industries: [...selectedForum.industries, industry]
        });
      }
    } else {
      if (!newForumIndustries.includes(industry)) {
        setNewForumIndustries([...newForumIndustries, industry]);
      }
    }
  };

  const handleRemoveIndustry = (industry: string, isEdit: boolean) => {
    if (isEdit) {
      setSelectedForum({
        ...selectedForum,
        industries: selectedForum.industries.filter((i: string) => i !== industry)
      });
    } else {
      setNewForumIndustries(newForumIndustries.filter(i => i !== industry));
    }
  };

  const handleUpdateForum = () => {
    if (!selectedForum) return;
    const updated = forums.map(f => f.id === selectedForum.id ? selectedForum : f);
    setForums(updated);
    forumsStorage.save(updated);
    setIsEditModalOpen(false);
    showToast('Forum category updated successfully!');
  };

  const handleDeleteForum = (id: number) => {
    if (window.confirm('Are you sure you want to delete this forum category?')) {
      const updated = forums.filter(f => f.id !== id);
      setForums(updated);
      forumsStorage.save(updated);
      showToast('Forum category deleted successfully!');
    }
  };

  const handleEdit = (forum: any) => {
    setSelectedForum(forum);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Forum Management</h1>
          <p className="text-slate-500 font-medium mt-1">Create and manage forum categories and discussion boards.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Create Forum
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Followers', value: '400', icon: Users, color: 'text-brand', bg: 'bg-brand/10' },
          { label: 'Total Forums', value: '6', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Total Replies', value: '3,988', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Forum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forums.map((forum) => (
          <motion.div
            key={forum.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(forum)}
                  className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteForum(forum.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">{forum.title}</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              <span>{forum.followers} Followers</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span>{forum.posts} Posts</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {forum.industries.map((ind, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                  {ind}
                </span>
              ))}
            </div>

            <button 
              onClick={() => navigate(`/admin/forums/${forum.id}`)}
              className="w-full py-3.5 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2"
            >
              View Discussions <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Forum Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Add Forum</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                    <input 
                      type="text" 
                      value={newForumTitle}
                      onChange={(e) => setNewForumTitle(e.target.value)}
                      placeholder="General" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Career Industries</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newForumIndustries.map((ind, i) => (
                        <div key={i} className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                          {ind} <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveIndustry(ind, false)} />
                        </div>
                      ))}
                    </div>
                    <select 
                      onChange={(e) => handleAddIndustry(e.target.value, false)}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                    >
                      <option>Industries</option>
                      <option value="Tech">Tech</option>
                      <option value="Science">Science</option>
                      <option value="Arts">Arts</option>
                      <option value="Business">Business</option>
                      <option value="Healthcare">Healthcare</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      onClick={handleAddForum}
                      className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Create <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Forum Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Edit Forum</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                    <input 
                      type="text" 
                      value={selectedForum?.title || ''}
                      onChange={(e) => setSelectedForum({ ...selectedForum, title: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Career Industries</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedForum?.industries.map((ind: string, i: number) => (
                        <div key={i} className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                          {ind} <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveIndustry(ind, true)} />
                        </div>
                      ))}
                    </div>
                    <select 
                      onChange={(e) => handleAddIndustry(e.target.value, true)}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                    >
                      <option>Industries</option>
                      <option value="Tech">Tech</option>
                      <option value="Science">Science</option>
                      <option value="Arts">Arts</option>
                      <option value="Business">Business</option>
                      <option value="Healthcare">Healthcare</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <button className="text-red-500 font-bold text-sm hover:underline">Remove Forum</button>
                    <button 
                      onClick={handleUpdateForum}
                      className="px-10 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
