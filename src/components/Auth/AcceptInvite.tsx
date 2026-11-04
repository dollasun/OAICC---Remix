import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, User, ShieldAlert } from 'lucide-react';
import AuthSlider from './AuthSlider';
import Logo from '../Logo';
import { useToast } from '../../context/ToastContext';
import { acceptInvite, className, invitesStore, studentsStore, teachersStore, parentsStore } from '../../utils/schoolData';
import { schoolStorage } from '../../utils/storage';

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const invite = invitesStore.byToken(token);
  const usable = invite && invite.status === 'pending';

  const prefill =
    invite?.role === 'teacher' ? teachersStore.get(invite.userId)
    : invite?.role === 'student' ? studentsStore.get(invite.userId)
    : invite ? parentsStore.get(invite.userId) : undefined;

  const [form, setForm] = useState({ firstName: prefill?.firstName ?? '', lastName: prefill?.lastName ?? '', phone: '' });
  const [accepted, setAccepted] = useState(false);

  const school = invite?.schoolId ? schoolStorage.get() : null;
  const roleLabel = invite?.role === 'parent' ? 'parent / guardian' : invite?.role;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;
    if (!accepted) {
      showToast('Please accept the Terms and Privacy Policy to continue.', 'error');
      return;
    }
    const result = acceptInvite(invite.token, form);
    if ('error' in result) {
      showToast(result.error, 'error');
      return;
    }
    localStorage.setItem('user_role', invite.role);
    showToast('Welcome to OAICC! Your account is ready.');
    navigate(`/onboarding/${invite.role}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthSlider title="You're invited." subtitle="Join your school community on OAICC and start exploring career paths." />

      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-12 bg-white dark:bg-slate-900 overflow-y-auto relative">
        <div className="flex items-center justify-between w-full mb-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors font-bold group text-sm">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md mx-auto my-auto py-4">
          <Logo size="lg" className="mb-5" />

          {!usable ? (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center"><ShieldAlert className="w-7 h-7" /></div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Invite not available</h1>
              <p className="text-slate-500">
                {invite?.status === 'accepted'
                  ? 'This invitation has already been used. Sign in to continue.'
                  : 'This invitation link is invalid or has been cancelled. Ask the person who invited you to send a new one.'}
              </p>
              <button onClick={() => navigate('/auth/signin')} className="btn-primary w-full py-3">Go to sign in</button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1.5 font-display">Accept your invitation</h1>
              <p className="text-sm text-slate-500 mb-6">
                You've been invited to join {school ? <b className="text-slate-700 dark:text-slate-300">{school.name}</b> : 'OAICC'} as a {roleLabel}
                {invite.classId ? <> in <b className="text-slate-700 dark:text-slate-300">{className(invite.classId)}</b></> : null}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email</label>
                  <div className="input-with-icon">
                    <div className="icon-wrapper"><Mail className="w-4 h-4" /></div>
                    <input type="email" value={invite.email} readOnly className="input-field py-3 text-sm opacity-70 cursor-not-allowed" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">First Name</label>
                    <div className="input-with-icon">
                      <div className="icon-wrapper"><User className="w-4 h-4" /></div>
                      <input type="text" required placeholder="First name" className="input-field py-3 text-sm" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                    <div className="input-with-icon">
                      <div className="icon-wrapper"><User className="w-4 h-4" /></div>
                      <input type="text" required placeholder="Last name" className="input-field py-3 text-sm" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                  </div>
                </div>
                {invite.role !== 'student' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone number</label>
                    <div className="input-with-icon">
                      <div className="icon-wrapper"><Phone className="w-4 h-4" /></div>
                      <input type="tel" placeholder="+234 800 000 0000" className="input-field py-3 text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                )}
                <label className="flex items-start gap-3 text-xs text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-0.5 accent-brand" />
                  <span>
                    I agree to the <a href="/terms" target="_blank" rel="noreferrer" className="text-brand font-bold hover:underline">Terms</a> and{' '}
                    <a href="/privacy" target="_blank" rel="noreferrer" className="text-brand font-bold hover:underline">Privacy Policy</a>.
                  </span>
                </label>
                <button type="submit" className="btn-primary w-full py-3.5">Accept & continue</button>
              </form>
            </>
          )}
        </motion.div>
        <div />
      </div>
    </div>
  );
}
