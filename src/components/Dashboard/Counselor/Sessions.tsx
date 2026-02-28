import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  ChevronRight, 
  Search, 
  Filter, 
  Plus, 
  X, 
  User, 
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { counselingSessionsStorage, studentsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

export default function Sessions() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    studentId: '',
    title: '',
    date: '',
    time: '09:00 AM',
    type: 'Virtual',
    link: ''
  });

  useEffect(() => {
    // For now, we assume the logged-in counselor has ID 1
    const allSessions = counselingSessionsStorage.get();
    setSessions(allSessions);

    const allStudents = studentsStorage.get();
    // Filter students assigned to this counselor (ID 1)
    const assigned = allStudents.filter((s: any) => s.counselorId === 1);
    setAssignedStudents(assigned);
  }, []);

  const handleCreateSession = () => {
    if (!newSessionData.studentId || !newSessionData.title || !newSessionData.date) {
      showToast('Please fill in all required fields');
      return;
    }

    const student = assignedStudents.find(s => s.id === Number(newSessionData.studentId));
    if (!student) return;

    const newSession = {
      id: Date.now(),
      counselorId: 1,
      counselorName: 'Mr. Alfred Funmbi', // Mocked counselor name
      studentId: student.id,
      studentName: student.name,
      studentImage: student.avatar,
      title: newSessionData.title,
      date: newSessionData.date,
      time: newSessionData.time,
      type: newSessionData.type,
      link: newSessionData.link || 'https://zoom.us/j/123456789',
      status: 'Upcoming'
    };

    const allSessions = counselingSessionsStorage.get([]);
    const updatedSessions = [...allSessions, newSession];
    counselingSessionsStorage.save(updatedSessions);
    setSessions(updatedSessions);
    
    setIsNewSessionModalOpen(false);
    setNewSessionData({
      studentId: '',
      title: '',
      date: '',
      time: '09:00 AM',
      type: 'Virtual',
      link: ''
    });
    showToast('Counseling session scheduled successfully!');
  };

  const filteredSessions = sessions.filter(s => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scheduled Sessions</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your upcoming meetings with students.</p>
        </div>
        <button 
          onClick={() => setIsNewSessionModalOpen(true)}
          className="px-6 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Session
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sessions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-brand/5 font-medium text-slate-700 shadow-sm transition-all"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-[20px] font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="grid gap-6">
        {filteredSessions.map((session) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-brand/20 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <img src={session.studentImage || `https://picsum.photos/seed/${session.id}/100/100`} alt={session.studentName} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{session.title}</h3>
                <p className="text-sm font-medium text-slate-500">with {session.studentName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 md:px-8 md:border-x border-slate-50">
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                <CalendarIcon className="w-4 h-4 text-brand" />
                <span className="text-sm">{session.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                <Clock className="w-4 h-4 text-brand" />
                <span className="text-sm">{session.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                {session.type === 'Virtual' ? <Video className="w-4 h-4 text-brand" /> : <MapPin className="w-4 h-4 text-brand" />}
                <span className="text-sm">{session.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-widest">
                {session.status}
              </span>
              <button 
                onClick={() => {
                  if (session.type === 'Virtual') {
                    window.open(session.link || 'https://zoom.us', '_blank');
                  }
                }}
                className="px-6 py-2 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-all text-sm shadow-lg shadow-brand/10"
              >
                Join Meeting
              </button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:text-brand group-hover:bg-brand/5 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {filteredSessions.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No sessions found</h3>
            <p className="text-slate-500 font-medium">You don't have any scheduled sessions yet.</p>
          </div>
        )}
      </div>

      {/* New Session Modal */}
      <AnimatePresence>
        {isNewSessionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewSessionModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Schedule New Session</h2>
                    <p className="text-slate-500 font-medium">Set up a counseling meeting with a student.</p>
                  </div>
                  <button 
                    onClick={() => setIsNewSessionModalOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Student</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        value={newSessionData.studentId}
                        onChange={(e) => setNewSessionData({ ...newSessionData, studentId: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 appearance-none"
                      >
                        <option value="">Select a student...</option>
                        {assignedStudents.map(student => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                      </select>
                    </div>
                    {assignedStudents.length === 0 && (
                      <p className="text-xs font-bold text-amber-500 mt-2">No students assigned to you yet.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Session Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Career Path Discussion"
                      value={newSessionData.title}
                      onChange={(e) => setNewSessionData({ ...newSessionData, title: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                      <input 
                        type="date" 
                        value={newSessionData.date}
                        onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
                      <select 
                        value={newSessionData.time}
                        onChange={(e) => setNewSessionData({ ...newSessionData, time: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700"
                      >
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>01:00 PM</option>
                        <option>02:00 PM</option>
                        <option>03:00 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Meeting Link (Zoom/Meet)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="url" 
                        placeholder="https://zoom.us/j/..."
                        value={newSessionData.link}
                        onChange={(e) => setNewSessionData({ ...newSessionData, link: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => setIsNewSessionModalOpen(false)}
                      className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateSession}
                      className="py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Schedule Session
                    </button>
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
