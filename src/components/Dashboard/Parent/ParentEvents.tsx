import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  Users, 
  ChevronRight, 
  ExternalLink,
  Video,
  Star,
  CheckCircle2
} from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Parent-Teacher Career Symposium',
    date: 'Oct 15, 2024',
    time: '10:00 AM - 4:00 PM',
    type: 'Virtual',
    category: 'Symposium',
    image: 'https://picsum.photos/seed/parent-event/800/400',
    attendees: 1240,
    isRegistered: true,
    description: 'A special session for parents to understand the evolving job market and how to support their children in choosing the right career path.'
  },
  {
    id: 2,
    title: 'Supporting Your Child\'s Mental Health',
    date: 'Oct 18, 2024',
    time: '2:00 PM - 3:30 PM',
    type: 'Online Workshop',
    category: 'Workshop',
    image: 'https://picsum.photos/seed/parent-ai/800/400',
    attendees: 450,
    isRegistered: false,
    description: 'Learn practical strategies to help your child manage stress and anxiety during their academic journey.'
  },
  {
    id: 3,
    title: 'University Admissions Masterclass',
    date: 'Oct 22, 2024',
    time: '5:00 PM - 7:00 PM',
    type: 'Group Mentoring',
    category: 'Mentorship',
    image: 'https://picsum.photos/seed/parent-design/800/400',
    attendees: 85,
    isRegistered: false,
    description: 'Get insights from university admissions officers on what they look for in applications and how to help your child stand out.'
  },
  {
    id: 4,
    title: 'Education & Technology Expo',
    date: 'Nov 05, 2024',
    time: '9:00 AM - 5:00 PM',
    type: 'In-Person (Lagos)',
    category: 'Conference',
    image: 'https://picsum.photos/seed/parent-finance/800/400',
    attendees: 2000,
    isRegistered: false,
    description: 'Explore the latest educational tools and technologies that can enhance your child\'s learning experience.'
  }
];

export default function ParentEvents() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events & Workshops</h1>
          <p className="text-slate-500 font-medium mt-1">Join sessions designed to help you support your child's future.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'upcoming' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'past' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events by title, category, or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-brand hover:text-brand transition-all">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col sm:flex-row"
          >
            <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  {event.category}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                  </div>
                </div>
                {event.isRegistered && (
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Registered
                  </div>
                )}
              </div>

              <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                {event.description}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-6 h-6 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div>
                  <span>+{event.attendees} attending</span>
                </div>
                <button className="flex items-center gap-2 text-brand font-bold text-sm hover:underline">
                  {event.isRegistered ? 'View Details' : 'Register Now'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Event / Banner */}
      <div className="bg-slate-900 rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-brand font-bold text-sm uppercase tracking-widest mb-4">
            <Star className="w-5 h-5 fill-brand" /> Featured Workshop
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Navigating the Digital Future</h2>
          <p className="text-white/70 text-lg font-medium mb-8">
            Join our exclusive session with education experts and learn how to help your child navigate the digital landscape safely and effectively.
          </p>
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase">Date</p>
                <p className="font-bold">Oct 25, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase">Platform</p>
                <p className="font-bold">Zoom Live</p>
              </div>
            </div>
          </div>
          <button className="bg-brand text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-105 transition-all flex items-center gap-2">
            Register for Free <ExternalLink className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-brand/20 to-transparent hidden lg:block"></div>
        <Users className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
      </div>
    </div>
  );
}
