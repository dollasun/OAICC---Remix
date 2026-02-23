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

const initialMentors = [
  { id: 1, name: 'Mason Elpi', email: 'elpi@example.com', role: 'Design', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m1/100/100' },
  { id: 2, name: 'Amanda Lance', email: 'lance@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m2/100/100' },
  { id: 3, name: 'Bolu Ahmed', email: 'bolu@example.com', role: 'Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m3/100/100' },
  { id: 4, name: 'Lilian Okoh', email: 'lilian@example.com', role: 'Real Estate', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m4/100/100' },
  { id: 5, name: 'John Chidiebere', email: 'john@example.com', role: 'Software Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m5/100/100' },
  { id: 6, name: 'Adeola Bisoye', email: 'adeola@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m6/100/100' },
];

export default function AdminMentors() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [newMentor, setNewMentor] = useState({ name: '', email: '', role: '' });
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

  const handleAddMentor = () => {
    if (!newMentor.name || !newMentor.email) return;
    if (selectedMentor) {
      const updated = mentors.map(m => m.id === selectedMentor.id ? { ...selectedMentor, ...newMentor } : m);
      setMentors(updated);
      mentorsStorage.save(updated);
    } else {
      const mentor = {
        id: Date.now(),
        ...newMentor,
        date: new Date().toLocaleString(),
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
      };
      const updated = [...mentors, mentor];
      setMentors(updated);
      mentorsStorage.save(updated);
    }
    setIsAddModalOpen(false);
    setSelectedMentor(null);
    setNewMentor({ name: '', email: '', role: '' });
  };

  const handleEditMentor = (mentor: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMentor(mentor);
    setNewMentor({ name: mentor.name, email: mentor.email, role: mentor.role });
    setStep(1);
    setIsAddModalOpen(true);
  };

  const handleDeleteMentor = (id: number) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      const updated = mentors.filter(m => m.id !== id);
      setMentors(updated);
      mentorsStorage.save(updated);
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
          onClick={() => { setStep(1); setIsAddModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Mentor
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: 'Total Mentors', value: '400', icon: Users, color: 'text-brand', bg: 'bg-brand/10' },
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
                  onClick={() => setSelectedMentor(mentor)}
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
                        onClick={(e) => handleEditMentor(mentor, e)}
                        className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteMentor(mentor.id); }}
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

      {/* Add Mentor Modal (Multi-step) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 sm:p-12">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedMentor && !isAddModalOpen ? 'Mentor Details' : (selectedMentor ? 'Edit Mentor' : 'Add Mentor')}</h2>
                    <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                      <span className={`text-sm font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Personal Info</span>
                    </div>
                    <div className="w-12 h-px bg-slate-100"></div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                      <span className={`text-sm font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Professional Info</span>
                    </div>
                    <div className="w-12 h-px bg-slate-100"></div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                      <span className={`text-sm font-bold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Alumni Info</span>
                    </div>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="flex items-center gap-8">
                        <div 
                          className="relative group cursor-pointer"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (re) => {
                                  setNewMentor({ ...newMentor, avatar: re.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          <div className="w-32 h-32 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-brand transition-all overflow-hidden">
                            {newMentor.avatar ? (
                              <img src={newMentor.avatar} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                              <Camera className="w-8 h-8" />
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-brand uppercase tracking-widest text-center mt-2">Change Profile Photo</p>
                        </div>
                        <div className="flex-1 space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900">About You</h3>
                          <p className="text-slate-500 font-medium">Tell us a bit about yourself and your background.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none">
                            <option>Miss.</option>
                            <option>Mr.</option>
                            <option>Dr.</option>
                            <option>Prof.</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                          <input 
                            type="text" 
                            value={newMentor.name.split(' ')[0] || ''}
                            onChange={(e) => setNewMentor({ ...newMentor, name: `${e.target.value} ${newMentor.name.split(' ')[1] || ''}`.trim() })}
                            placeholder="Enter your First Name" 
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                          <input 
                            type="text" 
                            value={newMentor.name.split(' ')[1] || ''}
                            onChange={(e) => setNewMentor({ ...newMentor, name: `${newMentor.name.split(' ')[0] || ''} ${e.target.value}`.trim() })}
                            placeholder="Enter your Last Name" 
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Email (OAICC account)</label>
                          <input 
                            type="email" 
                            value={newMentor.email}
                            onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                            placeholder="Enter your Email" 
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                          <input type="tel" placeholder="Enter your phone number" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Bio</label>
                        <textarea rows={4} placeholder="Write something about you?" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none" />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button onClick={() => setStep(2)} className="px-12 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">Next</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <h3 className="text-2xl font-bold text-slate-900">Professional Info</h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Career</label>
                          <select 
                            value={newMentor.role}
                            onChange={(e) => setNewMentor({ ...newMentor, role: e.target.value })}
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                          >
                            <option value="">Select Career</option>
                            <option value="Software Engineering">Software Engineering</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Design">Design</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Real Estate">Real Estate</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Current Role</label>
                          <input type="text" placeholder="e.g. Senior Product Designer" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Company</label>
                          <input type="text" placeholder="e.g. Google" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button onClick={() => setStep(1)} className="px-12 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Back</button>
                        <button onClick={() => setStep(3)} className="px-12 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">Next</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <h3 className="text-2xl font-bold text-slate-900">Alumni Info <span className="text-slate-400 text-sm font-medium">(Optional)</span></h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Institution</label>
                          <input type="text" placeholder="Enter Institution" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                          <input type="text" placeholder="Enter Department" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button onClick={() => setStep(2)} className="px-12 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Back</button>
                        <button onClick={handleAddMentor} className="px-12 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                          {selectedMentor ? 'Update Mentor' : 'Add Mentor'} <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mentor Detail Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMentor(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-12">
                <button 
                  onClick={() => setSelectedMentor(null)}
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3">
                    <img src={selectedMentor.avatar} className="w-full aspect-square rounded-[40px] object-cover shadow-xl mb-6" alt={selectedMentor.name} />
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-slate-900">{selectedMentor.name}</h2>
                      <p className="text-brand font-bold uppercase tracking-widest text-xs">{selectedMentor.role} • Medical Doctor</p>
                      <button className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">Create Event</button>
                    </div>
                  </div>
                  <div className="lg:w-2/3 space-y-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">About</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        Dr. Amanda Lance is an accomplished physician with over a decade of hands-on experience across Nigeria, where she has been committed to enhancing healthcare access and quality in both urban centers and remote, underserved areas. Her career spans primary care, maternal and child health, and infectious disease management, with a particular focus on reducing maternal and infant mortality. Dr. Lance has played a key role in establishing community health outreach programs and training initiatives, empowering local healthcare workers to better serve their communities.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                        <p className="font-bold text-slate-700">{selectedMentor.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="font-bold text-slate-700">0808 345 6400</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6">Upcoming Mentorship Event</h3>
                      <div className="space-y-4">
                        {[
                          { date: '25 Nov', title: 'Medicine & Surgery', time: '13:00' },
                          { date: '28 Nov', title: 'Medicine & Surgery', time: '13:00' },
                        ].map((event, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{event.date.split(' ')[1]}</span>
                                <span className="text-sm font-bold text-slate-900">{event.date.split(' ')[0]}</span>
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{event.title}</p>
                                <p className="text-xs font-medium text-slate-500">Session with {selectedMentor.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">{event.time}</p>
                              <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline">View</button>
                            </div>
                          </div>
                        ))}
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
