import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  TrendingUp, 
  Users, 
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  Eye,
  Trash2,
  AlertCircle,
  Edit2,
  X,
  Check,
  ArrowRight,
  User,
  Filter,
  Send
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { forumCategoriesStorage, forumsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialCategories = [
  { id: 1, title: 'Hospitality', industries: ['SOCIAL CARE', 'BANKING AND FINANCE', 'CHARITY AND VOLUNTEER'], followers: 0, postCount: 0 },
  { id: 2, title: 'Project Management', industries: ['BUSINESS'], followers: 0, postCount: 0 },
  { id: 3, title: 'Code', industries: ['INFORMATION TECHNOLOGY', 'BUSINESS', 'ENVIRONMENT AND AGRICULTURE', 'SCIENCE AND PHARMACEUTICALS'], followers: 0, postCount: 0 }
];

const INDUSTRIES = [
  'SOCIAL CARE',
  'BANKING AND FINANCE',
  'CHARITY AND VOLUNTEER',
  'BUSINESS',
  'INFORMATION TECHNOLOGY',
  'ENVIRONMENT AND AGRICULTURE',
  'SCIENCE AND PHARMACEUTICALS',
  'ENGINEERING',
  'ARTS AND CREATIVE',
  'HEALTHCARE'
];

export default function AdminForum() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forumIdParam = searchParams.get('forumId');
  const { showToast } = useToast();
  
  const [forums, setForums] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState<any>(null);
  
  const [newForum, setNewForum] = useState({ title: '', industries: [] as string[] });
  const [editForumData, setEditForumData] = useState({ title: '', industries: [] as string[] });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedForums = forumCategoriesStorage.get(initialCategories);
    const storedTopics = forumsStorage.get([]);
    setForums(storedForums);
    setTopics(storedTopics);
  }, []);

  const handleAddForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForum.title || newForum.industries.length === 0) return;
    
    const forum = {
      ...newForum,
      id: Date.now(),
      followers: 0,
      postCount: 0
    };
    
    const updated = [...forums, forum];
    setForums(updated);
    forumCategoriesStorage.save(updated);
    setIsAddModalOpen(false);
    setNewForum({ title: '', industries: [] });
    showToast('Forum created successfully');
  };

  const handleUpdateForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForumData.title || editForumData.industries.length === 0) return;
    
    const updated = forums.map(f => f.id === selectedForum.id ? { ...f, ...editForumData } : f);
    setForums(updated);
    forumCategoriesStorage.save(updated);
    setIsEditModalOpen(false);
    setSelectedForum(null);
    showToast('Forum updated successfully');
  };

  const handleDeleteForum = () => {
    const updated = forums.filter(f => f.id !== selectedForum.id);
    setForums(updated);
    forumCategoriesStorage.save(updated);
    setIsDeleteModalOpen(false);
    setSelectedForum(null);
    showToast('Forum deleted successfully');
  };

  const toggleIndustry = (industry: string, isEdit = false) => {
    if (isEdit) {
      setEditForumData(prev => ({
        ...prev,
        industries: prev.industries.includes(industry)
          ? prev.industries.filter(i => i !== industry)
          : [...prev.industries, industry]
      }));
    } else {
      setNewForum(prev => ({
        ...prev,
        industries: prev.industries.includes(industry)
          ? prev.industries.filter(i => i !== industry)
          : [...prev.industries, industry]
      }));
    }
  };

  // Analytics
  const totalFollowers = forums.reduce((acc, f) => acc + (f.followers || 0), 0);
  const totalReplies = topics.reduce((acc, t) => acc + (t.replies?.length || 0), 0);

  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', content: '' });

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.content || !forumIdParam) return;
    
    const currentForum = forums.find(f => f.id.toString() === forumIdParam);
    
    const topic = {
      id: Date.now(),
      forumId: parseInt(forumIdParam),
      title: newTopic.title,
      content: newTopic.content,
      author: 'Bolu Ahmed',
      authorImage: 'https://picsum.photos/seed/admin/100/100',
      category: currentForum?.title || 'General',
      replies: [],
      views: 0,
      likes: 0,
      time: 'Just now',
      isTrending: false,
      reports: 0
    };
    
    const updated = [topic, ...topics];
    setTopics(updated);
    forumsStorage.save(updated);
    setIsAddTopicModalOpen(false);
    setNewTopic({ title: '', content: '' });
    showToast('Topic posted successfully');
  };

  // If viewing discussions under a forum
  if (forumIdParam) {
    const currentForum = forums.find(f => f.id.toString() === forumIdParam);
    const forumTopics = topics.filter(t => t.forumId?.toString() === forumIdParam || (!t.forumId && currentForum?.title === t.category));

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/forum')}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{currentForum?.title || 'Discussions'}</h1>
              <p className="text-slate-500 font-bold">Manage discussions within this forum.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddTopicModalOpen(true)}
            className="flex items-center gap-2 bg-[#00B4D8] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-brand/20 hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" /> Create Topic
          </button>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Author</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stats</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {forumTopics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map((topic) => (
                  <tr key={topic.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 max-w-md">
                      <p className="font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{topic.title}</p>
                      <p className="text-xs text-slate-400 font-bold line-clamp-1">{topic.content}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img src={topic.authorImage || `https://picsum.photos/seed/${topic.author}/100/100`} className="w-8 h-8 rounded-lg object-cover" alt={topic.author} />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{topic.author}</p>
                          <p className="text-[10px] font-bold text-slate-400">{topic.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-4 text-slate-400">
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-700">{topic.replies?.length || 0}</p>
                          <p className="text-[8px] font-black uppercase tracking-tighter">Replies</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-700">{topic.views || 0}</p>
                          <p className="text-[8px] font-black uppercase tracking-tighter">Views</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/admin/forum/${topic.id}`)}
                        className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Topic Modal */}
        <AnimatePresence>
          {isAddTopicModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddTopicModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
              >
                <div className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-slate-900">Create Topic</h2>
                    <button onClick={() => setIsAddTopicModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleAddTopic} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="What's on your mind?"
                        value={newTopic.title}
                        onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 transition-all" 
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Tell us more..."
                        value={newTopic.content}
                        onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 transition-all resize-none" 
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-5 bg-[#00B4D8] text-white font-black rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Post Topic <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Forum Management</h1>
          <p className="text-slate-500 font-bold mt-1">Create and manage forum categories and discussion boards.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#00B4D8] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-brand/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" /> Create Forum
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Followers</p>
            <h3 className="text-3xl font-black text-slate-900">{totalFollowers}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Forums</p>
            <h3 className="text-3xl font-black text-slate-900">{forums.length}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Replies</p>
            <h3 className="text-3xl font-black text-slate-900">{totalReplies}</h3>
          </div>
        </div>
      </div>

      {/* Forums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {forums.map((forum) => (
          <div key={forum.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand/5 transition-all group relative">
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-[#00B4D8] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setSelectedForum(forum); setEditForumData({ title: forum.title, industries: forum.industries }); setIsEditModalOpen(true); }}
                  className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setSelectedForum(forum); setIsDeleteModalOpen(true); }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <h3 className="text-2xl font-black text-slate-900">{forum.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                FOLLOWERS • {topics.filter(t => t.forumId?.toString() === forum.id.toString() || (!t.forumId && forum.title === t.category)).length} POSTS
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {forum.industries.map((ind: string) => (
                <span key={ind} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-100">
                  {ind}
                </span>
              ))}
            </div>

            <button 
              onClick={() => navigate(`/admin/forum?forumId=${forum.id}`)}
              className="w-full py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
            >
              View Discussions <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Trending and Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Topics */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Trending Topics</h2>
            <TrendingUp className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-6">
            {topics.filter(t => t.isTrending).slice(0, 4).map((topic) => (
              <div 
                key={topic.id} 
                onClick={() => navigate(`/admin/forum/${topic.id}`)}
                className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{topic.title}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{topic.category} • {topic.views} views</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </div>
            ))}
            {topics.filter(t => t.isTrending).length === 0 && (
              <div className="text-center py-10 text-slate-400 font-bold">No trending topics yet</div>
            )}
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Most Active People</h2>
            <Users className="w-6 h-6 text-brand" />
          </div>
          <div className="space-y-6">
            {Array.from(new Set(topics.map(t => t.author))).slice(0, 4).map((author, idx) => {
              const authorTopics = topics.filter(t => t.author === author);
              return (
                <div key={idx} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <img src={`https://picsum.photos/seed/${author}/100/100`} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-50" alt={author} />
                    <div>
                      <p className="font-bold text-slate-900">{author}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{authorTopics.length} Posts • {authorTopics.reduce((acc, t) => acc + (t.replies?.length || 0), 0)} Replies</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand font-black text-sm">
                    #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-slate-900">Add Forum</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddForum} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="General"
                      value={newForum.title}
                      onChange={(e) => setNewForum({...newForum, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 transition-all" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Career Industries</label>
                    <div className="relative">
                      <select 
                        onChange={(e) => toggleIndustry(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="">Industries</option>
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {newForum.industries.map(ind => (
                        <span key={ind} className="px-3 py-1.5 bg-brand/5 text-brand rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          {ind} <X className="w-3 h-3 cursor-pointer" onClick={() => toggleIndustry(ind)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#00B4D8] text-white font-black rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Create <Check className="w-5 h-5" />
                  </button>
                </form>
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
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-slate-900">Edit Forum</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateForum} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={editForumData.title}
                      onChange={(e) => setEditForumData({...editForumData, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 transition-all" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Career Industries</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editForumData.industries.map(ind => (
                        <span key={ind} className="px-3 py-1.5 bg-brand/5 text-brand rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          {ind} <X className="w-3 h-3 cursor-pointer" onClick={() => toggleIndustry(ind, true)} />
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <select 
                        onChange={(e) => toggleIndustry(e.target.value, true)}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="">Add Industry</option>
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button 
                      type="button"
                      onClick={() => { setIsEditModalOpen(false); setIsDeleteModalOpen(true); }}
                      className="text-red-500 font-black text-sm hover:underline"
                    >
                      Remove Forum
                    </button>
                    <button 
                      type="submit"
                      className="px-10 py-4 bg-[#00B4D8] text-white font-black rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Forum Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 text-center"
            >
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-3xl font-black text-slate-900 mb-4">Remove Forum</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Are you sure you want to delete "{selectedForum?.title}"? This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 border-2 border-[#00B4D8] text-[#00B4D8] font-black rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteForum}
                  className="flex-1 py-4 bg-[#EF4444] text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
