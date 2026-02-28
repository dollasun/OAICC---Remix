import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowRight, 
  Star, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Users,
  TrendingUp,
  Bookmark,
  ChevronRight,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savedCareersStorage, counselingSessionsStorage } from '../../../utils/storage';

export default function StudentHome() {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

  useEffect(() => {
    const saved = savedCareersStorage.get([]);
    setSavedIds(saved.map((c: any) => c.id));

    const allSessions = counselingSessionsStorage.get([]);
    // Filter sessions for the current student (mocked as student ID 1)
    const studentSessions = allSessions.filter((s: any) => s.studentId === 1 || s.studentName === 'Osayuki Yuki');
    setUpcomingSessions(studentSessions.slice(0, 2));
  }, []);

  const stats = [
    { label: 'Completed Tasks', value: '12', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Saved Careers', value: savedIds.length.toString(), icon: Bookmark, color: 'bg-brand' },
    { label: 'Upcoming Events', value: '3', icon: Calendar, color: 'bg-indigo-500' },
  ];

  const recommendations = [
    { id: 1, title: 'Software Engineer', category: 'Technology', match: '98%', image: 'https://picsum.photos/seed/tech/400/300' },
    { id: 2, title: 'Graphic Designer', category: 'Creative', match: '85%', image: 'https://picsum.photos/seed/design/400/300' },
    { id: 3, title: 'Data Scientist', category: 'Technology', match: '92%', image: 'https://picsum.photos/seed/data/400/300' },
  ];

  const events = [
    { id: 1, title: 'Tech Career Fair 2024', date: 'Oct 15, 2024', time: '10:00 AM', type: 'Virtual' },
    { id: 2, title: 'Introduction to AI', date: 'Oct 18, 2024', time: '2:00 PM', type: 'Workshop' },
  ];

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
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Bolu! 👋</h1>
          <p className="text-slate-500 font-medium mt-1">Here's what's happening with your career journey today.</p>
        </div>
        <button 
          onClick={() => navigate('/student/careers')}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-all"
        >
          Explore Careers <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Careers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
            <button 
              onClick={() => navigate('/student/careers')}
              className="text-brand font-bold text-sm hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer relative">
                <div className="relative h-48">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand flex items-center gap-1">
                    <Star className="w-3 h-3 fill-brand" /> {item.match} Match
                  </div>
                  <button 
                    onClick={(e) => handleSaveCareer(item, e)}
                    className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-sm transition-all ${
                      savedIds.includes(item.id) 
                        ? 'bg-brand text-white' 
                        : 'bg-white/90 text-slate-400 hover:text-brand'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${savedIds.includes(item.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{item.category}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{item.title}</h3>
                  <button 
                    onClick={() => navigate('/student/careers')}
                    className="w-full py-3 bg-slate-50 text-slate-600 font-bold rounded-xl group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Counseling Sessions */}
          <section className="bg-emerald-500 p-6 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Counseling Sessions</h2>
              <Video className="w-5 h-5 text-white/60" />
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <h3 className="font-bold text-white">{session.title}</h3>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">with {session.counselorName}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-white/80">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                  </div>
                  <button 
                    onClick={() => window.open(session.link || 'https://zoom.us', '_blank')}
                    className="w-full mt-4 py-2 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all text-xs"
                  >
                    Join Meeting
                  </button>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm font-medium text-white/60 mb-4">No scheduled sessions</p>
                  <button 
                    onClick={() => navigate('/student/counselors')}
                    className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm"
                  >
                    Book a Session
                  </button>
                </div>
              )}
              {upcomingSessions.length > 0 && (
                <button 
                  onClick={() => navigate('/student/counselors')}
                  className="w-full py-3 text-white font-bold text-sm hover:bg-white/10 rounded-xl transition-all"
                >
                  View all sessions
                </button>
              )}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => navigate('/student/events')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <h3 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => navigate('/student/events')}
                className="w-full py-3 text-brand font-bold text-sm hover:bg-brand/5 rounded-xl transition-all"
              >
                Explore all events
              </button>
            </div>
          </section>

          {/* Mentor Suggestion */}
          <section className="bg-brand rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2">Need guidance?</h2>
              <p className="text-white/80 text-sm font-medium mb-6">Connect with professional mentors in your field of interest.</p>
              <button 
                onClick={() => navigate('/student/mentors')}
                className="bg-white text-brand px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all"
              >
                Find a Mentor
              </button>
            </div>
            <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
          </section>
        </div>
      </div>
    </div>
  );
}

