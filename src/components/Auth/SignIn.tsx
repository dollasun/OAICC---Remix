import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import AuthSlider from './AuthSlider';
import GoogleAuthModal from './GoogleAuthModal';
import { useToast } from '../../context/ToastContext';

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Welcome back! Successfully signed in.', 'success');
    if (role === 'school') {
      navigate('/school/dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (role === 'parent') {
      navigate('/parent/dashboard');
    } else if (role === 'counselor') {
      navigate('/counselor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthSlider 
        title="Empowering the next generation." 
        subtitle={`Join thousands of ${role}s helping students find their true calling.`}
      />

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-brand transition-colors font-bold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <Logo size="lg" className="mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500">
              Don't have an account? {' '}
              <button 
                onClick={() => navigate(`/auth/signup?role=${role}`)}
                className="text-brand font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate('/auth/forgot-password')}
                  className="text-sm text-brand font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
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
              Sign In
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand/40 transition-all font-medium text-slate-700 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </form>

          <GoogleAuthModal 
            isOpen={showGoogleModal} 
            onClose={() => setShowGoogleModal(false)} 
            targetRole={role}
            mode="signin"
          />
        </motion.div>
      </div>
    </div>
  );
}
