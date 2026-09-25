import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowLeft, Check, AlertCircle, User } from 'lucide-react';
import Logo from '../Logo';
import AuthSlider from './AuthSlider';
import GoogleAuthModal from './GoogleAuthModal';
import { useToast } from '../../context/ToastContext';

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // T&C Acceptance State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  React.useEffect(() => {
    if (role === 'school') {
      navigate('/auth/signup/school', { replace: true });
    }
  }, [role, navigate]);

  const isPasswordMatch = formData.password.length >= 6 && formData.password === formData.confirmPassword;

  const isFormValid = Boolean(
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.email.includes('@') &&
    (role === 'student' || formData.phone.trim()) &&
    isPasswordMatch &&
    termsAccepted
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      showToast('Passwords do not match or are too short (min 6 characters).', 'error');
      return;
    }
    if (!isFormValid) {
      if (!termsAccepted) {
        setTermsError(true);
        showToast('You must accept the Terms and Conditions and Privacy Policy to complete registration.', 'error');
      } else {
        showToast('Please complete all required fields correctly.', 'error');
      }
      return;
    }
    setTermsError(false);
    showToast('Account created successfully! Welcome to OAICC.', 'success');
    navigate(`/onboarding/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthSlider 
        title="Start your journey today." 
        subtitle="Create an account and help shape the future of education."
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
          <div className="mb-6">
            <Logo size="lg" className="mb-5" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1.5 font-display">
              Sign up as a {role === 'parent' ? 'sponsor' : role.toLowerCase()}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <p>Create your account to get started.</p>
              <p>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate(`/auth/signin?role=${role}`)}
                  className="text-brand font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">First Name</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="First name" 
                    className="input-field py-3 text-sm" 
                    required 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Last name" 
                    className="input-field py-3 text-sm" 
                    required 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {role !== 'student' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                <div className="input-with-icon">
                  <div className="icon-wrapper">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="(555) 000-0000" 
                    className="input-field py-3 text-sm" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password (min 6 characters)" 
                  className="input-field pr-12 py-3 text-sm"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="input-with-icon">
                <div className="icon-wrapper">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm password" 
                  className={`input-field pr-12 py-3 text-sm ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400/20'
                      : ''
                  }`}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-rose-500 font-medium pl-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Policy Acceptance Session */}
            <div className="pt-2">
              {role === 'parent' ? (
                <div className={`p-4 rounded-2xl border transition-all ${
                  termsError 
                    ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      Parent/Guardian — Mandatory
                    </span>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group select-none">
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) setTermsError(false);
                        }}
                        className="sr-only peer"
                        id="parent-terms-checkbox"
                      />
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        termsAccepted 
                          ? 'bg-brand border-brand text-white shadow-sm' 
                          : termsError
                            ? 'border-red-400 bg-white dark:bg-slate-800'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-brand'
                      }`}>
                        {termsAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                      I confirm that I am the student’s parent/guardian or have lawful authority to act for them. I agree to the{' '}
                      <Link 
                        to="/policies/terms?role=parent" 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand font-bold hover:underline"
                      >
                        OAICC Terms of Use
                      </Link>, acknowledge the{' '}
                      <Link 
                        to="/policies/privacy?role=parent" 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand font-bold hover:underline"
                      >
                        Privacy Policy
                      </Link>, and consent to the student’s participation and data processing where required.
                    </span>
                  </label>
                </div>
              ) : role === 'school' ? (
                <div className={`p-4 rounded-2xl border transition-all ${
                  termsError 
                    ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
                      School — Mandatory
                    </span>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group select-none">
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) setTermsError(false);
                        }}
                        className="sr-only peer"
                        id="school-terms-checkbox"
                      />
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        termsAccepted 
                          ? 'bg-brand border-brand text-white shadow-sm' 
                          : termsError
                            ? 'border-red-400 bg-white dark:bg-slate-800'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-brand'
                      }`}>
                        {termsAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                      I confirm that I am authorised to act for this school. I agree to the{' '}
                      <Link 
                        to="/policies/terms?role=school" 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand font-bold hover:underline"
                      >
                        OAICC Terms of Use
                      </Link>, acknowledge the{' '}
                      <Link 
                        to="/policies/privacy?role=school" 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand font-bold hover:underline"
                      >
                        Privacy
                      </Link>{' '}
                      and{' '}
                      <Link 
                        to="/policies/safeguarding?role=school" 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand font-bold hover:underline"
                      >
                        Safeguarding Policies
                      </Link>, and confirm that the school has lawful authority to enrol the student and provide their information, including any required parent/guardian consent.
                    </span>
                  </label>
                </div>
              ) : (
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) setTermsError(false);
                      }}
                      className="sr-only peer"
                      id="terms-checkbox"
                    />
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      termsAccepted 
                        ? 'bg-brand border-brand text-white shadow-sm' 
                        : termsError
                          ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-brand'
                    }`}>
                      {termsAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {role === 'counselor' ? (
                      <>
                        I agree to the{' '}
                        <Link 
                          to={`/policies/terms?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Terms of Use
                        </Link>{' '}
                        and accept the{' '}
                        <Link 
                          to={`/policies/counselor-code?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Counselor & Mentor Code of Conduct
                        </Link>.
                      </>
                    ) : role === 'teacher' ? (
                      <>
                        I agree to the{' '}
                        <Link 
                          to={`/policies/terms?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Terms of Use
                        </Link>,{' '}
                        <Link 
                          to={`/policies/privacy?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Privacy Policy
                        </Link>, and{' '}
                        <Link 
                          to={`/policies/acceptable-use?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Acceptable Use Policy
                        </Link>.
                      </>
                    ) : (
                      <>
                        I agree to the{' '}
                        <Link 
                          to={`/policies/terms?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Terms of Use
                        </Link>{' '}
                        and{' '}
                        <Link 
                          to={`/policies/privacy?role=${role}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand font-bold hover:underline"
                        >
                          Privacy Policy
                        </Link>.
                      </>
                    )}
                  </span>
                </label>
              )}

              {termsError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500 font-medium pl-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {role === 'parent'
                      ? 'Please confirm the mandatory parent/guardian policy declaration to continue.'
                      : role === 'school'
                        ? 'Please confirm the mandatory school policy declaration to continue.'
                        : 'Please accept the Terms of Use and Privacy Policy to continue.'}
                  </span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!isFormValid}
              className={`w-full py-3.5 mt-2 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center text-sm ${
                isFormValid 
                  ? 'bg-brand hover:bg-brand-hover text-white cursor-pointer active:scale-[0.99]' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              Sign up
            </button>

            <button 
              type="button" 
              disabled={!termsAccepted}
              onClick={() => {
                setShowGoogleModal(true);
              }}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl transition-all font-medium text-sm shadow-sm ${
                termsAccepted
                  ? 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Sign up with Google
            </button>
          </form>

          <GoogleAuthModal 
            isOpen={showGoogleModal} 
            onClose={() => setShowGoogleModal(false)} 
            targetRole={role}
            mode="signup"
          />
        </motion.div>

        {/* Clean, Simple Footer Legal Links */}
        <div className="w-full max-w-md mx-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-400">
          <Link to={`/policies/terms?role=${role}`} className="hover:text-brand transition-colors">
            Terms & Conditions
          </Link>
          <span aria-hidden="true">·</span>
          <Link to={`/policies/privacy?role=${role}`} className="hover:text-brand transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
