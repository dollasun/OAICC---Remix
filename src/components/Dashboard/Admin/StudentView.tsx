import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  Activity, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminStudentView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'interest' | 'tracker'>('profile');

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-8">
        <img 
          src="https://picsum.photos/seed/student/200/200" 
          alt="Student" 
          className="w-32 h-32 rounded-[40px] object-cover border-4 border-slate-50 shadow-xl"
        />
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-3xl font-bold text-slate-900">Favour Aina</h2>
          <p className="text-slate-500 font-medium mt-1">JSS 3 A • The Seaside School</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
            <span className="px-4 py-1.5 bg-brand/10 text-brand rounded-xl text-xs font-bold uppercase tracking-widest">Student</span>
            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-100">Joined Jan 2022</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm w-fit mx-auto sm:mx-0">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-8 sm:px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'profile' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Profile Information
        </button>
        <button 
          onClick={() => setActiveTab('interest')}
          className={`px-8 sm:px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'interest' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Career Interest
        </button>
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`px-8 sm:px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'tracker' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Tracker
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">User ID</span>
                    <span className="font-bold text-slate-700">recR23ortRikranhx</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Created on</span>
                    <span className="font-bold text-slate-700">7 September, 2022, 13:28</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">First Name</span>
                    <span className="font-bold text-slate-700">Favour</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last Name</span>
                    <span className="font-bold text-slate-700">Aina</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                    <span className="font-bold text-slate-700">favouraina@gmail.com</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                    <span className="font-bold text-slate-700">08054883021</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gender</span>
                    <span className="font-bold text-slate-700">Female</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Account Type</span>
                    <span className="font-bold text-slate-700">Individual Account</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Class</span>
                    <span className="font-bold text-slate-700">JSS 3 A</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Home Address</span>
                    <span className="font-bold text-slate-700">34, Wuse II, Abuja, Nigeria</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bio</span>
                <p className="text-slate-600 font-medium leading-relaxed">
                  I am an JSS 3 student at The Seaside School based in Nigeria. I would love to pursue a degree in Computer science. I am currently in a Tech wiz club at my secondary school.
                </p>
              </div>

              <div className="pt-10 border-t border-slate-50">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Teacher</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl w-fit">
                  <img src="https://picsum.photos/seed/teacher/100/100" className="w-12 h-12 rounded-2xl object-cover" alt="Teacher" />
                  <div>
                    <p className="font-bold text-slate-900">Mr. Uzo Kelechi</p>
                    <p className="text-xs font-medium text-slate-500">Teacher at The Seaside School</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'interest' && (
          <motion.div
            key="interest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Front-end Developer</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative h-64 rounded-[32px] overflow-hidden shadow-xl">
                  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Career" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="px-4 py-1.5 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-widest">Recommended</span>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Mentor</h4>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-14 h-14 rounded-2xl object-cover" alt="Mentor" />
                      <div>
                        <p className="font-bold text-slate-900">Mason Elpi</p>
                        <p className="text-xs font-medium text-slate-500">Full Stack Developer at Techmover</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Match Score</p>
                      <p className="text-2xl font-bold text-emerald-700">95%</p>
                    </div>
                    <div className="p-6 bg-brand/5 rounded-3xl border border-brand/10">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Interest Level</p>
                      <p className="text-2xl font-bold text-brand">High</p>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-10">Learning Progress</h3>
            <div className="space-y-12">
              {[
                { title: 'Introduction to Web Development', status: 'Completed', date: 'Oct 12, 2023', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: 'HTML & CSS Fundamentals', status: 'Completed', date: 'Oct 25, 2023', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: 'JavaScript Basics', status: 'In Progress', date: 'Started Nov 5, 2023', icon: Clock, color: 'text-brand', bg: 'bg-brand/10' },
                { title: 'React Framework', status: 'Not Started', date: '-', icon: Clock, color: 'text-slate-300', bg: 'bg-slate-50' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative">
                  {i !== 3 && <div className="absolute left-7 top-14 bottom-[-48px] w-0.5 bg-slate-100" />}
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0 z-10`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.status}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
