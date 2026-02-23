import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import Logo from '../Logo';

export default function ParentOnboarding() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    relationship: '',
    title: '',
    firstName: 'Fadeyibi',
    lastName: 'Aina',
    email: 'fadeyibiaina@oaicc.com',
    profession: '',
    location: '',
    phone: '',
    avatar: 'https://picsum.photos/seed/parent/200/200'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Dr. {formData.firstName} {formData.lastName}</h2>
              <p className="text-slate-500">Let's get your profile set up.</p>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">I am a</label>
              <select 
                className="input-field appearance-none bg-white"
                value={formData.relationship}
                onChange={(e) => setFormData({...formData, relationship: e.target.value})}
              >
                <option value="">Select your relationship with the child(ren)</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian/Sponsor</option>
              </select>
            </div>
            <button onClick={nextStep} disabled={!formData.relationship} className="btn-primary w-full">
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Complete your profile</h2>
              <p className="text-slate-500">This helps members recognize you in OAICC.</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <img src={formData.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-brand-light" />
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-brand text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <button 
                onClick={triggerFileInput}
                className="text-brand font-bold text-sm hover:underline"
              >
                Upload profile picture
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title</label>
                <select className="input-field appearance-none bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}>
                  <option value="">Select a title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Profession</label>
                <select className="input-field appearance-none bg-white" value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})}>
                  <option value="">What do you do?</option>
                  <option value="Architect">Architect</option>
                  <option value="Banker">Banker</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <MapPin className="w-5 h-5" />
                </div>
                <input type="text" placeholder="Enter your location" className="input-field" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone Number</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Phone className="w-5 h-5" />
                </div>
                <input type="tel" placeholder="Enter your phone number" className="input-field" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50">
                Back
              </button>
              <button onClick={nextStep} className="flex-[2] btn-primary">
                Continue
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Great! Your account is all set.</h2>
              <p className="text-slate-500 text-lg">
                You have successfully set up your account on OAICC.<br />
                You are currently part of <span className="text-brand font-bold">The Seaside School</span> plan.
              </p>
            </div>
            <button onClick={() => navigate('/parent/dashboard')} className="btn-primary w-full py-4 text-lg">
              Go to Dashboard
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-brand p-6 text-white text-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase">Onboarding</h1>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white p-8 md:p-12">
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-12 bg-brand' : 'w-2 bg-slate-200'}`} 
                />
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
