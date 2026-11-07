import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, Check, Clock, Copy, DollarSign, ExternalLink, GraduationCap, Link2, Mail, Pencil, Play, Share2, ThumbsDown, ThumbsUp,
  Trash2, TrendingUp,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import BulkDeleteModal from '../../Common/BulkDeleteModal';
import AdminArticleViewModal from './AdminArticleViewModal';
import { careersStorage } from '../../../utils/storage';
import { getArticleReaction } from '../../../utils/articleReactions';

type Tab = 'overview' | 'info' | 'path';

const CURRENCY_CODE: Record<string, string> = { '$': 'USD', '₦': 'NGN', '£': 'GBP', 'GH₵': 'GHS', 'KSh': 'KES', 'R': 'ZAR', '€': 'EUR', 'C$': 'CAD' };
const toNumber = (v: unknown) => { const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0; };
/** 360000 -> "360K", 1500000 -> "1.5M". */
const compact = (n: number) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
};
const code = (c: { currency?: string }) => CURRENCY_CODE[c.currency ?? ''] ?? (c.currency || '—');

function List({ title, items, empty }: { title: string; items: string[]; empty?: string }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-5">{title}</h3>
      {items.length === 0 ? <p className="text-sm text-slate-500">{empty ?? 'Nothing listed yet.'}</p> : (
        <div className="flex flex-wrap gap-3">
          {items.map(i => <span key={i} className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800">{i}</span>)}
        </div>
      )}
    </div>
  );
}

export default function CareerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [viewingArticle, setViewingArticle] = useState<any>(null);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const career = useMemo(() => (careersStorage.get([]) as any[]).find(c => String(c.id) === String(id)), [id]);

  useEffect(() => {
    if (!shareOpen) return;
    const onDown = (e: MouseEvent) => { if (!shareRef.current?.contains(e.target as Node)) setShareOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShareOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [shareOpen]);

  if (!career) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/admin/careers')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand transition-colors"><ArrowLeft className="w-5 h-5" /> Back to Career Library</button>
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="font-bold text-slate-700">This career no longer exists</p>
          <Link to="/admin/careers" className="mt-2 inline-block text-sm font-bold text-brand hover:underline">Go to the career library</Link>
        </div>
      </div>
    );
  }

  const title: string = career.title || career.name;
  const skills: string[] = career.skills ?? [];
  const subjects: string[] = career.subjects ?? [];
  const universities: string[] = career.topUniversities ?? [];
  const responsibilities: string[] = career.responsibilities ?? [];
  const pathway: any[] = career.pathway ?? [];
  const salaries: any[] = (career.salaries ?? []).filter((s: any) => s && (s.min || s.max));
  const videos: any[] = career.videoItems ?? [];
  const articles: any[] = career.articleItems ?? career.articlesList ?? [];
  const links: any[] = career.linkItems ?? [];
  const shownArticles = showAllArticles ? articles : articles.slice(0, 3);
  const shareUrl = `${window.location.origin}/student/careers/${career.id}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); showToast('Career link copied!'); }
    catch { showToast('Could not copy automatically. Copy it from the address shown in the menu.', 'error'); }
    setShareOpen(false);
  };
  const nativeShare = async () => {
    try { await navigator.share({ title, text: `${title} on OAICC`, url: shareUrl }); } catch { /* cancelled */ }
    setShareOpen(false);
  };
  const remove = () => {
    careersStorage.save((careersStorage.get([]) as any[]).filter(c => String(c.id) !== String(career.id)));
    showToast(`${title} deleted.`);
    navigate('/admin/careers', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate('/admin/careers')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand transition-colors"><ArrowLeft className="w-5 h-5" /> Back to Career Library</button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/admin/careers/edit/${career.id}`)} className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold shadow-sm shadow-brand/20 hover:brightness-105 active:scale-[0.99] transition-all"><Pencil className="w-4 h-4" /> Edit Career</button>
          <button onClick={() => setConfirmDelete(true)} title="Delete career" aria-label="Delete career" className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
          <div ref={shareRef} className="relative">
            <button onClick={() => setShareOpen(o => !o)} title="Share career" aria-label="Share career" aria-expanded={shareOpen} aria-haspopup="true" className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand hover:border-brand/40 transition-all"><Share2 className="w-5 h-5" /></button>
            {shareOpen && (
              <div role="menu" className="absolute right-0 top-full mt-2 z-30 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl p-3">
                <p className="px-2 pt-1 text-sm font-bold text-slate-900">Share this career</p>
                <p className="px-2 pb-2 text-xs text-slate-500 break-all">{shareUrl}</p>
                <button role="menuitem" onClick={copyLink} className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700"><Copy className="w-4 h-4 text-slate-400" /> Copy link</button>
                <a role="menuitem" href={`mailto:?subject=${encodeURIComponent(`${title} on OAICC`)}&body=${encodeURIComponent(`Explore this career: ${shareUrl}`)}`} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700"><Mail className="w-4 h-4 text-slate-400" /> Share by email</a>
                <a role="menuitem" href={`https://wa.me/?text=${encodeURIComponent(`${title} on OAICC: ${shareUrl}`)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700"><Link2 className="w-4 h-4 text-slate-400" /> Share on WhatsApp</a>
                {typeof navigator !== 'undefined' && 'share' in navigator && <button role="menuitem" onClick={nativeShare} className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700"><Share2 className="w-4 h-4 text-slate-400" /> More options…</button>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[280px] sm:h-[340px] rounded-[28px] overflow-hidden shadow-lg">
        <img src={career.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <span className="inline-block px-4 py-2 rounded-full bg-brand text-white text-xs font-bold uppercase tracking-wider mb-4">{career.category}</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">{title}</h1>
          {career.description && <p className="text-white/85 text-sm sm:text-lg font-medium mt-3 max-w-3xl line-clamp-2">{career.description}</p>}
        </div>
      </div>

      {/* Key facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><DollarSign className="w-7 h-7" /></div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Median salary</p>
            {salaries.length === 0 ? <p className="text-sm font-semibold text-slate-500">Not set</p> : (
              <div className="space-y-1 mt-1">
                {salaries.slice(0, 3).map((s, i) => (
                  <p key={i} className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand text-[10px] font-bold">{code(s)}</span><span className="font-bold text-slate-900">{compact((toNumber(s.min) + toNumber(s.max)) / 2)}</span></p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0"><TrendingUp className="w-7 h-7" /></div>
          <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Job growth</p><p className="text-xl font-bold text-slate-900 leading-snug">{career.growth || 'Not set'}</p></div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><GraduationCap className="w-7 h-7" /></div>
          <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Education</p><p className="text-xl font-bold text-slate-900 leading-snug">{career.education || 'See recommended subjects'}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="flex gap-8 border-b border-slate-200">
        {([['overview', 'Overview'], ['info', 'Career Info'], ['path', 'Career Path']] as const).map(([t, label]) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`pb-4 px-1 font-bold transition-colors relative ${tab === t ? 'text-brand' : 'text-slate-500 hover:text-slate-800'}`}>
            {label}{tab === t && <span className="absolute left-0 right-0 -bottom-px h-1 rounded-t-full bg-brand" />}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-10 space-y-12">
          <div><h3 className="text-xl font-bold text-slate-900 mb-4">About</h3><p className="text-slate-600 leading-relaxed text-lg">{career.description || 'No description yet.'}</p></div>
          <List title="Top skills" items={skills} empty="No skills listed yet." />
          <List title="Top subjects" items={subjects} empty="No subjects listed yet." />
          <List title="Top universities" items={universities} empty="No universities listed yet." />

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-5">Salary Range</h3>
            {salaries.length === 0 ? <p className="text-sm text-slate-500">No salary information yet.</p> : (
              <div className="rounded-2xl bg-slate-50/80 border border-slate-100 py-5 px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {salaries.map((s, i) => (
                  <div key={i}>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand/10 text-brand text-[11px] font-bold">{code(s)}</span>
                    <p className="font-bold text-slate-900 mt-1">{compact(toNumber(s.min))} – {compact(toNumber(s.max))}</p>
                    {s.country && <p className="text-[11px] text-slate-400 font-medium">{s.country}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-5">Videos</h3>
            {videos.length === 0 ? <p className="text-slate-500">No videos yet.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map(v => (
                  <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-brand/30 transition-all">
                    <div className="relative h-40"><img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/25 flex items-center justify-center"><span className="w-12 h-12 rounded-full bg-white/90 text-brand flex items-center justify-center group-hover:scale-110 transition-transform"><Play className="w-5 h-5 fill-current" /></span></div></div>
                    <div className="p-4"><p className="font-bold text-slate-900 line-clamp-2">{v.title}</p><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">{v.ownedBy}</p></div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">Articles</h3>
              {articles.length > 3 && <button onClick={() => setShowAllArticles(a => !a)} className="text-brand font-bold hover:underline">{showAllArticles ? 'Show less' : 'View all'}</button>}
            </div>
            {articles.length === 0 ? <p className="text-slate-500">No articles yet.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {shownArticles.map(a => {
                  const r = getArticleReaction(a.id);
                  return (
                    <button key={a.id} onClick={() => setViewingArticle(a)} className="text-left rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-brand/30 transition-all bg-slate-50/50">
                      <div className="relative h-44"><img src={a.thumbnail} alt="" className="w-full h-full object-cover" />
                        <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/75 text-white text-xs font-bold"><Clock className="w-3.5 h-3.5 text-brand" /> {a.readTimeMinutes ?? parseInt(a.readTime) ?? 1} min read</span></div>
                      <div className="p-5">
                        <p className="font-bold text-slate-900 line-clamp-1">{a.title}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Author - {a.author || 'OAICC'}</p>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100"><ThumbsUp className="w-3.5 h-3.5" /> {r.likes}</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100"><ThumbsDown className="w-3.5 h-3.5" /> {r.dislikes}</span>
                          <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-slate-400">{r.likes + r.dislikes} votes</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-5">Top {title.toLowerCase()} resources</h3>
            {links.length === 0 ? <p className="text-slate-500">No resources yet.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map(l => (
                  <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-brand/30 hover:shadow-md transition-all group">
                    <img src={l.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1"><p className="font-bold text-slate-900 truncate group-hover:text-brand">{l.title}</p><p className="text-xs text-slate-500 font-medium">{l.from}{l.type && <span className="ml-2 px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-bold">{l.type}</span>}</p></div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-brand shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'info' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-10 space-y-10">
          <div><h3 className="text-xl font-bold text-slate-900 mb-3">Qualifications</h3><p className="text-slate-600 leading-relaxed">{career.qualifications || 'Not listed yet.'}</p></div>
          <div><h3 className="text-xl font-bold text-slate-900 mb-3">Work experience</h3><p className="text-slate-600 leading-relaxed">{career.workExperience || 'Not listed yet.'}</p></div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Typical responsibilities</h3>
            {responsibilities.length === 0 ? <p className="text-sm text-slate-500">Not listed yet.</p> : (
              <ul className="space-y-3">{responsibilities.map(r => <li key={r} className="flex items-start gap-3 text-slate-700"><span className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>{r}</li>)}</ul>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[['Mentors', career.mentors ?? 0], ['Videos', videos.length], ['Articles', articles.length], ['Resources', links.length]].map(([label, n]) => (
              <div key={label as string} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center"><p className="text-2xl font-bold text-slate-900 tabular-nums">{n}</p><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p></div>
            ))}
          </div>
        </div>
      )}

      {tab === 'path' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-10">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Career path</h3>
          {pathway.length === 0 ? <p className="text-slate-500">No career path added yet.</p> : (
            <ol className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {pathway.map((p, i) => (
                <li key={i} className="relative flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center shrink-0 z-10 shadow-sm shadow-brand/20">{i + 1}</div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-lg">{p.step}</h4>
                      {p.type && <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{p.type}</span>}
                      {p.duration && <span className="px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-bold">{p.duration}</span>}
                    </div>
                    {p.description && <p className="text-slate-600 mt-1.5 leading-relaxed">{p.description}</p>}
                    {(p.milestones ?? []).length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">{p.milestones.map((m: string) => <li key={m} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">{m}</li>)}</ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      <BulkDeleteModal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={remove} itemCount={1} itemType="Career"
        items={[{ id: career.id, name: title, category: career.category, image: career.image }]}
        note={(videos.length + articles.length + links.length) > 0 ? <>This also removes its {videos.length} videos, {articles.length} articles and {links.length} resources.</> : undefined} />

      <AdminArticleViewModal isOpen={!!viewingArticle} onClose={() => setViewingArticle(null)} article={viewingArticle} careerTitle={title} careerCategory={career.category}
        onEdit={() => navigate(`/admin/careers/edit/${career.id}`)} />
    </div>
  );
}
