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
    replies: [
      {
        id: 101,
        author: 'Dr. Sarah Johnson',
        authorRole: 'AI Researcher',
        authorImage: 'https://picsum.photos/seed/sarah/100/100',
        isVerified: true,
        content: 'Great question, Alex! AI is a fantastic field to get into. At your stage, the most important thing is building a strong foundation in Mathematics—specifically Linear Algebra and Calculus.',
        time: '1 hour ago',
        likes: 15,
        dislikes: 2,
        replies: []
      }
    ],
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
    replies: [],
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
    replies: [],
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
    replies: [],
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'Career Advice'
  });

  useEffect(() => {
    const stored = forumsStorage.get(initialTopics);
    setTopics(stored);
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (topic.content && topic.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || topic.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = {
      ...newTopic,
      id: Date.now(),
      author: 'Bolu Ahmed',
      authorImage: 'https://picsum.photos/seed/bolu/100/100',
      replies: [],
      views: 0,
      likes: 0,
      dislikes: 0,
      time: 'Just now',
      isTrending: false
    };

    const updatedTopics = [topic, ...topics];
    setTopics(updatedTopics);
    forumsStorage.save(updatedTopics);
    
    setIsModalOpen(false);
    setNewTopic({ title: '', content: '', category: 'Career Advice' });
    showToast('Topic created successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* New Topic Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleCreateTopic} className="p-8 sm:p-12">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Start a Conversation</h2>
                    <p className="text-slate-500 font-bold mt-1">Share your thoughts with the community.</p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Topic Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="What would you like to discuss?"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 placeholder:text-slate-300 transition-all" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative">
                      <select 
                        value={newTopic.category}
                        onChange={(e) => setNewTopic({...newTopic, category: e.target.value})}
                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 appearance-none transition-all cursor-pointer"
                      >
                        {initialCategories.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.label}>{cat.label}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Tell us more about it..."
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none focus:border-brand/20 focus:ring-4 focus:ring-brand/5 font-bold text-slate-700 placeholder:text-slate-300 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-3xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-5 bg-brand text-white font-black rounded-3xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Post Topic
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-brand to-indigo-600 p-8 sm:p-12 text-white shadow-2xl shadow-brand/20">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Community <span className="text-brand-light">Forum</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 font-medium mb-8 leading-relaxed">
              The heart of our student community. Ask questions, share your journey, and grow together with peers and mentors.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-3 bg-white text-brand px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" /> 
              Start a Conversation
            </button>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block opacity-20">
          <MessageSquare className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar - Desktop */}
        <div className="lg:col-span-3 space-y-8 hidden lg:block">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm sticky top-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Explore Topics</h3>
            <div className="space-y-2">
              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${
                    activeCategory === cat.id 
                      ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trending Now</h3>
              <div className="space-y-6">
                {topics.filter(t => t.isTrending).slice(0, 3).map(topic => (
                  <div 
                    key={topic.id} 
                    className="group cursor-pointer" 
                    onClick={() => navigate(`/student/forum/${topic.id}`)}
                  >
                    <p className="text-[10px] font-black text-brand uppercase tracking-wider mb-1">{topic.category}</p>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-brand transition-colors line-clamp-2 leading-snug">{topic.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Mobile Categories Scroll */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar flex gap-3 pb-2">
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                    : 'bg-white text-slate-500 border border-slate-100 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search topics, questions, or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4.5 bg-white border-2 border-transparent rounded-[24px] shadow-sm focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold text-slate-700"
              />
            </div>
            <button className="flex items-center justify-center gap-3 px-8 py-4.5 bg-white border border-slate-100 rounded-[24px] font-bold text-slate-600 hover:border-brand hover:text-brand transition-all shadow-sm">
              <Filter className="w-5 h-5" /> Filter
            </button>
          </div>

          {/* Topic List */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`/student/forum/${topic.id}`)}
                  className="group bg-white p-6 sm:p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand/5 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Hover Accent */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="relative shrink-0">
                      <img 
                        src={topic.authorImage} 
                        alt={topic.author} 
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-slate-50 shadow-md group-hover:scale-110 transition-transform duration-500" 
                      />
                      {topic.isTrending && (
                        <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1.5 rounded-lg shadow-lg">
                          <TrendingUp className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-brand uppercase tracking-[0.15em] px-3 py-1 bg-brand/5 rounded-full">
                          {topic.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {topic.time}
                        </span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight group-hover:text-brand transition-colors">
                        {topic.title}
                      </h3>
                      
                      <p className="text-slate-500 font-medium line-clamp-2 text-sm sm:text-base leading-relaxed">
                        {topic.content}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <img 
                                key={i}
                                src={`https://picsum.photos/seed/${topic.id + i}/40/40`} 
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                alt="Participant"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-400">
                            {topic.author} and others
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-slate-400">
                          <div className="flex items-center gap-2 group/stat">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/stat:bg-brand/10 group-hover/stat:text-brand transition-colors">
                              <MessageCircle className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-sm font-black">{Array.isArray(topic.replies) ? topic.replies.length : topic.replies}</span>
                          </div>
                          <div className="flex items-center gap-2 group/stat">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/stat:bg-red-50 group-hover/stat:text-red-500 transition-colors">
                              <ThumbsUp className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-sm font-black">{topic.likes}</span>
                          </div>
                          <div className="flex items-center gap-2 group/stat">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/stat:bg-indigo-50 group-hover/stat:text-indigo-500 transition-colors">
                              <Eye className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-sm font-black">{topic.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTopics.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-[48px] border-2 border-dashed border-slate-100"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <MessageSquare className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">No conversations found</h3>
                <p className="text-slate-500 font-bold mt-3 max-w-xs mx-auto">Try adjusting your search or be the first to start a new topic!</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-8 text-brand font-black hover:underline underline-offset-8"
                >
                  Start a new topic now
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

