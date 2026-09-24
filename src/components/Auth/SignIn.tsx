import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-12 bg-white dark:bg-slate-900 overflow-y-auto relative">
        <div className="flex items-center justify-between w-full mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors font-bold group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto my-auto py-4"
        >
          <div className="mb-8">
            <Logo size="lg" className="mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-slate-500 text-sm">
              Don't have an account? {' '}
              <button 
                onClick={() => navigate(`/auth/signup?role=${role}`)}
                className="text-brand font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="input-field py-3 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate('/auth/forgot-password')}
                  className="text-xs text-brand font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input-field pr-12 py-3 text-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5">
              Sign In
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold">Or continue with</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-700 dark:text-slate-200 text-sm shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
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

        {/* Legal hyperlinks at the bottom of login */}
        <div className="w-full max-w-md mx-auto pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By signing in, you acknowledge OAICC's{' '}
            <Link to={`/policies/terms?role=${role}`} className="text-brand font-semibold hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to={`/policies/privacy?role=${role}`} className="text-brand font-semibold hover:underline">Privacy Policy</Link>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400">
            <Link to={`/policies/terms?role=${role}`} className="hover:text-brand transition-colors">Terms & Conditions</Link>
            <span aria-hidden="true">·</span>
            <Link to={`/policies/privacy?role=${role}`} className="hover:text-brand transition-colors">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to={`/policies/safeguarding?role=${role}`} className="hover:text-brand transition-colors">Child Safeguarding</Link>
            <span aria-hidden="true">·</span>
            <Link to={`/policies/cookies?role=${role}`} className="hover:text-brand transition-colors">Cookie Notice</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
