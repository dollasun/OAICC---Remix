import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload } from 'lucide-react';
import type { School, SchoolClass } from '../../../types';
import { downloadCsv } from '../../../utils/download';
import {
  buildTemplateCsv, parseInviteCsv, ROLE_SPECS, runBulkInvite, templateFileName,
  type BulkResult, type InviteRole, type ParsedInviteCsv,
} from '../../../utils/invitations';

interface Props {
  school: School;
  role: InviteRole;
  classes: SchoolClass[];
  /** Set when adding from inside a class: the CSV is then just a list of emails. */
  fixedClass?: SchoolClass;
  onCancel: () => void;
  onImported: (result: BulkResult) => void;
}

const PREVIEW_PROBLEMS = 5;

export default function BulkInvitePanel({ school, role, classes, fixedClass, onCancel, onImported }: Props) {
  const spec = ROLE_SPECS[role];
  const ctx = { role, fixedClass };
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<ParsedInviteCsv | null>(null);
  const [busy, setBusy] = useState(false);

  const needsClasses = !fixedClass && spec.classColumn !== 'none';
  const valid = parsed?.rows.filter(r => !r.errors.length) ?? [];
  const problems = parsed?.rows.filter(r => r.errors.length) ?? [];

  const onFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setParsed(await parseInviteCsv(file, ctx, classes));
    if (inputRef.current) inputRef.current.value = ''; // lets the same file be chosen again after fixing it
  };

  const submit = () => {
    if (!parsed || !valid.length) return;
    setBusy(true);
    // Rows with problems are reported, never imported; the valid ones go through.
    onImported(runBulkInvite(school, role, parsed.rows));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0"><FileSpreadsheet className="w-5 h-5" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">1. Get the {fixedClass ? 'student' : spec.label.toLowerCase()} template</p>
          <p className="text-xs text-slate-500 mt-0.5 mb-3">
            {fixedClass
              ? `One email per row. Everyone is added to ${fixedClass.name}.`
              : <>Columns: <span className="font-semibold">{spec.columns.join(', ')}</span>.{needsClasses && (role === 'teacher' ? ' Separate several classes with ";".' : ' Use the exact class name.')}</>}
          </p>
          <button type="button" onClick={() => downloadCsv(buildTemplateCsv(ctx, classes), templateFileName(ctx))} className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">
            <Download className="w-4 h-4" /> Download sample CSV
          </button>
        </div>
      </div>

      {needsClasses && (
        <p className="text-xs text-slate-500 -mt-2">
          {classes.length
            ? <>Your classes: <span className="font-semibold text-slate-700">{classes.map(c => c.name).join(', ')}</span></>
            : <span className="text-amber-600 font-semibold">{role === 'student' ? 'Create a class first. Every student must be placed in one.' : 'You have no classes yet. Leave the class column empty and assign classes later.'}</span>}
        </p>
      )}

      <div>
        <p className="text-sm font-bold text-slate-900 mb-2">2. Upload your CSV</p>
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand/50 hover:bg-brand/5 transition-all py-6 flex flex-col items-center gap-1.5"
        >
          <Upload className="w-6 h-6 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">{fileName || 'Choose a CSV file or drop it here'}</span>
          <span className="text-xs text-slate-400">Up to 500 rows</span>
        </button>
      </div>

      {parsed?.fileError && (
        <div role="alert" className="flex gap-2 rounded-xl bg-red-50 text-red-600 p-3 text-sm font-medium"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{parsed.fileError}</div>
      )}

      {parsed && !parsed.fileError && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" />{valid.length} ready to invite</span>
            {problems.length > 0 && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600"><AlertCircle className="w-4 h-4" />{problems.length} with problems</span>}
          </div>
          {problems.length > 0 && (
            <ul className="rounded-xl border border-red-100 divide-y divide-red-50 text-xs max-h-40 overflow-y-auto">
              {problems.slice(0, PREVIEW_PROBLEMS).map(r => (
                <li key={r.line} className="px-3 py-2"><span className="font-bold text-slate-700">Line {r.line}{r.email && ` · ${r.email}`}</span><br /><span className="text-red-600">{r.errors.join(' ')}</span></li>
              ))}
              {problems.length > PREVIEW_PROBLEMS && <li className="px-3 py-2 text-slate-500 font-medium">and {problems.length - PREVIEW_PROBLEMS} more. Rows with problems are skipped.</li>}
            </ul>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
        <button type="button" onClick={submit} disabled={busy || !valid.length} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {valid.length ? `Invite ${valid.length} ${valid.length === 1 ? 'person' : 'people'}` : 'Send invitations'}
        </button>
      </div>
    </div>
  );
}
