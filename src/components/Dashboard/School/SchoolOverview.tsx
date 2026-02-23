import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  X, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Users
} from 'lucide-react';

const initialUsers = [
  { id: '1', name: 'John Obi', email: 'johnobi@oaicc.com', role: 'Teacher', date: 'Jan 6, 2022 4:26 PM', initials: 'JO', color: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'Esther Rae', email: 'estherrae@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'ER', color: 'bg-cyan-100 text-cyan-600' },
  { id: '3', name: 'Daniel Abayomi', email: 'danielabayomi@oaicc.com', role: 'Parent', date: 'Jan 6, 2022 4:26 PM', initials: 'DA', color: 'bg-emerald-100 text-emerald-600' },
  { id: '4', name: 'Demi Wilkinson', email: 'demiwilkinson@oaicc.com', role: 'Teacher', date: 'Jan 6, 2022 4:26 PM', initials: 'DW', color: 'bg-blue-100 text-blue-600' },
  { id: '5', name: 'Elizabeth Daniella', email: 'elizabethdaniella@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'ED', color: 'bg-cyan-100 text-cyan-600' },
  { id: '6', name: 'Williams Oghenemaro', email: 'williamsoghenemaro@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'WO', color: 'bg-cyan-100 text-cyan-600' },
  { id: '7', name: 'Louisa Maeve', email: 'louisamaeve@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'LM', color: 'bg-cyan-100 text-cyan-600' },
];

export default function SchoolOverview() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: '', class: '', children: '' });
  const [isSortOpen, setIsSortOpen] = useState(false);

  const stats = [
    { label: 'Total users', value: users.length > 0 ? '400' : '0' },
    { label: 'Total teachers', value: users.length > 0 ? '12' : '0' },
    { label: 'Total students', value: users.length > 0 ? '388' : '0' },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteData.role === 'Student' && inviteData.email === 'johnabbie@oaicc.com') {
      setIsSuccessModalOpen(true);
    } else {
      setIsInviteModalOpen(false);
      // Logic to add user
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 text-slate-500 font-bold mt-2 hover:text-brand transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        {users.length > 0 && (
          <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary px-6 py-3">
            Invite new user
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-400 mb-4">{stat.label}</p>
            <p className="text-5xl font-bold text-slate-900 font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Users yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs">You haven't added any user yet</p>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-primary px-10 py-4"
          >
            Invite new users
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200"
              >
                <Filter className="w-4 h-4" /> Sort by
              </button>
              
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                    >
                      {['Teachers', 'Parents', 'Students'].map(type => (
                        <button key={type} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">{type}</button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">USER</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">EMAIL</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ROLE</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">DATE</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                    onClick={() => {
                      if (user.role === 'Student') navigate(`/school/student/${user.id}`);
                    }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${user.color}`}>
                          {user.initials}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-900 font-bold">{user.role}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-500 font-medium">{user.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-100 flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3, '...', 8, 9, 10].map((page, idx) => (
                <button 
                  key={idx} 
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === 1 ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Invite new user</h3>
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email address</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="input-field"
                    required
                    value={inviteData.email}
                    onChange={e => setInviteData({...inviteData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Role</label>
                  <select 
                    className="input-field appearance-none bg-white"
                    required
                    value={inviteData.role}
                    onChange={e => setInviteData({...inviteData, role: e.target.value})}
                  >
                    <option value="">Select a role</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Parent">Parent/ Guardian</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                {inviteData.role === 'Parent' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Child(ren)</label>
                    <select className="input-field appearance-none bg-white">
                      <option value="">Add/ Select the child(ren)</option>
                      <option value="1">Favour Aina</option>
                      <option value="2">Gbenga Aina</option>
                    </select>
                  </div>
                )}

                {inviteData.role === 'Student' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Class</label>
                    <select className="input-field appearance-none bg-white" required>
                      <option value="">Select class</option>
                      <option value="SS3">SS3</option>
                      <option value="JSS1">JSS1</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Invite user
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success/Message Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Message</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                This student already has an account with OAICC, and invitation to join has been sent to the student awaiting acceptance.
              </p>
              <button 
                onClick={() => { setIsSuccessModalOpen(false); setIsInviteModalOpen(false); }}
                className="btn-primary w-full py-4"
              >
                Okay, Got it!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-8">Export Users</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsExportModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsExportModalOpen(false)}
                  className="flex-1 btn-primary py-3"
                >
                  Export users
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
