import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { schoolClassesStorage, schoolStorage } from '../../../utils/storage';
import {
  addExistingStudentToSchool, createInvite, fullName, linkParentToStudents, moveStudentToClass,
  studentsOfSchool, studentsStore,
} from '../../../utils/schoolData';

type InviteRole = 'teacher' | 'student' | 'parent';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called after an invite or direct add succeeds so the parent page can refresh. */
  onDone: () => void;
  lockRole?: InviteRole;
  lockClassId?: string;
}

export default function InviteUserModal({ open, onClose, onDone, lockRole, lockClassId }: Props) {
  const { showToast } = useToast();
  const school = schoolStorage.get();
  const [role, setRole] = useState<InviteRole | ''>(lockRole ?? '');
  const [email, setEmail] = useState('');
  const [classId, setClassId] = useState(lockClassId ?? '');
  const [childId, setChildId] = useState('');
  const [result, setResult] = useState<{ link?: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setRole(lockRole ?? '');
      setEmail('');
      setClassId(lockClassId ?? '');
      setChildId('');
      setResult(null);
      setCopied(false);
    }
  }, [open, lockRole, lockClassId]);

  const classes = open ? schoolClassesStorage.get() : [];
  const students = open ? studentsOfSchool(school?.id) : [];

  const close = () => { onClose(); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) { showToast('Register your school first.', 'error'); return; }
    if (!role) return;
    const invitedBy = { role: 'school' as const, userId: school.id };

    // Students who already have an OAICC account are added directly and notified.
    if (role === 'student') {
      const existing = studentsStore.all().find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        if (existing.schoolId === school.id) {
          if (classId && existing.classId !== classId) {
            moveStudentToClass(existing.id, classId);
            onDone();
            setResult({ message: 'This student is already in your school and has been moved to the selected class.' });
            return;
          }
          showToast('This student is already in your school.', 'error');
          return;
        }
        if (existing.schoolId) { showToast('This student belongs to another school.', 'error'); return; }
        const added = addExistingStudentToSchool(school.id, existing.id, classId || undefined);
        if ('error' in added) { showToast(added.error, 'error'); return; }
        onDone();
        setResult({ message: 'This student already has an account with OAICC. They have been added to your school and notified.' });
        return;
      }
    }

    const created = createInvite({ role, email, classId: role === 'student' ? classId : undefined, invitedBy });
    if ('error' in created) { showToast(created.error, 'error'); return; }
    if (role === 'parent' && childId) linkParentToStudents(created.value.invite.userId, [childId]);
    onDone();
    setResult({ link: created.value.link, message: 'Invitation created. Share this link with them to join.' });
  };

  const copy = async () => {
    if (!result?.link) return;
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy automatically. Select the link and copy it.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
            {result ? (
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><Check className="w-7 h-7" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{result.link ? 'Invitation ready' : 'Done'}</h3>
                  <p className="text-slate-600 leading-relaxed">{result.message}</p>
                </div>
                {result.link && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Invite link</label>
                    <div className="flex gap-2">
                      <input readOnly value={result.link} onFocus={e => e.currentTarget.select()} className="input-field py-3 text-xs" />
                      <button type="button" onClick={copy} className="px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Email delivery isn't set up yet, so send this link to them yourself.</p>
                  </div>
                )}
                <button onClick={close} className="btn-primary w-full py-4">Okay, Got it!</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{lockRole === 'teacher' ? 'Invite teacher' : lockRole === 'student' ? 'Add new student' : 'Invite new user'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email address</label>
                    <input type="email" placeholder="Enter email address" className="input-field" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>

                  {!lockRole && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Role</label>
                      <select className="input-field appearance-none bg-white" required value={role} onChange={e => setRole(e.target.value as InviteRole)}>
                        <option value="">Select a role</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent/ Guardian</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                  )}

                  {role === 'parent' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Child <span className="font-medium text-slate-400">(optional)</span></label>
                      <select className="input-field appearance-none bg-white" value={childId} onChange={e => setChildId(e.target.value)}>
                        <option value="">{students.length ? 'Select a student' : 'No students yet'}</option>
                        {students.map(s => <option key={s.id} value={s.id}>{fullName(s) || s.email}</option>)}
                      </select>
                    </div>
                  )}

                  {role === 'student' && !lockClassId && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Class</label>
                      <select className="input-field appearance-none bg-white" required value={classId} onChange={e => setClassId(e.target.value)}>
                        <option value="">{classes.length ? 'Select class' : 'Create a class first'}</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={close} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 btn-primary">{lockRole === 'student' ? 'Add student' : 'Invite user'}</button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
