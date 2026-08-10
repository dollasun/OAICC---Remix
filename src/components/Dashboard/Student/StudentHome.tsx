import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Video,
  Target,
  X,
  Scale,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savedCareersStorage, counselingSessionsStorage, eventsStorage } from '../../../utils/storage';
import { INITIAL_QUESTIONS } from '../../../data/assessmentQuestions';
import { getTopRecommendedCareers } from '../../../utils/recommendations';
import CompareCareersModal from './CompareCareersModal';
import { useToast } from '../../../context/ToastContext';

export default function StudentHome() {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  const [answeredCount, setAnsweredCount] = useState(0);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [hasCompared, setHasCompared] = useState(() => localStorage.getItem('hasComparedCareers') === 'true');
  const totalQuestions = INITIAL_QUESTIONS.length;
  const { showToast } = useToast();

  const toggleCompare = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(cId => cId !== id));
    } else {
      if (compareIds.length < 2) {
        setCompareIds(prev => {
          const newIds = [...prev, id];
          if (newIds.length === 2 && !hasCompared) {
            setHasCompared(true);
            localStorage.setItem('hasComparedCareers', 'true');
          }
          return newIds;
        });
      } else {
        // Replace the oldest one if already 2 selected, or just notify user
        setCompareIds([compareIds[1], id]);
      }
    }
  };

  useEffect(() => {
    const saved = savedCareersStorage.get([]);
    setSavedIds(saved.map((c: any) => typeof c === 'number' ? c : c.id));

    const allSessions = counselingSessionsStorage.get([]);
    // Filter sessions for the current student (mocked as student ID 1)
    const studentSessions = allSessions.filter((s: any) => s.studentId === 1 || s.studentName === 'Osayuki Yuki');
    setUpcomingSessions(studentSessions.slice(0, 2));

    // Get top 10 careers with highest recommendation scores
    const topRecommended = getTopRecommendedCareers(10);
    setRecommendations(topRecommended);

    const allEvents = eventsStorage.get([]);
    setEvents(allEvents.slice(0, 2));

    const assessmentSaved = localStorage.getItem('studentAssessmentAnswers');
    let count = 0;
    if (assessmentSaved) {
      count = Object.keys(JSON.parse(assessmentSaved)).length;
      setAnsweredCount(count);
    }

    if (count < totalQuestions) {
      setTimeout(() => {
        showToast('Please complete your onboarding questions.', 'info', {
          label: 'Complete Now',
          onClick: () => navigate('/student/onboarding?continue=true')
        });
      }, 500);
    }
  }, []);

  const stats = [
    { label: 'Completed Tasks', value: '12', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Saved Careers', value: savedIds.length.toString(), icon: Bookmark, color: 'bg-brand' },
    { label: 'Upcoming Events', value: events.length.toString(), icon: Calendar, color: 'bg-indigo-500' },
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

  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const badges = [
    {
      id: 'starter',
      title: 'Assessment Starter',
      description: 'Started the career assessment',
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
      unlocked: answeredCount > 0,
    },
    {
      id: 'self_aware',
      title: 'Self-Aware',
      description: 'Completed the career assessment',
      icon: Star,
      color: 'bg-brand',
      bgColor: 'bg-brand/10',
      textColor: 'text-brand',
      unlocked: answeredCount === totalQuestions,
    },
    {
      id: 'explorer',
      title: 'Career Explorer',
      description: 'Saved your first career',
      icon: Bookmark,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-500',
      unlocked: savedIds.length > 0,
    },
    {
      id: 'decisive',
      title: 'Decisive Planner',
      description: 'Saved 3 or more careers',
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-500',
      unlocked: savedIds.length >= 3,
    },
    {
      id: 'analytical',
      title: 'Analytical Thinker',
      description: 'Compared two careers',
      icon: Scale,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-500',
      unlocked: hasCompared,
    }
  ];

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
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-sm shadow-brand/5 hover:scale-105 transition-all"
        >
          Explore Careers <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Assessment Prompt */}
      {completionPercentage < 100 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-brand/20 p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="flex-1 relative z-10 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Complete your Onboarding Assessment</h2>
            </div>
            
            <p className="text-slate-600 font-medium mb-6">
              You haven't finished your Career Discovery Assessment yet! 
              Answer a few more questions to unlock highly personalized career matches and mentor recommendations.
            </p>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
                <span className="font-bold text-brand text-sm">{completionPercentage}%</span>
              </div>
              <div className="flex-1 w-full text-left">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-slate-700">Assessment Progress</p>
                  <span className="text-xs text-slate-500 font-medium">{answeredCount} / {totalQuestions} answered</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-brand rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/onboarding/student?continue=true')}
              className="w-full sm:w-auto px-8 py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/10 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Continue Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-sm transition-all group"
          >
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Career Milestones */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Career Milestones</h2>
            <p className="text-sm text-slate-500 font-medium">Earn badges by completing your profile and exploring careers.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked 
                  ? `bg-white border-slate-200 shadow-sm hover:shadow-md` 
                  : 'bg-slate-50 border-slate-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 relative ${badge.bgColor} ${badge.textColor}`}>
                  <badge.icon className="w-6 h-6" />
                  {!badge.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 border-2 border-slate-50">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                  {badge.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>{badge.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
            {recommendations.map((item, idx) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/student/careers/${item.id}`)}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer relative flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-brand flex items-center gap-1 shadow-sm border border-slate-100">
                      <Star className="w-3.5 h-3.5 fill-brand text-brand" /> {item.match || item.matchScore + '%'} Match
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                      Rank #{idx + 1}
                    </div>
                    <button 
                      onClick={(e) => handleSaveCareer(item, e)}
                      className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-all ${
                        savedIds.includes(item.id) 
                          ? 'bg-brand text-white' 
                          : 'bg-white/90 text-slate-400 hover:text-brand'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedIds.includes(item.id) ? 'fill-white' : ''}`} />
                    </button>

                    <button 
                      onClick={(e) => toggleCompare(e, item.id)}
                      className={`absolute top-12 right-3 mt-1 p-2 rounded-lg backdrop-blur-sm transition-all ${
                        compareIds.includes(item.id) 
                          ? 'bg-emerald-500 text-white shadow-md' 
                          : 'bg-white/90 text-slate-400 hover:text-emerald-500'
                      }`}
                      title="Compare Career"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-3">{item.description}</p>
                    {item.salary && (
                      <p className="text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-4">
                        Salary: <span className="text-brand">{item.salary}</span>
                      </p>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Match Score</span>
                        <span className="text-brand">{item.matchScore || parseInt(item.match)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand rounded-full" 
                          style={{ width: `${item.matchScore || parseInt(item.match)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student/careers/${item.id}`);
                    }}
                    className="w-full py-2.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-xl group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
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
          <section className="bg-emerald-500 p-6 rounded-2xl text-white shadow-sm shadow-emerald-500/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Counseling Sessions</h2>
              <Video className="w-5 h-5 text-white/60" />
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <h3 className="font-bold text-white">{session.title}</h3>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">with {session.counselorName}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-white/80">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                  </div>
                  <button 
                    onClick={() => window.open(session.link || 'https://zoom.us', '_blank')}
                    className="w-full mt-4 py-2 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all text-xs"
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
                    className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    Book a Session
                  </button>
                </div>
              )}
              {upcomingSessions.length > 0 && (
                <button 
                  onClick={() => navigate('/student/counselors')}
                  className="w-full py-3 text-white font-bold text-sm hover:bg-white/10 rounded-lg transition-all"
                >
                  View all sessions
                </button>
              )}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => navigate('/student/events')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
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
                className="w-full py-3 text-brand font-bold text-sm hover:bg-brand/5 rounded-lg transition-all"
              >
                Explore all events
              </button>
            </div>
          </section>

          {/* Mentor Suggestion */}
          <section className="bg-brand rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2">Need guidance?</h2>
              <p className="text-white/80 text-sm font-medium mb-6">Connect with professional mentors in your field of interest.</p>
              <button 
                onClick={() => navigate('/student/mentors')}
                className="bg-white text-brand px-6 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all"
              >
                Find a Mentor
              </button>
            </div>
            <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
          </section>
        </div>
      </div>
      
      {/* Compare Floating Bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold">{compareIds.length} Career{compareIds.length > 1 ? 's' : ''} Selected</p>
                <p className="text-xs text-slate-400">
                  {compareIds.length === 1 ? 'Select one more to compare' : 'Ready to compare'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <button 
                onClick={() => setCompareIds([])}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Clear
              </button>
              <button 
                disabled={compareIds.length !== 2}
                onClick={() => setShowCompareModal(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  compareIds.length === 2 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20' 
                    : 'bg-white/10 text-slate-400 cursor-not-allowed'
                }`}
              >
                Compare Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCompareModal && compareIds.length === 2 && (
        <CompareCareersModal 
          careerIds={compareIds} 
          onClose={() => setShowCompareModal(false)} 
        />
      )}
    </div>
  );
}


