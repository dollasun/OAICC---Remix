import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  Eye,
  X,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { forumsStorage, careersStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialCategories = [
  { id: 'all', label: 'All Topics' },
  { id: 'careers', label: 'Career Advice' },
  { id: 'education', label: 'Education & Degrees' },
  { id: 'internships', label: 'Internships' },
  { id: 'skills', label: 'Skill Development' },
  { id: 'mentorship', label: 'Mentorship' }
];

const initialTopics = [
  {
    id: 1,
    title: 'How to start a career in AI as a high school student?',
    content: 'I\'m currently in my junior year of high school and I\'m really fascinated by Artificial Intelligence...',
    author: 'Alex Chen',
    authorImage: 'https://picsum.photos/seed/alex/100/100',
    category: 'Career Advice',
    replies: 24,
    views: 156,
    likes: 42,
    time: '2h ago',
    isTrending: true
  },
  {
    id: 2,
    title: 'Best universities for Computer Science in 2024?',
    content: 'Looking for recommendations on top CS programs...',
    author: 'Sarah Miller',
    authorImage: 'https://picsum.photos/seed/sarah/100/100',
    category: 'Education & Degrees',
    replies: 18,
    views: 320,
    likes: 25,
    time: '5h ago',
    isTrending: false
  },
  {
    id: 3,
    title: 'My experience interning at a local tech startup',
    content: 'I worked as a software engineering intern at a local startup...',
    author: 'David Wilson',
    authorImage: 'https://picsum.photos/seed/david/100/100',
    category: 'Internships',
    replies: 12,
    views: 89,
    likes: 15,
    time: '1d ago',
    isTrending: false
  },
  {
    id: 4,
    title: 'Which programming language should I learn first?',
    content: 'I want to start learning programming but I\'m not sure which language to pick...',
    author: 'Emily Brown',
    authorImage: 'https://picsum.photos/seed/emily/100/100',
    category: 'Skill Development',
    replies: 56,
    views: 1200,
    likes: 110,
    time: '3d ago',
    isTrending: true
  }
];

export default function Forum() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New topic state
  const [newTopic, setNewTopic] = useState({
    title: '',
    body: '',
    careerId: ''
  });

  useEffect(() => {
    const storedTopics = forumsStorage.get(initialTopics);
    setTopics(storedTopics);
    
    const storedCareers = careersStorage.get([]);
    setCareers(storedCareers);

    const adminForums = forumsStorage.get([]);
    if (adminForums.length > 0 && adminForums !== initialTopics) {
      // This is a bit tricky since forumsStorage might contain initialTopics or admin-created ones
      // For now let's just use initialCategories if no specific categories are found
      setCategories(initialCategories);
    } else {
      setCategories(initialCategories);
    }
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (topic.content && topic.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || topic.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleStartTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.body || !newTopic.careerId) return;

    const selectedCareer = careers.find(c => c.id.toString() === newTopic.careerId);
    
    const topic = {
      id: Date.now(),
      title: newTopic.title,
      content: newTopic.body,
      author: 'Bolu Ahmed',
      authorImage: 'https://picsum.photos/seed/student/100/100',
      category: selectedCareer?.category || 'General',
      replies: 0,
      views: 0,
      likes: 0,
      time: 'Just now',
      isTrending: false
    };

    const updatedTopics = [topic, ...topics];
    setTopics(updatedTopics);
    forumsStorage.save(updatedTopics);
    
    setIsModalOpen(false);
    setNewTopic({ title: '', body: '', careerId: '' });
    showToast('Topic posted successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
          <p className="text-slate-500 font-medium mt-1">Connect, share, and learn from other students and professionals.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" /> Start New Topic
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-brand/10 text-brand' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                  {activeCategory === cat.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand" /> Trending Now
            </h3>
            <div className="space-y-4">
              {topics.filter(t => t.isTrending).slice(0, 3).map(topic => (
                <div key={topic.id} className="group cursor-pointer" onClick={() => navigate(`/student/forum/${topic.id}`)}>
                  <p className="text-xs font-bold text-white/50 uppercase mb-1">{topic.category}</p>
                  <p className="text-sm font-bold group-hover:text-brand transition-colors line-clamp-2">{topic.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Forum Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for topics, questions, or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-brand hover:text-brand transition-all">
              <Filter className="w-5 h-5" /> Filter
            </button>
          </div>

          {/* Topic List */}
          <div className="space-y-4">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/student/forum/${topic.id}`)}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <img src={topic.authorImage} alt={topic.author} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-brand uppercase tracking-widest px-2 py-0.5 bg-brand/5 rounded-lg">
                        {topic.category}
                      </span>
                      {topic.isTrending && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest px-2 py-0.5 bg-amber-50 rounded-lg">
                          <TrendingUp className="w-3 h-3" /> Trending
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand transition-colors line-clamp-1">
                      {topic.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Users className="w-3.5 h-3.5" /> {topic.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {topic.time}
                      </span>
                      <div className="flex items-center gap-4 ml-auto">
                        <span className="flex items-center gap-1.5 hover:text-brand transition-colors">
                          <MessageCircle className="w-4 h-4" /> {topic.replies}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                          <ThumbsUp className="w-4 h-4" /> {topic.likes}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" /> {topic.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No topics found</h3>
                <p className="text-slate-500 font-medium mt-2">Be the first to start a conversation about this topic!</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 text-brand font-bold hover:underline"
                >
                  Start a new topic
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Topic Modal */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Start New Topic</h2>
                      <p className="text-slate-500 font-medium">Share your thoughts with the community</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleStartTopic} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Select Career</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        required
                        value={newTopic.careerId}
                        onChange={(e) => setNewTopic({ ...newTopic, careerId: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Choose a career...</option>
                        {careers.map(career => (
                          <option key={career.id} value={career.id}>{career.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Topic Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="What's on your mind?"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Topic Body</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="Tell us more about it..."
                      value={newTopic.body}
                      onChange={(e) => setNewTopic({ ...newTopic, body: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-slate-700 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-6 py-4 bg-brand text-white rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Post Topic
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

