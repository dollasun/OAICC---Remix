import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, GraduationCap, Power, PowerOff, School as SchoolIcon, Search, Trash2,
  UserSquare2, Users, X, type LucideIcon,
} from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '../../../context/ToastContext';
import BulkActionBar from '../../Common/BulkActionBar';
import BulkDeleteModal from '../../Common/BulkDeleteModal';
import { STATUS_BADGE } from '../../../utils/accountStatus';
import { downloadCsv } from '../../../utils/download';
import { schoolsDirectory } from '../../../utils/storage';
import {
  deletePlatformUser, KIND_LABEL, KIND_PLURAL, listPlatformUsers, schoolDeletionImpact, setUserActive, USER_KINDS, userPath, usersListPath,
  type PlatformUser, type UserKind,
} from '../../../utils/platformUsers';

const PAGE_SIZE = 15;
const NO_SCHOOL = '__none';
type SortKey = 'name' | 'school' | 'role' | 'joined' | 'status';
const STATUS_FILTERS = [{ id: '', label: 'All statuses' }, { id: 'active', label: 'Active' }, { id: 'invited', label: 'Pending' }, { id: 'inactive', label: 'Inactive' }];
const ROLE_TONE: Record<UserKind, string> = {
  school: 'bg-violet-50 text-violet-600',
  student: 'bg-brand/10 text-brand',
  teacher: 'bg-amber-50 text-amber-600',
  parent: 'bg-indigo-50 text-indigo-500',
};
const ROLE_ICON: Record<UserKind | 'all', LucideIcon> = { all: Users, school: SchoolIcon, student: GraduationCap, teacher: UserSquare2, parent: Users };
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PlatformUsers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);

  const role = (USER_KINDS as string[]).includes(params.get('role') ?? '') ? (params.get('role') as UserKind) : '';
  const school = params.get('school') ?? '';
  const status = params.get('status') ?? '';
  const q = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'joined', desc: true });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<PlatformUser[]>([]);
  const [busy, setBusy] = useState(false);

  const setFilter = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in changes)) next.delete('page');
    setParams(next, { replace: true });
  };

  const all = useMemo(() => listPlatformUsers(), [version]);
  const schools = useMemo(() => schoolsDirectory.all().slice().sort((a, b) => a.name.localeCompare(b.name)), [version]);

  // Everything except the role filter, so each role tab can show how many people match the other filters.
  const base = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter(u =>
      (!school || (school === NO_SCHOOL ? !u.schoolId : u.schoolId === school)) &&
      (!status || u.status === status) &&
      (!needle || `${u.name} ${u.email} ${u.schoolName}`.toLowerCase().includes(needle)));
  }, [all, school, status, q]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    USER_KINDS.forEach(k => { c[k] = base.filter(u => u.kind === k).length; });
    return c;
  }, [base]);

  const rows = useMemo(() => {
    const list = role ? base.filter(u => u.kind === role) : base;
    const val = (u: PlatformUser) => (sort.key === 'name' ? u.name.toLowerCase() : sort.key === 'school' ? u.schoolName.toLowerCase() : sort.key === 'role' ? u.kind : sort.key === 'status' ? u.status : u.joinedAt);
    return [...list].sort((a, b) => { const r = val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0; return sort.desc ? -r : r; });
  }, [base, role, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // A changed filter starts a fresh selection, and rows that no longer exist drop out of it.
  useEffect(() => { setSelected(new Set()); }, [role, school, status, q]);
  const exists = new Set(all.map(u => u.key));
  const selectedRows = rows.filter(u => selected.has(u.key) && exists.has(u.key));

  const hasFilters = Boolean(role || school || status || q);
  const allOnPage = visible.length > 0 && visible.every(u => selected.has(u.key));
  const someOnPage = visible.some(u => selected.has(u.key));
  const toggle = (key: string) => setSelected(prev => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  const togglePage = () => setSelected(prev => { const n = new Set(prev); visible.forEach(u => (allOnPage ? n.delete(u.key) : n.add(u.key))); return n; });
  const sortBy = (key: SortKey) => setSort(s => ({ key, desc: s.key === key ? !s.desc : key === 'joined' }));

  const flip = (u: PlatformUser) => {
    const turnOn = u.status === 'inactive';
    if (setUserActive(u.kind, u.id, turnOn)) {
      showToast(`${u.name} ${turnOn ? 'activated' : 'deactivated'}.`);
      refresh();
    }
  };

  const confirmDelete = () => {
    setBusy(true);
    try {
      toDelete.forEach(u => deletePlatformUser(u.kind, u.id));
      showToast(toDelete.length === 1 ? `${toDelete[0].name} deleted.` : `${toDelete.length} users deleted.`);
      setSelected(new Set());
      setToDelete([]);
      refresh();
    } finally { setBusy(false); }
  };

  const schoolImpact = toDelete.filter(u => u.kind === 'school').reduce((n, u) => {
    const i = schoolDeletionImpact(u.id);
    return { students: n.students + i.students, teachers: n.teachers + i.teachers, parents: n.parents + i.parents, classes: n.classes + i.classes };
  }, { students: 0, teachers: 0, parents: 0, classes: 0 });

  const exportCsv = () => {
    const csv = Papa.unparse({
      fields: ['Name', 'Email', 'School', 'Role', 'Date joined', 'Status'],
      data: rows.map(u => [u.name, u.email, u.schoolName, KIND_LABEL[u.kind], u.joinedAt.slice(0, 10), STATUS_BADGE[u.status].label]),
    }, { escapeFormulae: true });
    downloadCsv(csv, `oaicc-users-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast(`Exported ${rows.length} ${rows.length === 1 ? 'user' : 'users'}.`);
  };

  const SortHead = ({ k, label, className = '' }: { k: SortKey; label: string; className?: string }) => (
    <th className={`px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest ${className}`} aria-sort={sort.key === k ? (sort.desc ? 'descending' : 'ascending') : 'none'}>
      <button onClick={() => sortBy(k)} className="inline-flex items-center gap-1 hover:text-slate-700 uppercase tracking-widest">
        {label}{sort.key === k && (sort.desc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
      </button>
    </th>
  );

  const tabs: { id: UserKind | ''; label: string; key: UserKind | 'all' }[] = [{ id: '', label: 'All users', key: 'all' }, ...USER_KINDS.map(k => ({ id: k, label: KIND_PLURAL[k], key: k }))];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 font-medium mt-1">Every school, student, teacher and parent on OAICC. Mentors and counsellors are managed in their own sections.</p>
        </div>
        <button onClick={exportCsv} disabled={rows.length === 0}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-brand hover:text-brand transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
          <Download className="w-5 h-5" /> Export
        </button>
      </div>

      {/* Role tabs with live counts */}
      <div role="tablist" aria-label="Filter by role" className="flex flex-wrap gap-2">
        {tabs.map(t => {
          const on = role === t.id;
          const Icon = ROLE_ICON[t.key];
          return (
            <button key={t.key} role="tab" aria-selected={on} onClick={() => setFilter({ role: t.id })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${on ? 'bg-brand text-white border-brand shadow-sm shadow-brand/10' : 'bg-white border-slate-200 text-slate-600 hover:border-brand/50 hover:text-brand'}`}>
              <Icon className="w-4 h-4" /> {t.label}
              <span className={`px-2 py-0.5 rounded-full text-[11px] tabular-nums ${on ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>{counts[t.key]?.toLocaleString() ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-50 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="search" value={q} onChange={e => setFilter({ q: e.target.value })} placeholder="Search by name, email or school..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 font-medium text-sm text-slate-900 placeholder:text-slate-400" />
          </div>
          <select value={school} onChange={e => setFilter({ school: e.target.value })} aria-label="Filter by school"
            className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer lg:max-w-[240px]">
            <option value="">All schools</option>
            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value={NO_SCHOOL}>No school</option>
          </select>
          <select value={status} onChange={e => setFilter({ status: e.target.value })} aria-label="Filter by status"
            className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer">
            {STATUS_FILTERS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          {hasFilters && (
            <button onClick={() => setParams({}, { replace: true })} className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold text-brand hover:bg-brand/5 transition-all">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-slate-50/60">
                <th className="px-4 py-3.5 w-12 text-center">
                  <input type="checkbox" aria-label="Select all users on this page" checked={allOnPage} ref={el => { if (el) el.indeterminate = someOnPage && !allOnPage; }} onChange={togglePage}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer accent-brand" />
                </th>
                <SortHead k="name" label="Name" />
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <SortHead k="school" label="School" />
                <SortHead k="role" label="Role" />
                <SortHead k="joined" label="Date joined" />
                <SortHead k="status" label="Status" />
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visible.length === 0 && (
                <tr><td colSpan={8} className="px-8 py-16 text-center">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">No users match these filters</p>
                  {hasFilters && <button onClick={() => setParams({}, { replace: true })} className="mt-2 text-sm font-bold text-brand hover:underline">Clear filters</button>}
                </td></tr>
              )}
              {visible.map(u => {
                const badge = STATUS_BADGE[u.status];
                const on = selected.has(u.key);
                return (
                  <tr key={u.key} onClick={() => navigate(userPath(u.kind, u.id))} className={`group cursor-pointer transition-colors hover:bg-slate-50/70 ${on ? 'bg-brand/[0.04]' : ''}`}>
                    <td className="px-4 py-3.5 w-12 text-center" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" aria-label={`Select ${u.name}`} checked={on} onChange={() => toggle(u.key)} className="w-4 h-4 rounded border-slate-300 cursor-pointer accent-brand" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className={`font-bold truncate ${u.status === 'invited' ? 'text-slate-500 italic' : 'text-slate-900'} group-hover:text-brand transition-colors`}>{u.name}</p>
                          <p className="text-xs text-slate-400 font-medium truncate">{u.detail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-500 max-w-[220px] truncate">{u.email}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold" onClick={e => e.stopPropagation()}>
                      {u.schoolId && u.kind !== 'school'
                        ? <Link to={userPath('school', u.schoolId)} className="text-slate-700 hover:text-brand hover:underline">{u.schoolName}</Link>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ROLE_TONE[u.kind]}`}>{KIND_LABEL[u.kind]}</span></td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-500 whitespace-nowrap">{fmtDate(u.joinedAt)}</td>
                    <td className="px-4 py-3.5"><span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.className}`}>{badge.label}</span></td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {u.status === 'active' && (
                          <button onClick={() => flip(u)} title={`Deactivate ${u.name}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 transition-all">
                            <PowerOff className="w-3.5 h-3.5" /> Deactivate
                          </button>
                        )}
                        {u.status === 'inactive' && (
                          <button onClick={() => flip(u)} title={`Activate ${u.name}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all">
                            <Power className="w-3.5 h-3.5" /> Activate
                          </button>
                        )}
                        {u.status === 'invited' && <span title="Can be activated or deactivated once they accept their invitation" className="px-3 py-1.5 text-xs font-semibold text-slate-300 cursor-default">Awaiting</span>}
                        <button onClick={() => setToDelete([u])} title={`Delete ${u.name}`} aria-label={`Delete ${u.name}`} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500">Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, rows.length)} of {rows.length.toLocaleString()}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setFilter({ page: String(current - 1) })} disabled={current === 1} aria-label="Previous page" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-3 text-xs font-bold text-slate-600 tabular-nums">Page {current} of {pages}</span>
              <button onClick={() => setFilter({ page: String(current + 1) })} disabled={current === pages} aria-label="Next page" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <BulkActionBar selectedCount={selectedRows.length} totalCount={rows.length} itemLabel="user"
        onClearSelection={() => setSelected(new Set())} onSelectAll={() => setSelected(new Set(rows.map(r => r.key)))}
        onDeleteSelected={() => setToDelete(selectedRows)} isDeleting={busy} />

      <BulkDeleteModal isOpen={toDelete.length > 0} onClose={() => { if (!busy) setToDelete([]); }} onConfirm={confirmDelete}
        itemCount={toDelete.length} itemType="User" isDeleting={busy}
        items={toDelete.map(u => ({ id: u.key, name: u.name, role: KIND_LABEL[u.kind], avatar: u.avatar }))}
        note={toDelete.some(u => u.kind === 'school') ? (
          <>Deleting a school also deletes everything inside it: <b>{schoolImpact.students}</b> students, <b>{schoolImpact.teachers}</b> teachers, <b>{schoolImpact.parents}</b> parents and <b>{schoolImpact.classes}</b> classes, along with their invitations, notes and progress.</>
        ) : toDelete.some(u => u.kind === 'student') ? 'A deleted student also loses their progress, notes and sessions.' : undefined} />
    </div>
  );
}

export { usersListPath };
