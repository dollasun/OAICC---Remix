import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  School, 
  Users, 
  Heart, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo';
import { UserRole } from '../types';

const roles: { id: UserRole; title: string; icon: React.ReactNode; description: string; color: string }[] = [
  { 
    id: 'student', 
    title: 'Student', 
    icon: <GraduationCap className="w-8 h-8" />, 
    description: 'Explore career paths and track your learning journey.',
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 flex flex-col items-center"
      >
        <Logo size="xl" className="mb-6" />
        <h1 className="text-5xl font-bold text-slate-900 mb-4 font-display">
          Welcome to <span className="text-brand">OAICC</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The ultimate platform for career guidance and student success. 
          Select your role to get started.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => {
              if (role.id === 'admin') {
                navigate('/admin/signin');
              } else if (role.id === 'counselor') {
                navigate('/counselor/signin');
              } else {
                navigate(`/auth/signin?role=${role.id}`);
              }
            }}
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 group"
          >
            <div className={`${role.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
              {role.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{role.title}</h3>
            <p className="text-slate-500 mb-6">{role.description}</p>
            <div className="flex items-center text-brand font-semibold group-hover:gap-2 transition-all">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} OAICC Career Counseling Platform. All rights reserved.
      </footer>
    </div>
  );
}
