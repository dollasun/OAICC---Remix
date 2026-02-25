import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Lock, 
  ArrowRight, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Logo from '../Logo';

type Step = 'personal' | 'professional' | 'password' | 'success';

export default function CounselorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: 'counselor@oaicc.com',
    phone: '',
    bio: '',
    specialization: '',
    experience: '',
    education: '',
    password: '',
    confirmPassword: ''
  });

  const handleNext = () => {
    if (step === 'personal') setStep('professional');
    else if (step === 'professional') setStep('password');
    else if (step === 'password') setStep('success');
  };

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional Info', icon: Briefcase },
    { id: 'password', label: 'Account Info', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Logo size="md" />
        <div className="flex items-center gap-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 
                steps.findIndex(x => x.id === step) > i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {steps.findIndex(x => x.id === step) > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-sm font-bold hidden sm:block ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-200 ml-2" />}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">About You</h2>
                  <p className="text-slate-500 font-medium">Let's start with your basic information.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div className="w-32 h-32 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-brand/50 group-hover:bg-slate-100/50 transition-all cursor-pointer overflow-hidden">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload Photo</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                      <input 
                        type="text"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                      <input 
                        type="text"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      type="email"
                      disabled
                      className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl outline-none font-medium text-slate-500 cursor-not-allowed"
                      value={formData.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <input 
                      type="tel"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Short Bio</label>
                    <textarea 
                      rows={4}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all resize-none"
                      placeholder="Tell us a bit about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'professional' && (
              <motion.div
                key="professional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Professional Info</h2>
                  <p className="text-slate-500 font-medium">Tell us about your background and expertise.</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all appearance-none"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    >
                      <option value="">Select your specialization</option>
                      <option value="Career Counseling">Career Counseling</option>
                      <option value="Academic Advising">Academic Advising</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="College Admissions">College Admissions</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
                    <input 
                      type="text"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                      placeholder="e.g. 5+ years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Education / Certifications</label>
                    <textarea 
                      rows={4}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all resize-none"
                      placeholder="List your relevant education and certifications..."
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('personal')}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-[2] py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="mb-10 text-center">
                  <div className="w-20 h-20 bg-brand/10 rounded-[24px] flex items-center justify-center text-brand mx-auto mb-6">
                    <Lock className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your Password</h2>
                  <p className="text-slate-500 font-medium">To secure your account, please create your password below.</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Create Password</label>
                    <input 
                      type="password"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                    <input 
                      type="password"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                      placeholder="••••••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('professional')}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-[2] py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Complete Setup <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
              >
                <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Setup Complete!</h2>
                <p className="text-lg text-slate-500 font-medium mb-10 max-w-md mx-auto">
                  Your counselor profile has been successfully created. You can now access your dashboard and start guiding students.
                </p>
                <button 
                  onClick={() => {
                    localStorage.setItem('counselor_auth', 'true');
                    localStorage.setItem('user_role', 'counselor');
                    navigate('/counselor/dashboard');
                  }}
                  className="w-full py-5 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  Go to Dashboard <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
