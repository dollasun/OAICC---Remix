/**
 * Lets a dashboard viewer choose which analytics sections they see. The headline numbers are never
 * part of this: only the sections passed in can be hidden. The choice is remembered per viewer in
 * this browser (a convenience, so storage failures just fall back to showing everything).
 */
import React, { useEffect, useRef, useState } from 'react';
import { Check, Eye, RotateCcw, SlidersHorizontal } from 'lucide-react';

export interface SectionDef {
  id: string;
  label: string;
  description?: string;
  /** Whether the section is shown until the viewer changes it. */
  defaultOn: boolean;
}

/**
 * Which optional sections are shown. A viewer who hasn't chosen anything sees each section's default;
 * their choices are then remembered per viewer in this browser (a convenience, so a storage failure
 * just falls back to the defaults).
 */
export function useDashboardSections(storageKey: string, sections: SectionDef[]) {
  const defaults = () => new Set<string>(sections.filter(s => s.defaultOn).map(s => s.id));
  const read = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return defaults();
      const saved = new Set<string>(JSON.parse(raw));
      return new Set<string>(sections.filter(s => saved.has(s.id)).map(s => s.id)); // ignore sections that no longer exist
    } catch { return defaults(); }
  };
  const [visible, setVisible] = useState<Set<string>>(read);
  useEffect(() => { setVisible(read()); }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = (next: Set<string>) => {
    setVisible(next);
    try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { /* keep the in-memory choice */ }
  };
  const toggle = (id: string) => {
    const next = new Set<string>(visible);
    if (next.has(id)) next.delete(id); else next.add(id);
    persist(next);
  };
  const isDefault = sections.every(s => visible.has(s.id) === s.defaultOn);
  return {
    sections,
    isVisible: (id: string) => visible.has(id),
    toggle,
    showAll: () => persist(new Set(sections.map(s => s.id))),
    resetToDefault: () => { setVisible(defaults()); try { localStorage.removeItem(storageKey); } catch { /* ignore */ } },
    isDefault,
    visibleCount: sections.filter(s => visible.has(s.id)).length,
    hiddenCount: sections.filter(s => !visible.has(s.id)).length,
  };
}

type Controls = ReturnType<typeof useDashboardSections>;

/** The "Customize" button and its checklist. `align` sets which edge the menu opens from. */
export function SectionToggleMenu({ controls, align = 'right', lockedNote }: { controls: Controls; align?: 'left' | 'right'; lockedNote: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="true"
        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-brand hover:text-brand transition-all shadow-sm">
        <SlidersHorizontal className="w-5 h-5" /> Customize
        <span className="ml-0.5 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-xs tabular-nums">{controls.visibleCount}/{controls.sections.length}</span>
      </button>
      {open && (
        <div role="menu" aria-label="Dashboard sections"
          className={`absolute z-40 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="px-2 pt-1 pb-3">
            <p className="text-sm font-bold text-slate-900">Show on your dashboard</p>
            <p className="text-xs text-slate-500 mt-0.5">{lockedNote}</p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {controls.sections.map(s => {
              const on = controls.isVisible(s.id);
              return (
                <button key={s.id} role="menuitemcheckbox" aria-checked={on} onClick={() => controls.toggle(s.id)}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-all">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{s.label}</span>
                    {s.description && <span className="block text-xs text-slate-500 truncate">{s.description}</span>}
                  </span>
                  <span className={`relative w-10 h-6 rounded-full transition-all shrink-0 ${on ? 'bg-brand' : 'bg-slate-200'}`} aria-hidden>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow flex items-center justify-center transition-all ${on ? 'left-5' : 'left-1'}`}>
                      {on && <Check className="w-2.5 h-2.5 text-brand" strokeWidth={4} />}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-slate-100 mt-2 pt-2 px-1 grid grid-cols-2 gap-1">
            <button onClick={controls.showAll} disabled={controls.hiddenCount === 0}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold text-brand hover:bg-brand/5 disabled:text-slate-300 disabled:hover:bg-transparent">
              <Eye className="w-4 h-4" /> Show all
            </button>
            <button onClick={controls.resetToDefault} disabled={controls.isDefault}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold text-brand hover:bg-brand/5 disabled:text-slate-300 disabled:hover:bg-transparent">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * A dashboard row. Hidden sections drop out and the rest share the row by their `span`
 * (e.g. 2 + 1 -> two-thirds and one-third; a lone survivor takes the full width).
 */
export function DashRow({ items, isVisible }: { items: { id: string; span?: number; node: React.ReactNode }[]; isVisible: (id: string) => boolean }) {
  const shown = items.filter(i => isVisible(i.id));
  if (shown.length === 0) return null;
  const cols = shown.length === 1 ? 'minmax(0, 1fr)' : shown.map(i => `minmax(0, ${i.span ?? 1}fr)`).join(' ');
  return (
    <div className="dash-row" style={{ ['--dash-cols' as string]: cols } as React.CSSProperties}>
      {shown.map(i => <React.Fragment key={i.id}>{i.node}</React.Fragment>)}
    </div>
  );
}

/** Shown when every optional section is switched off, so the page never looks broken. */
export function AllHiddenNote({ onShowAll }: { onShowAll: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
      <p className="text-sm font-bold text-slate-700">All analytics sections are hidden.</p>
      <button onClick={onShowAll} className="mt-2 text-sm font-bold text-brand hover:underline">Show all sections</button>
    </div>
  );
}
