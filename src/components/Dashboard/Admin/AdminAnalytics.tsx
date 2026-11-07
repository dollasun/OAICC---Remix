import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, ArrowDown, ArrowUp, BookOpen, Briefcase, CalendarPlus, CheckCircle2, ClipboardCheck, GraduationCap,
  HeartHandshake, School, UserPlus, Users, UserSquare2, type LucideIcon, ChevronRight,
} from 'lucide-react';
import Papa from 'papaparse';
import { BarList, ChartCard, FunnelChart, Legend, LineChart, Segmented, StatTile } from '../../Charts/Charts';
import { ACTIVE_WINDOW_DAYS, growthSeries, platformAnalytics, type GrowthPeriod } from '../../../utils/analytics';
import { downloadCsv } from '../../../utils/download';
import { AllHiddenNote, DashRow, type SectionDef } from '../Shared/DashboardSections';

const PERIODS: { id: GrowthPeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly' },
];
const PERIOD_HINT: Record<GrowthPeriod, string> = { daily: 'last 14 days', weekly: 'last 12 weeks', monthly: 'last 12 months', yearly: 'last 5 years' };
const SERIES = [
  { key: 'students', name: 'Students', color: 'var(--viz-1)' },
  { key: 'teachers', name: 'Teachers', color: 'var(--viz-2)' },
  { key: 'parents', name: 'Parents', color: 'var(--viz-3)' },
] as const;

const TOP_SCHOOLS = 3;
const TOP_INDUSTRIES = 4;

/** Sections the admin can switch off. The headline numbers above them are always shown. */
export const ADMIN_SECTIONS: SectionDef[] = [
  { id: 'growth', label: 'Platform growth', description: 'Users joining over time' },
  { id: 'funnel', label: 'Student invitation funnel', description: 'Invited, accepted, active' },
  { id: 'topSize', label: 'Top schools by students', description: 'The 3 largest schools' },
  { id: 'topEngagement', label: 'Top schools by engagement', description: 'The 3 most engaged schools' },
  { id: 'performance', label: 'School performance', description: 'Top 3 schools, sortable' },
  { id: 'demand', label: 'Career demand by industry', description: 'Top 4 industries' },
  { id: 'counsellors', label: 'Counsellor workload', description: 'Sessions and coverage' },
  { id: 'attention', label: 'Needs attention', description: 'Follow-ups and quick links' },
];

type SortKey = 'name' | 'students' | 'teachers' | 'activation' | 'active30' | 'avgEngagement';

/** Exports the per-school performance table; used by the dashboard's "Export data" button. */
export function exportSchoolsCsv() {
  const a = platformAnalytics();
  const csv = Papa.unparse({
    fields: ['School', 'Location', 'Students', 'Joined', 'Pending invites', 'Teachers', 'Invitation acceptance %', `Active in last ${ACTIVE_WINDOW_DAYS} days`, 'Average engagement (0-100)', 'On OAICC since'],
    data: a.perSchool.map(p => [p.school.name, p.school.location, p.students, p.enrolled, p.pending, p.teachers, p.activation, p.active30, p.avgEngagement, p.school.createdAt.slice(0, 10)]),
  }, { escapeFormulae: true });
  downloadCsv(csv, `oaicc-schools-${new Date().toISOString().slice(0, 10)}.csv`);
  return a.perSchool.length;
}

export default function AdminAnalytics({ isVisible, hiddenCount, onShowAll }: { isVisible: (id: string) => boolean; hiddenCount: number; onShowAll: () => void }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<GrowthPeriod>('monthly');
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'students', desc: true });
  const a = useMemo(() => platformAnalytics(), []);
  const growth = useMemo(() => ({
    students: growthSeries(a.joinDates.students, period),
    teachers: growthSeries(a.joinDates.teachers, period),
    parents: growthSeries(a.joinDates.parents, period),
  }), [a, period]);

  const { totals, kpis } = a;
  const detail = (t: { active: number; pending: number }) => `${t.active.toLocaleString()} active${t.pending ? ` · ${t.pending} pending` : ''}`;
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

  const bySize = [...a.perSchool].sort((x, y) => y.students - x.students).slice(0, TOP_SCHOOLS);
  const byEngagement = a.perSchool.filter(p => p.enrolled >= 5).sort((x, y) => y.avgEngagement - x.avgEngagement).slice(0, TOP_SCHOOLS);
  const table = [...a.perSchool].sort((x, y) => {
    const v = (p: typeof x) => (sort.key === 'name' ? p.school.name.toLowerCase() : p[sort.key]);
    const r = v(x) < v(y) ? -1 : v(x) > v(y) ? 1 : 0;
    return sort.desc ? -r : r;
  }).slice(0, TOP_SCHOOLS);
  const sortBy = (key: SortKey) => setSort(s => ({ key, desc: s.key === key ? !s.desc : key !== 'name' }));
  const attentionCount = a.attention.lowActivation.length + a.attention.lowEngagement.length + (a.attention.pendingRequests > 0 ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Headline numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatTile label="Total schools" value={totals.schools} detail={`${a.perSchool.filter(p => p.enrolled > 0).length} with active students`} icon={School} tone="bg-brand/10 text-brand" />
        <StatTile label="Total students" value={totals.students.total} detail={detail(totals.students)} icon={GraduationCap} tone="bg-blue-50 text-blue-600" />
        <StatTile label="Total teachers" value={totals.teachers.total} detail={detail(totals.teachers)} icon={UserSquare2} tone="bg-amber-50 text-amber-600" />
        <StatTile label="Total parents" value={totals.parents.total} detail={detail(totals.parents)} icon={Users} tone="bg-emerald-50 text-emerald-600" />
      </div>

      {/* How well the platform is being used */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={Activity} label={`Active students (${ACTIVE_WINDOW_DAYS} days)`} value={`${pct(kpis.active30, kpis.activeStudents)}%`} detail={`${kpis.active30} of ${kpis.activeStudents} signed in`} />
        <MiniStat icon={ClipboardCheck} label="Career assessment progress" value={`${kpis.assessmentAvg}%`} detail={`${kpis.assessmentCompleted} students finished it`} />
        <MiniStat icon={HeartHandshake} label={`Counselling sessions (${ACTIVE_WINDOW_DAYS} days)`} value={kpis.recentCounselling} detail="Completed sessions" />
        <MiniStat icon={Briefcase} label={`Mentoring sessions (${ACTIVE_WINDOW_DAYS} days)`} value={kpis.recentMentoring} detail="Sessions with mentors" />
      </div>

      {/* Growth and conversion */}
      <DashRow isVisible={isVisible} items={[
          { id: 'growth', span: 2, node: (
        <ChartCard title="Platform growth" subtitle={`Total users on OAICC, ${PERIOD_HINT[period]}`}
          action={<Segmented label="Time period" value={period} options={PERIODS} onChange={setPeriod} />}>
          <LineChart labels={growth.students.map(p => p.label)}
            series={SERIES.map(s => ({ name: s.name, color: s.color, values: growth[s.key].map(p => p.total) }))}
            tooltipExtra={i => [`New: ${SERIES.map(s => `${growth[s.key][i].added} ${s.name.toLowerCase()}`).join(', ')}`]} />
          <Legend items={SERIES.map(s => ({ name: s.name, color: s.color }))} />
        </ChartCard>
          ) },
          { id: 'funnel', node: (
        <ChartCard title="Student invitation funnel" subtitle="Students invited by schools, across the platform">
          <FunnelChart stages={[
            { label: 'Invited', value: a.funnel.invited, hint: 'Invited by their school' },
            { label: 'Accepted', value: a.funnel.accepted, hint: 'Created their account' },
            { label: `Active (last ${ACTIVE_WINDOW_DAYS} days)`, value: a.funnel.active, hint: `Signed in within ${ACTIVE_WINDOW_DAYS} days` },
          ]} />
        </ChartCard>
          ) },
      ]} />

      {/* Schools compared */}
      <DashRow isVisible={isVisible} items={[
          { id: 'topSize', node: (
        <ChartCard title="Top schools by students" subtitle="The 3 largest schools, including pending invitations">
          <BarList items={bySize.map(p => ({
            id: p.school.id, label: p.school.name, value: p.students, note: p.pending ? `· ${p.pending} pending` : undefined,
            details: [p.school.location, `${p.enrolled} joined, ${p.pending} pending`, `${p.teachers} teachers`],
          }))} empty="No schools yet." />
        </ChartCard>
          ) },
          { id: 'topEngagement', node: (
        <ChartCard title="Top schools by student engagement" subtitle="The 3 highest average scores out of 100 (schools with 5+ students)">
          <BarList max={100} items={byEngagement.map(p => ({
            id: p.school.id, label: p.school.name, value: p.avgEngagement, note: `· ${p.enrolled} students`,
            details: [`${p.active30} of ${p.enrolled} active in the last ${ACTIVE_WINDOW_DAYS} days`, 'Score: assessment, counselling, mentoring, saved careers and recent sign-ins'],
          }))} empty="Schools appear here once 5 or more students have joined." />
        </ChartCard>
          ) },
      ]} />

      <DashRow isVisible={isVisible} items={[
          { id: 'performance', node: (
      <ChartCard title="School performance" subtitle={`Top 3 of ${a.perSchool.length} schools by the selected column. Click a column to rank by it; Export data downloads every school.`}>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50">
                {([['name', 'School'], ['students', 'Students'], ['teachers', 'Teachers'], ['activation', 'Invites accepted'], ['active30', `Active (${ACTIVE_WINDOW_DAYS}d)`], ['avgEngagement', 'Engagement']] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 ${key === 'name' ? '' : 'text-right'}`} aria-sort={sort.key === key ? (sort.desc ? 'descending' : 'ascending') : 'none'}>
                    <button onClick={() => sortBy(key)} className="inline-flex items-center gap-1 hover:text-slate-800 uppercase tracking-widest">
                      {label}{sort.key === key && (sort.desc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {table.map(p => (
                <tr key={p.school.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-3"><p className="font-bold text-slate-900">{p.school.name}</p><p className="text-xs text-slate-500">{p.school.location}</p></td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold text-slate-800">{p.students}{p.pending > 0 && <span className="text-xs font-medium text-slate-500"> ({p.pending} pending)</span>}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold text-slate-800">{p.teachers}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold text-slate-800">{p.activation}%</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold text-slate-800">{pct(p.active30, p.enrolled)}%<span className="text-xs font-medium text-slate-500"> ({p.active30})</span></td>
                  <td className="px-6 py-3 text-right tabular-nums font-bold text-slate-900">{p.avgEngagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
          ) },
      ]} />

      {/* Demand, capacity, follow-ups */}
      <DashRow isVisible={isVisible} items={[
          { id: 'demand', node: (
        <ChartCard title="Career demand by industry" subtitle="Top 4 industries by students interested, from top matches and saved careers">
          <BarList items={a.careerInterest.slice(0, TOP_INDUSTRIES).map(c => ({ id: c.label, label: c.label, value: c.students, note: 'students', details: [`Popular: ${c.topCareers.join(', ')}`] }))}
            empty="Demand appears once students take the career assessment." />
        </ChartCard>
          ) },
          { id: 'counsellors', node: (
        <ChartCard title="Counsellor workload" subtitle="Sessions per counsellor (completed + upcoming)">
          <BarList items={a.counsellorLoad.map(c => ({
            id: c.name, label: c.name, value: c.total, note: `· ${c.upcoming} upcoming`, details: [`${c.completed} completed`, `${c.upcoming} upcoming`],
            onClick: () => navigate('/admin/counselors'),
          }))} empty="No counselling sessions yet." />
          <dl className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Students reached</dt>
              <dd className="text-xl font-bold text-slate-900 tabular-nums">{pct(a.counselling.studentsCounselled, kpis.activeStudents)}%</dd>
              <dd className="text-xs text-slate-500">{a.counselling.studentsCounselled} of {kpis.activeStudents} have had or booked a session</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Students per counsellor</dt>
              <dd className="text-xl font-bold text-slate-900 tabular-nums">{a.counselling.counsellors ? Math.round(kpis.activeStudents / a.counselling.counsellors) : 0}</dd>
              <dd className="text-xs text-slate-500">{a.counselling.upcoming} sessions upcoming</dd>
            </div>
          </dl>
        </ChartCard>
          ) },
          { id: 'attention', node: (
        <ChartCard title="Needs attention" subtitle={attentionCount ? `${attentionCount} item${attentionCount === 1 ? '' : 's'} to follow up` : 'Nothing needs follow-up'}>
          <ul className="space-y-3">
            {a.attention.lowActivation.map(p => (
              <React.Fragment key={`act-${p.school.id}`}>
                <AttentionItem tone="warn" title={`${p.school.name}: ${p.activation}% of invitations accepted`} body={`${p.pending} students haven't joined. Ask the school to resend invitations.`} />
              </React.Fragment>
            ))}
            {a.attention.lowEngagement.map(p => (
              <React.Fragment key={`eng-${p.school.id}`}>
                <AttentionItem tone="warn" title={`${p.school.name}: low engagement (${p.avgEngagement}/100)`} body={`Only ${p.active30} of ${p.enrolled} students active recently. Offer onboarding support or a counselling drive.`} />
              </React.Fragment>
            ))}
            {a.attention.pendingRequests > 0 && (
              <AttentionItem tone="warn" title={`${a.attention.pendingRequests} counsellor request${a.attention.pendingRequests === 1 ? '' : 's'} waiting`} body="Students are waiting to be matched with a counsellor." onClick={() => navigate('/admin/counselors')} />
            )}
            {a.attention.independentStudents > 0 && (
              <AttentionItem tone="info" title={`${a.attention.independentStudents} students without a school`} body="Signed up on their own. A chance to bring their schools onto OAICC." />
            )}
            {attentionCount === 0 && a.attention.independentStudents === 0 && <AttentionItem tone="ok" title="All schools look healthy" body="No low acceptance or engagement found." />}
          </ul>
          <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-slate-100">
            <QuickLink icon={BookOpen} label="Add a career" onClick={() => navigate('/admin/careers/create')} />
            <QuickLink icon={UserPlus} label="Add a mentor" onClick={() => navigate('/admin/mentors/create')} />
            <QuickLink icon={CalendarPlus} label="Manage events" onClick={() => navigate('/admin/events')} />
            <QuickLink icon={Users} label="Manage users" onClick={() => navigate('/admin/users')} />
          </div>
        </ChartCard>
          ) },
      ]} />

      {hiddenCount === ADMIN_SECTIONS.length && <AllHiddenNote onShowAll={onShowAll} />}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: number | string; detail: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 text-slate-500 mb-2"><Icon className="w-4 h-4" /><p className="text-[11px] font-bold uppercase tracking-widest truncate">{label}</p></div>
      <p className="text-2xl font-bold text-slate-900 tabular-nums">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-xs font-medium text-slate-500 truncate">{detail}</p>
    </div>
  );
}

function AttentionItem({ tone, title, body, onClick }: { tone: 'warn' | 'info' | 'ok'; title: string; body: string; onClick?: () => void }) {
  const Icon = tone === 'ok' ? CheckCircle2 : AlertTriangle;
  const colour = tone === 'ok' ? 'text-emerald-600 bg-emerald-50' : tone === 'warn' ? 'text-amber-600 bg-amber-50' : 'text-sky-600 bg-sky-50';
  const Tag = onClick ? 'button' : 'div';
  return (
    <li>
      <Tag onClick={onClick} className={`w-full flex gap-3 text-left ${onClick ? 'hover:opacity-80' : ''}`}>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colour}`}><Icon className="w-4 h-4" /></span>
        <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="block text-xs text-slate-500">{body}</span></span>
      </Tag>
    </li>
  );
}

function QuickLink({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-brand/40 hover:bg-brand/5 text-sm font-bold text-slate-700 transition-all">
      <Icon className="w-4 h-4 text-brand shrink-0" /><span className="truncate">{label}</span><ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto shrink-0" />
    </button>
  );
}
