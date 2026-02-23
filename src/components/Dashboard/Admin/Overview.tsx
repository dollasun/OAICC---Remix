import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  School, 
  UserSquare2, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  MoreHorizontal,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mentorsStorage, counselorsStorage, adminUsersStorage } from '../../../utils/storage';

const initialRecentUsers = [
  { id: 1, name: 'Dr. John Obi', email: 'johnobi@oaicc.com', role: 'Parent', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 2, name: 'Favour Aina', email: 'estheras@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 3, name: 'Daniel Abayomi', email: 'danielabayomi@oaicc.com', role: 'Parent', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 4, name: 'Demi Wilkinson', email: 'demiwilkinson@oaicc.com', role: 'Teacher', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user4/100/100' },
  { id: 5, name: 'Mrs. Elizabeth Danilla', email: 'elizabethdanilla@oaicc.com', role: 'Parent', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user5/100/100' },
  { id: 6, name: 'Williams Oghenemaro', email: 'williamsoghenemaro@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user6/100/100' },
  { id: 7, name: 'Louisa Maeve', email: 'louisamaeve@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/user7/100/100' },
];

export default function AdminOverview() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dynamicStats, setDynamicStats] = useState([
    { label: 'Total Students', value: '388', icon: Users, color: 'bg-brand', trend: '+12%' },
    { label: 'Total Schools', value: '50', icon: School, color: 'bg-indigo-500', trend: '+5%' },
    { label: 'Total Parents', value: '12', icon: UserSquare2, color: 'bg-emerald-500', trend: '+2%' },
    { label: 'Total Mentors', value: '12', icon: Briefcase, color: 'bg-amber-500', trend: '+8%' },
  ]);

  useEffect(() => {
    const mentors = mentorsStorage.get([]);
    const counselors = counselorsStorage.get([]);
    const admins = adminUsersStorage.get([]);
    
    setDynamicStats([
      { label: 'Total Students', value: '388', icon: Users, color: 'bg-brand', trend: '+12%' },
      { label: 'Total Mentors', value: mentors.length.toString(), icon: Briefcase, color: 'bg-amber-500', trend: '+8%' },
      { label: 'Total Counselors', value: counselors.length.toString(), icon: UserSquare2, color: 'bg-emerald-500', trend: '+2%' },
      { label: 'Total Admins', value: admins.length.toString(), icon: School, color: 'bg-indigo-500', trend: '+5%' },
    ]);
  }, []);

  const handleUserClick = (user: any) => {
    if (user.role === 'Student') {
      navigate(`/admin/students/${user.id}`);
    } else {
      setSelectedUser(user);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-brand hover:text-brand transition-all shadow-sm">
          <ArrowUpRight className="w-5 h-5" /> Export Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-brand/5 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Users</h2>
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-brand/20">
              <option>All Roles</option>
              <option>Students</option>
              <option>Parents</option>
              <option>Teachers</option>
              <option>Schools</option>
            </select>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Joined</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialRecentUsers.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => handleUserClick(user)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-500">{user.email}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'Student' ? 'bg-brand/10 text-brand' :
                      user.role === 'Parent' ? 'bg-indigo-50 text-indigo-500' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-500">{user.date}</td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-50 text-center">
          <button className="text-brand font-bold text-sm hover:underline">View All Users</button>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-12">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                  <img src={selectedUser.avatar} className="w-24 h-24 rounded-[32px] object-cover border-4 border-slate-50 shadow-lg" alt={selectedUser.name} />
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h2>
                    <p className="text-slate-500 font-medium">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                      <p className="font-bold text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-brand" /> {selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                      <p className="font-bold text-slate-700 flex items-center gap-2"><Phone className="w-4 h-4 text-brand" /> +123 456 7890</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">User ID</p>
                      <p className="font-bold text-slate-700">recR23ortRikranhx</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Joined</p>
                      <p className="font-bold text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand" /> {selectedUser.date}</p>
                    </div>
                  </div>
                </div>

                {selectedUser.role === 'Teacher' && (
                  <div className="mt-10 pt-8 border-t border-slate-50 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Class Assigned</p>
                      <p className="font-bold text-slate-700">SS3</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Students</p>
                      <div className="flex items-center -space-x-2 mt-1">
                        {[1, 2, 3, 4].map(i => (
                          <img key={i} src={`https://picsum.photos/seed/s${i}/100/100`} className="w-8 h-8 rounded-full border-2 border-white" alt="Student" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">+344</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'Parent' && (
                  <div className="mt-10 pt-8 border-t border-slate-50 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Profession</p>
                      <p className="font-bold text-slate-700">Medical Doctor</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Children</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5"><Users className="w-3 h-3" /> Chika Adanne</span>
                        <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5"><Users className="w-3 h-3" /> Daniel Ake</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-12 flex gap-4">
                  <button className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Close</button>
                  <button className="flex-1 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    View Full Profile <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
