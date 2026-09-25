import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import AuthSlider from './AuthSlider';
import GoogleAuthModal from './GoogleAuthModal';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

interface SignInProps {
  defaultRole?: UserRole | string;
}

export default function SignIn({ defaultRole }: SignInProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Determine user role from prop, pathname, or query parameter
  const roleFromPath = location.pathname.includes('/admin') 
    ? 'admin' 
    : location.pathname.includes('/counselor') 
      ? 'counselor' 
      : null;
      
  const role: string = defaultRole || roleFromPath || searchParams.get('role') || 'student';
  const policyRole = role || 'student';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // When clicking sign up, route based on different user types
  const handleSignUpClick = () => {
    if (role === 'school') {
      navigate('/auth/signup/school');
    } else if (role === 'counselor') {
      navigate('/counselor/onboarding');
    } else if (role === 'parent') {
      navigate('/auth/signup?role=parent');
    } else if (role === 'teacher') {
      navigate('/auth/signup?role=teacher');
    } else if (role === 'admin') {
      navigate('/auth/signup?role=admin');
    } else {
      navigate('/auth/signup?role=student');
    }
  };

  const handleForgotPasswordClick = () => {
    if (role === 'admin') {
      navigate('/admin/forgot-password');
    } else {
      navigate(`/auth/forgot-password?role=${role}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    // Persist authenticated state
    localStorage.setItem('user_role', role);
    if (role === 'admin') {
      localStorage.setItem('admin_auth', 'true');
    } else if (role === 'counselor') {
      localStorage.setItem('counselor_auth', 'true');
    }

    showToast('Welcome back! Successfully signed in.', 'success');

    // Route to respective dashboard based on user role
    if (role === 'school') {
      navigate('/school/dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (role === 'parent') {
      navigate('/parent/dashboard');
    } else if (role === 'counselor') {
      navigate('/counselor/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Column - Centered Form View matching exact design in screenshot */}
      <div className="flex-1 w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-8 md:p-12 bg-white relative overflow-y-auto">
        {/* Top Header - Back to Home Button */}
        <div className="w-full mb-4">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#00A3C4] transition-colors font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto my-auto py-4"
        >
          {/* Centered Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          {/* Heading and Subtitle - Centered */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
              Sign In
            </h1>
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={handleSignUpClick}
                className="text-[#00A3C4] font-bold hover:underline transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A3C4] focus:ring-4 focus:ring-[#00A3C4]/10 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-xs font-medium"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-xs font-bold text-[#00A3C4] hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A3C4] focus:ring-4 focus:ring-[#00A3C4]/10 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-xs font-medium"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Sign In Button (Cyan button matching screenshot) */}
            <button 
              type="submit" 
              className="w-full py-3.5 mt-2 bg-[#00A3C4] hover:bg-[#0092B0] text-white font-bold rounded-xl shadow-sm transition-all hover:scale-[1.005] active:scale-[0.995] text-sm flex items-center justify-center cursor-pointer"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative my-7 flex items-center justify-center">
              <div className="w-full border-t border-slate-200/80" />
              <span className="absolute px-3 bg-white text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Sign in with Google Button */}
            <button 
              type="button" 
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50/80 text-slate-700 font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 text-sm cursor-pointer"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          </form>

          <GoogleAuthModal 
            isOpen={showGoogleModal} 
            onClose={() => setShowGoogleModal(false)} 
            targetRole={role}
            mode="signin"
          />
        </motion.div>

        {/* Deep Linking of All Platform Policies at Footer */}
        <div className="w-full max-w-md mx-auto pt-6 border-t border-slate-100 text-center space-y-2">
          {/* Terms of Service & Privacy Policy Acceptance notice */}
          <p className="text-xs text-slate-500 leading-relaxed">
            By signing in, you acknowledge OAICC's{' '}
            <Link 
              to={`/policies/terms?role=${policyRole}`} 
              className="text-[#00A3C4] font-semibold hover:underline"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link 
              to={`/policies/privacy?role=${policyRole}`} 
              className="text-[#00A3C4] font-semibold hover:underline"
            >
              Privacy Policy
            </Link>.
          </p>

          {/* Deep linked Policy Bar with Separator dots matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400">
            <Link 
              to={`/policies/terms?role=${policyRole}`} 
              className="hover:text-[#00A3C4] transition-colors"
            >
              Terms & Conditions
            </Link>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <Link 
              to={`/policies/privacy?role=${policyRole}`} 
              className="hover:text-[#00A3C4] transition-colors"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <Link 
              to={`/policies/safeguarding?role=${policyRole}`} 
              className="hover:text-[#00A3C4] transition-colors"
            >
              Child Safeguarding
            </Link>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <Link 
              to={`/policies/cookies?role=${policyRole}`} 
              className="hover:text-[#00A3C4] transition-colors"
            >
              Cookie Notice
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Slider / Brand Illustration Panel */}
      <AuthSlider 
        title="Start your journey today." 
        subtitle="Empowering students, counselors, schools, and families to discover their full potential."
      />
    </div>
  );
}
