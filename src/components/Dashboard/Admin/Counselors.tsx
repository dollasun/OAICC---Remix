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
  Mail,
  Phone,
  X,
  CheckCircle2,
  ArrowUpRight,
  UserSquare2,
  Send,
  Calendar
} from 'lucide-react';
import { counselorsStorage } from '../../../utils/storage';

const initialCounselors = [
  { id: 1, name: 'Mason Elpi', email: 'elpi@example.com', role: 'Counselor', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/c1/100/100' },
  { id: 2, name: 'Amanda Lance', email: 'lance@example.com', role: 'Counselor', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/c2/100/100' },
  { id: 3, name: 'Bolu Ahmed', email: 'bolu@example.com', role: 'Counselor', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/c3/100/100' },
  { id: 4, name: 'Lilian Okoh', email: 'lilian@example.com', role: 'Counselor', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/c4/100/100' },
  { id: 5, name: 'John Chidiebere', email: 'john@example.com', role: 'Counselor', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/c5/100/100' },
  { id: 6, name: 'Adeola Bisoye', email: 'adeola@example.com', role: 'Counselor', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/c6/100/100' },
];

export default function AdminCounselors() {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setCounselors(counselorsStorage.get(initialCounselors));
  }, []);

  const filteredCounselors = counselors.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleInvite = () => {
    if (!inviteEmail) return;
    if (selectedCounselor && isInviteModalOpen) {
       const updated = counselors.map(c => c.id === selectedCounselor.id ? { ...selectedCounselor, email: inviteEmail, name: inviteEmail.split('@')[0] } : c);
       setCounselors(updated);
       counselorsStorage.save(updated);
    } else {
      const newCounselor = {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'Counselor',
        date: new Date().toLocaleString(),
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
      };
      const updated = [...counselors, newCounselor];
      setCounselors(updated);
      counselorsStorage.save(updated);
    }
    setIsInviteModalOpen(false);
    setSelectedCounselor(null);
    setInviteEmail('');
  };

  const handleEditCounselor = (counselor: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCounselor(counselor);
    setInviteEmail(counselor.email);
    setIsInviteModalOpen(true);
  };

  const handleDeleteCounselor = (id: number) => {
    if (window.confirm('Are you sure you want to delete this counselor?')) {
      const updated = counselors.filter(c => c.id !== id);
      setCounselors(updated);
      counselorsStorage.save(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Counselor Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage academic counselors and invite new team members.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Invite Counselor
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: 'Total Counselors', value: '400', icon: UserSquare2, color: 'text-brand', bg: 'bg-brand/10' },
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

      {/* Counselors Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search counselors..." 
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
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Added</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCounselors.map((counselor) => (
                <tr 
                  key={counselor.id} 
                  onClick={() => setSelectedCounselor(counselor)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={counselor.avatar} alt={counselor.name} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-bold text-slate-900">{counselor.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-500">{counselor.email}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {counselor.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-500">{counselor.date}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleEditCounselor(counselor, e)}
                        className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCounselor(counselor.id); }}
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

      {/* Invite Counselor Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
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
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCounselor ? 'Edit Counselor' : 'Invite Counselor'}</h2>
                  <button onClick={() => { setIsInviteModalOpen(false); setSelectedCounselor(null); }} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:text-brand transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter counselor's email" 
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      onClick={handleInvite}
                      className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      {selectedCounselor ? 'Update Counselor' : 'Send Invite'} <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Counselor Detail Modal */}
      <AnimatePresence>
        {selectedCounselor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCounselor(null)}
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
                  onClick={() => setSelectedCounselor(null)}
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                  <img src={selectedCounselor.avatar} className="w-24 h-24 rounded-[32px] object-cover border-4 border-slate-50 shadow-lg" alt={selectedCounselor.name} />
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedCounselor.name}</h2>
                    <p className="text-slate-500 font-medium">{selectedCounselor.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                      <p className="font-bold text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-brand" /> {selectedCounselor.email}</p>
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
                      <p className="font-bold text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand" /> {selectedCounselor.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Close</button>
                  <button className="flex-1 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    Message Counselor <Send className="w-5 h-5" />
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
