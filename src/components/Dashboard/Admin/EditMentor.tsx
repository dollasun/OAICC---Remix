import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function AdminEditMentor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState({ 
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

  useEffect(() => {
    const mentors = mentorsStorage.get(initialMentors);
    const found = mentors.find((m: any) => m.id.toString() === id);
    if (found) {
      const [firstName, ...lastNameParts] = found.name.split(' ');
      setMentorData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: found.email || '',
        role: found.role || '',
        phone: found.phone || '',
        bio: found.bio || '',
        avatar: found.avatar || '',
        title: found.title || 'Mr.',
        currentRole: found.currentRole || '',
        company: found.company || '',
        institution: found.institution || '',
        department: found.department || ''
      });
      setLoading(false);
    } else {
      showToast('Mentor not found');
      navigate('/admin/mentors');
    }
  }, [id, navigate, showToast]);

  const handleUpdateMentor = () => {
    if (!mentorData.firstName || !mentorData.lastName || !mentorData.email) {
      showToast('Please fill in all required fields');
      return;
    }

    const mentors = mentorsStorage.get(initialMentors);
    const updatedMentors = mentors.map((m: any) => {
      if (m.id.toString() === id) {
        return {
          ...m,
          name: `${mentorData.firstName} ${mentorData.lastName}`,
          email: mentorData.email,
          role: mentorData.role,
          phone: mentorData.phone,
          bio: mentorData.bio,
          avatar: mentorData.avatar,
          title: mentorData.title,
          currentRole: mentorData.currentRole,
          company: mentorData.company,
          institution: mentorData.institution,
          department: mentorData.department
        };
      }
      return m;
    });

    mentorsStorage.save(updatedMentors);
    showToast('Mentor updated successfully!');
    navigate(`/admin/mentors/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate(`/admin/mentors/${id}`)}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Details
      </button>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Edit Mentor Profile</h2>
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
                            setMentorData({ ...mentorData, avatar: re.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <div className="w-32 h-32 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-brand transition-all overflow-hidden">
                      {mentorData.avatar ? (
                        <img src={mentorData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <Camera className="w-8 h-8" />
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest text-center mt-2">Change Profile Photo</p>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">Personal Details</h3>
                    <p className="text-slate-500 font-medium">Update the mentor's basic information.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                    <select 
                      value={mentorData.title}
                      onChange={(e) => setMentorData({...mentorData, title: e.target.value})}
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
                      value={mentorData.firstName}
                      onChange={(e) => setMentorData({ ...mentorData, firstName: e.target.value })}
                      placeholder="Enter First Name" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={mentorData.lastName}
                      onChange={(e) => setMentorData({ ...mentorData, lastName: e.target.value })}
                      placeholder="Enter Last Name" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={mentorData.email}
                      onChange={(e) => setMentorData({ ...mentorData, email: e.target.value })}
                      placeholder="Enter Email Address" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={mentorData.phone}
                      onChange={(e) => setMentorData({ ...mentorData, phone: e.target.value })}
                      placeholder="Enter Phone Number" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Bio</label>
                  <textarea 
                    rows={4} 
                    value={mentorData.bio}
                    onChange={(e) => setMentorData({ ...mentorData, bio: e.target.value })}
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
                      value={mentorData.role}
                      onChange={(e) => setMentorData({ ...mentorData, role: e.target.value })}
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
                      value={mentorData.currentRole}
                      onChange={(e) => setMentorData({ ...mentorData, currentRole: e.target.value })}
                      placeholder="e.g. Senior Product Designer" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Current Company</label>
                    <input 
                      type="text" 
                      value={mentorData.company}
                      onChange={(e) => setMentorData({ ...mentorData, company: e.target.value })}
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
                      value={mentorData.institution}
                      onChange={(e) => setMentorData({ ...mentorData, institution: e.target.value })}
                      placeholder="Enter Institution" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                    <input 
                      type="text" 
                      value={mentorData.department}
                      onChange={(e) => setMentorData({ ...mentorData, department: e.target.value })}
                      placeholder="Enter Department" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="px-12 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Back</button>
                  <button onClick={handleUpdateMentor} className="px-12 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                    Update Mentor <CheckCircle2 className="w-5 h-5" />
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
