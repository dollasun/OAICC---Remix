import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  School, 
  Users, 
  Heart, 
  Briefcase, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Lock,
  Cookie,
  FileText,
  Sliders
} from 'lucide-react';
import Logo from './Logo';
import { UserRole } from '../types';
import GoogleAuthModal from './Auth/GoogleAuthModal';
import { useCookies } from '../context/CookieContext';

const roles: { id: UserRole; title: string; icon: React.ReactNode; description: string; color: string }[] = [
  { 
    id: 'student', 
    title: 'Student', 
    icon: <GraduationCap className="w-8 h-8" />, 
    description: 'Explore career paths, take interest/strength quizzes, and track your journey.',
    color: 'bg-blue-500'
  },
  { 
    id: 'parent', 
    title: 'Parent', 
    icon: <Heart className="w-8 h-8" />, 
    description: 'Support your child\'s career development and monitor progress.',
    color: 'bg-cyan-500'
  },
  { 
    id: 'teacher', 
    title: 'Teacher', 
    icon: <Briefcase className="w-8 h-8" />, 
    description: 'Guide students and manage classroom career activities.',
    color: 'bg-emerald-500'
  },
  { 
    id: 'counselor', 
    title: 'Counselor', 
    icon: <Users className="w-8 h-8" />, 
    description: 'Provide professional guidance and career assessments.',
    color: 'bg-violet-500'
  },
  { 
    id: 'school', 
    title: 'School', 
    icon: <School className="w-8 h-8" />, 
    description: 'Manage institutional career programs and student data.',
    color: 'bg-orange-500'
  },
  { 
    id: 'admin', 
    title: 'Admin', 
    icon: <User className="w-8 h-8" />, 
    description: 'Platform administration and system-wide management.',
    color: 'bg-slate-700'
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const { openModal: openCookieModal } = useCookies();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-8">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 flex flex-col items-center max-w-3xl"
        >
          <Logo size="xl" className="mb-6" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 font-display tracking-tight">
            Welcome to <span className="text-brand">OAICC</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            The personalized career counseling and psychometric assessment platform. 
            Select your role or sign up directly with Google to begin your journey.
          </p>

          {/* Quick Google Sign Up Simulation CTA */}
          <button
            onClick={() => setShowGoogleModal(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-full hover:border-brand hover:shadow-md transition-all font-bold text-slate-800 dark:text-slate-200 text-sm group"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span>Sign up with Google (Student)</span>
            <span className="px-2.5 py-0.5 bg-brand/10 text-brand rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Demo
            </span>
          </button>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                if (role.id === 'admin') {
                  navigate('/admin/signin');
                } else if (role.id === 'counselor') {
                  navigate('/counselor/signin');
                } else {
                  navigate(`/auth/signup?role=${role.id}`);
                }
              }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 dark:border-slate-800 group"
            >
              <div className={`${role.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{role.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">{role.description}</p>
              <div className="flex items-center text-brand font-bold text-sm group-hover:gap-2 transition-all">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <GoogleAuthModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)} 
        targetRole="student"
        mode="signup"
      />

      {/* Modern High-Craft Footer with Legal Hyperlinks & Trust Badges */}
      <footer className="w-full max-w-6xl mt-16 pt-10 pb-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Logo size="md" />
            <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Online Assessment & Individual Career Counseling Platform
            </p>
          </div>

          {/* Trust Assurances */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> FERPA & COPPA Safe
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand" /> 256-bit Encrypted
            </span>
          </div>
        </div>

        {/* Hyperlinks Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-850">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold">
            <Link 
              to="/policies/terms" 
              className="hover:text-brand transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Terms & Conditions
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <Link 
              to="/policies/privacy" 
              className="hover:text-brand transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <Link 
              to="/policies/safeguarding" 
              className="hover:text-brand transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Child Safeguarding
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <Link 
              to="/policies/cookies" 
              className="hover:text-brand transition-colors flex items-center gap-1.5"
            >
              <Cookie className="w-3.5 h-3.5 text-slate-400" />
              Cookie Notice
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={openCookieModal}
              className="hover:text-brand transition-colors flex items-center gap-1.5 text-slate-500 hover:underline cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Cookie Preferences
            </button>
          </div>

          <p className="text-slate-400 text-center text-[11px]">
            &copy; {new Date().getFullYear()} OruAikiIse Ltd (OAICC). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
