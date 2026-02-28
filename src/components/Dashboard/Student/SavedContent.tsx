import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, 
  Search, 
  Filter, 
  Briefcase, 
  MessageSquare, 
  Users, 
  ChevronRight, 
  Trash2,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savedCareersStorage } from '../../../utils/storage';

export default function SavedContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('careers');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCareers, setSavedCareers] = useState<any[]>([]);

  useEffect(() => {
    setSavedCareers(savedCareersStorage.get([]));
  }, []);

  const handleRemoveCareer = (id: number) => {
    const updated = savedCareers.filter(c => c.id !== id);
    setSavedCareers(updated);
    savedCareersStorage.save(updated);
  };

  const savedMentors = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Software Engineer', company: 'Google', rating: 4.9, image: 'https://picsum.photos/seed/sarah/100/100' },
    { id: 2, name: 'Marcus Thorne', role: 'Product Designer', company: 'Airbnb', rating: 4.8, image: 'https://picsum.photos/seed/marcus/100/100' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Content</h1>
          <p className="text-slate-500 font-medium mt-1">Access your bookmarked careers, discussions, and mentors.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-white rounded-[24px] border border-slate-100 shadow-sm w-fit">
        {[
          { id: 'careers', label: 'Careers', icon: Briefcase },
          { id: 'mentors', label: 'Mentors', icon: Users }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        {activeTab === 'careers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedCareers.map((career) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative h-48">
                  <img src={career.image} alt={career.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemoveCareer(career.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-brand hover:bg-white transition-colors"
                  >
                    <Bookmark className="w-5 h-5 fill-brand" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{career.category}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{career.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {career.match} Match
                    </div>
                    <button 
                      onClick={() => navigate(`/student/careers/${career.id}`)}
                      className="text-brand font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedMentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-bold text-slate-900">{mentor.name}</h3>
                    <p className="text-xs font-bold text-brand">{mentor.role}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{mentor.company}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {mentor.rating}
                  </div>
                  <button 
                    onClick={() => navigate(`/student/mentors/${mentor.id}`)}
                    className="text-brand font-bold text-sm flex items-center gap-1 hover:underline"
                  >
                    Profile <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'careers' && savedCareers.length === 0) ||
          (activeTab === 'mentors' && savedMentors.length === 0)) && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No saved {activeTab} yet</h3>
            <p className="text-slate-500 font-medium mt-2">Start exploring and bookmarking content you find interesting!</p>
            <button 
              onClick={() => navigate(`/student/${activeTab}`)}
              className="mt-6 px-8 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all"
            >
              Explore {activeTab}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

