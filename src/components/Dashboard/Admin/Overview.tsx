import React, { useMemo } from 'react';
import { ArrowUpRight, ChevronRight, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { STATUS_BADGE } from '../../../utils/accountStatus';
import { KIND_LABEL, listPlatformUsers, userPath, type UserKind } from '../../../utils/platformUsers';
import AdminAnalytics, { ADMIN_SECTIONS, exportSchoolsCsv } from './AdminAnalytics';
import { AllHiddenNote, SectionToggleMenu, useDashboardSections } from '../Shared/DashboardSections';

const RECENT_COUNT = 7;
const ROLE_TONE: Record<UserKind, string> = { school: 'bg-violet-50 text-violet-600', student: 'bg-brand/10 text-brand', teacher: 'bg-amber-50 text-amber-600', parent: 'bg-indigo-50 text-indigo-500' };
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminOverview() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const sections = useDashboardSections('oaicc_dashboard_sections_admin_v2', ADMIN_SECTIONS);
  const recent = useMemo(() => listPlatformUsers().sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, RECENT_COUNT), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">How schools and students are using OAICC, and what needs your attention.</p>
        </div>
        <div className="flex items-center gap-3">
          <SectionToggleMenu controls={sections} align="right" lockedNote="Headline totals and usage numbers always stay on." />
          <button onClick={() => { const n = exportSchoolsCsv(); showToast(`Exported performance data for ${n} ${n === 1 ? 'school' : 'schools'}.`); }}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-brand hover:text-brand transition-all shadow-sm">
            <ArrowUpRight className="w-5 h-5" /> Export Data
          </button>
        </div>
      </div>

      <AdminAnalytics isVisible={sections.isVisible} />

      {sections.hiddenCount === ADMIN_SECTIONS.length && <AllHiddenNote onShowAll={sections.showAll} />}

      {sections.isVisible('recentUsers') && <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent users</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">The latest schools, students, teachers and parents to join OAICC</p>
          </div>
          <Link to="/admin/all-users" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">View all users <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50/60">
                {['User', 'Email', 'School', 'Role', 'Date joined', 'Status'].map(h => <th key={h} className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.length === 0 && <tr><td colSpan={6} className="px-8 py-12 text-center text-sm font-medium text-slate-400"><Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />No users yet.</td></tr>}
              {recent.map(u => (
                <tr key={u.key} onClick={() => navigate(userPath(u.kind, u.id))} className="group cursor-pointer hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <span className="font-bold text-slate-900 truncate group-hover:text-brand transition-colors">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-500 max-w-[220px] truncate">{u.email}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-slate-700">{u.kind !== 'school' && u.schoolName ? u.schoolName : <span className="text-slate-300">—</span>}</td>
                  <td className="px-6 py-3.5"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ROLE_TONE[u.kind]}`}>{KIND_LABEL[u.kind]}</span></td>
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-500 whitespace-nowrap">{fmtDate(u.joinedAt)}</td>
                  <td className="px-6 py-3.5"><span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[u.status].className}`}>{STATUS_BADGE[u.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-50 text-center">
          <Link to="/admin/all-users" className="text-brand font-bold text-sm hover:underline">View all users</Link>
        </div>
      </section>}
    </div>
  );
}
