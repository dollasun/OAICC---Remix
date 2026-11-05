import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Download, X } from 'lucide-react';
import type { ReportTheme } from '../../../utils/studentReport';

const STORAGE_KEY = 'app_report_theme';
const readSaved = (): ReportTheme => {
  try { return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
};

interface Props {
  open: boolean;
  studentName: string;
  busy: boolean;
  onClose: () => void;
  onDownload: (theme: ReportTheme) => void;
}

/** A miniature of the report card so the choice is visual, in the same colours as the PDF. */
function Preview({ theme }: { theme: ReportTheme }) {
  const dark = theme === 'dark';
  const c = dark
    ? { bg: '#05071A', card: '#0C1430', line: '#1A2547', text: '#FFFFFF', muted: '#5C6896', quiz: '#06283A', counsel: '#2A1608', mentor: '#1D1240' }
    : { bg: '#F6F8FC', card: '#FFFFFF', line: '#E3E9F4', text: '#0E1736', muted: '#98A2BE', quiz: '#E3F3FC', counsel: '#FDEBDC', mentor: '#EDE8FD' };
  return (
    <div className="rounded-xl p-3 h-40 overflow-hidden border" style={{ backgroundColor: c.bg, borderColor: c.line }} aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-12 rounded-full" style={{ background: 'linear-gradient(90deg,#3B6BFF,#00ADEF,#FF6A00,#FFB400)' }} />
        <div className="h-2 w-10 rounded-full border" style={{ borderColor: '#00B4D8' }} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="h-2.5 w-14 rounded" style={{ backgroundColor: c.text }} />
          <div className="mt-1 h-3.5 w-[4.5rem] rounded-md -rotate-2" style={{ backgroundColor: '#00B4D8' }} />
        </div>
        <div className="h-8 w-16 rounded-lg border" style={{ backgroundColor: c.card, borderColor: c.line }}>
          <div className="m-1.5 h-2 w-8 rounded" style={{ backgroundColor: c.muted }} />
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-5 gap-1.5">
        <div className="col-span-3 h-9 rounded-lg" style={{ backgroundColor: c.quiz }} />
        <div className="col-span-2 h-9 rounded-lg" style={{ backgroundColor: c.counsel }} />
      </div>
      <div className="mt-1.5 rounded-lg p-1.5 border" style={{ backgroundColor: c.card, borderColor: c.line }}>
        {[['#10B981', 'w-4/5'], ['#00B4D8', 'w-3/5'], ['#F97316', 'w-2/5']].map(([col, w]) => (
          <div key={col} className="h-1 rounded-full my-1" style={{ backgroundColor: c.line }}><div className={`h-1 rounded-full ${w}`} style={{ backgroundColor: col }} /></div>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <div className="h-4 rounded-md" style={{ backgroundColor: c.counsel }} />
        <div className="h-4 rounded-md" style={{ backgroundColor: c.mentor }} />
      </div>
    </div>
  );
}

const OPTIONS: { id: ReportTheme; title: string; blurb: string }[] = [
  { id: 'dark', title: 'Dark', blurb: 'Deep navy, just like the OAICC site. Best for screens and sharing online.' },
  { id: 'light', title: 'Light', blurb: 'Bright and airy with pastel cards. Best for printing and handing out.' },
];

export default function ReportStyleModal({ open, studentName, busy, onClose, onDownload }: Props) {
  const [theme, setTheme] = useState<ReportTheme>('dark');

  useEffect(() => { if (open) setTheme(readSaved()); }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !busy) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onClose]);

  const choose = (t: ReportTheme) => {
    setTheme(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* remembering the choice is optional */ }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !busy && onClose()} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} role="dialog" aria-modal="true" aria-labelledby="report-style-title" className="relative w-full max-w-xl bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h3 id="report-style-title" className="text-2xl font-bold text-slate-900">Choose a report style</h3>
              <button onClick={onClose} disabled={busy} aria-label="Close" className="p-2 -mr-2 -mt-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-40"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6">Pick how {studentName}'s report card should look. It downloads as a one-page PDF.</p>

            <div role="radiogroup" aria-label="Report style" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTIONS.map(o => {
                const selected = theme === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => choose(o.id)}
                    className={`text-left rounded-2xl p-3 border-2 transition-all ${selected ? 'border-brand bg-brand/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <Preview theme={o.id} />
                    <div className="flex items-center justify-between mt-3 px-1">
                      <span className="font-bold text-slate-900">{o.title}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${selected ? 'bg-brand border-brand text-white' : 'border-slate-300'}`}>{selected && <Check className="w-3 h-3" strokeWidth={3} />}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1 px-1 pb-1">{o.blurb}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={onClose} disabled={busy} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50">Cancel</button>
              <button type="button" onClick={() => onDownload(theme)} disabled={busy} className="flex-[1.4] btn-primary disabled:opacity-70 disabled:cursor-wait">
                {busy ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Preparing…</> : <><Download className="w-4 h-4" /> Download {theme === 'dark' ? 'dark' : 'light'} PDF</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
