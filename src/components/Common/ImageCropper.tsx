/**
 * Image cropper: pick the frame shape, then drag to reposition and zoom to choose exactly what shows.
 * Works with mouse, touch, trackpad (pinch / wheel) and keyboard. The crop is described in
 * normalised coordinates (zoom + centre point), so the frame can resize freely and a saved crop can
 * be reopened later exactly as it was left.
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Move, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

export interface CropState {
  /** Width / height of the output frame. */
  aspect: number;
  /** 1 = the image just covers the frame; up to MAX_ZOOM. */
  zoom: number;
  /** Centre of the visible area in the source image, 0–1 on each axis. */
  cx: number;
  cy: number;
}

export interface AspectOption { id: string; label: string; ratio: number; hint?: string }

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Props {
  open: boolean;
  /** Data URL or remote URL of the full, uncropped image. */
  src: string;
  title?: string;
  description?: string;
  aspects: AspectOption[];
  initial?: Partial<CropState>;
  /** Longest side of the exported image, in pixels. */
  outputWidth?: number;
  onCancel: () => void;
  onApply: (result: { dataUrl: string; crop: CropState }) => void;
}

export default function ImageCropper({ open, src, title = 'Adjust image', description, aspects, initial, outputWidth = 1600, onCancel, onApply }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState('');
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [aspect, setAspect] = useState(initial?.aspect ?? aspects[0].ratio);
  const [zoom, setZoom] = useState(initial?.zoom ?? 1);
  const [center, setCenter] = useState({ x: initial?.cx ?? 0.5, y: initial?.cy ?? 0.5 });
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);

  // Load the image (crossOrigin so remote images can be exported from the canvas when the host allows it).
  useEffect(() => {
    if (!open) return;
    setImg(null);
    setLoadError('');
    const el = new Image();
    if (!src.startsWith('data:')) el.crossOrigin = 'anonymous';
    el.onload = () => setImg(el);
    el.onerror = () => setLoadError('This image could not be loaded. Try uploading it again.');
    el.src = src;
  }, [open, src]);

  // Reset to the saved crop each time the cropper opens.
  useEffect(() => {
    if (!open) return;
    setAspect(initial?.aspect ?? aspects[0].ratio);
    setZoom(initial?.zoom ?? 1);
    setCenter({ x: initial?.cx ?? 0.5, y: initial?.cy ?? 0.5 });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (!open || !frameRef.current) return;
    const el = frameRef.current;
    const update = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, aspect]);

  /* geometry: the image always covers the frame; scale = cover scale × zoom */
  const geometry = useCallback((z: number) => {
    if (!img || !frame.w) return null;
    const cover = Math.max(frame.w / img.naturalWidth, frame.h / img.naturalHeight);
    const s = cover * z;
    return { s, dw: img.naturalWidth * s, dh: img.naturalHeight * s };
  }, [img, frame]);

  /** Keeps the visible area inside the image. */
  const clampCenter = useCallback((c: { x: number; y: number }, z: number) => {
    const g = geometry(z);
    if (!g) return c;
    const hx = frame.w / (2 * g.dw);
    const hy = frame.h / (2 * g.dh);
    return { x: clamp(c.x, hx, 1 - hx), y: clamp(c.y, hy, 1 - hy) };
  }, [geometry, frame]);

  // Re-clamp whenever the frame shape or size changes.
  useEffect(() => { setCenter(c => clampCenter(c, zoom)); }, [clampCenter]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyZoom = (z: number) => {
    const next = clamp(Math.round(z * 100) / 100, MIN_ZOOM, MAX_ZOOM);
    setZoom(next);
    setCenter(c => clampCenter(c, next));
  };
  const pan = (dxPx: number, dyPx: number) => {
    const g = geometry(zoom);
    if (!g) return;
    setCenter(c => clampCenter({ x: c.x - dxPx / g.dw, y: c.y - dyPx / g.dh }, zoom));
  };

  /* pointer: one finger / mouse pans, two fingers pinch-zoom */
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDragging(true);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      applyZoom(pinchStart.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinchStart.current.dist));
    } else if (pointers.current.size === 1) {
      pan(e.clientX - prev.x, e.clientY - prev.y);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  // Wheel / trackpad zoom (non-passive so the page doesn't scroll while zooming).
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const applyZoomRef = useRef(applyZoom);
  applyZoomRef.current = applyZoom;
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyZoomRef.current(zoomRef.current * Math.exp(-e.deltaY * 0.0025));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [open, aspect]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 40 : 10;
    const map: Record<string, () => void> = {
      ArrowLeft: () => pan(step, 0), ArrowRight: () => pan(-step, 0), ArrowUp: () => pan(0, step), ArrowDown: () => pan(0, -step),
      '+': () => applyZoom(zoom + 0.1), '=': () => applyZoom(zoom + 0.1), '-': () => applyZoom(zoom - 0.1),
    };
    if (map[e.key]) { e.preventDefault(); map[e.key](); }
  };

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onCancel]);

  const reset = () => { setZoom(1); setCenter(clampCenter({ x: 0.5, y: 0.5 }, 1)); };

  const apply = () => {
    const g = geometry(zoom);
    if (!img || !g) return;
    setBusy(true);
    try {
      // Source rectangle that is visible in the frame.
      const sw = frame.w / g.s;
      const sh = frame.h / g.s;
      const sx = center.x * img.naturalWidth - sw / 2;
      const sy = center.y * img.naturalHeight - sh / 2;
      const outW = Math.round(clamp(sw, 400, outputWidth));
      const outH = Math.round(outW / aspect);
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
      onApply({ dataUrl: canvas.toDataURL('image/jpeg', 0.86), crop: { aspect, zoom, cx: center.x, cy: center.y } });
    } catch {
      setLoadError("This image is hosted somewhere that doesn't allow editing. Upload the image file instead.");
    } finally {
      setBusy(false);
    }
  };

  const g = geometry(zoom);
  const imgStyle: React.CSSProperties | undefined = g && img ? {
    width: g.dw, height: g.dh,
    transform: `translate(${frame.w / 2 - center.x * g.dw}px, ${frame.h / 2 - center.y * g.dh}px)`,
  } : undefined;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <motion.div role="dialog" aria-modal="true" aria-labelledby="cropper-title" initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 id="cropper-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{description ?? 'Drag to reposition, zoom to frame the part you want, and choose a shape.'}</p>
              </div>
              <button onClick={onCancel} aria-label="Close" className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Shape */}
              <div role="radiogroup" aria-label="Crop shape" className="flex flex-wrap gap-2">
                {aspects.map(a => {
                  const on = Math.abs(a.ratio - aspect) < 0.001;
                  return (
                    <button key={a.id} role="radio" aria-checked={on} onClick={() => setAspect(a.ratio)} title={a.hint}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-bold transition-all ${on ? 'bg-brand text-white border-brand shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand/50 hover:text-brand'}`}>
                      <span aria-hidden className={`inline-block border-2 rounded-[3px] ${on ? 'border-white/90' : 'border-current'}`}
                        style={{ width: a.ratio >= 1 ? 18 : 18 * a.ratio, height: a.ratio >= 1 ? 18 / a.ratio : 18 }} />
                      {a.label}
                    </button>
                  );
                })}
              </div>

              {/* Crop area */}
              <div className="rounded-2xl bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f8fafc_0%_50%)] dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] [background-size:20px_20px] p-3 sm:p-4">
                <div ref={frameRef} tabIndex={0} role="application" onKeyDown={onKeyDown}
                  aria-label="Crop area. Drag, or use the arrow keys, to move the image. Use plus and minus, the scroll wheel or a pinch to zoom."
                  onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                  style={{ aspectRatio: String(aspect), width: `min(100%, calc(52vh * ${aspect}))` }}
                  className={`relative mx-auto overflow-hidden rounded-xl bg-slate-900 select-none touch-none outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                  {img && imgStyle && <img src={img.src} alt="" draggable={false} className="absolute left-0 top-0 max-w-none origin-top-left pointer-events-none will-change-transform" style={imgStyle} />}
                  {!img && !loadError && <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/70">Loading image…</div>}
                  {/* Rule-of-thirds guides, stronger while dragging */}
                  <div aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity ${dragging ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="absolute inset-y-0 left-1/3 w-px bg-white/60" /><div className="absolute inset-y-0 left-2/3 w-px bg-white/60" />
                    <div className="absolute inset-x-0 top-1/3 h-px bg-white/60" /><div className="absolute inset-x-0 top-2/3 h-px bg-white/60" />
                  </div>
                  <div aria-hidden className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-white/80 rounded-xl" />
                  {img && !dragging && (
                    <div aria-hidden className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 text-white text-xs font-bold backdrop-blur-sm">
                      <Move className="w-3.5 h-3.5" /> Drag to reposition
                    </div>
                  )}
                </div>
              </div>

              {loadError && <p role="alert" className="text-sm font-semibold text-red-600 bg-red-50 rounded-xl px-4 py-3">{loadError}</p>}

              {/* Zoom */}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => applyZoom(zoom - 0.2)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all"><ZoomOut className="w-5 h-5" /></button>
                <label className="flex-1 flex items-center gap-3">
                  <span className="sr-only">Zoom</span>
                  <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.01} value={zoom} onChange={e => applyZoom(Number(e.target.value))}
                    aria-valuetext={`${Math.round(zoom * 100)}%`} className="w-full accent-brand cursor-pointer" />
                </label>
                <button type="button" onClick={() => applyZoom(zoom + 0.2)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all"><ZoomIn className="w-5 h-5" /></button>
                <span className="w-14 text-right text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">{Math.round(zoom * 100)}%</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900">
              <button type="button" onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
              <div className="flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="button" onClick={apply} disabled={!img || busy} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold shadow-sm shadow-brand/20 hover:brightness-105 disabled:opacity-50 transition-all"><Check className="w-4 h-4" /> Apply crop</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
