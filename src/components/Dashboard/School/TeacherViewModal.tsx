import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, Check, Link2, Mail, MapPin, Phone, Repeat, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { schoolClassesStorage } from '../../../utils/storage';
import {
  classesForTeacher, fullName, initialsOf, inviteLink, invitesStore, setTeacherClasses, studentsInClass, teachersStore,
} from '../../../utils/schoolData';
import type { TeacherRecord } from '../../../types';

interface Props {
  teacher: TeacherRecord | null;
  /** Open straight into the reassign step (used by the "assign classes" row action). */
  initialMode?: 'view' | 'reassign';
  onClose: () => void;
  /** Called after the classes change so the page behind can refresh. */
  onChanged: () => void;
}

const LABEL = 'text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400';

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`py-4 border-b border-slate-100 ${className}`}>
      <p className={LABEL}>{label}</p>
      <div className="mt-1.5 text-[15px] font-semibold text-slate-900">{children}</div>
    </div>
  );
}

const joinedOn = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function TeacherViewModal({ teacher, initialMode = 'view', onClose, onChanged }: Props) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'view' | 'reassign'>('view');
  const [selected, setSelected] = useState<string[]>([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!teacher) return;
    setMode(initialMode);
    setSelected(classesForTeacher(teacher.id).map(c => c.id));
  }, [teacher?.id, initialMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!teacher) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [teacher, onClose]);

  void version; // re-read classes after a reassignment
  // Always show the freshest copy of the record.
  const t = teacher ? teachersStore.get(teacher.id) ?? teacher : null;
  const taught = t ? classesForTeacher(t.id) : [];
  const students = taught.flatMap(c => studentsInClass(c.id));
  const allClasses = t ? schoolClassesStorage.get() : [];
  const name = t ? fullName(t) || 'Awaiting sign-up' : '';
  const invite = t && t.status === 'invited' ? invitesStore.forUser(t.id) : undefined;

  const copyInvite = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(inviteLink(invite.token));
      showToast('Invite link copied!');
    } catch {
      showToast('Could not copy the link automatically.', 'error');
    }
  };

  const saveReassign = () => {
    if (!t) return;
    setTeacherClasses(t.id, selected);
    setVersion(v => v + 1);
    onChanged();
    setMode('view');
    showToast('Classes updated successfully!');
  };

  return (
    <AnimatePresence>
      {t && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
            role="dialog" aria-modal="true" aria-labelledby="teacher-view-title"
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10"
          >
            {/* close icon, top right */}
            <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <X className="w-6 h-6" />
            </button>

            {mode === 'view' ? (
              <>
                <div className="flex items-center gap-5 pr-10">
                  {t.avatar ? (
                    <img src={t.avatar} alt={name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-300 to-brand text-white flex items-center justify-center text-2xl font-bold shrink-0">
                      {fullName(t) ? initialsOf(t) : '?'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 id="teacher-view-title" className="text-3xl font-bold text-slate-900 truncate">{name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 font-medium">Teacher</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${t.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {t.status === 'active' ? 'Active' : 'Invited'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Field label="Bio" className="!border-b-0 !pb-2">
                    <span className={t.bio ? '' : 'text-slate-400 font-medium'}>{t.bio || 'No bio added yet'}</span>
                  </Field>
                  <div className="border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
                    <Field label="Email address">
                      <span className="flex items-center gap-2 break-all"><Mail className="w-5 h-5 text-brand shrink-0" />{t.email}</span>
                    </Field>
                    <Field label="Date joined">
                      <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-brand shrink-0" />{joinedOn(t.createdAt)}</span>
                    </Field>
                    <Field label="Phone number">
                      {t.phone ? <span className="flex items-center gap-2"><Phone className="w-5 h-5 text-brand shrink-0" />{t.phone}</span> : <span className="text-slate-400 font-medium">Not provided</span>}
                    </Field>
                    <Field label="Students">
                      {students.length === 0 ? (
                        <span>No Students Assigned</span>
                      ) : (
                        <div>
                          <span>{students.length} {students.length === 1 ? 'student' : 'students'}</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {students.slice(0, 4).map(s => (
                              <span key={s.id} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">{fullName(s) || s.email}</span>
                            ))}
                            {students.length > 4 && <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold">+{students.length - 4} more</span>}
                          </div>
                        </div>
                      )}
                    </Field>
                    <Field label="Class assigned">
                      {taught.length === 0 ? '—' : (
                        <div className="flex flex-wrap gap-1.5">
                          {taught.map(c => <span key={c.id} className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-sm font-bold">{c.name}</span>)}
                        </div>
                      )}
                    </Field>
                    <Field label="Subject / department">
                      {t.subject ? t.subject : <span className="text-slate-400 font-medium">Not provided</span>}
                    </Field>
                    <Field label="Location" className="sm:col-span-2">
                      {t.location ? <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-brand shrink-0" />{t.location}</span> : <span className="text-slate-400 font-medium">Not provided</span>}
                    </Field>
                  </div>
                </div>

                {invite && (
                  <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm font-medium text-amber-800">This teacher hasn't accepted their invitation yet, so some details are still empty.</p>
                    <button onClick={copyInvite} className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-700 hover:bg-amber-100/50 transition-all flex items-center gap-2 shrink-0">
                      <Link2 className="w-4 h-4" /> Copy invite link
                    </button>
                  </div>
                )}

                {/* footer: reassign sits bottom right */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button onClick={onClose} className="px-8 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all">Close</button>
                  <button onClick={() => { setSelected(taught.map(c => c.id)); setMode('reassign'); }} className="btn-primary px-8 py-3">
                    <Repeat className="w-4 h-4" /> Reassign
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setMode('view')} className="flex items-center gap-2 text-brand font-bold hover:gap-3 transition-all mb-4">
                  <ArrowLeft className="w-5 h-5" /> Back to profile
                </button>
                <h2 id="teacher-view-title" className="text-3xl font-bold text-slate-900 pr-10">Reassign {name}</h2>
                <p className="text-slate-500 font-medium mt-1 mb-6">Choose the classes this teacher should teach. A class has one teacher, so ticking a class that someone else teaches moves it to {fullName(t) || 'this teacher'}.</p>

                {allClasses.length === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-500 font-medium">You haven't created any classes yet. Add a class first, then come back to assign it.</div>
                ) : (
                  <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                    {allClasses.map(c => {
                      const checked = selected.includes(c.id);
                      const other = c.teacherId && c.teacherId !== t.id ? teachersStore.get(c.teacherId) : undefined;
                      const count = studentsInClass(c.id).length;
                      return (
                        <label key={c.id} className={`flex items-center justify-between gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${checked ? 'border-brand bg-brand/5' : 'border-slate-200 hover:border-slate-300'}`}>
                          <span className="flex items-center gap-3 min-w-0">
                            <input type="checkbox" className="sr-only" checked={checked} onChange={e => setSelected(e.target.checked ? [...selected, c.id] : selected.filter(id => id !== c.id))} />
                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-brand border-brand text-white' : 'border-slate-300'}`}>{checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}</span>
                            <span className="min-w-0">
                              <span className="block font-bold text-slate-900">{c.name}</span>
                              <span className="block text-xs font-medium text-slate-500">{count} {count === 1 ? 'student' : 'students'}</span>
                            </span>
                          </span>
                          {other && checked && <span className="text-xs font-bold text-amber-600 text-right">Moves from {fullName(other) || other.email}</span>}
                          {other && !checked && <span className="text-xs font-medium text-slate-400 text-right">Taught by {fullName(other) || other.email}</span>}
                        </label>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button onClick={() => setMode('view')} className="px-8 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={saveReassign} disabled={allClasses.length === 0} className="btn-primary px-8 py-3 disabled:opacity-50">Save changes</button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
