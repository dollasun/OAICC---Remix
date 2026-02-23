import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2,
  X,
  Info,
  Trophy
} from 'lucide-react';
import { eventsStorage, registeredEventsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialEvents = [
  {
    id: 1,
    title: 'Tech Career Fair 2026',
    date: '2026-03-15',
    displayDate: 'Mar 15, 2026',
    time: '10:00 AM - 4:00 PM',
    type: 'Virtual',
    category: 'Technology',
    image: 'https://picsum.photos/seed/fair/800/400',
    attendees: 1240,
    description: 'Connect with top tech companies looking for interns and entry-level talent. Get a chance to network with recruiters and learn about open roles.'
  },
  {
    id: 2,
    title: 'Introduction to Artificial Intelligence',
    date: '2026-03-18',
    displayDate: 'Mar 18, 2026',
    time: '2:00 PM - 3:30 PM',
    type: 'Online Workshop',
    category: 'Technology',
    image: 'https://picsum.photos/seed/ai/800/400',
    attendees: 450,
    description: 'A beginner-friendly workshop covering the basics of AI, machine learning, and how to start your journey in this exciting field.'
  },
  {
    id: 3,
    title: 'Design Portfolio Review Session',
    date: '2026-01-10',
    displayDate: 'Jan 10, 2026',
    time: '5:00 PM - 7:00 PM',
    type: 'Group Mentoring',
    category: 'Design',
    image: 'https://picsum.photos/seed/design/800/400',
    attendees: 85,
    description: 'Get your design portfolio reviewed by industry professionals from leading creative agencies and tech companies.'
  },
  {
    id: 4,
    title: 'Future of Finance Summit',
    date: '2026-04-05',
    displayDate: 'Apr 05, 2026',
    time: '9:00 AM - 5:00 PM',
    type: 'In-Person (Lagos)',
    category: 'Finance',
    image: 'https://picsum.photos/seed/finance/800/400',
    attendees: 2000,
    description: 'Explore the latest trends in fintech, banking, and investment at the biggest finance summit of the year.'
  },
  {
    id: 5,
    title: 'Soft Skills for Engineers',
    date: '2026-03-25',
    displayDate: 'Mar 25, 2026',
    time: '11:00 AM - 12:30 PM',
    type: 'Webinar',
    category: 'Professional Development',
    image: 'https://picsum.photos/seed/softskills/800/400',
    attendees: 320,
    description: 'Learn communication, teamwork, and leadership skills essential for a successful engineering career.'
  }
];

export default function Events() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState<any[]>([]);
  const [registeredIds, setRegisteredIds] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const adminEvents = eventsStorage.get([]);
    const registered = registeredEventsStorage.get([]);
    setRegisteredIds(registered);

    if (adminEvents.length > 0) {
      const mapped = adminEvents.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        displayDate: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: e.time,
        type: 'Online',
        category: e.career || 'General',
        image: e.image,
        attendees: Math.floor(Math.random() * 100) + 50,
        description: `Join us for this exciting event about ${e.career} with ${e.mentor}.`
      }));
      setEvents([...initialEvents, ...mapped]);
    } else {
      setEvents(initialEvents);
    }
  }, []);

  const categories = ['All', ...new Set(events.map(e => e.category))];

  const isPast = (dateStr: string) => {
    const today = new Date('2026-02-23');
    const eventDate = new Date(dateStr);
    return eventDate < today;
  };

  const handleRegister = (event: any) => {
    if (registeredIds.includes(event.id)) return;
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const confirmRegistration = () => {
    const newRegistered = [...registeredIds, selectedEvent.id];
    setRegisteredIds(newRegistered);
    registeredEventsStorage.save(newRegistered);
    setIsModalOpen(false);
    setSelectedEvent(null);
    showToast('Successfully registered for the event!');
  };

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesTab = activeTab === 'upcoming' ? !isPast(event.date) : isPast(event.date);
      return matchesSearch && matchesCategory && matchesTab;
    })
    .sort((a, b) => {
      const aReg = registeredIds.includes(a.id) ? 1 : 0;
      const bReg = registeredIds.includes(b.id) ? 1 : 0;
      return bReg - aReg; // Registered first
    });

  const upcomingEvents = events.filter(e => !isPast(e.date)).slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Events & Workshops</h1>
            <p className="text-slate-500 font-medium mt-1">Join live sessions, workshops, and career fairs to boost your growth.</p>
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
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-bold text-slate-600 appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-8">
          {filteredEvents.map((event, index) => {
            const isRegistered = registeredIds.includes(event.id);
            const past = isPast(event.date);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-[40px] border overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col sm:flex-row ${
                  isRegistered ? 'border-brand/30 bg-brand/[0.02]' : 'border-slate-100'
                }`}
              >
                <div className="relative w-full sm:w-64 h-64 sm:h-auto overflow-hidden shrink-0">
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
                      <h3 className={`text-xl font-bold mb-2 group-hover:text-brand transition-colors ${
                        isRegistered ? 'text-brand' : 'text-slate-900'
                      }`}>
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {event.displayDate || event.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                      </div>
                    </div>
                    {isRegistered && (
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
                          <img key={i} src={`https://picsum.photos/seed/user${i + event.id}/100/100`} className="w-6 h-6 rounded-full border-2 border-white" alt="User" />
                        ))}
                      </div>
                      <span>+{event.attendees} attending</span>
                    </div>
                    {!past && (
                      <button 
                        onClick={() => handleRegister(event)}
                        disabled={isRegistered}
                        className={`flex items-center gap-2 font-bold text-sm transition-all ${
                          isRegistered 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'text-brand hover:underline'
                        }`}
                      >
                        {isRegistered ? 'Already Registered' : 'Register Now'} <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {past && (
                      <button className="flex items-center gap-2 text-slate-400 font-bold text-sm cursor-not-allowed">
                        Event Ended <Info className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sidebar - Upcoming Events Progress */}
      <div className="lg:w-80 space-y-8">
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand" /> Upcoming Schedule
          </h2>
          
          <div className="space-y-6">
            {upcomingEvents.map((event) => {
              const isRegistered = registeredIds.includes(event.id);
              return (
                <div key={event.id} className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{event.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{event.displayDate || event.date}</p>
                    </div>
                    {isRegistered && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                  
                  <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: isRegistered ? '100%' : '30%' }}
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        isRegistered ? 'bg-emerald-500' : 'bg-brand'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className={isRegistered ? 'text-emerald-500' : 'text-brand'}>
                      {isRegistered ? 'Ready to attend' : 'Not registered'}
                    </span>
                    <span className="text-slate-400">{event.time.split(' - ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-brand/5 rounded-2xl border border-brand/10">
            <p className="text-xs font-bold text-brand mb-1">Pro Tip</p>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Register early to receive pre-event materials and exclusive networking links.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="relative h-48">
                <img src={selectedEvent.image} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <span className="px-3 py-1 bg-brand text-white rounded-lg text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">
                    {selectedEvent.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{selectedEvent.title}</h3>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Calendar className="w-4 h-4 text-brand" />
                      {selectedEvent.displayDate || selectedEvent.date}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Clock className="w-4 h-4 text-brand" />
                      {selectedEvent.time.split(' - ')[0]}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Registration Details</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    By registering, you'll receive the meeting link, calendar invite, and event reminders. You'll also be able to access the recording after the session.
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmRegistration}
                    className="flex-1 px-6 py-4 bg-brand text-white rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Confirm Registration
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

