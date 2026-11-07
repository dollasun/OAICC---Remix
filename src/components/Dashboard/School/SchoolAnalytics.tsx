import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, CheckCircle2, Download, GraduationCap, Layers, MailWarning, MessageSquare,
  School, UserPlus, Users, UserX, ClipboardList, Link2Off, LucideIcon, Clock3,
} from 'lucide-react';
import { BarList, ChartCard, FunnelChart, LineChart, Segmented, StatTile } from '../../Charts/Charts';
import { ACTIVE_WINDOW_DAYS, growthSeries, schoolAnalytics, type GrowthPeriod } from '../../../utils/analytics';
import { className as classNameOf, fullName } from '../../../utils/schoolData';
import type { StudentRecord } from '../../../types';

interface Props {
  schoolId: string;
  /** Changes whenever the page's data changes, so the analytics re-read it. */
  version: number;
  onInvite: () => void;
  onDownloadReport: () => void;
}

const PERIODS: { id: GrowthPeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly' },
];
const PERIOD_HINT: Record<GrowthPeriod, string> = { daily: 'last 14 days', weekly: 'last 12 weeks', monthly: 'last 12 months', yearly: 'last 5 years' };

export default function SchoolAnalytics({ schoolId, version, onInvite, onDownloadReport }: Props) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<GrowthPeriod>('monthly');
  const a = useMemo(() => schoolAnalytics(schoolId), [schoolId, version]);
  const growth = useMemo(() => growthSeries(a.joinDates, period), [a, period]);
  const name = (s: StudentRecord) => fullName(s) || s.email;
  const { totals, attention } = a;

  const detail = (t: { active: number; pending: number }, activeWord = 'active') => `${t.active} ${activeWord}${t.pending ? ` · ${t.pending} pending` : ''}`;
  const growthAdded = growth.reduce((n, p) => n + p.added, 0);

  return (
    <div className="space-y-8">
      {/* Headline numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatTile label="Total users" value={totals.users.total} detail={detail(totals.users)} icon={Users} tone="bg-brand/10 text-brand" />
        <StatTile label="Total students" value={totals.students.total} detail={detail(totals.students, 'joined')} icon={GraduationCap} tone="bg-blue-50 text-blue-600" />
        <StatTile label="Total teachers" value={totals.teachers.total} detail={detail(totals.teachers)} icon={School} tone="bg-amber-50 text-amber-600" />
        <StatTile label="Total parents" value={totals.parents.total} detail={detail(totals.parents)} icon={UserPlus} tone="bg-emerald-50 text-emerald-600" />
      </div>

      {/* What needs doing */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChartCard title="Needs attention" subtitle="Things holding students back. Open an item to see who it affects." className="xl:col-span-2">
          <div className="divide-y divide-slate-100">
            <AttentionRow icon={MailWarning} tone="text-amber-600 bg-amber-50" label="Invitations not yet accepted"
              count={attention.pendingByRole.students + attention.pendingByRole.teachers + attention.pendingByRole.parents}
              summary={[`${attention.pendingByRole.students} students`, `${attention.pendingByRole.teachers} teachers`, `${attention.pendingByRole.parents} parents`].join(' · ')}
              actionLabel="Review in users list" onAction={() => document.getElementById('school-users')?.scrollIntoView({ behavior: 'smooth' })} />
            <AttentionRow icon={Layers} tone="text-red-600 bg-red-50" label="Classes without a form teacher" count={attention.classesWithoutTeacher.length}
              people={attention.classesWithoutTeacher.map(c => ({ id: c.id, label: c.name, onClick: () => navigate(`/school/classes/${c.id}`) }))}
              actionLabel="Assign teachers" onAction={() => navigate('/school/classes')} />
            <AttentionRow icon={Clock3} tone="text-orange-600 bg-orange-50" label={`Students inactive for ${ACTIVE_WINDOW_DAYS}+ days`} count={attention.inactive.length}
              people={attention.inactive.map(s => ({ id: s.id, label: `${name(s)} · ${classNameOf(s.classId)}`, onClick: () => navigate(`/school/student/${s.id}`) }))} />
            <AttentionRow icon={ClipboardList} tone="text-violet-600 bg-violet-50" label="Students who haven't started the career assessment" count={attention.notStartedAssessment.length}
              people={attention.notStartedAssessment.map(s => ({ id: s.id, label: `${name(s)} · ${classNameOf(s.classId)}`, onClick: () => navigate(`/school/student/${s.id}`) }))} />
            <AttentionRow icon={UserX} tone="text-sky-600 bg-sky-50" label="Students who haven't finished onboarding" count={attention.notOnboarded.length}
              people={attention.notOnboarded.map(s => ({ id: s.id, label: `${name(s)} · ${classNameOf(s.classId)}`, onClick: () => navigate(`/school/student/${s.id}`) }))} />
            <AttentionRow icon={Link2Off} tone="text-slate-600 bg-slate-100" label="Students with no parent linked" count={attention.noParent.length}
              people={attention.noParent.map(s => ({ id: s.id, label: `${name(s)} · ${classNameOf(s.classId)}`, onClick: () => navigate(`/school/student/${s.id}`) }))}
              actionLabel="Invite parents" onAction={onInvite} />
          </div>
        </ChartCard>

        <ChartCard title="Quick actions">
          <div className="grid grid-cols-1 gap-3">
            <QuickAction icon={UserPlus} label="Invite users" hint="One at a time or a CSV upload" onClick={onInvite} />
            <QuickAction icon={Layers} label="Manage classes" hint="Create classes and assign form teachers" onClick={() => navigate('/school/classes')} />
            <QuickAction icon={Download} label="Download school report" hint="CSV of every student's progress" onClick={onDownloadReport} />
            <QuickAction icon={MessageSquare} label="Message teachers & parents" hint="Start or continue a conversation" onClick={() => navigate('/school/messages')} />
          </div>
          {attention.upcomingCounselling > 0 && (
            <p className="text-xs font-medium text-slate-500 mt-4">{attention.upcomingCounselling} counselling {attention.upcomingCounselling === 1 ? 'session is' : 'sessions are'} booked by your students.</p>
          )}
        </ChartCard>
      </div>

      {/* Growth and conversion */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChartCard title="Student growth" subtitle={`Students who have joined, ${PERIOD_HINT[period]} · ${growthAdded} new in this range`} className="xl:col-span-2"
          action={<Segmented label="Time period" value={period} options={PERIODS} onChange={setPeriod} />}>
          <LineChart labels={growth.map(p => p.label)} series={[{ name: 'Students', color: 'var(--viz-1)', values: growth.map(p => p.total) }]}
            tooltipExtra={i => [`+${growth[i].added} joined in this ${period === 'daily' ? 'day' : period.replace('ly', '')}`]} />
        </ChartCard>

        <ChartCard title="Student invitation funnel" subtitle="From invitation to regular use">
          <FunnelChart stages={[
            { label: 'Invited', value: a.funnel.invited, hint: 'Invitations sent to students' },
            { label: 'Accepted', value: a.funnel.accepted, hint: 'Created their account' },
            { label: `Active (last ${ACTIVE_WINDOW_DAYS} days)`, value: a.funnel.active, hint: `Signed in within ${ACTIVE_WINDOW_DAYS} days` },
          ]} />
        </ChartCard>
      </div>

      {/* Who is engaging, where classes stand, what students want */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ChartCard title="Top students by engagement" subtitle={`Score out of 100 · school average ${a.averageEngagement}`}>
          <BarList max={100} empty="No active students yet."
            items={a.topStudents.map(({ student, engagement: e }) => ({
              id: student.id, label: `${name(student)} · ${classNameOf(student.classId)}`, value: e.total,
              onClick: () => navigate(`/school/student/${student.id}`),
              details: [`Career assessment: ${e.assessment}/35`, `Counselling: ${e.counselling}/20`, `Mentoring: ${e.mentoring}/15`, `Saved careers: ${e.careers}/15`, `Recent sign-in: ${e.recency}/15`],
            }))} />
          <p className="text-[11px] text-slate-500 mt-4">Based on assessment progress, counselling and mentoring sessions, saved careers and how recently they signed in.</p>
        </ChartCard>

        <ChartCard title="Career assessment by class" subtitle="Average progress through the assessment">
          <BarList max={100} format={v => `${v}%`} empty="Create classes to compare them."
            items={a.classProgress.map(c => ({
              id: c.id, label: c.label, value: c.avgProgress, note: `· ${c.completed}/${c.students} done`,
              onClick: () => navigate(`/school/classes/${c.id}`),
              details: [`${c.students} students joined`, `${c.completed} completed the assessment`, `Average progress ${c.avgProgress}%`],
            }))} />
        </ChartCard>

        <ChartCard title="What students are interested in" subtitle="Students per industry, from their top matches and saved careers">
          <BarList empty="Interests appear once students take the career assessment."
            items={a.careerInterest.map(c => ({ id: c.label, label: c.label, value: c.students, note: c.students === 1 ? 'student' : 'students', details: [`Popular: ${c.topCareers.join(', ')}`] }))} />
        </ChartCard>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, hint, onClick }: { icon: LucideIcon; label: string; hint: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand/40 hover:bg-brand/5 transition-all text-left group">
      <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 truncate">{hint}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand shrink-0" />
    </button>
  );
}

interface AttentionProps {
  icon: LucideIcon;
  tone: string;
  label: string;
  count: number;
  summary?: string;
  people?: { id: string; label: string; onClick: () => void }[];
  actionLabel?: string;
  onAction?: () => void;
}

function AttentionRow({ icon: Icon, tone, label, count, summary, people, actionLabel, onAction }: AttentionProps) {
  const [open, setOpen] = useState(false);
  const done = count === 0;
  const expandable = !done && Boolean(people?.length);
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${done ? 'bg-emerald-50 text-emerald-600' : tone}`}>
          {done ? <CheckCircle2 className="w-[18px] h-[18px]" /> : <Icon className="w-[18px] h-[18px]" />}
        </div>
        <button type="button" disabled={!expandable} onClick={() => setOpen(o => !o)} aria-expanded={expandable ? open : undefined}
          className="flex-1 min-w-0 text-left disabled:cursor-default">
          <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            {label}
            {expandable && <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />}
          </p>
          <p className="text-xs text-slate-500 truncate">{done ? 'All clear' : summary ?? `${count} ${count === 1 ? 'needs' : 'need'} follow-up`}</p>
        </button>
        <span className={`text-lg font-bold tabular-nums ${done ? 'text-slate-300' : 'text-slate-900'}`}>{count}</span>
        {!done && onAction && actionLabel && (
          <button onClick={onAction} className="hidden sm:inline-flex text-xs font-bold text-brand hover:underline whitespace-nowrap">{actionLabel}</button>
        )}
      </div>
      {open && people && (
        <ul className="mt-2 ml-12 flex flex-wrap gap-2">
          {people.slice(0, 12).map(p => (
            <li key={p.id}><button onClick={p.onClick} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 hover:border-brand/40 hover:text-brand">{p.label}</button></li>
          ))}
          {people.length > 12 && <li className="px-2.5 py-1 text-xs text-slate-500">and {people.length - 12} more</li>}
        </ul>
      )}
    </div>
  );
}
