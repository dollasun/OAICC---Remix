import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/check-email');
  };

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
            Forgot your <span className="text-brand">password</span>?
          </h1>
          <p className="text-xl text-slate-300 font-medium max-w-lg">
            Don't worry, it happens. Enter your email and we'll send you instructions to reset it.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <Logo size="md" />
          </div>

          <Link to="/admin/signin" className="inline-flex items-center gap-2 text-brand font-bold hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to log in
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot your password?</h2>
            <p className="text-slate-500 font-medium">
              Enter the email address below and we'll send you instructions to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:text-brand transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
                  placeholder="fadeyibiaina@oaicc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8"
            >
              Send email <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
