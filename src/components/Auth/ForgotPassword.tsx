import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import Logo from '../Logo';
import AuthSlider from './AuthSlider';

type ForgotStep = 'request' | 'check-email' | 'reset';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotStep>('request');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'error@oaicc.com') {
      setError(true);
      return;
    }
    setError(false);
    setStep('check-email');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    navigate('/auth/signin');
  };

  const renderContent = () => {
    switch (step) {
      case 'request':
        return (
          <motion.div
            key="request"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <Logo size="lg" className="mb-6" />
              <button 
                onClick={() => navigate('/auth/signin')}
                className="text-brand font-bold text-sm flex items-center gap-1 mb-4 hover:underline"
              >
                <ChevronLeft className="w-4 h-4" /> Back to log in
              </button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot your password?</h1>
              <p className="text-slate-500">
                Enter your email address below and we'll send you instructions to reset your password
              </p>
            </div>

            <form onSubmit={handleRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <div className={`input-with-icon ${error ? 'ring-2 ring-red-500/20' : ''}`}>
                  <div className="icon-wrapper">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="fadeyibiaina@oaicc.com" 
                    className={`input-field ${error ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-500 font-bold mt-1">
                    Sorry! This email is not valid, use the email address you use in signing up.
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full">
                Send email
              </button>
            </form>
          </motion.div>
        );

      case 'check-email':
        return (
          <motion.div
            key="check-email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <Logo size="lg" className="mb-6" />
              <button 
                onClick={() => navigate('/auth/signin')}
                className="text-brand font-bold text-sm flex items-center gap-1 mb-4 hover:underline"
              >
                <ChevronLeft className="w-4 h-4" /> Back to log in
              </button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Check your email</h1>
              <p className="text-slate-500">
                We have sent a secure reset link to your email. Click on the link to reset your password
              </p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={() => setStep('reset')} // For demo: clicking resend goes to set password
                className="btn-primary w-full"
              >
                Resend email
              </button>
            </div>
          </motion.div>
        );

      case 'reset':
        return (
          <motion.div
            key="reset"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <Logo size="lg" className="mb-6" />
              <button 
                onClick={() => navigate('/auth/signin')}
                className="text-brand font-bold text-sm flex items-center gap-1 mb-4 hover:underline"
              >
                <ChevronLeft className="w-4 h-4" /> Back to log in
              </button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Set a new password</h1>
              <p className="text-slate-500">
                Enter a new password for your OAICC account
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">New password</label>
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Confirm password</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="input-field pr-14"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Reset password
              </button>
            </form>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthSlider 
        title="Secure your account." 
        subtitle="Follow the steps to reset your password and get back to OAICC."
      />

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
