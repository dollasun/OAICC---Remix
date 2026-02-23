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
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import Logo from '../Logo';

export default function TeacherOnboarding() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: 'Uzo',
    lastName: 'Kelechi',
    email: 'fadeyibiaina@oaicc.com',
    phone: '08055888444',
    bio: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore.',
    location: '34, Wuse II, Abuja, Nigeria',
    avatar: 'https://picsum.photos/seed/teacher/200/200'
  });

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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {formData.title} {formData.firstName} {formData.lastName}</h2>
              <p className="text-slate-500">Let's get your profile set up.</p>
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
              <div className="flex gap-3">
                <button onClick={() => setFormData({...formData, avatar: 'https://picsum.photos/seed/placeholder/200/200'})} className="text-slate-400 font-bold text-sm hover:underline">Remove profile picture</button>
                <button onClick={triggerFileInput} className="text-brand font-bold text-sm hover:underline">Upload profile picture</button>
              </div>
              <p className="text-xs text-slate-400">This helps your members recognize you in OAICC.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title</label>
                <select className="input-field appearance-none bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">First Name</label>
                  <input type="text" className="input-field" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Enter your First name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Last Name</label>
                  <input type="text" className="input-field" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Enter your Last name" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Bio</label>
                <textarea 
                  className="input-field min-h-[120px] py-3 resize-none" 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="Brief description for your profile"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Location</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><MapPin className="w-5 h-5" /></div>
                  <input type="text" className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Enter your Location" />
                </div>
              </div>
            </div>

            <button onClick={nextStep} className="btn-primary w-full py-4">
              Continue
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Set your Password</h2>
              <p className="text-slate-500">Favour Aina & Gbenga Aina</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><Lock className="w-5 h-5" /></div>
                  <input type={showPassword ? "text" : "password"} className="input-field pr-14" placeholder="••••••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper"><Lock className="w-5 h-5" /></div>
                  <input type={showConfirmPassword ? "text" : "password"} className="input-field pr-14" placeholder="••••••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={nextStep} className="btn-primary w-full py-4">
              Set your Password
            </button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {formData.title} {formData.firstName} {formData.lastName}</h2>
              <p className="text-slate-500">Mother to - Favour Aina & Gbenga Aina</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-900 font-display">Great! Your account its all set.</h2>
              <p className="text-slate-500 text-lg">
                Your have successfully setup your account on OAICC.<br />
                You are currently part of <span className="text-brand font-bold">The Seaside School</span> plan.
              </p>
            </div>
            <button onClick={() => navigate('/teacher/dashboard')} className="btn-primary w-full py-4 text-lg">
              Continue
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
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
