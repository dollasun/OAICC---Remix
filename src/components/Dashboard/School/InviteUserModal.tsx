import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, Download } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { schoolClassesStorage, schoolStorage } from '../../../utils/storage';
import { fullName, studentsOfSchool } from '../../../utils/schoolData';
import { downloadCsv } from '../../../utils/download';
import {
  BULK_ROLES, failedRowsCsv, inviteOne,
  type BulkResult, type InviteRole,
} from '../../../utils/invitations';
import BulkInvitePanel from './BulkInvitePanel';

type Mode = 'single' | 'bulk';
type Result = { kind: 'single'; link?: string; message: string } | { kind: 'bulk'; data: BulkResult };

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called after an invite or direct add succeeds so the parent page can refresh. */
  onDone: () => void;
  lockRole?: InviteRole;
  lockClassId?: string;
}

const ROLE_OPTIONS: Record<InviteRole, string> = { teacher: 'Teacher', parent: 'Parent/ Guardian', student: 'Student' };

export default function InviteUserModal({ open, onClose, onDone, lockRole, lockClassId }: Props) {
  const { showToast } = useToast();
  const school = schoolStorage.get();
  const [mode, setMode] = useState<Mode>('single');
  const [role, setRole] = useState<InviteRole | ''>(lockRole ?? '');
  const [email, setEmail] = useState('');
  const [classId, setClassId] = useState(lockClassId ?? '');
  const [childId, setChildId] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setMode('single');
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
  const fixedClass = classes.find(c => c.id === lockClassId);

  const handleSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) { showToast('Register your school first.', 'error'); return; }
    if (!role) return;
    const r = inviteOne(school, { role, email, classIds: classId ? [classId] : [], childId: childId || undefined });
    if (r.ok === false) { showToast(r.error, 'error'); return; }
    onDone();
    setResult(r.value.kind === 'invited'
      ? { kind: 'single', link: r.value.link, message: 'Invitation sent. The invite link is below in case you need to share it yourself.' }
      : { kind: 'single', message: r.value.message });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy automatically. Select the link and copy it.', 'error');
    }
  };

  const title = result ? '' : lockRole === 'teacher' ? 'Invite teacher' : lockRole === 'student' ? 'Add new student' : 'Invite new user';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-sm p-8">
            {result ? (
              <ResultView result={result} copied={copied} onCopy={copy} onClose={onClose} />
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{title}</h3>

                <div role="tablist" aria-label="Invite type" className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
                  {(['single', 'bulk'] as Mode[]).map(m => (
                    <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                      className={`py-2.5 rounded-lg text-sm font-bold transition-all ${mode === m ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      {m === 'single' ? 'Single invite' : 'Bulk invite'}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {!lockRole && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Role</label>
                      <select className="input-field appearance-none bg-white" required value={role} onChange={e => setRole(e.target.value as InviteRole)}>
                        <option value="">Select a role</option>
                        {BULK_ROLES.map(r => <option key={r} value={r}>{ROLE_OPTIONS[r]}</option>)}
                      </select>
                    </div>
                  )}

                  {mode === 'bulk' ? (
                    role && school ? (
                      <React.Fragment key={`${role}-${lockClassId ?? ''}`}>
                        <BulkInvitePanel
                          school={school}
                          role={role}
                          classes={classes}
                          fixedClass={fixedClass}
                          onCancel={onClose}
                          onImported={data => { onDone(); setResult({ kind: 'bulk', data }); }}
                        />
                      </React.Fragment>
                    ) : (
                      <p className="text-sm text-slate-500">{school ? 'Select a role to download its CSV template and upload your list.' : 'Register your school first.'}</p>
                    )
                  ) : (
                    <form onSubmit={handleSingle} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email address</label>
                        <input type="email" placeholder="Enter email address" className="input-field" required value={email} onChange={e => setEmail(e.target.value)} />
                      </div>

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
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 btn-primary">{lockRole === 'student' ? 'Add student' : 'Invite user'}</button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ResultView({ result, copied, onCopy, onClose }: { result: Result; copied: boolean; onCopy: (t: string) => void; onClose: () => void }) {
  if (result.kind === 'single') {
    return (
      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><Check className="w-7 h-7" /></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{result.link ? 'Invitation sent' : 'Done'}</h3>
          <p className="text-slate-600 leading-relaxed">{result.message}</p>
        </div>
        {result.link && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Invite link</label>
            <div className="flex gap-2">
              <input readOnly value={result.link} onFocus={e => e.currentTarget.select()} className="input-field py-3 text-xs" />
              <button type="button" onClick={() => onCopy(result.link!)} className="px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        <button onClick={onClose} className="btn-primary w-full py-4">Okay, Got it!</button>
      </div>
    );
  }

  const { invited, attached, failed } = result.data;
  const nothingWorked = invited + attached === 0;
  return (
    <div className="space-y-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${nothingWorked ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}><Check className="w-7 h-7" /></div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{nothingWorked ? 'No invitations sent' : 'Invitations sent'}</h3>
        <ul className="text-slate-600 leading-relaxed space-y-1">
          {invited > 0 && <li><span className="font-bold text-slate-900">{invited}</span> invited by email</li>}
          {attached > 0 && <li><span className="font-bold text-slate-900">{attached}</span> already had an account and {attached === 1 ? 'was' : 'were'} added directly</li>}
          {failed.length > 0 && <li><span className="font-bold text-red-600">{failed.length}</span> could not be imported</li>}
        </ul>
      </div>
      {failed.length > 0 && (
        <ul className="rounded-xl border border-red-100 divide-y divide-red-50 text-xs max-h-36 overflow-y-auto">
          {failed.slice(0, 5).map(f => <li key={f.line} className="px-3 py-2"><span className="font-bold text-slate-700">Line {f.line}{f.email && ` · ${f.email}`}</span><br /><span className="text-red-600">{f.error}</span></li>)}
          {failed.length > 5 && <li className="px-3 py-2 text-slate-500 font-medium">and {failed.length - 5} more in the download below.</li>}
        </ul>
      )}
      <div className="flex flex-col gap-2">
        {failed.length > 0 && (
          <button type="button" onClick={() => downloadCsv(failedRowsCsv(failed), 'oaicc-invite-problems.csv')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Download rows with problems
          </button>
        )}
      </div>
      <button onClick={onClose} className="btn-primary w-full py-4">Done</button>
    </div>
  );
}
