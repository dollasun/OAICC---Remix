/**
 * Small, dependency-free chart kit for the dashboards: stat tiles, a ranked bar list, a conversion
 * funnel and a line chart with a crosshair tooltip. Colours come from the `.viz` tokens in index.css,
 * which hold a validated palette for light and dark mode. Text always uses text colours, never the
 * series colour.
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

/* ───────────── shared pieces ───────────── */

export function ChartCard({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`viz bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}

export function StatTile({ label, value, detail, icon: Icon, tone }: { label: string; value: number | string; detail?: string; icon: LucideIcon; tone: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tone}`}><Icon className="w-6 h-6" /></div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900 tabular-nums leading-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {detail && <p className="text-xs font-medium text-slate-500 truncate">{detail}</p>}
      </div>
    </div>
  );
}

/** Period / segment switcher placed above a chart. */
export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex bg-slate-100 p-1 rounded-lg">
      {options.map(o => (
        <button key={o.id} role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${value === o.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Tooltip({ x, y, children, containerWidth }: { x: number; y: number; children: React.ReactNode; containerWidth: number }) {
  const flip = x > containerWidth - 200;
  return (
    <div role="tooltip" className="absolute z-20 pointer-events-none bg-slate-900 text-white text-xs rounded-lg shadow-lg px-3 py-2 min-w-[140px] max-w-[240px]"
      style={{ left: flip ? undefined : x + 12, right: flip ? containerWidth - x + 12 : undefined, top: Math.max(0, y - 10) }}>
      {children}
    </div>
  );
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/* ───────────── ranked bars ───────────── */

export interface BarItem {
  id: string;
  label: string;
  value: number;
  /** Shown after the value, e.g. "of 8 students". */
  note?: string;
  /** Extra lines for the hover tooltip. */
  details?: string[];
  onClick?: () => void;
}

/** Horizontal bars, one series, labelled directly. Pass `max` for a fixed scale (e.g. 100 for percentages). */
export function BarList({ items, max, format = v => v.toLocaleString(), empty = 'No data yet.' }: { items: BarItem[]; max?: number; format?: (v: number) => string; empty?: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<{ item: BarItem; x: number; y: number } | null>(null);
  if (items.length === 0) return <p className="text-sm text-slate-500 py-6 text-center">{empty}</p>;
  const scale = max ?? Math.max(1, ...items.map(i => i.value));

  return (
    <div ref={ref} className="relative space-y-3" onMouseLeave={() => setHover(null)}>
      {items.map((item, idx) => {
        const pct = Math.max(0, Math.min(100, (item.value / scale) * 100));
        const Row = item.onClick ? 'button' : 'div';
        return (
          <Row key={item.id} type={item.onClick ? 'button' : undefined} onClick={item.onClick}
            onMouseMove={(e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); setHover({ item, x: e.clientX - r.left, y: e.clientY - r.top }); }}
            onFocus={() => setHover({ item, x: width / 2, y: idx * 44 })} onBlur={() => setHover(null)}
            className={`block w-full text-left rounded-lg -mx-2 px-2 py-1 ${item.onClick ? 'hover:bg-slate-50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand' : ''}`}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-sm font-semibold text-slate-700 truncate">{item.label}</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">{format(item.value)}{item.note && <span className="text-xs font-medium text-slate-500"> {item.note}</span>}</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'var(--viz-track)' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--viz-1)', minWidth: item.value > 0 ? 4 : 0 }} />
            </div>
          </Row>
        );
      })}
      {hover && hover.item.details && hover.item.details.length > 0 && (
        <Tooltip x={hover.x} y={hover.y} containerWidth={width}>
          <p className="font-bold mb-1">{hover.item.label}</p>
          {hover.item.details.map(d => <p key={d} className="text-slate-300">{d}</p>)}
        </Tooltip>
      )}
    </div>
  );
}

/* ───────────── conversion funnel ───────────── */

export function FunnelChart({ stages }: { stages: { label: string; value: number; hint: string }[] }) {
  const top = Math.max(1, stages[0]?.value ?? 1);
  const ramp = ['var(--viz-ord-1)', 'var(--viz-ord-2)', 'var(--viz-ord-3)'];
  return (
    <div className="space-y-4">
      {stages.map((s, i) => {
        const pct = (s.value / top) * 100;
        const prev = i > 0 ? stages[i - 1].value : 0;
        const ofPrevious = i > 1 && prev > 0 ? Math.round((s.value / prev) * 100) : null;
        return (
          <div key={s.label}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-sm font-semibold text-slate-700">{s.label}</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {s.value.toLocaleString()}
                <span className="text-xs font-medium text-slate-500"> · {Math.round(pct)}%{ofPrevious !== null && ` (${ofPrevious}% of previous)`}</span>
              </span>
            </div>
            <div className="h-7 rounded-md" style={{ background: 'var(--viz-track)' }} title={`${s.label}: ${s.value}`}>
              <div className="h-7 rounded-md transition-all" style={{ width: `${pct}%`, minWidth: s.value > 0 ? 4 : 0, background: ramp[Math.min(i, ramp.length - 1)] }} />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{s.hint}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── line chart ───────────── */

export interface LineSeries { name: string; color: string; values: number[] }

/** A round tick step giving about five gridlines, and the axis maximum that step implies. */
const niceScale = (v: number) => {
  const raw = Math.max(1, v / 5);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  const step = Math.max(1, (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag);
  return { step, max: Math.max(step, Math.ceil(v / step) * step) };
};

/**
 * One y-axis, 2px lines, a crosshair with a tooltip on hover, and the last value labelled at the end
 * of each line. `labels` are the x positions; every series has one value per label.
 */
export function LineChart({ labels, series, height = 240, tooltipExtra }: { labels: string[]; series: LineSeries[]; height?: number; tooltipExtra?: (index: number) => string[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const pad = { top: 12, right: series.length > 1 ? 92 : 44, bottom: 28, left: 40 };
  const innerW = Math.max(10, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const { step, max } = niceScale(Math.max(1, ...series.flatMap(s => s.values)));
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const x = (i: number) => pad.left + (labels.length <= 1 ? innerW / 2 : (i / (labels.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;
  const labelEvery = Math.ceil(labels.length / Math.max(2, Math.floor(innerW / 64)));

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    setHoverIdx(Math.max(0, Math.min(labels.length - 1, Math.round(rel * (labels.length - 1)))));
  };

  // Keep end labels from overlapping when two series finish close together.
  const ends = series.map(s => ({ name: s.name, v: s.values[s.values.length - 1] ?? 0, y: y(s.values[s.values.length - 1] ?? 0) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={`Line chart: ${series.map(s => `${s.name} ${s.values[s.values.length - 1] ?? 0}`).join(', ')}`}>
          {ticks.map(t => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + innerW} y1={y(t)} y2={y(t)} stroke="var(--viz-grid)" strokeWidth={1} />
              <text x={pad.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-slate-400 text-[10px] font-semibold tabular-nums">{t.toLocaleString()}</text>
            </g>
          ))}
          {labels.map((l, i) => (i % labelEvery === 0 || i === labels.length - 1) && (
            <text key={l + i} x={x(i)} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">{l}</text>
          ))}
          {series.map(s => (
            <path key={s.name} d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {series.map(s => {
            const i = s.values.length - 1;
            return <circle key={s.name} cx={x(i)} cy={y(s.values[i] ?? 0)} r={4} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />;
          })}
          {ends.map(e => (
            <text key={e.name} x={pad.left + innerW + 8} y={e.y} dominantBaseline="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-bold tabular-nums">
              {e.v.toLocaleString()}{series.length > 1 ? ` ${e.name}` : ''}
            </text>
          ))}
          {hoverIdx !== null && (
            <g>
              <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={pad.top} y2={pad.top + innerH} stroke="var(--viz-axis)" strokeWidth={1} />
              {series.map(s => <circle key={s.name} cx={x(hoverIdx)} cy={y(s.values[hoverIdx] ?? 0)} r={5} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />)}
            </g>
          )}
          <rect x={pad.left} y={pad.top} width={innerW} height={innerH} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHoverIdx(null)} />
        </svg>
      )}
      {hoverIdx !== null && (
        <Tooltip x={x(hoverIdx)} y={pad.top} containerWidth={width}>
          <p className="font-bold mb-1">{labels[hoverIdx]}</p>
          {series.map(s => (
            <p key={s.name} className="flex items-center gap-2 text-slate-200">
              <span className="w-2.5 h-0.5 rounded" style={{ background: s.color }} />{s.name}: <span className="font-bold text-white tabular-nums">{(s.values[hoverIdx] ?? 0).toLocaleString()}</span>
            </p>
          ))}
          {tooltipExtra?.(hoverIdx).map(l => <p key={l} className="text-slate-300">{l}</p>)}
        </Tooltip>
      )}
    </div>
  );
}

export function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 mt-3">
      {items.map(i => (
        <span key={i.name} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="w-3 h-0.5 rounded" style={{ background: i.color }} /> {i.name}
        </span>
      ))}
    </div>
  );
}
