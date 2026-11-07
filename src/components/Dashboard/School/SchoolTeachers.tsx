import React, { useState } from 'react';
import { STATUS_BADGE } from '../../../utils/accountStatus';
import { BookOpen, ChevronLeft, ChevronRight, Link2, Trash2, Users } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { schoolStorage } from '../../../utils/storage';
import {
  classesForTeacher, fullName, initialsOf, inviteLink, invitesStore, removeTeacher, teachersOfSchool,
} from '../../../utils/schoolData';
import type { TeacherRecord } from '../../../types';
import InviteUserModal from './InviteUserModal';
import TeacherViewModal from './TeacherViewModal';

const PAGE_SIZE = 10;

export default function SchoolTeachers() {
  const { showToast } = useToast();
  const school = schoolStorage.get();
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [viewing, setViewing] = useState<{ teacher: TeacherRecord; mode: 'view' | 'reassign' } | null>(null);
  const [page, setPage] = useState(1);

  // `version` forces a re-read of localStorage after each change.
  void version;
  const teachers = teachersOfSchool(school?.id);
  const totalPages = Math.max(1, Math.ceil(teachers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = teachers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = [
    { label: 'Total teachers', value: teachers.length },
    { label: 'Active', value: teachers.filter(t => t.status === 'active').length },
    { label: 'Pending invites', value: teachers.filter(t => t.status === 'invited').length },
  ];

  const copyInvite = async (t: TeacherRecord) => {
    const invite = invitesStore.forUser(t.id);
    if (!invite) { showToast('No pending invitation for this teacher.', 'error'); return; }
    try {
      await navigator.clipboard.writeText(inviteLink(invite.token));
      showToast('Invite link copied!');
    } catch {
      showToast('Could not copy the link automatically.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-slate-900">Teachers</h1>
        {teachers.length > 0 && (
          <button onClick={() => setIsInviteOpen(true)} className="btn-primary px-6 py-3">Invite teacher</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-400 mb-4">{stat.label}</p>
            <p className="text-5xl font-bold text-slate-900 font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      {teachers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No teachers yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs">Invite teachers to your school, then assign them to classes.</p>
          <button onClick={() => setIsInviteOpen(true)} className="btn-primary px-10 py-4">Invite teacher</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {['TEACHER', 'EMAIL', 'CLASSES', 'STATUS'].map(h => (
                    <th key={h} className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visible.map(t => {
                  const taught = classesForTeacher(t.id);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer" onClick={() => setViewing({ teacher: t, mode: 'view' })}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-blue-100 text-blue-600">{fullName(t) ? initialsOf(t) : '?'}</div>
                          <p className="text-sm font-bold text-slate-900">{fullName(t) || 'Awaiting sign-up'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5"><p className="text-sm text-slate-500 font-medium">{t.email}</p></td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-slate-900 font-bold">{taught.length ? taught.map(c => c.name).join(', ') : <span className="text-slate-400 font-medium">Not assigned</span>}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[t.status].className}`}>
                          {STATUS_BADGE[t.status].label}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          {t.status === 'invited' && (
                            <button title="Copy invite link" onClick={() => copyInvite(t)} className="p-2 text-slate-400 hover:text-brand transition-all"><Link2 className="w-5 h-5" /></button>
                          )}
                          <button title="Assign classes" onClick={() => setViewing({ teacher: t, mode: 'reassign' })} className="p-2 text-slate-400 hover:text-brand transition-all"><BookOpen className="w-5 h-5" /></button>
                          <button
                            title="Remove teacher"
                            onClick={() => {
                              if (window.confirm(`Remove ${fullName(t) || t.email} from your school?`)) {
                                removeTeacher(t.id);
                                refresh();
                                showToast('Teacher removed.');
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-100 flex items-center justify-between">
            <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all disabled:opacity-40 disabled:pointer-events-none">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, n) => n + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === currentPage ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:bg-slate-50'}`}>{n}</button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all disabled:opacity-40 disabled:pointer-events-none">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <InviteUserModal open={isInviteOpen} onClose={() => setIsInviteOpen(false)} onDone={refresh} lockRole="teacher" />

      <TeacherViewModal
        teacher={viewing?.teacher ?? null}
        initialMode={viewing?.mode ?? 'view'}
        onClose={() => setViewing(null)}
        onChanged={refresh}
      />
    </div>
  );
}
