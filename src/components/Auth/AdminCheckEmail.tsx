import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Logo from '../Logo';

export default function AdminCheckEmail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" 
          alt="Admin" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-20 left-20 right-20">
          <Logo variant="white" size="lg" className="mb-8" />
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Check your <span className="text-brand">email</span>.
          </h1>
          <p className="text-xl text-slate-300 font-medium max-w-lg">
            We've sent a password reset link to your email address. Please check your inbox.
          </p>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <Logo size="md" />
          </div>

          <Link to="/admin/signin" className="inline-flex items-center gap-2 text-brand font-bold hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to log in
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 font-medium">
              We have sent a secure reset link to your email. Click on the link to reset your password
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mb-8">
              <Mail className="w-10 h-10" />
            </div>

            <button 
              onClick={() => navigate('/admin/set-password')}
              className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Resend email <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
