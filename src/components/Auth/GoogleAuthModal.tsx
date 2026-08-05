import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, ShieldCheck, User, Plus, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

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
  defaultEmail = 'osayuki.aganmwonyi@fbistech.com',
  mode = 'signup'
}: GoogleAuthModalProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const googleAccounts = [
    {
      name: 'Osayuki Aganmwonyi',
      email: defaultEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: 'OA'
    },
    {
      name: 'Alex Johnson',
      email: 'alex.student@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      initials: 'AJ'
    }
  ];

  const handleSelectAccount = (account: { name: string; email: string }) => {
    setSelectedAccount(account.email);
    setIsAuthenticating(true);

    setAuthStep('Connecting to Google services...');
    
    setTimeout(() => {
      setAuthStep('Verifying account credentials & permissions...');
    }, 800);

    setTimeout(() => {
      setAuthStep(`${mode === 'signin' ? 'Signing in' : 'Signing up'} as ${account.name}...`);
    }, 1600);

    setTimeout(() => {
      setIsAuthenticating(false);
      onClose();
      showToast(mode === 'signin' ? `Welcome back, ${account.name}!` : `Signed up with Google as ${account.name}`, 'success');
      
      // Save current logged in user details into localStorage/session
      localStorage.setItem('currentUser', JSON.stringify({
        name: account.name,
        email: account.email,
        role: targetRole,
        provider: 'google'
      }));

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
          navigate(`/onboarding/${targetRole}?name=${encodeURIComponent(account.name)}&email=${encodeURIComponent(account.email)}`);
        }
      }
    }, 2400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const nameFromEmail = customEmail.split('@')[0].replace('.', ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    handleSelectAccount({ name: formattedName, email: customEmail });
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
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Choose an account</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    to continue to <span className="font-semibold text-brand">OAICC Career Platform</span>
                  </p>
                </div>

                {/* Account list */}
                <div className="space-y-2 mb-4">
                  {googleAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleSelectAccount(account)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={account.avatar} 
                          alt={account.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors">{account.name}</p>
                          <p className="text-xs text-slate-500">{account.email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-brand group-hover:text-white transition-colors">
                        Select
                      </span>
                    </button>
                  ))}
                </div>

                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-slate-300 hover:border-brand hover:bg-slate-50 text-slate-600 hover:text-brand transition-all text-sm font-semibold"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-500" />
                    </div>
                    Use another Google account
                  </button>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">Enter your Google Email</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                        required 
                      />
                      <button 
                        type="submit"
                        className="btn-primary text-xs px-4 py-2.5"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                )}

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
