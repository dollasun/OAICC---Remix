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
import { careersStorage } from '../../../utils/storage';

const initialCareers = [
  {
    id: 1,
    title: 'Software Engineer',
    category: 'Technology',
    salary: '$80k - $150k',
    growth: 'High',
    education: 'Bachelor\'s Degree',
    match: '98%',
    image: 'https://picsum.photos/seed/software/600/400',
    description: 'Design, develop, and maintain software systems and applications.'
  },
  {
    id: 2,
    title: 'Data Scientist',
    category: 'Technology',
    salary: '$90k - $160k',
    growth: 'Very High',
    education: 'Master\'s Degree',
    match: '92%',
    image: 'https://picsum.photos/seed/data/600/400',
    description: 'Analyze complex data to help organizations make better decisions.'
  },
  {
    id: 3,
    title: 'Graphic Designer',
    category: 'Creative',
    salary: '$45k - $90k',
    growth: 'Medium',
    education: 'Bachelor\'s Degree',
    match: '85%',
    image: 'https://picsum.photos/seed/design/600/400',
    description: 'Create visual concepts to communicate ideas that inspire and inform.'
  },
  {
    id: 4,
    title: 'Marketing Manager',
    category: 'Business',
    salary: '$70k - $130k',
    growth: 'High',
    education: 'Bachelor\'s Degree',
    match: '78%',
    image: 'https://picsum.photos/seed/marketing/600/400',
    description: 'Plan and execute strategies to promote products or services.'
  },
  {
    id: 5,
    title: 'Cybersecurity Analyst',
    category: 'Technology',
    salary: '$85k - $140k',
    growth: 'Very High',
    education: 'Bachelor\'s Degree',
    match: '88%',
    image: 'https://picsum.photos/seed/security/600/400',
    description: 'Protect an organization\'s computer networks and systems.'
  },
  {
    id: 6,
    title: 'Financial Analyst',
    category: 'Finance',
    salary: '$65k - $120k',
    growth: 'Medium',
    education: 'Bachelor\'s Degree',
    match: '72%',
    image: 'https://picsum.photos/seed/finance/600/400',
    description: 'Provide guidance to businesses and individuals making investment decisions.'
  }
];

export default function CareerLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    // Map admin careers to student career format if needed
    const adminCareers = careersStorage.get([]);
    if (adminCareers.length > 0) {
      const mapped = adminCareers.map((c: any) => ({
        id: c.id,
        title: c.name,
        category: c.category,
        salary: `$${c.salaryMin || '50k'} - $${c.salaryMax || '100k'}`,
        growth: 'High',
        education: 'Bachelor\'s Degree',
        match: '90%',
        image: c.image,
        description: c.description
      }));
      setCareers(mapped);
    } else {
      setCareers(initialCareers);
    }
  }, []);

  const categories = ['All', 'Technology', 'Creative', 'Business', 'Finance', 'Healthcare', 'Science'];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
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
            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={career.image} 
                alt={career.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-brand transition-colors">
                  <Bookmark className="w-5 h-5" />
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
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest px-2 py-1 bg-brand/5 rounded-lg">
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
                className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
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
