import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Lock, 
  ArrowRight, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  FileText,
  Users,
  GraduationCap,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';
import Logo from '../Logo';
import { POLICIES, PolicyDocument } from '../../data/policiesData';
import { useToast } from '../../context/ToastContext';

type Step = 'personal' | 'professional' | 'password' | 'success';

interface CounselorTypeOption {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
}

const COUNSELOR_TYPES: CounselorTypeOption[] = [
  {
    id: 'school_counselor',
    title: 'School Counselor',
    badge: 'Institutional',
    description: 'Certified in-school guidance advisor working directly with registered student cohorts.',
    icon: <Building2 className="w-5 h-5" />
  },
  {
    id: 'independent_counselor',
    title: 'Independent Career Counselor',
    badge: 'Private Practice',
    description: 'Private practice advisor consulting students and families on career trajectories and pathways.',
    icon: <Briefcase className="w-5 h-5" />
  },
  {
    id: 'admissions_advisor',
    title: 'College Admissions & Guidance Specialist',
    badge: 'Higher Ed',
    description: 'Specialist focused on university applications, vocational options, and scholarship navigation.',
    icon: <GraduationCap className="w-5 h-5" />
  },
  {
    id: 'industry_mentor',
    title: 'Career Mentor & Industry Advisor',
    badge: 'Mentorship',
    description: 'Experienced industry practitioner providing real-world guidance, coaching, and career insights.',
    icon: <Users className="w-5 h-5" />
  }
];

export default function CounselorOnboarding() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('personal');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: 'counselor@oaicc.com',
    phone: '',
    bio: '',
    specialization: '',
    experience: '',
    education: '',
    counselorType: 'school_counselor',
    password: '',
    confirmPassword: '',
    agreedToPolicies: false,
    acceptedPrivacy: false,
    acceptedCodeOfConduct: false,
    acceptedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // In-page modal preview for reading policies
  const [previewPolicy, setPreviewPolicy] = useState<PolicyDocument | null>(null);

  const isPasswordValid = formData.password.length >= 8 && formData.password === formData.confirmPassword;
  const isStep3Valid = isPasswordValid && formData.agreedToPolicies;

  const handleNext = () => {
    if (step === 'personal') {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        showToast('Please provide your first and last name.', 'error');
        return;
      }
      setStep('professional');
    } else if (step === 'professional') {
      setStep('password');
    }
  };

  const handleCompleteSetup = () => {
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreedToPolicies) {
      errors.policies = 'You must accept the Terms of Use, Privacy Policy, and Counselor Code of Conduct to proceed.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast('Please fulfill all mandatory agreements and requirements.', 'error');
      return;
    }

    setValidationErrors({});

    // Persist verified counselor setup
    localStorage.setItem('counselor_auth', 'true');
    localStorage.setItem('user_role', 'counselor');
    localStorage.setItem('counselor_user_type', formData.counselorType || 'school_counselor');
    localStorage.setItem('counselor_name', `${formData.firstName} ${formData.lastName}`.trim() || 'Counselor');
    localStorage.setItem('counselor_accepted_privacy', 'true');
    localStorage.setItem('counselor_accepted_code_of_conduct', 'true');
    localStorage.setItem('counselor_accepted_terms', 'true');
    localStorage.setItem('counselor_setup_completed_at', new Date().toISOString());

    showToast('Counselor profile and legal agreements confirmed!', 'success');
    setStep('success');
  };

  const openPolicyReader = (policyId: string) => {
    const doc = POLICIES.find(p => p.id === policyId);
    if (doc) {
      setPreviewPolicy(doc);
    }
  };

  const handleModalAccept = () => {
    setFormData(prev => ({
      ...prev,
      agreedToPolicies: true,
      acceptedPrivacy: true,
      acceptedCodeOfConduct: true,
      acceptedTerms: true
    }));
    setValidationErrors(prev => ({ ...prev, policies: '', privacy: '', codeOfConduct: '', terms: '' }));
    setPreviewPolicy(null);
    showToast('Agreements confirmed!', 'success');
  };

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional Info', icon: Briefcase },
    { id: 'password', label: 'Account & Agreements', icon: Lock },
  ];

  const selectedTypeMeta = COUNSELOR_TYPES.find(t => t.id === formData.counselorType) || COUNSELOR_TYPES[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <Logo size="md" />
        <div className="flex items-center gap-4 sm:gap-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.id ? 'bg-brand text-white shadow-sm shadow-brand/10' : 
                steps.findIndex(x => x.id === step) > i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {steps.findIndex(x => x.id === step) > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs sm:text-sm font-bold hidden sm:block ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className="w-6 sm:w-8 h-px bg-slate-200 ml-1 sm:ml-2" />}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {step === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm shadow-slate-200/40 border border-slate-100"
              >
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
                    About You
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Let's start with your counselor profile credentials.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div className="w-28 h-28 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-brand/50 group-hover:bg-slate-100/50 transition-all cursor-pointer overflow-hidden">
                        <Camera className="w-7 h-7 mb-1.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Photo</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-800 transition-all text-sm"
                        placeholder="e.g. Samuel"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-800 transition-all text-sm"
                        placeholder="e.g. Adebayo"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      disabled
                      className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium text-slate-500 cursor-not-allowed text-sm"
                      value={formData.email}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-800 transition-all text-sm"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                      Professional Bio
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-800 transition-all resize-none text-sm"
                      placeholder="Brief overview of your counseling methodology and guidance approach..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <button 
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.firstName.trim() || !formData.lastName.trim()}
                    className={`w-full py-4 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4 text-sm ${
                      formData.firstName.trim() && formData.lastName.trim()
                        ? 'bg-brand hover:bg-brand-hover text-white hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Continue to Professional Info <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Info */}
            {step === 'professional' && (
              <motion.div
                key="professional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm shadow-slate-200/40 border border-slate-100"
              >
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
                    Professional Experience
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Specify your domain expertise, certifications, and guidance specialties.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                      Primary Specialization
                    </label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-700 transition-all appearance-none text-sm"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    >
                      <option value="">Select your specialization</option>
                      <option value="Career Counseling">Career Counseling & Discovery</option>
                      <option value="Academic Advising">Academic Advising & Subject Selection</option>
                      <option value="College Admissions">College Admissions & Global Applications</option>
                      <option value="Vocational Guidance">Vocational Guidance & Technical Trades</option>
                      <option value="STEM Mentorship">STEM & Technology Mentorship</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                      Years of Experience <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input 
                      type="text"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-700 transition-all text-sm"
                      placeholder="e.g. 6+ years in secondary education"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
                      Credentials & Certifications <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-700 transition-all resize-none text-sm"
                      placeholder="e.g. B.Ed Guidance & Counseling, Certified Career Development Facilitator..."
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => setStep('personal')}
                      className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-[2] py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      Continue to Agreements <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Final Setup Page - Counselor User Type, Password & Policy Acceptance */}
            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm shadow-slate-200/40 border border-slate-100"
              >
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" /> Final Setup Step
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
                    Account & Agreements
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Select your counselor user type, secure your account, and accept professional agreements.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* 1. Counselor User Type Selection (Optional & Simplified) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Select Counselor Type</span>
                      <span className="text-[11px] font-normal text-slate-400">Optional</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.counselorType}
                        onChange={(e) => setFormData({ ...formData, counselorType: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand font-medium text-slate-700 text-sm appearance-none cursor-pointer"
                      >
                        <option value="school_counselor">School Counselor</option>
                        <option value="independent_counselor">Independent Career Counselor</option>
                        <option value="admissions_advisor">College Admissions Specialist</option>
                        <option value="industry_mentor">Career Mentor & Industry Advisor</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. Password Creation */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-brand" /> Account Password <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">Create Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-xl outline-none text-sm transition-all ${
                              validationErrors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10'
                            }`}
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({ ...formData, password: e.target.value });
                              setValidationErrors(prev => ({ ...prev, password: '' }));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {validationErrors.password && (
                          <p className="text-[11px] text-red-500">{validationErrors.password}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">Confirm Password</label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-xl outline-none text-sm transition-all ${
                              validationErrors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10'
                            }`}
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              setFormData({ ...formData, confirmPassword: e.target.value });
                              setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {validationErrors.confirmPassword && (
                          <p className="text-[11px] text-red-500">{validationErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Mandatory Policy Agreement (Single line & single checkbox, clean like student) */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={formData.agreedToPolicies}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              agreedToPolicies: checked,
                              acceptedPrivacy: checked,
                              acceptedCodeOfConduct: checked,
                              acceptedTerms: checked
                            }));
                            if (checked) setValidationErrors(prev => ({ ...prev, policies: '' }));
                          }}
                          className="sr-only peer"
                          id="counselor-agreements-checkbox"
                        />
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          formData.agreedToPolicies 
                            ? 'bg-brand border-brand text-white shadow-sm' 
                            : validationErrors.policies
                              ? 'border-red-400 bg-red-50/50'
                              : 'border-slate-300 bg-white group-hover:border-brand'
                        }`}>
                          {formData.agreedToPolicies && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <span className="text-xs leading-relaxed text-slate-600">
                        I agree to the{' '}
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); openPolicyReader('terms'); }}
                          className="text-brand font-bold hover:underline inline"
                        >
                          Terms of Use
                        </button>{' '}
                        and accept the{' '}
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); openPolicyReader('counselor-code'); }}
                          className="text-brand font-bold hover:underline inline"
                        >
                          Counselor and Mentor Code of Conduct
                        </button>.
                      </span>
                    </label>

                    {validationErrors.policies && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium pl-8">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{validationErrors.policies}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => setStep('professional')}
                      className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      disabled={!isStep3Valid}
                      onClick={handleCompleteSetup}
                      className={`flex-[2] py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
                        isStep3Valid 
                          ? 'bg-brand hover:bg-brand-hover text-white cursor-pointer hover:scale-[1.01] active:scale-[0.99]' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      Complete Setup <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success View */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 sm:p-12 rounded-3xl shadow-sm shadow-slate-200/40 border border-slate-100 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display mb-3">
                  Setup Complete!
                </h2>
                <p className="text-base text-slate-600 font-medium mb-8 max-w-md mx-auto leading-relaxed">
                  Your counselor profile as a <strong className="text-slate-900 font-bold">{selectedTypeMeta.title}</strong> has been configured with verified policy agreements.
                </p>

                {/* Verified Badges */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-8 max-w-md mx-auto text-left space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Privacy Policy accepted
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Counselor Code of Conduct accepted
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Terms of Use verified
                  </div>
                </div>

                <button 
                  onClick={() => {
                    navigate('/counselor/dashboard');
                  }}
                  className="w-full py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-base"
                >
                  Go to Counselor Dashboard <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* In-page Policy Reader Modal */}
      <AnimatePresence>
        {previewPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {previewPolicy.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Counselor Agreement · v{previewPolicy.version}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewPolicy(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {previewPolicy.noticeBanner && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{previewPolicy.noticeBanner}</span>
                  </div>
                )}
                {previewPolicy.sections.map((sec) => (
                  <div key={sec.id} className="space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {sec.title}
                    </h4>
                    <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewPolicy(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleModalAccept}
                  className="px-5 py-2.5 bg-brand text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:bg-brand-hover flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> I Understand & Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
