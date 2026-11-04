import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Target, 
  Activity as ActivityIcon, 
  Calendar, 
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronRight,
  ExternalLink,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Star,
  Users,
  BookOpen,
  X,
  Briefcase,
  GraduationCap,
  DollarSign
} from 'lucide-react';
import { Activity } from '../../types';
import { savedCareersStorage, schoolStorage } from '../../utils/storage';
import { activity, addStudentNote, className, fullName, parentsStore, sessionStore, studentsStore, teacherOfClass } from '../../utils/schoolData';
import { trackerEntries } from './studentTimeline';
import { getTopRecommendedCareers } from '../../utils/recommendations';

export default function ChildDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'interests' | 'tracker'>('tracker');
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [selectedCareerModal, setSelectedCareerModal] = useState<any | null>(null);

  const session = sessionStore.get();
  const record = studentsStore.get(id);
  // A parent may only open their own children.
  const allowed = Boolean(record && session?.role === 'parent' && record.parentIds.includes(session.userId));
  const child = {
    firstName: record?.firstName || 'Awaiting',
    lastName: record ? (record.lastName || (record.firstName ? '' : 'sign-up')) : '',
    class: record?.classId ? className(record.classId) : 'No class yet',
    school: record?.schoolId ? (schoolStorage.get()?.name ?? 'Your school') : 'No school yet',
    avatar: `https://picsum.photos/seed/${id}/200/200`,
  };

  // 1. Career Interest list: top 10 recommended careers + favorited careers
  const recommendedCareers = getTopRecommendedCareers(5).slice(0, 6);
  const [combinedCareers, setCombinedCareers] = useState<any[]>([]);

  useEffect(() => {
    const saved = savedCareersStorage.get([]);
    const careerList: any[] = [...recommendedCareers];

    saved.forEach((savedCareer: any) => {
      const existingIndex = careerList.findIndex(
        (c: any) => c.id === savedCareer.id || c.title?.toLowerCase() === savedCareer.title?.toLowerCase()
      );

      if (existingIndex !== -1) {
        careerList[existingIndex] = {
          ...careerList[existingIndex],
          isFavorited: true
        };
      } else {
        careerList.push({
          id: savedCareer.id || Date.now(),
          title: savedCareer.title,
          category: savedCareer.category || 'Technology',
          description: savedCareer.description || `Explore career paths and opportunities in ${savedCareer.title}.`,
          matchScore: savedCareer.matchScore || parseInt(savedCareer.match) || 92,
          match: savedCareer.match || `${savedCareer.matchScore || 92}%`,
          salary: savedCareer.salary || '$80,000 - $140,000',
          growth: savedCareer.growth || '20%',
          education: savedCareer.education || "Bachelor's Degree",
          image: savedCareer.image || `https://picsum.photos/seed/${savedCareer.id || savedCareer.title}/600/400`,
          isFavorited: true
        });
      }
    });

    setCombinedCareers(careerList);
  }, []);

  // 2. Activity Tracker data (same format as Student Activity Tracker)
  const trackerActivities = trackerEntries(id);
  const [noteVersion, setNoteVersion] = useState(0);
  void noteVersion; // re-read the activity feed after posting a note
  const [newNote, setNewNote] = useState('');
  const notes = id ? activity.forStudent(id).filter(a => a.type === 'note') : [];
  const classTeacher = record?.classId ? teacherOfClass(record.classId) : undefined;
  const parentRecord = session?.role === 'parent' ? parentsStore.get(session.userId) : undefined;
  const postNote = () => {
    if (!id || !newNote.trim()) return;
    addStudentNote(id, parentRecord ? fullName(parentRecord) || 'Parent' : 'Parent', 'Parent', newNote.trim());
    setNewNote('');
    setNoteVersion(v => v + 1);
  };

  // 3. Milestones data
  const milestones = trackerEntries(id).filter(e => e.type !== 'note').map(e => ({ id: e.id, title: e.title, date: e.date, icon: e.icon }));

  if (!allowed) return <Navigate to="/parent/dashboard" replace />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={child.avatar} alt={child.firstName} className="w-24 h-24 rounded-2xl object-cover" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{child.firstName} {child.lastName}</h1>
            <p className="text-slate-500 font-medium">{child.class} • {child.school}</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <Edit2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 p-1 bg-slate-50 rounded-xl w-fit">
          {[
            { id: 'profile', label: 'Profile Information', icon: <User className="w-4 h-4" /> },
            { id: 'interests', label: 'Career Interest', icon: <Target className="w-4 h-4" /> },
            { id: 'tracker', label: 'Tracker', icon: <ActivityIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-brand shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {/* CAREER INTEREST TAB */}
        {activeTab === 'interests' && (
          <motion.div
            key="interests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Top Recommended Careers</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Top 10 recommended career paths for {child.firstName} along with saved favorites
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combinedCareers.map((career, index) => {
                  const matchValue = career.matchScore || parseInt(career.match) || 95;
                  return (
                    <div key={`child-career-${career.id}-${index}`} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group hover:shadow-md transition-all flex flex-col">
                      <div className="relative h-40">
                        <img 
                          src={career.image} 
                          alt={career.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                          <div className="flex items-center justify-between w-full">
                            <h4 className="text-xl font-bold text-white line-clamp-1">{career.title}</h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {career.isFavorited && (
                                <span className="px-2.5 py-1 bg-amber-500/90 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-white" /> Saved
                                </span>
                              )}
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-slate-600 font-medium mb-4 line-clamp-2">
                            {career.description}
                          </p>
                          
                          <div className="space-y-1.5 mb-6">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-500">Match Score</span>
                              <span className="text-brand font-extrabold">{matchValue}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand rounded-full" 
                                style={{ width: `${matchValue}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedCareerModal(career)}
                          className="w-full py-2.5 bg-white text-slate-600 font-bold text-sm rounded-xl hover:bg-brand hover:text-white transition-all border border-slate-200 hover:border-brand shadow-sm flex items-center justify-center gap-2 mt-auto"
                        >
                          View More Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TRACKER TAB */}
        {activeTab === 'tracker' && (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Recent Activity Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-brand" /> Recent Activity
                  </h2>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-600">
                      <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative space-y-8 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                  {trackerActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-16 group"
                    >
                      <div className={`absolute left-0 w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform z-10`}>
                        <activity.icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                        <span className="text-xs font-bold text-slate-400">{activity.date}</span>
                      </div>
                      
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-brand/20 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                            activity.status === 'Upcoming' ? 'bg-brand/10 text-brand' :
                            activity.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600">{activity.details}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-8 py-4 text-slate-400 font-bold text-sm hover:text-brand transition-colors">
                  Load more activity
                </button>
              </div>
            </div>

            {/* Right Column: Milestones and Achievements */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-brand" /> Milestones
                </h2>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                        <milestone.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{milestone.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{milestone.date}</p>
                      </div>
                      <div className="ml-auto">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setIsAchievementsModalOpen(true)}
                  className="w-full mt-6 py-3 text-brand font-bold text-sm hover:underline flex items-center justify-center gap-1"
                >
                  View all achievements
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 space-y-12">
                <div className="space-y-6">
                  {[
                    { label: 'First Name', value: record?.firstName || 'Not provided' },
                    { label: 'Last Name', value: record?.lastName || 'Not provided' },
                    { label: 'Email Address', value: record?.email ?? '' },
                    { label: 'Phone Number', value: record?.phone || 'Not provided' },
                    { label: 'Class', value: child.class },
                    { label: 'School', value: child.school },
                  ].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-4 items-start">
                      <p className="text-slate-500 font-medium">{item.label}</p>
                      <p className="text-slate-900 font-bold leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Teacher</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><User className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{classTeacher ? (fullName(classTeacher) || classTeacher.email) : 'No teacher assigned yet'}</p>
                      {classTeacher && <p className="text-xs text-slate-500">Teacher at {child.school}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Notes</h3>
                <textarea
                  placeholder="Leave a note for the teacher..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="w-full h-32 p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-none"
                />
                <div className="mt-4 flex justify-end">
                  <button onClick={postNote} disabled={!newNote.trim()} className="btn-primary text-xs px-4 py-2 disabled:opacity-50">Post note</button>
                </div>
                <div className="mt-6 space-y-4">
                  {notes.length === 0 && <p className="text-xs text-slate-400 font-medium">No notes yet.</p>}
                  {notes.map(n => (
                    <div key={n.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-bold shrink-0">{(n.author ?? '?')[0]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-xs font-bold">{n.author} <span className="text-[10px] text-brand uppercase tracking-wider">{n.authorRole}</span></p>
                          <p className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Assigned Team</h3>
                <div className="space-y-4">
                  {classTeacher ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Teacher</p>
                        <p className="text-sm font-bold text-slate-900">{fullName(classTeacher) || classTeacher.email}</p>
                        <p className="text-[10px] text-slate-500">{child.school}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-medium">No one has been assigned yet.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALL ACHIEVEMENTS MODAL */}
      <AnimatePresence>
        {isAchievementsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAchievementsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">All Achievements</h2>
                    <p className="text-sm text-slate-500 font-medium">Milestones and badges earned by {child.firstName}</p>
                  </div>
                  <button onClick={() => setIsAchievementsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {milestones.map((m, idx) => (
                    <div key={`child-modal-m-${m.id}-${idx}`} className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                        <m.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{m.title}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{m.date}</p>
                      </div>
                      <div className="ml-auto">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CAREER DETAILS MODAL */}
      <AnimatePresence>
        {selectedCareerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCareerModal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Banner */}
              <div className="relative h-48 sm:h-56">
                <img 
                  src={selectedCareerModal.image} 
                  alt={selectedCareerModal.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-6 sm:p-8">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                        {selectedCareerModal.category || 'Career Path'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedCareerModal.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedCareerModal(null)}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedCareerModal.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand" /> Average Salary
                    </p>
                    <p className="text-sm font-bold text-slate-900">{selectedCareerModal.salary || '$85,000 - $150,000'}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-brand" /> Job Growth Rate
                    </p>
                    <p className="text-sm font-bold text-slate-900">{selectedCareerModal.growth || '22%'}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-brand" /> Required Education
                    </p>
                    <p className="text-sm font-bold text-slate-900">{selectedCareerModal.education || "Bachelor's Degree"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Assessment Match</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand rounded-full" 
                        style={{ width: `${selectedCareerModal.matchScore || parseInt(selectedCareerModal.match) || 95}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-brand">{selectedCareerModal.matchScore || parseInt(selectedCareerModal.match) || 95}% Match</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedCareerModal(null)}
                  className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
