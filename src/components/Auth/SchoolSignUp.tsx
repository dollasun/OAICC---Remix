import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, MapPin, School, Users, ChevronLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Logo from '../Logo';
import AuthSlider from '../Auth/AuthSlider';

export default function SchoolSignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    location: '',
    schoolTypes: [] as string[],
    numClasses: '',
    numStudents: ''
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(s => s + 1);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); // Check email step
  };

  const toggleSchoolType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      schoolTypes: prev.schoolTypes.includes(type) 
        ? prev.schoolTypes.filter(t => t !== type)
        : [...prev.schoolTypes, type]
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <Logo size="lg" className="mb-6" />
              <p className="text-sm text-slate-500 mb-2">Have an account? <button onClick={() => navigate('/auth/signin?role=school')} className="text-brand font-bold hover:underline">Sign in</button></p>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign up as a school</h1>
              <p className="text-slate-500">Do you want to sign up as a <button onClick={() => navigate('/auth/signup?role=student')} className="text-brand font-bold hover:underline">student instead?</button></p>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your First name" 
                    className="input-field"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your Last name" 
                    className="input-field"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><Mail className="w-5 h-5" /></div>
                  <input 
                    type="email" 
                    placeholder="adajoseph@oaicc.com" 
                    className="input-field"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><Lock className="w-5 h-5" /></div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••••" 
                    className="input-field pr-14"
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Confirm password</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><Lock className="w-5 h-5" /></div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••••••" 
                    className="input-field pr-14"
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4">
                Next
              </button>
            </form>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-brand font-bold mb-6 hover:gap-3 transition-all">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">You're one step away!</h1>
              <p className="text-slate-500">Supporting text here</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Name of school</label>
                <input 
                  type="text" 
                  placeholder="Caleb secondary school" 
                  className="input-field"
                  required
                  value={formData.schoolName}
                  onChange={e => setFormData({...formData, schoolName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Location</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><MapPin className="w-5 h-5" /></div>
                  <input 
                    type="text" 
                    placeholder="Ogudu, Lagos, Nigeria" 
                    className="input-field"
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">School type</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 min-h-[50px]">
                  {formData.schoolTypes.map(type => (
                    <span key={type} className="bg-brand/10 text-brand px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                      {type}
                      <button onClick={() => toggleSchoolType(type)} className="hover:text-brand-hover">×</button>
                    </span>
                  ))}
                  <select 
                    className="bg-transparent outline-none text-xs font-medium flex-1 min-w-[100px]"
                    onChange={(e) => {
                      if (e.target.value) toggleSchoolType(e.target.value);
                      e.target.value = '';
                    }}
                  >
                    <option value="">Select school type</option>
                    <option value="Primary">Primary</option>
                    <option value="Junior Secondary">Junior Secondary</option>
                    <option value="Senior Secondary">Senior Secondary</option>
                    <option value="Undergraduate programs">Undergraduate programs</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">number of classes</label>
                <select 
                  className="input-field appearance-none bg-white"
                  required
                  value={formData.numClasses}
                  onChange={e => setFormData({...formData, numClasses: e.target.value})}
                >
                  <option value="">Select range</option>
                  <option value="1 - 10">1 - 10</option>
                  <option value="10 - 12">10 - 12</option>
                  <option value="12 - 20">12 - 20</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">number of students</label>
                <select 
                  className="input-field appearance-none bg-white"
                  required
                  value={formData.numStudents}
                  onChange={e => setFormData({...formData, numStudents: e.target.value})}
                >
                  <option value="">Select range</option>
                  <option value="1 - 100">1 - 100</option>
                  <option value="100 - 400">100 - 400</option>
                  <option value="400 - 1000">400 - 1000</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full py-4">
                Register
              </button>
            </form>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-brand font-bold mb-10 hover:gap-3 transition-all mx-auto">
              <ChevronLeft className="w-5 h-5" /> Back to Sign Up
            </button>
            
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Check your email</h1>
              <p className="text-slate-500">
                We have sent a secure verification link to your email. Click on the link to verify your account
              </p>
            </div>

            <button onClick={() => navigate('/school/dashboard')} className="btn-primary w-full py-4">
              Resend email
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthSlider 
        title="Empowering the next generation." 
        subtitle="Join thousands of schools helping students find their true calling."
      />

      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
