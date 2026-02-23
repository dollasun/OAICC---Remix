import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  X, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const initialStudents = [
  { id: '1', name: 'John Obi', email: 'johnobi@oaicc.com', role: 'Teacher', date: 'Jan 6, 2022 4:26 PM', initials: 'JO', color: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'Esther Rae', email: 'estherrae@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'ER', color: 'bg-cyan-100 text-cyan-600' },
  { id: '3', name: 'Daniel Abayomi', email: 'danielabayomi@oaicc.com', role: 'Parent', date: 'Jan 6, 2022 4:26 PM', initials: 'DA', color: 'bg-emerald-100 text-emerald-600' },
  { id: '4', name: 'Demi Wilkinson', email: 'demiwilkinson@oaicc.com', role: 'Teacher', date: 'Jan 6, 2022 4:26 PM', initials: 'DW', color: 'bg-blue-100 text-blue-600' },
  { id: '5', name: 'Elizabeth Daniella', email: 'elizabethdaniella@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'ED', color: 'bg-cyan-100 text-cyan-600' },
  { id: '6', name: 'Williams Oghenemaro', email: 'williamsoghenemaro@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'WO', color: 'bg-cyan-100 text-cyan-600' },
  { id: '7', name: 'Louisa Maeve', email: 'louisamaeve@oaicc.com', role: 'Student', date: 'Jan 6, 2022 4:26 PM', initials: 'LM', color: 'bg-cyan-100 text-cyan-600' },
];

export default function SchoolClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTeacherProfileOpen, setIsTeacherProfileOpen] = useState(false);
  const [isParentProfileOpen, setIsParentProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <button onClick={() => navigate('/school/classes')} className="flex items-center gap-2 text-brand font-bold hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">{id}</h1>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm w-fit">
            <img 
              src="https://picsum.photos/seed/teacher/100/100" 
              alt="Teacher" 
              className="w-16 h-16 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-lg font-bold text-slate-900">Bukky Aile</p>
              <p className="text-sm text-slate-500">Teacher</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button 
                onClick={() => setIsTeacherProfileOpen(true)}
                className="px-4 py-2 bg-brand/10 text-brand rounded-xl font-bold text-sm hover:bg-brand/20 transition-all"
              >
                View profile
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Unassign teacher</button>
                        <button className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50">Remove user</button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary px-6 py-3">
          Add new student
        </button>
      </div>

      {/* Student List */}
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
                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Newest first</button>
                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Oldest first</button>
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
              {initialStudents.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                  onClick={() => {
                    if (user.role === 'Parent') setIsParentProfileOpen(true);
                    else if (user.role === 'Teacher') setIsTeacherProfileOpen(true);
                    else if (user.role === 'Student') navigate(`/school/student/${user.id}`);
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
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Add new user</h3>
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email address</label>
                  <input 
                    type="email" 
                    placeholder="jinad@gmail.com" 
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Role</label>
                  <select className="input-field appearance-none bg-white" required defaultValue="Student">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Class</label>
                  <select className="input-field appearance-none bg-white" required defaultValue={id}>
                    <option value={id}>{id}</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Add user
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Teacher Profile Modal */}
      <AnimatePresence>
        {isTeacherProfileOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTeacherProfileOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-10"
            >
              <button onClick={() => setIsTeacherProfileOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-50 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <img 
                  src="https://picsum.photos/seed/teacher/200/200" 
                  alt="Teacher" 
                  className="w-24 h-24 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Bukky Aile</h3>
                  <p className="text-slate-500">Teacher</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</p>
                  <p className="text-slate-600 leading-relaxed">
                    I am Bayo, I am a teacher at Foundry Secondary Schools. Besides teaching I also help businesses and entrepreneurs build online marketplaces with no-code tools.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">email</p>
                      <p className="text-brand font-bold">johnobi@oaicc.com</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone number</p>
                      <p className="text-slate-700 font-bold">+123 456 7890</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Class</p>
                      <p className="text-slate-700 font-bold">{id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                      <p className="text-slate-700 font-bold uppercase">recR23orfRikranhx</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created</p>
                    <p className="text-slate-700 font-bold">7 September, 2022, 13:28</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Students</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="student" />
                    ))}
                    <span className="text-xs font-bold text-slate-400 ml-2">+344</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Parent Profile Modal */}
      <AnimatePresence>
        {isParentProfileOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsParentProfileOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-10"
            >
              <button onClick={() => setIsParentProfileOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-50 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <img 
                  src="https://picsum.photos/seed/parent/200/200" 
                  alt="Parent" 
                  className="w-24 h-24 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Hope Ronke</h3>
                  <p className="text-slate-500">Parent</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">email</p>
                    <p className="text-brand font-bold">johnobi@oaicc.com</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Class</p>
                    <p className="text-slate-700 font-bold">{id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created</p>
                    <p className="text-slate-700 font-bold">7 September, 2022, 13:28</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone number</p>
                    <p className="text-slate-700 font-bold">+123 456 7890</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                    <p className="text-slate-700 font-bold uppercase">recR23orfRikranhx</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Children</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?u=10" className="w-6 h-6 rounded-full" alt="child" />
                        <span className="text-sm font-bold text-slate-700">Chika Adanne</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?u=11" className="w-6 h-6 rounded-full" alt="child" />
                        <span className="text-sm font-bold text-slate-700">Daniel Ake</span>
                      </div>
                    </div>
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
