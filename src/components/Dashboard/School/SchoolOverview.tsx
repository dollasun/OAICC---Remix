import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { ChevronLeft, ChevronRight, Download, Filter, GraduationCap, School as SchoolIcon, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { schoolClassesStorage, schoolStorage } from '../../../utils/storage';
import {
  fullName, initialsOf, parentsOfSchool, removeParent, removeStudent, removeTeacher, studentsOfSchool, teachersOfSchool,
} from '../../../utils/schoolData';
import InviteUserModal from './InviteUserModal';
import TeacherViewModal from './TeacherViewModal';
import { downloadStudentsCsv } from '../../../utils/studentReport';
import SchoolAnalytics from './SchoolAnalytics';
import { StatTile } from '../../Charts/Charts';

type UserRole = 'Teacher' | 'Parent' | 'Student';
interface Row { id: string; name: string; email: string; role: UserRole; status: string; createdAt: string; initials: string; color: string }

const PAGE_SIZE = 10;
const COLORS: Record<UserRole, string> = {
  Teacher: 'bg-blue-100 text-blue-600',
  Parent: 'bg-emerald-100 text-emerald-600',
  Student: 'bg-cyan-100 text-cyan-600',
};

export default function SchoolOverview() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const school = schoolStorage.get();
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  void version; // re-read localStorage after each change
  const toRow = (r: { id: string; firstName: string; lastName: string; email: string; status: string; createdAt: string }, role: UserRole): Row => ({
    id: r.id, name: fullName(r) || 'Awaiting sign-up', email: r.email, role, status: r.status, createdAt: r.createdAt,
    initials: fullName(r) ? initialsOf(r) : '?', color: COLORS[role],
  });
  const teachers = teachersOfSchool(school?.id);
  const students = studentsOfSchool(school?.id);
  const parents = parentsOfSchool(school?.id);
  const users: Row[] = [
    ...teachers.map(t => toRow(t, 'Teacher')),
    ...parents.map(p => toRow(p, 'Parent')),
    ...students.map(s => toRow(s, 'Student')),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const filtered = users
    .filter(u => roleFilter === 'All' || u.role === roleFilter)
    .filter(u => `${u.name} ${u.email}`.toLowerCase().includes(query.trim().toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);


  const handleDownloadReport = () => {
    const count = downloadStudentsCsv(students.map(x => x.id), 'all-students');
    if (count === 0) showToast('There are no students in your school yet.', 'error');
    else showToast(`School report downloaded (${count} ${count === 1 ? 'student' : 'students'}).`);
  };

  const remove = (u: Row) => {
    if (!window.confirm(`Remove ${u.name === 'Awaiting sign-up' ? u.email : u.name} from your school?`)) return;
    if (u.role === 'Teacher') removeTeacher(u.id);
    else if (u.role === 'Parent') removeParent(u.id);
    else removeStudent(u.id);
    refresh();
    showToast('User removed.');
  };

  const exportCsv = () => {
    const classNameById = new Map(schoolClassesStorage.get().map(c => [c.id, c.name]));
    const classOf = (u: Row) => classNameById.get(students.find(s => s.id === u.id)?.classId ?? '') ?? '';
    const csv = Papa.unparse(users.map(u => ({
      Name: u.name === 'Awaiting sign-up' ? '' : u.name, Email: u.email, Role: u.role, Status: u.status,
      Class: u.role === 'Student' ? classOf(u) : '', 'Date added': u.createdAt,
    })));
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(school?.name ?? 'school').replace(/\s+/g, '-').toLowerCase()}-users.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
    showToast('Users exported.');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 text-slate-500 font-bold mt-2 hover:text-brand transition-all">
            <Download className="w-4 h-4" /> Export users
          </button>
        </div>
        {users.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              disabled={students.length === 0}
              title={students.length === 0 ? 'Add students to download a report' : 'Download a CSV report of all students'}
              className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Download report
            </button>
            <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary px-6 py-3">Invite new user</button>
          </div>
        )}
      </div>

      {school && users.length > 0 ? (
        <SchoolAnalytics schoolId={school.id} version={version} onInvite={() => setIsInviteModalOpen(true)} onDownloadReport={handleDownloadReport} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatTile label="Total users" value={0} icon={Users} tone="bg-brand/10 text-brand" />
          <StatTile label="Total students" value={0} icon={GraduationCap} tone="bg-blue-50 text-blue-600" />
          <StatTile label="Total teachers" value={0} icon={SchoolIcon} tone="bg-amber-50 text-amber-600" />
          <StatTile label="Total parents" value={0} icon={UserPlus} tone="bg-emerald-50 text-emerald-600" />
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Users className="w-10 h-10 text-slate-200" /></div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Users yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs">You haven't added any user yet</p>
          <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary px-10 py-4">Invite new users</button>
        </div>
      ) : (
        <div id="school-users" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-24">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm" />
            </div>
            <div className="relative">
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200">
                <Filter className="w-4 h-4" /> {roleFilter === 'All' ? 'Sort by' : `${roleFilter}s`}
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-sm border border-slate-100 py-2 z-50 overflow-hidden">
                      {(['All', 'Teacher', 'Parent', 'Student'] as const).map(type => (
                        <button key={type} onClick={() => { setRoleFilter(type); setPage(1); setIsSortOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                          {type === 'All' ? 'All users' : `${type}s`}
                        </button>
                      ))}
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
                  {['USER', 'EMAIL', 'ROLE', 'STATUS', 'DATE', 'ACTION'].map(h => (
                    <th key={h} className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visible.length === 0 && (
                  <tr><td colSpan={6} className="px-8 py-16 text-center text-sm font-medium text-slate-400">No users match your search.</td></tr>
                )}
                {visible.map(u => (
                  <tr
                    key={u.id}
                    className={`hover:bg-slate-50/80 transition-all group ${u.role === 'Student' || u.role === 'Teacher' ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (u.role === 'Student') navigate(`/school/student/${u.id}`);
                      else if (u.role === 'Teacher') setViewingTeacherId(u.id);
                    }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${u.color}`}>{u.initials}</div>
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5"><p className="text-sm text-slate-500 font-medium">{u.email}</p></td>
                    <td className="px-8 py-5"><p className="text-sm text-slate-900 font-bold">{u.role}</p></td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{u.status === 'active' ? 'Active' : 'Invited'}</span>
                    </td>
                    <td className="px-8 py-5"><p className="text-sm text-slate-500 font-medium">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></td>
                    <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                      <button title="Remove user" onClick={() => remove(u)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-100 flex items-center justify-between">
            <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all disabled:opacity-40 disabled:pointer-events-none"><ChevronLeft className="w-4 h-4" /> Previous</button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, n) => n + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === currentPage ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:bg-slate-50'}`}>{n}</button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all disabled:opacity-40 disabled:pointer-events-none">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <TeacherViewModal
        teacher={viewingTeacherId ? teachers.find(t => t.id === viewingTeacherId) ?? null : null}
        onClose={() => setViewingTeacherId(null)}
        onChanged={refresh}
      />

      <InviteUserModal open={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} onDone={refresh} />

      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExportModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Export Users</h3>
              <p className="text-sm text-slate-500 mb-8">Download all {users.length} users as a CSV file.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsExportModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={exportCsv} disabled={users.length === 0} className="flex-1 btn-primary py-3 disabled:opacity-50">Export users</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
