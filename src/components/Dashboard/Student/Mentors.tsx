import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  ChevronRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mentorsStorage } from '../../../utils/storage';

const initialMentors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['Software Engineering', 'AI/ML', 'Career Growth'],
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/seed/sarah/400/400',
    location: 'San Francisco, CA',
    isVerified: true,
    description: 'Passionate about helping students navigate the tech industry and build meaningful careers.'
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    role: 'Product Designer',
    company: 'Airbnb',
    expertise: ['UI/UX Design', 'Product Strategy', 'Portfolio Review'],
    rating: 4.8,
    reviews: 89,
    image: 'https://picsum.photos/seed/marcus/400/400',
    location: 'New York, NY',
    isVerified: true,
    description: 'Specializing in design thinking and helping aspiring designers land their first roles.'
  },
  {
    id: 3,
    name: 'Dr. Emily Chen',
    role: 'Data Scientist',
    company: 'Microsoft',
    expertise: ['Data Science', 'Statistics', 'Academic Research'],
    rating: 5.0,
    reviews: 56,
    image: 'https://picsum.photos/seed/emily/400/400',
    location: 'Seattle, WA',
    isVerified: true,
    description: 'Bridging the gap between academia and industry through data-driven insights.'
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Marketing Director',
    company: 'Nike',
    expertise: ['Brand Strategy', 'Digital Marketing', 'Leadership'],
    rating: 4.7,
    reviews: 112,
    image: 'https://picsum.photos/seed/james/400/400',
    location: 'Portland, OR',
    isVerified: false,
    description: 'Experienced marketing professional focused on building iconic brands and developing talent.'
  }
];

export default function Mentors() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    const adminMentors = mentorsStorage.get([]);
    if (adminMentors.length > 0) {
      const mapped = adminMentors.map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        company: 'Professional',
        expertise: [m.role],
        rating: 4.5,
        reviews: 0,
        image: m.avatar,
        location: 'Remote',
        isVerified: true,
        description: 'Professional mentor available for guidance.'
      }));
      setMentors(mapped);
    } else {
      setMentors(initialMentors);
    }
  }, []);

  const expertiseList = ['All', 'Software Engineering', 'UI/UX Design', 'Data Science', 'Marketing', 'Business', 'Healthcare'];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpertise = selectedExpertise === 'All' || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Professional Mentors</h1>
          <p className="text-slate-500 font-medium mt-1">Connect with industry experts who can guide your career journey.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand/10 text-brand px-6 py-3 rounded-2xl font-bold hover:bg-brand hover:text-white transition-all">
          <Users className="w-5 h-5" /> My Mentors
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, role, or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {expertiseList.map(exp => (
            <button
              key={exp}
              onClick={() => setSelectedExpertise(exp)}
              className={`px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedExpertise === exp
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50"
                  />
                  {mentor.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-brand text-white p-1 rounded-lg border-2 border-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full text-amber-600 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {mentor.rating}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand transition-colors">{mentor.name}</h3>
              <p className="text-sm font-bold text-slate-500 mb-4">{mentor.role} @ {mentor.company}</p>
              
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                <MapPin className="w-3.5 h-3.5" /> {mentor.location}
              </div>

              <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                {mentor.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {mentor.expertise.slice(0, 2).map((exp) => (
                  <span key={exp} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    {exp}
                  </span>
                ))}
                {mentor.expertise.length > 2 && (
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    +{mentor.expertise.length - 2} more
                  </span>
                )}
              </div>

              <button 
                onClick={() => navigate(`/student/mentors/${mentor.id}`)}
                className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Profile <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No mentors found</h3>
          <p className="text-slate-500 font-medium mt-2">Try adjusting your search or filters to find a mentor.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedExpertise('All'); }}
            className="mt-6 text-brand font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
