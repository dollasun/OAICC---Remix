import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Plus,
  X,
  ExternalLink,
  MessageSquare,
  UserCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type Tab = 'profile' | 'career' | 'tracker';

export default function CounselorStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Mock student data
  const student = {
    id: 's1',
    name: 'Favour Aina',
    email: 'favouraina@gmail.com',
    phone: '08034567890',
    gender: 'Female',
    class: 'SS3 A',
    bio: 'I am an SS3 student at The Oke-Odo School District in Nigeria. I would like to pursue a degree in Computer Science as I am currently in my last year of secondary school.',
    image: 'https://picsum.photos/seed/s1/200/200',
    career: 'Product Design',
    interests: ['UI/UX Design', 'Product Management', 'Graphic Design'],
    topSubjects: ['English Language', 'Mathematics', 'Economics', 'Accounting'],
    activities: [
      { id: 1, type: 'session', title: 'Career Path Discussion', date: 'Today, 2:00 PM', status: 'Upcoming' },
      { id: 2, type: 'quiz', title: 'Career Interest Quiz', date: 'Yesterday', status: 'Completed', score: '85%' },
      { id: 3, type: 'article', title: 'Introduction to Product Design', date: '2 days ago', status: 'Read' },
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/counselor/students')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Students
        </button>
        <button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-6 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" /> Schedule Session
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img src={student.image} alt={student.name} className="w-32 h-32 rounded-[32px] object-cover border-4 border-slate-50 shadow-md" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
              <span className="px-3 py-1 bg-brand/5 text-brand rounded-lg text-xs font-bold uppercase tracking-widest">{student.class}</span>
            </div>
            <div className="flex flex-wrap gap-6 text-slate-500 font-medium mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> {student.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> {student.phone}
              </div>
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-slate-400" /> {student.gender}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand hover:bg-brand/5 transition-all">
                <Mail className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand hover:bg-brand/5 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
        {(['profile', 'career', 'tracker'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Information
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">About {student.name.split(' ')[0]}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{student.bio}</p>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Academic Background</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Class</p>
                    <p className="text-lg font-bold text-slate-900">{student.class}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top Subject</p>
                    <p className="text-lg font-bold text-slate-900">{student.topSubjects[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Top Subjects</h3>
                <div className="space-y-3">
                  {student.topSubjects.map((subject, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                      <span>{subject}</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'career' && (
          <motion.div
            key="career"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Career Interest</h3>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold">High Match</span>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="relative rounded-[32px] overflow-hidden mb-6 aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80" 
                      alt="Product Design" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <h4 className="text-2xl font-bold text-white">{student.career}</h4>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Product design is a branch of industrial design. They use design tools and technical knowledge to design, create and improve the visual and functional aspects of a product. Product designers use product research, sketch and build prototypes to create products that solve problems for users.
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Interest Tags</h4>
                    <div className="flex flex-wrap gap-3">
                      {student.interests.map((interest, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Recommended Resources</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-brand/5 transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand shadow-sm">
                          <Video className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">Intro to UI/UX Design</p>
                          <p className="text-xs font-medium text-slate-500">Video Course • 45 mins</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand" />
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-brand/5 transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">The Design Process</p>
                          <p className="text-xs font-medium text-slate-500">Article • 10 mins read</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tracker' && (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Activity Tree</h3>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100" />

                <div className="space-y-12">
                  {student.activities.map((activity, i) => (
                    <div key={activity.id} className="relative flex items-start gap-8 pl-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm ${
                        activity.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                        activity.status === 'Upcoming' ? 'bg-brand text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {activity.type === 'session' ? <Calendar className="w-4 h-4" /> : 
                         activity.type === 'quiz' ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 bg-slate-50 p-6 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.date}</span>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            activity.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : 
                            activity.status === 'Upcoming' ? 'bg-brand/10 text-brand' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{activity.title}</h4>
                        {activity.score && <p className="text-sm font-bold text-emerald-600">Score: {activity.score}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Session Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Schedule Session</h3>
                  <p className="text-slate-500 font-medium">With {student.name}</p>
                </div>
                <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Session Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Career Path Review"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Session Type</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all appearance-none">
                    <option>Video Call (Google Meet)</option>
                    <option>In-person Meeting</option>
                    <option>Voice Call</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Notes (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Add any specific topics to discuss..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Logic to save session
                    setIsScheduleModalOpen(false);
                  }}
                  className="flex-[2] py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
