import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Filter, MoreVertical, Search, Trash2, User } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { schoolClassesStorage } from '../../../utils/storage';
import {
  assignTeacher, fullName, initialsOf, inviteLink, invitesStore, moveStudentToClass, removeStudent, studentsInClass, teacherOfClass,
} from '../../../utils/schoolData';
import InviteUserModal from './InviteUserModal';

export default function SchoolClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);
  const [query, setQuery] = useState('');

  void version; // re-read localStorage after each change
  const schoolClass = schoolClassesStorage.get().find(c => c.id === id);
  if (!schoolClass) return <Navigate to="/school/classes" replace />;

  const teacher = teacherOfClass(schoolClass.id);
  const members = studentsInClass(schoolClass.id)
    .filter(s => `${fullName(s)} ${s.email}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (newestFirst ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));

  const copyInvite = async (userId: string) => {
    const invite = invitesStore.forUser(userId);
    if (!invite) return;
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
        <div className="space-y-4">
          <button onClick={() => navigate('/school/classes')} className="flex items-center gap-2 text-brand font-bold hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">{schoolClass.name}</h1>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-fit">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              {teacher && fullName(teacher) ? initialsOf(teacher) : <User className="w-7 h-7 text-slate-300" />}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{teacher ? (fullName(teacher) || 'Awaiting sign-up') : 'No teacher assigned'}</p>
              <p className="text-sm text-slate-500">{teacher ? teacher.email : 'Assign a teacher from the Teachers page.'}</p>
            </div>
            {teacher && (
              <div className="relative ml-4">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-sm border border-slate-100 py-2 z-50 overflow-hidden">
                        <button
                          onClick={() => { assignTeacher(schoolClass.id, undefined); setIsMenuOpen(false); refresh(); showToast('Teacher unassigned.'); }}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Unassign teacher
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary px-6 py-3">Add new student</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
            />
          </div>
          <div className="relative">
            <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200">
              <Filter className="w-4 h-4" /> Sort by
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-sm border border-slate-100 py-2 z-50 overflow-hidden">
                    <button onClick={() => { setNewestFirst(true); setIsSortOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Newest first</button>
                    <button onClick={() => { setNewestFirst(false); setIsSortOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Oldest first</button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['STUDENT', 'EMAIL', 'STATUS', 'DATE ADDED', 'ACTION'].map(h => (
                  <th key={h} className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-sm font-medium text-slate-400">
                    {query ? 'No students match your search.' : 'No students in this class yet.'}
                  </td>
                </tr>
              )}
              {members.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer" onClick={() => navigate(`/school/student/${s.id}`)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-cyan-100 text-cyan-600">{fullName(s) ? initialsOf(s) : '?'}</div>
                      <p className="text-sm font-bold text-slate-900">{fullName(s) || 'Awaiting sign-up'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5"><p className="text-sm text-slate-500 font-medium">{s.email}</p></td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {s.status === 'active' ? 'Active' : 'Invited'}
                    </span>
                  </td>
                  <td className="px-8 py-5"><p className="text-sm text-slate-500 font-medium">{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></td>
                  <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {s.status === 'invited' && (
                        <button onClick={() => copyInvite(s.id)} className="px-3 py-1.5 text-xs font-bold text-brand bg-brand/10 rounded-lg hover:bg-brand/20 transition-all">Copy invite link</button>
                      )}
                      <button
                        title="Remove from class"
                        onClick={() => {
                          if (!window.confirm(`Remove ${fullName(s) || s.email} from ${schoolClass.name}?`)) return;
                          if (s.status === 'invited') removeStudent(s.id);
                          else moveStudentToClass(s.id, undefined);
                          refresh();
                          showToast('Student removed from class.');
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteUserModal open={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} onDone={refresh} lockRole="student" lockClassId={schoolClass.id} />
    </div>
  );
}
