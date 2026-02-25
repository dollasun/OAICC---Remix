import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Video, MapPin, ChevronRight, Search, Filter } from 'lucide-react';

const sessions = [
  {
    id: 1,
    student: 'Favour Aina',
    title: 'Career Path Discussion',
    date: 'Oct 25, 2024',
    time: '2:00 PM',
    type: 'Virtual',
    status: 'Upcoming',
    image: 'https://picsum.photos/seed/s1/100/100'
  },
  {
    id: 2,
    student: 'Adebayo Samuel',
    title: 'Academic Performance Review',
    date: 'Oct 26, 2024',
    time: '10:00 AM',
    type: 'In-person',
    status: 'Upcoming',
    image: 'https://picsum.photos/seed/s2/100/100'
  }
];

export default function Sessions() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scheduled Sessions</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your upcoming meetings with students.</p>
        </div>
        <button className="px-6 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" /> New Session
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sessions..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-brand/5 font-medium text-slate-700 shadow-sm transition-all"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-[20px] font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-brand/20 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <img src={session.image} alt={session.student} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{session.title}</h3>
                <p className="text-sm font-medium text-slate-500">with {session.student}</p>
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
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:text-brand group-hover:bg-brand/5 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
