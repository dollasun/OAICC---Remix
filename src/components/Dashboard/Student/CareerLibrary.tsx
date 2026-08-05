import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Bookmark, 
  ChevronRight,
  Briefcase,
  GraduationCap,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careersStorage, savedCareersStorage } from '../../../utils/storage';
import { clusters } from '../../../data/questionnaire';
import { careerGlossary } from '../../../data/careers';

export default function CareerLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [careers, setCareers] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    // Check if admin has added any careers
    const adminCareers = careersStorage.get([]);
    let allCareers: any[] = [];
    
    if (adminCareers.length > 0) {
      allCareers = adminCareers.map((c: any) => ({
        id: c.id,
        title: c.name,
        category: c.category,
        salary: `$${c.salaryMin || '50k'} - $${c.salaryMax || '100k'}`,
        growth: 'High',
        education: 'Bachelor\'s Degree',
        match: c.match || `${Math.floor(Math.random() * 40) + 60}%`,
        image: c.image,
        description: c.description
      }));
    } else {
      // Generate initial careers from the glossary
      let idCounter = 1;
      for (const [cluster, jobs] of Object.entries(careerGlossary)) {
        // Pick a few jobs from each cluster to show initially if no admin careers exist
        const sampleJobs = jobs.slice(0, 5);
        sampleJobs.forEach(job => {
          allCareers.push({
            id: idCounter++,
            title: job,
            category: cluster,
            salary: '$60k - $120k',
            growth: 'Medium',
            education: 'Bachelor\'s Degree',
            match: `${Math.floor(Math.random() * 30) + 65}%`,
            image: `https://picsum.photos/seed/${idCounter}/600/400`,
            description: `A professional in the ${cluster} industry focusing on ${job.toLowerCase()} tasks and responsibilities.`
          });
        });
      }
    }

    // Sort by match percentage (highest first)
    const sorted = [...allCareers].sort((a, b) => {
      const matchA = parseInt(a.match);
      const matchB = parseInt(b.match);
      return matchB - matchA;
    });

    setCareers(sorted);

    const saved = savedCareersStorage.get([]);
    setSavedIds(saved.map((c: any) => c.id));
  }, []);

  const categories = ['All', ...clusters];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveCareer = (career: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentSaved = savedCareersStorage.get([]);
    const isSaved = currentSaved.find((c: any) => c.id === career.id);
    
    let updated;
    if (isSaved) {
      updated = currentSaved.filter((c: any) => c.id !== career.id);
    } else {
      updated = [...currentSaved, career];
    }
    
    savedCareersStorage.save(updated);
    setSavedIds(updated.map((c: any) => c.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Career Library</h1>
          <p className="text-slate-500 font-medium mt-1">Discover and explore career paths that match your interests.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search careers, skills, or industries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-sm shadow-brand/5'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCareers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-sm transition-all group flex flex-col"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={career.image} 
                alt={career.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={(e) => handleSaveCareer(career, e)}
                  className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
                    savedIds.includes(career.id) 
                      ? 'bg-brand text-white' 
                      : 'bg-white/90 text-slate-400 hover:text-brand'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${savedIds.includes(career.id) ? 'fill-white' : ''}`} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-brand/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> {career.match} Match
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest px-2 py-1 bg-brand/5 rounded-lg line-clamp-1">
                  {career.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{career.title}</h3>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                {career.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-600">{career.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-600">{career.growth} Growth</span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/student/careers/${career.id}`)}
                className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-xl group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No careers found</h3>
          <p className="text-slate-500 font-medium mt-2">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-6 text-brand font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}


