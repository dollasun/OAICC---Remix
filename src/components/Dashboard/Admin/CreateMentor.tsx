import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2,
  X
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
];

export default function AdminCreateMentor() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [newMentor, setNewMentor] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    role: '', 
    phone: '', 
    bio: '', 
    avatar: '',
    title: 'Mr.',
    currentRole: '',
    company: '',
    institution: '',
    department: ''
  });

  const handleCreateMentor = () => {
    if (!newMentor.firstName || !newMentor.lastName || !newMentor.email) {
      showToast('Please fill in all required fields');
      return;
    }

    const mentors = mentorsStorage.get(initialMentors);
    const mentor = {
      id: Date.now(),
      name: `${newMentor.firstName} ${newMentor.lastName}`,
      email: newMentor.email,
      role: newMentor.role || 'Unassigned',
      phone: newMentor.phone,
      bio: newMentor.bio,
      avatar: newMentor.avatar || `https://picsum.photos/seed/${Date.now()}/100/100`,
      date: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      }),
      currentRole: newMentor.currentRole,
      company: newMentor.company,
      institution: newMentor.institution,
      department: newMentor.department
    };

    const updated = [...mentors, mentor];
    mentorsStorage.save(updated);
    showToast('Mentor added successfully!');
    navigate('/admin/mentors');
  };

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/admin/mentors')}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Mentors
      </button>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Add New Mentor</h2>
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
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest text-center mt-2">Upload Profile Photo</p>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">Personal Details</h3>
                    <p className="text-slate-500 font-medium">Provide basic information about the mentor.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                    <select 
                      value={newMentor.title}
                      onChange={(e) => setNewMentor({...newMentor, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                    >
                      <option>Mr.</option>
                      <option>Miss.</option>
                      <option>Dr.</option>
                      <option>Prof.</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={newMentor.firstName}
                      onChange={(e) => setNewMentor({ ...newMentor, firstName: e.target.value })}
                      placeholder="Enter First Name" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={newMentor.lastName}
                      onChange={(e) => setNewMentor({ ...newMentor, lastName: e.target.value })}
                      placeholder="Enter Last Name" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={newMentor.email}
                      onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                      placeholder="Enter Email Address" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={newMentor.phone}
                      onChange={(e) => setNewMentor({ ...newMentor, phone: e.target.value })}
                      placeholder="Enter Phone Number" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Bio</label>
                  <textarea 
                    rows={4} 
                    value={newMentor.bio}
                    onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                    placeholder="Write a short bio for the mentor..." 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none" 
                  />
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
                    <label className="text-sm font-bold text-slate-700 ml-1">Career / Role</label>
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
                    <label className="text-sm font-bold text-slate-700 ml-1">Current Job Title</label>
                    <input 
                      type="text" 
                      value={newMentor.currentRole}
                      onChange={(e) => setNewMentor({ ...newMentor, currentRole: e.target.value })}
                      placeholder="e.g. Senior Product Designer" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Current Company</label>
                    <input 
                      type="text" 
                      value={newMentor.company}
                      onChange={(e) => setNewMentor({ ...newMentor, company: e.target.value })}
                      placeholder="e.g. Google" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
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
                    <input 
                      type="text" 
                      value={newMentor.institution}
                      onChange={(e) => setNewMentor({ ...newMentor, institution: e.target.value })}
                      placeholder="Enter Institution" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                    <input 
                      type="text" 
                      value={newMentor.department}
                      onChange={(e) => setNewMentor({ ...newMentor, department: e.target.value })}
                      placeholder="Enter Department" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="px-12 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Back</button>
                  <button onClick={handleCreateMentor} className="px-12 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                    Add Mentor <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
