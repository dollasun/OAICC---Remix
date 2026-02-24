import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../context/ToastContext';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Target, 
  TrendingUp,
  Clock,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SchoolStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  const student = {
    name: 'Esther Rae',
    role: 'Student',
    email: 'estherrae@oaicc.com',
    phone: '+234 801 234 5678',
    class: 'SSS3',
    location: 'Lagos, Nigeria',
    joinedDate: 'Jan 6, 2022',
    initials: 'ER',
    color: 'bg-cyan-100 text-cyan-600',
    bio: 'Esther is a brilliant student with a keen interest in technology and creative arts. She consistently performs well in her academics and is an active participant in school clubs.',
    interests: [
      { id: 1, title: 'Software Engineering', category: 'Technology', level: 'High', icon: '💻' },
      { id: 2, title: 'Digital Art', category: 'Creative', level: 'Medium', icon: '🎨' },
      { id: 3, title: 'Public Speaking', category: 'Communication', level: 'Medium', icon: '🎤' },
    ],
    activities: [
      { id: 1, title: 'Completed Career Assessment', date: '2 hours ago', type: 'assessment' },
      { id: 2, title: 'Joined Robotics Club', date: 'Yesterday', type: 'club' },
      { id: 3, title: 'Updated Career Interests', date: '3 days ago', type: 'update' },
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-brand hover:border-brand transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-xl font-bold ${student.color} shadow-sm`}>
              {student.initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                {student.role} • {student.class}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Download Report
          </button>
          <button 
            onClick={() => setIsNoteModalOpen(true)}
            className="btn-primary px-6 py-3"
          >
            Add Admin Note
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {['profile', 'interests', 'activities'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${
              activeTab === tab ? 'text-brand' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                        <p className="text-slate-900 font-bold">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                        <p className="text-slate-900 font-bold">{student.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                        <p className="text-slate-900 font-bold">{student.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</p>
                        <p className="text-slate-900 font-bold">{student.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Biography</h3>
                <p className="text-slate-600 leading-relaxed">{student.bio}</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'interests' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {student.interests.map((interest) => (
                <div 
                  key={interest.id}
                  onClick={() => setIsInterestModalOpen(true)}
                  className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:border-brand transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {interest.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      interest.level === 'High' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {interest.level} Interest
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{interest.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{interest.category}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100"
            >
              <div className="space-y-8">
                {student.activities.map((activity, idx) => (
                  <div key={activity.id} className="flex gap-6 relative">
                    {idx !== student.activities.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-[-32px] w-px bg-slate-100" />
                    )}
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 z-10">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{activity.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Assigned Team</h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                T1
              </div>
              <div>
                <p className="font-bold text-slate-900">Tech Innovators</p>
                <p className="text-xs text-slate-500">5 Members</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Admin Notes</h3>
              <button className="text-brand font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed mb-3 italic">
                  "Esther has shown great progress in her robotics project. Recommended for the upcoming tech competition."
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">By Admin • 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Admin Note</h3>
              <textarea 
                placeholder="Type your note here..." 
                className="input-field min-h-[150px] py-4 resize-none"
              />
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsNoteModalOpen(false);
                    showToast('Admin note saved successfully!');
                  }}
                  className="flex-1 btn-primary"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
