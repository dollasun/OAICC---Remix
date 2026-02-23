import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import Logo from '../Logo';
import AuthSlider from './AuthSlider';

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'parent';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (role === 'school') {
      navigate('/auth/signup/school', { replace: true });
    }
  }, [role, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/onboarding/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthSlider 
        title="Start your journey today." 
        subtitle="Create an account and help shape the future of education."
      />

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-8"
        >
          <div className="mb-10">
            <Logo size="lg" className="mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign Up as a {role === 'parent' ? 'Sponsor' : role.charAt(0).toUpperCase() + role.slice(1)}</h1>
            <p className="text-slate-500">
              Already have an account? {' '}
              <button 
                onClick={() => navigate(`/auth/signin?role=${role}`)}
                className="text-brand font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">First Name</label>
                <input type="text" placeholder="John" className="input-field" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Last Name</label>
                <input type="text" placeholder="Doe" className="input-field" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Mail className="w-5 h-5" />
                </div>
                <input type="email" placeholder="name@example.com" className="input-field" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone Number</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Phone className="w-5 h-5" />
                </div>
                <input type="tel" placeholder="(555) 000-0000" className="input-field" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input-field pr-14"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Sign Up
            </button>

            <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
