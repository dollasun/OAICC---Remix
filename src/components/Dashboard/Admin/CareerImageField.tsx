import React, { useRef, useState } from 'react';
import { Crop, ImagePlus, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import ImageCropper, { type AspectOption, type CropState } from '../../Common/ImageCropper';

export interface CareerImageValue {
  /** The cropped image shown everywhere. */
  image: string | null;
  /** The uncropped upload, kept so the crop can be changed later without losing quality. */
  original?: string;
  crop?: CropState;
}

/** Banner (2:1) matches the career page header, so it is the default and recommended shape. */
export const CAREER_IMAGE_ASPECTS: AspectOption[] = [
  { id: 'banner', label: 'Banner 2:1', ratio: 2, hint: 'Matches the career page header' },
  { id: 'wide', label: 'Wide 16:9', ratio: 16 / 9 },
  { id: 'standard', label: 'Standard 4:3', ratio: 4 / 3 },
  { id: 'square', label: 'Square 1:1', ratio: 1 },
];

const MAX_BYTES = 10 * 1024 * 1024;
const ORIGINAL_MAX_SIDE = 2000;

/** Reads an upload and scales it to at most 2000px on its longest side, so it fits in browser storage. */
function prepareUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const scale = Math.min(1, ORIGINAL_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff'; // transparent PNGs become white rather than black
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function CareerImageField({ value, onChange, title = 'Background Image' }: { value: CareerImageValue; onChange: (v: CareerImageValue) => void; title?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  /** The image being cropped, and whether it is a fresh upload (cancel then discards it). */
  const [cropping, setCropping] = useState<{ src: string; fresh: boolean } | null>(null);

  const accept = async (file?: File) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file (PNG, JPG, GIF or WebP).'); return; }
    if (file.size > MAX_BYTES) { setError('This image is larger than 10 MB. Please choose a smaller file.'); return; }
    setProcessing(true);
    try {
      setCropping({ src: await prepareUpload(file), fresh: true });
    } catch {
      setError("This image couldn't be read. Try a different file.");
    } finally {
      setProcessing(false);
    }
  };

  const openPicker = () => inputRef.current?.click();
  const aspect = value.crop?.aspect ?? 2;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">Shown at the top of the career page and on career cards. You can crop and zoom after uploading.</p>
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; accept(f); }} />

      {value.image ? (
        <div className="space-y-3">
          <div className="relative group rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mx-auto"
            style={{ aspectRatio: String(aspect), maxWidth: aspect < 1.5 ? 520 : undefined }}>
            <img src={value.image} alt="Career background preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 px-2.5 py-1 rounded-lg bg-slate-900/60 text-white text-[11px] font-bold backdrop-blur-sm">Preview</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCropping({ src: value.original ?? value.image!, fresh: false })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-sm shadow-brand/20 hover:brightness-105 transition-all">
              <Crop className="w-4 h-4" /> Adjust crop & zoom
            </button>
            <button type="button" onClick={openPicker} disabled={processing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-brand hover:text-brand transition-all disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} /> Replace image
            </button>
            <button type="button" onClick={() => onChange({ image: null })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all">
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={openPicker}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); accept(e.dataTransfer.files?.[0]); }}
          aria-describedby="career-image-help"
          className={`w-full aspect-[2/1] max-h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 transition-all group ${dragOver ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-slate-200 bg-slate-50 hover:border-brand/50 hover:bg-slate-100/60'}`}>
          <div className={`w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-4 transition-all ${dragOver ? 'bg-brand text-white' : 'bg-white text-slate-400 group-hover:text-brand group-hover:scale-110'}`}>
            {processing ? <RefreshCw className="w-7 h-7 animate-spin" /> : dragOver ? <UploadCloud className="w-8 h-8" /> : <ImagePlus className="w-8 h-8" />}
          </div>
          <p className="text-slate-700 font-bold">{dragOver ? 'Drop the image to upload' : processing ? 'Preparing image…' : 'Click to upload or drag and drop'}</p>
          <p id="career-image-help" className="text-slate-400 text-sm font-medium mt-1">PNG, JPG, GIF or WebP · up to 10 MB · best at 1600 × 800 or larger</p>
        </button>
      )}

      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

      <ImageCropper
        open={Boolean(cropping)}
        src={cropping?.src ?? ''}
        title="Crop career image"
        description="Drag to choose the part of the image to show, zoom in or out, and pick a shape. Banner matches the career page header."
        aspects={CAREER_IMAGE_ASPECTS}
        initial={cropping && !cropping.fresh ? value.crop : undefined}
        onCancel={() => setCropping(null)}
        onApply={({ dataUrl, crop }) => {
          onChange({ image: dataUrl, original: cropping!.src, crop });
          setCropping(null);
        }}
      />
    </div>
  );
}
