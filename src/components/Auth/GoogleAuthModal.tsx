import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, ShieldCheck, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: string;
  defaultEmail?: string;
  mode?: 'signin' | 'signup';
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  targetRole = 'student',
  mode = 'signup'
}: GoogleAuthModalProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { signInWithGoogle } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthStep('Connecting to Google services...');
    
    try {
      await signInWithGoogle();
      
      setAuthStep('Authenticating...');
      
      onClose();
      showToast(mode === 'signin' ? `Welcome back!` : `Signed up successfully!`, 'success');
      
      // If sign-in, skip onboarding and navigate directly to dashboard
      if (mode === 'signin') {
        if (targetRole === 'school') {
          navigate('/school/dashboard');
        } else if (targetRole === 'teacher') {
          navigate('/teacher/dashboard');
        } else if (targetRole === 'parent') {
          navigate('/parent/dashboard');
        } else if (targetRole === 'counselor') {
          navigate('/counselor/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // Sign-up flow: take student or user through onboarding
        if (targetRole === 'school') {
          navigate('/school/dashboard');
        } else {
          navigate(`/onboarding/${targetRole}`);
        }
      }
    } catch (error) {
      console.error(error);
      showToast('Authentication failed. Please try again.', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-6 h-6" 
              />
              <span className="font-semibold text-slate-800 text-sm">
                {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
              </span>
            </div>
            {!isAuthenticating && (
              <button 
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {isAuthenticating ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-brand animate-spin flex items-center justify-center"></div>
                  <img 
                    src="https://www.google.com/favicon.ico" 
                    alt="Google" 
                    className="w-6 h-6 absolute inset-0 m-auto" 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Authenticating</h3>
                  <p className="text-sm text-slate-500 mt-1 animate-pulse font-medium">{authStep}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium mt-4">
                  <ShieldCheck className="w-4 h-4" />
                  Secure OAuth 2.0 Connection
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold text-slate-900">Continue with Google</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Sign in to <span className="font-semibold text-brand">OAICC Career Platform</span>
                  </p>
                </div>
                
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand/5 transition-all text-sm font-bold shadow-sm"
                >
                  <img 
                    src="https://www.google.com/favicon.ico" 
                    alt="Google" 
                    className="w-5 h-5" 
                  />
                  Continue with Google
                </button>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-400">
                    To continue, Google will share your name, email address, language preference, and profile picture with OAICC.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
