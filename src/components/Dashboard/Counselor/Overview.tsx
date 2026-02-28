import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight,
  Mail,
  Calendar,
  MessageSquare,
  Clock,
  Video,
  ExternalLink,
  X,
  Info
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { counselingSessionsStorage, studentsStorage, messagesStorage } from '../../../utils/storage';

export default function CounselorOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState<any[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  useEffect(() => {
    const allSessions = counselingSessionsStorage.get();
    setSessions(allSessions);

    const allStudents = studentsStorage.get();
    // Filter students assigned to this counselor (ID 1)
    const assigned = allStudents.filter((s: any) => s.counselorId === 1);
    setAssignedStudents(assigned);

    const chats = messagesStorage.get();
    const unread = chats.reduce((acc: number, chat: any) => acc + (chat.unread || 0), 0);
    setUnreadMessages(unread);
  }, []);

  const isDashboard = location.pathname.includes('/dashboard');

  const stats = [
    { 
      label: 'Total Students', 
      value: assignedStudents.length, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      path: '/counselor/students'
    },
    { 
      label: 'Scheduled Sessions', 
      value: sessions.length, 
      icon: Calendar, 
      color: 'text-brand', 
      bg: 'bg-brand/10',
      path: '/counselor/sessions'
    },
    { 
      label: 'Unread Messages', 
      value: unreadMessages, 
      icon: MessageSquare, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      path: '/counselor/messages'
    },
  ];

  // Filter stats for students page
  const displayStats = isDashboard ? stats : stats.slice(0, 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isDashboard ? 'Welcome, Mr. Alfred Funmbi' : 'My Students'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isDashboard 
              ? "Here's what's happening with your students today."
              : "Manage and track the progress of all your assigned students."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 gap-6 ${isDashboard ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-sm'}`}>
        {displayStats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(stat.path)}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 cursor-pointer hover:border-brand/20 hover:shadow-md transition-all group"
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`grid gap-8 ${isDashboard ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Student List */}
        <div className={`${isDashboard ? 'lg:col-span-2' : ''} space-y-6`}>
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Student List</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand/20 w-48"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Career</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedStudents.map((student) => (
                    <tr 
                      key={student.id}
                      onClick={() => navigate(`/counselor/students/${student.id}`)}
                      className="group hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-xl object-cover" />
                          <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-2 py-1 bg-brand/5 text-brand rounded-lg text-[10px] font-bold">{student.career || 'General'}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-sm font-bold text-slate-700">{student.class || 'N/A'}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand ml-auto" />
                      </td>
                    </tr>
                  ))}
                  {assignedStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">
                        No students assigned to you yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions - Only on Dashboard */}
        {isDashboard && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-brand" /> Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {sessions.slice(0, 3).map((session) => (
                  <div 
                    key={session.id}
                    onClick={() => navigate('/counselor/sessions')}
                    className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand/20 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img src={session.studentImage || `https://picsum.photos/seed/${session.id}/100/100`} alt={session.studentName} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{session.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand" />
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-sm font-medium text-slate-400 text-center py-4">No upcoming sessions</p>
                )}
              </div>
              <button 
                onClick={() => navigate('/counselor/sessions')}
                className="w-full mt-6 py-3 text-brand font-bold text-sm hover:underline"
              >
                View all sessions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Details Modal - Keep for other potential uses or remove if strictly following "navigate to sessions" */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Session Details</h3>
                <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl">
                  <img src={selectedSession.image} alt={selectedSession.student} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{selectedSession.student}</h4>
                    <p className="text-sm font-bold text-brand uppercase tracking-widest">Student</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session Title</p>
                    <p className="text-lg font-bold text-slate-900">{selectedSession.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                      <p className="text-sm font-bold text-slate-700">{selectedSession.date}, {selectedSession.time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-sm font-bold text-slate-700">{selectedSession.type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {selectedSession.description}
                    </p>
                  </div>
                  {selectedSession.type === 'Virtual' ? (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Meeting Link</p>
                      <a 
                        href={selectedSession.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between text-emerald-700 font-bold hover:underline"
                      >
                        <span className="truncate mr-4">{selectedSession.link}</span>
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-sm font-bold text-blue-700">{selectedSession.location}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
                {selectedSession.type === 'Virtual' && (
                  <a 
                    href={selectedSession.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-[2] py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-5 h-5" /> Join Meeting
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
