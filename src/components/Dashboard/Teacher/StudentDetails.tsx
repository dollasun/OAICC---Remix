import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { schoolStorage } from '../../../utils/storage';
import { activity, addStudentNote, className, classesForTeacher, fullName, parentsStore, sessionStore, studentsStore, teachersStore } from '../../../utils/schoolData';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../context/ToastContext';
import { 
  User, 
  Target, 
  Activity as ActivityIcon, 
  Calendar, 
  Filter,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Bell,
  Search,
  X
} from 'lucide-react';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'interests' | 'tracker' | 'resources' | 'events' | 'sessions'>('profile');
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const session = sessionStore.get();
  const record = studentsStore.get(id);
  const teacher = session?.role === 'teacher' ? teachersStore.get(session.userId) : undefined;
  const teacherName = teacher ? (fullName(teacher) || teacher.email) : 'Teacher';
  const [version, setVersion] = useState(0);
  void version; // re-read the activity feed after a new comment
  const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const feed = id ? activity.forStudent(id) : [];
  const parents = record ? record.parentIds.map(pid => parentsStore.get(pid)).filter((p): p is NonNullable<typeof p> => Boolean(p)) : [];
  const comments = feed.filter(a => a.type === 'note').map(a => ({
    id: a.id, author: a.author ?? 'Teacher', role: a.authorRole ?? 'Teacher', text: a.text ?? '', time: fmt(a.createdAt),
    avatar: `https://picsum.photos/seed/${a.author ?? 'teacher'}/100/100`,
  }));
  const activities = feed.map(a => ({
    id: a.id, type: a.type === 'onboarding' ? 'Quiz' : 'System', title: a.title, description: a.text ?? a.title, time: fmt(a.createdAt),
  }));

  const handleAddComment = () => {
    if (!newComment.trim() || !id) return;
    addStudentNote(id, teacherName, 'Teacher', newComment.trim());
    setVersion(v => v + 1);
    setNewComment('');
    showToast('Comment added successfully!');
  };

  const student = {
    firstName: record?.firstName || 'Awaiting',
    lastName: record ? (record.lastName || (record.firstName ? '' : 'sign-up')) : '',
    class: record?.classId ? className(record.classId) : 'No class',
    school: schoolStorage.get()?.name ?? 'Your school',
    avatar: `https://picsum.photos/seed/${id}/200/200`,
  };
  const allowed = Boolean(record && teacher && record.classId && classesForTeacher(teacher.id).some(c => c.id === record.classId));

  if (!allowed) return <Navigate to="/teacher/dashboard" replace />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img src={student.avatar} alt={student.firstName} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-slate-400 text-sm font-medium">{student.class}</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900 text-sm font-bold">{student.firstName} {student.lastName}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
          <p className="text-slate-500 font-medium">Institution: {student.school}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-50 rounded-xl w-fit">
        {[
          { id: 'profile', label: 'Profile Information' },
          { id: 'interests', label: 'Career Interest' },
          { id: 'tracker', label: 'Tracker' },
          { id: 'resources', label: 'Resources' },
          { id: 'events', label: 'Events' },
          { id: 'sessions', label: 'Sessions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-brand shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 space-y-12">
              <div className="space-y-6">
                {[
                  { label: 'First Name', value: record?.firstName || 'Not provided' },
                  { label: 'Last Name', value: record?.lastName || 'Not provided' },
                  { label: 'Email Address', value: record?.email ?? '' },
                  { label: 'Phone Number', value: record?.phone || 'Not provided' },
                  { label: 'Class', value: student.class },
                  { label: 'Onboarding', value: record?.onboarded ? 'Complete' : 'Pending' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[200px_1fr] gap-4 items-start">
                    <p className="text-slate-500 font-medium">{item.label}</p>
                    <p className="text-slate-900 font-bold leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Parents / Guardians</h4>
                {parents.length === 0 ? (
                  <p className="text-sm text-slate-400 font-medium">No parent has been linked to this student yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {parents.map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><User className="w-6 h-6" /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{fullName(p) || 'Awaiting sign-up'}</p>
                          <p className="text-xs text-slate-500">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Front-end Developer</h2>
                <div className="relative rounded-xl overflow-hidden mb-8 aspect-video">
                  <img src="https://picsum.photos/seed/coding/800/450" className="w-full h-full object-cover" alt="Coding" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <button onClick={() => setIsInterestModalOpen(true)} className="btn-primary px-8">View details</button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Mentor</h3>
                    <div className="flex items-center gap-4">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-14 h-14 rounded-full object-cover" alt="Mentor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mason Biyi</p>
                        <p className="text-xs text-slate-500">Full Stack Developer at Techinnover</p>
                      </div>
                      <button className="ml-auto text-brand font-bold text-sm hover:underline">View more</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Recent Activities By {student.firstName}</h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-bold text-slate-600">
                    <Calendar className="w-4 h-4" /> January 2023
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative pl-12">
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 ${
                      activity.type === 'Mentor' ? 'bg-blue-500' : 
                      activity.type === 'Interest' ? 'bg-orange-500' : 
                      activity.type === 'Quiz' ? 'bg-cyan-500' : 'bg-slate-400'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 group hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{activity.time}</p>
                          <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

          {activeTab === 'resources' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Recommended Resources</h2>
                <button 
                  onClick={() => setIsRecommendModalOpen(true)}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
                >
                  Recommend Resource
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Introduction to React', type: 'Video', duration: '15 mins', image: 'https://picsum.photos/seed/react/400/225' },
                  { title: 'Modern CSS Layouts', type: 'Article', duration: '10 mins read', image: 'https://picsum.photos/seed/css/400/225' },
                ].map((resource, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                      <img src={resource.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={resource.title} />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand rounded-lg text-[10px] font-bold uppercase tracking-widest">{resource.type}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{resource.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{resource.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Student Events</h2>
              <div className="space-y-6">
                {[
                  { title: 'Tech Innovation Summit', date: 'Oct 25, 2024', time: '10:00 AM', status: 'Registered' },
                  { title: 'Career Path Workshop', date: 'Nov 12, 2024', time: '2:00 PM', status: 'Upcoming' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand shadow-sm">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{event.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{event.date} • {event.time}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      event.status === 'Registered' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand/10 text-brand'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Counseling Sessions</h2>
              <div className="space-y-6">
                {[
                  { title: 'Career Path Discussion', counselor: 'Sarah Ojo', date: 'Oct 15, 2024', status: 'Completed' },
                  { title: 'Academic Progress Review', counselor: 'Sarah Ojo', date: 'Nov 05, 2024', status: 'Scheduled' },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{session.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">with {session.counselor} • {session.date}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      session.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Comments</h3>
            <textarea 
              placeholder="Leave a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-none"
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleAddComment}
                className="btn-primary text-xs px-4 py-2"
              >
                Post Comment
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img src={comment.avatar} className="w-10 h-10 rounded-full object-cover" alt={comment.author} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{comment.author}</p>
                        <p className="text-[10px] font-bold text-brand uppercase tracking-widest">{comment.role}</p>
                      </div>
                      <p className="text-[10px] text-slate-400">{comment.time}</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Recommend Resource Modal */}
      <AnimatePresence>
        {isRecommendModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecommendModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Recommend Resource</h3>
                  <button onClick={() => setIsRecommendModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Resource Title</label>
                    <input type="text" placeholder="e.g. Advanced JavaScript Patterns" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Resource Link</label>
                    <input type="url" placeholder="https://..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Why are you recommending this?</label>
                    <textarea rows={4} placeholder="Add a brief explanation..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium resize-none" />
                  </div>
                  <button 
                    onClick={() => {
                      setIsRecommendModalOpen(false);
                      showToast('Resource recommended successfully!');
                    }}
                    className="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all"
                  >
                    Send Recommendation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interest Detail Modal */}
      <AnimatePresence>
        {isInterestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInterestModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Front-end Developer</h3>
                  <button onClick={() => setIsInterestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <img src="https://picsum.photos/seed/coding/800/450" className="w-full rounded-xl aspect-video object-cover" alt="Coding" />
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Topic of Interest</h4>
                    <div className="flex flex-wrap gap-2">
                      {['HTML', 'CSS', 'Coding', 'Front-end', 'Developer'].map(tag => (
                        <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Top skills</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Physical fitness', 'leadership', 'communication', 'first aid'].map(skill => (
                        <span key={skill} className="px-4 py-2 border border-slate-100 text-slate-600 rounded-lg text-xs font-bold text-center">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">About</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Maxwell's equations—the foundation of classical electromagnetism—describe light as a wave that moves with a characteristic velocity. The modern view is that light needs no medium of transmission, but Maxwell and his contemporaries were convinced that light waves were propagated in a medium, analogous to sound propagating in air, and ripples propagating on the surface of a pond. This hypothetical medium was called the luminiferous aether, at rest relative to the "fixed stars" and through which the Earth moves. Fresnel's partial ether dragging hypothesis ruled out the measurement of first-order (v/c) effects, and although observations of second-order effects (v2/c2) were possible in principle, Maxwell thought they were too small to be detected with then-current technology... <button className="text-brand font-bold">Read more</button>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Mentor</h4>
                    <div className="flex items-center gap-4">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-12 h-12 rounded-full object-cover" alt="Mentor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mason Biyi</p>
                        <p className="text-xs text-slate-500">Full Stack Developer at Techinnover</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
