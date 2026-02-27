import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Users,
  Briefcase,
  Mail,
  Phone,
  X,
  CheckCircle2,
  ArrowUpRight,
  Camera,
  MapPin,
  Globe,
  Award
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { mentorsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialMentors = [
  { id: 1, name: 'Mason Elpi', email: 'elpi@example.com', role: 'Design', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m1/100/100' },
  { id: 2, name: 'Amanda Lance', email: 'lance@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m2/100/100' },
  { id: 3, name: 'Bolu Ahmed', email: 'bolu@example.com', role: 'Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m3/100/100' },
  { id: 4, name: 'Lilian Okoh', email: 'lilian@example.com', role: 'Real Estate', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m4/100/100' },
  { id: 5, name: 'John Chidiebere', email: 'john@example.com', role: 'Software Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m5/100/100' },
  { id: 6, name: 'Adeola Bisoye', email: 'adeola@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m6/100/100' },
  { id: 7, name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Marketing', date: 'Feb 12, 2023 10:15 AM', avatar: 'https://picsum.photos/seed/m7/100/100' },
  { id: 8, name: 'Michael Chen', email: 'michael@example.com', role: 'Finance', date: 'Mar 5, 2023 2:30 PM', avatar: 'https://picsum.photos/seed/m8/100/100' },
  { id: 9, name: 'Elena Rodriguez', email: 'elena@example.com', role: 'Law', date: 'Apr 20, 2023 9:45 AM', avatar: 'https://picsum.photos/seed/m9/100/100' },
  { id: 10, name: 'David Smith', email: 'david@example.com', role: 'Architecture', date: 'May 15, 2023 11:20 AM', avatar: 'https://picsum.photos/seed/m10/100/100' },
  { id: 11, name: 'Priya Sharma', email: 'priya@example.com', role: 'Data Science', date: 'Jun 8, 2023 3:10 PM', avatar: 'https://picsum.photos/seed/m11/100/100' },
  { id: 12, name: 'James Wilson', email: 'james@example.com', role: 'Psychology', date: 'Jul 22, 2023 1:55 PM', avatar: 'https://picsum.photos/seed/m12/100/100' },
  { id: 13, name: 'Isabella Garcia', email: 'isabella@example.com', role: 'Education', date: 'Aug 14, 2023 10:05 AM', avatar: 'https://picsum.photos/seed/m13/100/100' },
  { id: 14, name: 'Robert Taylor', email: 'robert@example.com', role: 'Business', date: 'Sep 30, 2023 4:40 PM', avatar: 'https://picsum.photos/seed/m14/100/100' },
  { id: 15, name: 'Sophie Martin', email: 'sophie@example.com', role: 'Journalism', date: 'Oct 18, 2023 12:25 PM', avatar: 'https://picsum.photos/seed/m15/100/100' },
  { id: 16, name: 'William Brown', email: 'william@example.com', role: 'Agriculture', date: 'Nov 5, 2023 8:50 AM', avatar: 'https://picsum.photos/seed/m16/100/100' },
  { id: 17, name: 'Olivia White', email: 'olivia@example.com', role: 'Hospitality', date: 'Dec 12, 2023 2:15 PM', avatar: 'https://picsum.photos/seed/m17/100/100' },
  { id: 18, name: 'Lucas Moore', email: 'lucas@example.com', role: 'Sports Management', date: 'Jan 25, 2024 11:30 AM', avatar: 'https://picsum.photos/seed/m18/100/100' },
  { id: 19, name: 'Noah Garcia', email: 'noah@example.com', role: 'Civil Engineering', date: 'Feb 10, 2024 9:00 AM', avatar: 'https://picsum.photos/seed/m19/100/100' },
  { id: 20, name: 'Mia Martinez', email: 'mia@example.com', role: 'Pharmacy', date: 'Feb 15, 2024 2:30 PM', avatar: 'https://picsum.photos/seed/m20/100/100' },
  { id: 21, name: 'Ethan Robinson', email: 'ethan@example.com', role: 'Cybersecurity', date: 'Feb 20, 2024 11:45 AM', avatar: 'https://picsum.photos/seed/m21/100/100' },
  { id: 22, name: 'Ava Clark', email: 'ava@example.com', role: 'Human Resources', date: 'Mar 1, 2024 10:20 AM', avatar: 'https://picsum.photos/seed/m22/100/100' },
  { id: 23, name: 'Liam Rodriguez', email: 'liam@example.com', role: 'Mechanical Engineering', date: 'Mar 5, 2024 3:15 PM', avatar: 'https://picsum.photos/seed/m23/100/100' },
  { id: 24, name: 'Charlotte Lewis', email: 'charlotte@example.com', role: 'Public Relations', date: 'Mar 10, 2024 1:00 PM', avatar: 'https://picsum.photos/seed/m24/100/100' },
  { id: 25, name: 'Benjamin Lee', email: 'benjamin@example.com', role: 'Artificial Intelligence', date: 'Mar 15, 2024 9:30 AM', avatar: 'https://picsum.photos/seed/m25/100/100' },
  { id: 26, name: 'Amelia Walker', email: 'amelia@example.com', role: 'Environmental Science', date: 'Mar 20, 2024 4:45 PM', avatar: 'https://picsum.photos/seed/m26/100/100' },
  { id: 27, name: 'James Hall', email: 'james.h@example.com', role: 'Real Estate Development', date: 'Mar 25, 2024 11:00 AM', avatar: 'https://picsum.photos/seed/m27/100/100' },
  { id: 28, name: 'Harper Young', email: 'harper@example.com', role: 'Veterinary Medicine', date: 'Apr 1, 2024 2:15 PM', avatar: 'https://picsum.photos/seed/m28/100/100' },
  { id: 29, name: 'Alexander King', email: 'alex@example.com', role: 'Aerospace Engineering', date: 'Apr 5, 2024 10:30 AM', avatar: 'https://picsum.photos/seed/m29/100/100' },
  { id: 30, name: 'Evelyn Wright', email: 'evelyn@example.com', role: 'Interior Design', date: 'Apr 10, 2024 3:50 PM', avatar: 'https://picsum.photos/seed/m30/100/100' },
];

export default function AdminMentors() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mentors, setMentors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setMentors(mentorsStorage.get(initialMentors));
  }, []);

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default to initial order for 'newest'
  });

  const handleDeleteMentor = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this mentor? This action cannot be undone.')) {
      const updated = mentors.filter(m => m.id !== id);
      setMentors(updated);
      mentorsStorage.save(updated);
      showToast('Mentor deleted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mentor Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage professional mentors and their profiles.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/mentors/create')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Mentor
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: 'Total Mentors', value: mentors.length.toString(), icon: Users, color: 'text-brand', bg: 'bg-brand/10' },
          { label: 'Total Students', value: '388', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mentors Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search mentors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-slate-400 font-bold text-sm outline-none focus:ring-0 cursor-pointer hover:text-brand transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Career</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Added</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMentors.map((mentor) => (
                <tr 
                  key={mentor.id} 
                  onClick={() => navigate(`/admin/mentors/${mentor.id}`)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={mentor.avatar} alt={mentor.name} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-bold text-slate-900">{mentor.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-500">{mentor.email}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {mentor.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-500">{mentor.date}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/mentors/edit/${mentor.id}`); }}
                        className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteMentor(mentor.id, e)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
