import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Edit3, 
  History, 
  Check, 
  ChevronRight, 
  FileText, 
  Lock, 
  Sparkles, 
  Cookie, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Clock, 
  UserCheck, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading3, 
  Divide, 
  Save,
  BookOpen
} from 'lucide-react';
import { 
  PolicyDocument, 
  PolicySection, 
  PolicyVersionRecord, 
  updateManagedPolicy, 
  togglePolicyVisibility, 
  incrementVersion 
} from '../../../data/policiesData';
import { useToast } from '../../../context/ToastContext';

interface AdminPolicyModalProps {
  policy: PolicyDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onPolicyUpdated?: (updated: PolicyDocument) => void;
}

type ModalTab = 'read' | 'edit' | 'history';

export default function AdminPolicyModal({
  policy,
  isOpen,
  onClose,
  onPolicyUpdated
}: AdminPolicyModalProps) {
  const { showToast } = useToast();

  const [currentPolicy, setCurrentPolicy] = useState<PolicyDocument | null>(policy);
  const [activeTab, setActiveTab] = useState<ModalTab>('read');
  const [editorSubTab, setEditorSubTab] = useState<'edit' | 'preview'>('edit');

  // Edit form state
  const [editedTitle, setEditedTitle] = useState('');
  const [editedTagline, setEditedTagline] = useState('');
  const [editedNoticeBanner, setEditedNoticeBanner] = useState('');
  const [editedSections, setEditedSections] = useState<PolicySection[]>([]);
  const [changeSummary, setChangeSummary] = useState('');
  const [versionBumpType, setVersionBumpType] = useState<'minor' | 'major'>('minor');
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  // History inspection state
  const [inspectingVersion, setInspectingVersion] = useState<PolicyVersionRecord | null>(null);

  useEffect(() => {
    if (policy) {
      setCurrentPolicy(policy);
      setEditedTitle(policy.title);
      setEditedTagline(policy.tagline || '');
      setEditedNoticeBanner(policy.noticeBanner || '');
      setEditedSections(JSON.parse(JSON.stringify(policy.sections || [])));
      setChangeSummary('');
      setVersionBumpType('minor');
      setActiveTab('read');
      setInspectingVersion(null);
    }
  }, [policy]);

  if (!isOpen || !currentPolicy) return null;

  const nextVersion = incrementVersion(currentPolicy.version || '1.0', versionBumpType);

  const handleToggleHideShow = () => {
    try {
      const updated = togglePolicyVisibility(currentPolicy.id);
      setCurrentPolicy(updated);
      onPolicyUpdated?.(updated);
      if (updated.isHidden) {
        showToast(`"${currentPolicy.title}" is now hidden from users.`);
      } else {
        showToast(`"${currentPolicy.title}" is now visible to all users.`);
      }
    } catch (err) {
      showToast('Failed to update policy visibility');
    }
  };

  const handleStartEdit = () => {
    setEditedTitle(currentPolicy.title);
    setEditedTagline(currentPolicy.tagline || '');
    setEditedNoticeBanner(currentPolicy.noticeBanner || '');
    setEditedSections(JSON.parse(JSON.stringify(currentPolicy.sections || [])));
    setChangeSummary('');
    setVersionBumpType('minor');
    setEditorSubTab('edit');
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setActiveTab('read');
    setInspectingVersion(null);
  };

  const handleAddSection = () => {
    const newSecNum = editedSections.length + 1;
    const newSection: PolicySection = {
      id: `${currentPolicy.slug}-sec-${Date.now()}`,
      title: `${newSecNum}. New Policy Section`,
      content: 'Enter the clauses and provisions for this section here.'
    };
    const updated = [...editedSections, newSection];
    setEditedSections(updated);
    setActiveSectionIndex(updated.length - 1);
  };

  const handleRemoveSection = (index: number) => {
    if (editedSections.length <= 1) {
      showToast('A policy must contain at least one section');
      return;
    }
    const updated = editedSections.filter((_, i) => i !== index);
    setEditedSections(updated);
    setActiveSectionIndex(Math.max(0, index - 1));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editedSections.length) return;
    const updated = [...editedSections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setEditedSections(updated);
    setActiveSectionIndex(targetIndex);
  };

  const handleSectionFieldChange = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...editedSections];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSections(updated);
  };

  // Rich text formatting helper to insert markdown tokens into textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(`section-textarea-${activeSectionIndex}`) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = editedSections[activeSectionIndex]?.content || '';
    const selectedText = currentText.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    handleSectionFieldChange(activeSectionIndex, 'content', newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleSavePolicyEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedTitle.trim()) {
      showToast('Policy title cannot be empty');
      return;
    }
    if (editedSections.length === 0) {
      showToast('Please include at least one policy section');
      return;
    }

    const summary = changeSummary.trim() || `Revised terms and updated to Version ${nextVersion}`;
    try {
      const updated = updateManagedPolicy(
        currentPolicy.id,
        {
          title: editedTitle,
          tagline: editedTagline,
          noticeBanner: editedNoticeBanner.trim() || undefined,
          sections: editedSections,
          version: nextVersion
        },
        summary,
        'Bolu Ahmed (Super Admin)'
      );

      setCurrentPolicy(updated);
      onPolicyUpdated?.(updated);
      setActiveTab('read');
      showToast(`Policy updated to Version ${updated.version}! Changes recorded.`);
    } catch (err) {
      console.error(err);
      showToast('Error saving policy updates');
    }
  };

  const handleRestoreVersion = (ver: PolicyVersionRecord) => {
    if (window.confirm(`Are you sure you want to restore Version ${ver.version}? This will create a new version with that content.`)) {
      try {
        const nextRestoredVer = incrementVersion(currentPolicy.version || '1.0', 'minor');
        const updated = updateManagedPolicy(
          currentPolicy.id,
          {
            sections: ver.sections,
            noticeBanner: ver.noticeBanner,
            version: nextRestoredVer
          },
          `Restored provisions from historical Version ${ver.version}`,
          'Bolu Ahmed (Super Admin)'
        );

        setCurrentPolicy(updated);
        onPolicyUpdated?.(updated);
        setInspectingVersion(null);
        setActiveTab('read');
        showToast(`Restored Version ${ver.version} as new Version ${nextRestoredVer}!`);
      } catch (err) {
        showToast('Failed to restore version');
      }
    }
  };

  const getPolicyIcon = (id: string) => {
    switch (id) {
      case 'terms':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'privacy':
        return <Lock className="w-5 h-5 text-emerald-500" />;
      case 'student-privacy':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'cookies':
        return <Cookie className="w-5 h-5 text-orange-500" />;
      case 'safeguarding':
        return <ShieldCheck className="w-5 h-5 text-rose-500" />;
      case 'acceptable-use':
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const versionHistory = currentPolicy.versionHistory || [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center border border-slate-200/80 shadow-xs shrink-0 mt-0.5 sm:mt-0">
              {getPolicyIcon(currentPolicy.id)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {currentPolicy.title}
                </h3>
                {/* Visibility Badge */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                  currentPolicy.isHidden 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {currentPolicy.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {currentPolicy.isHidden ? 'Hidden from Users' : 'Visible to Users'}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                  v{currentPolicy.version || '1.0'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Effective: {currentPolicy.effectiveDate} • Last Updated: {currentPolicy.lastUpdated}
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {/* Toggle Hide/Show Button */}
            <button
              type="button"
              onClick={handleToggleHideShow}
              title={currentPolicy.isHidden ? 'Make this policy visible to regular users' : 'Hide this policy from regular users'}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                currentPolicy.isHidden
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {currentPolicy.isHidden ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show to Users</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hide from Users</span>
                </>
              )}
            </button>

            {/* Mode Switchers */}
            {activeTab === 'read' ? (
              <>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-3.5 py-1.5 bg-brand text-white hover:brightness-105 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>History ({versionHistory.length})</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-bold transition-all"
              >
                Back to Document
              </button>
            )}

            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= TAB 1: READ / DOCUMENT VIEW ================= */}
        {activeTab === 'read' && (
          <>
            {/* Status notification banner if hidden */}
            {currentPolicy.isHidden && (
              <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200/80 text-amber-900 text-xs font-medium flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Hidden from Users:</strong> This document is currently unpublished and will not appear in student, counselor, or parent portals.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleHideShow}
                  className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold hover:bg-amber-700 shrink-0"
                >
                  Publish Now
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed flex-1">
              {currentPolicy.noticeBanner && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Administrative Notice:
                  </p>
                  <p>{currentPolicy.noticeBanner}</p>
                </div>
              )}

              <div className="space-y-6">
                {currentPolicy.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                      {section.title}
                    </h4>
                    <p className="whitespace-pre-line text-slate-600 leading-relaxed text-xs sm:text-sm">
                      {section.content}
                    </p>
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="pl-4 border-l-2 border-slate-100 space-y-3 mt-3">
                        {section.subsections.map((sub, idx) => (
                          <div key={idx}>
                            <h5 className="font-bold text-xs text-slate-800">{sub.title}</h5>
                            <p className="text-xs text-slate-600 mt-0.5">{sub.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Contact Legal: {currentPolicy.contactEmail}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleStartEdit}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:border-brand hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Clauses
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Close Document
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 2: RICH TEXT EDITING MODE ================= */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSavePolicyEdit} className="flex-1 flex flex-col min-h-0">
            {/* Editor Sub-Header Toolbar */}
            <div className="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Editor Mode:</span>
                <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('edit')}
                    className={`px-3 py-1 rounded-md font-bold transition-colors ${
                      editorSubTab === 'edit' ? 'bg-brand text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Structured Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('preview')}
                    className={`px-3 py-1 rounded-md font-bold transition-colors ${
                      editorSubTab === 'preview' ? 'bg-brand text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {/* Version Bump Selector */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Save as Version:</span>
                <select
                  value={versionBumpType}
                  onChange={(e) => setVersionBumpType(e.target.value as 'minor' | 'major')}
                  className="bg-white border border-slate-300 rounded-md px-2 py-1 font-bold text-brand outline-none"
                >
                  <option value="minor">Minor Update (v{incrementVersion(currentPolicy.version || '1.0', 'minor')})</option>
                  <option value="major">Major Revision (v{incrementVersion(currentPolicy.version || '1.0', 'major')})</option>
                </select>
              </div>
            </div>

            {/* Editor Content Area */}
            {editorSubTab === 'edit' ? (
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Policy Document Title</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Short Tagline</label>
                    <input
                      type="text"
                      value={editedTagline}
                      onChange={(e) => setEditedTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                {/* Optional Administrative Notice */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Administrative / Legal Notice Banner <span className="text-slate-400 font-normal">(Optional amber alert at top)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={editedNoticeBanner}
                    onChange={(e) => setEditedNoticeBanner(e.target.value)}
                    placeholder="Enter special statutory disclaimer or guidance..."
                    className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-amber-900 outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Section Editor Navigation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Sections & Terms ({editedSections.length})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Edit, reorder, or add clauses. Formatting supports bullet points and headers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                  </div>

                  {/* Section Tabs / Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {editedSections.map((sec, idx) => (
                      <button
                        key={sec.id || idx}
                        type="button"
                        onClick={() => setActiveSectionIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                          activeSectionIndex === idx
                            ? 'bg-brand text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>Sec {idx + 1}</span>
                        {editedSections.length > 1 && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSection(idx);
                            }}
                            className="hover:text-red-300"
                            title="Remove section"
                          >
                            ×
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Current Active Section Editor Card */}
                  {editedSections[activeSectionIndex] && (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Section Title</label>
                          <input
                            type="text"
                            value={editedSections[activeSectionIndex].title}
                            onChange={(e) => handleSectionFieldChange(activeSectionIndex, 'title', e.target.value)}
                            required
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-brand"
                            placeholder="e.g. 1. Agreement to These Terms"
                          />
                        </div>

                        {/* Reorder and Delete controls */}
                        <div className="flex items-center gap-1 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleMoveSection(activeSectionIndex, 'up')}
                            disabled={activeSectionIndex === 0}
                            title="Move section up"
                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand disabled:opacity-30 disabled:hover:text-slate-600"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSection(activeSectionIndex, 'down')}
                            disabled={activeSectionIndex === editedSections.length - 1}
                            title="Move section down"
                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand disabled:opacity-30 disabled:hover:text-slate-600"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(activeSectionIndex)}
                            disabled={editedSections.length <= 1}
                            title="Delete this section"
                            className="p-2 bg-white border border-slate-200 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Formatting Toolbar */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-bold text-slate-700">Section Clauses & Terms</label>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => insertFormatting('**', '**')}
                              title="Bold"
                              className="p-1 hover:bg-slate-100 rounded text-slate-700 text-xs font-bold"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('*', '*')}
                              title="Italic"
                              className="p-1 hover:bg-slate-100 rounded text-slate-700 text-xs italic"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('\n• ')}
                              title="Bullet List"
                              className="p-1 hover:bg-slate-100 rounded text-slate-700"
                            >
                              <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('\n1. ')}
                              title="Numbered List"
                              className="p-1 hover:bg-slate-100 rounded text-slate-700"
                            >
                              <ListOrdered className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('\n> ')}
                              title="Quote / Callout"
                              className="p-1 hover:bg-slate-100 rounded text-slate-700 text-xs font-bold"
                            >
                              " "
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('\n---\n')}
                              title="Horizontal Divider"
                              className="p-1 hover:bg-slate-100 rounded text-slate-700"
                            >
                              <Divide className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          id={`section-textarea-${activeSectionIndex}`}
                          rows={10}
                          value={editedSections[activeSectionIndex].content}
                          onChange={(e) => handleSectionFieldChange(activeSectionIndex, 'content', e.target.value)}
                          required
                          className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 font-mono"
                          placeholder="Write the full statutory text, terms, or conditions..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Changelog Summary */}
                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                  <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Revision Log / Change Summary (Recorded in Version History)
                  </label>
                  <input
                    type="text"
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="e.g. Updated Section 15 on peer-to-peer reporting; annual NDPA 2023 review"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-lg text-xs text-slate-800 outline-none focus:border-brand"
                  />
                  <p className="text-[11px] text-indigo-600 font-medium">
                    This note will be logged in the permanent audit trail alongside your administrator signature.
                  </p>
                </div>
              </div>
            ) : (
              /* Live Preview sub-tab */
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed flex-1 bg-slate-50/50">
                <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl text-xs text-brand font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Live Preview Mode (How it will render for users once published)
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{editedTitle}</h3>
                    <p className="text-xs text-slate-500 mt-1">Effective: {currentPolicy.effectiveDate} • Version {nextVersion}</p>
                  </div>

                  {editedNoticeBanner && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <strong>Administrative Notice:</strong> {editedNoticeBanner}
                    </div>
                  )}

                  <div className="space-y-6">
                    {editedSections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1">
                          {sec.title}
                        </h4>
                        <p className="whitespace-pre-line text-slate-600 text-xs sm:text-sm leading-relaxed">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Editor Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand text-white font-bold text-xs rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Version {nextVersion}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= TAB 3: VERSION HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">Document Version History</h4>
                <p className="text-xs text-slate-500">Complete audit log of revisions, amendments, and author signatures.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('read')}
                className="text-xs text-brand font-bold hover:underline"
              >
                Return to Document
              </button>
            </div>

            {inspectingVersion ? (
              /* Inspecting an older version */
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="px-2.5 py-1 bg-brand text-white rounded text-xs font-bold">
                      Version {inspectingVersion.version}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Published on {inspectingVersion.updatedAt} by {inspectingVersion.updatedBy}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(inspectingVersion)}
                      className="px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-lg hover:brightness-105 transition-all flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore This Version
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectingVersion(null)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                    >
                      Back to History List
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 font-medium">
                  <strong>Revision Note:</strong> {inspectingVersion.changeSummary}
                </div>

                <div className="space-y-4">
                  {inspectingVersion.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <h5 className="font-bold text-slate-800 text-sm">{sec.title}</h5>
                      <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{sec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Timeline of versions */
              <div className="space-y-3">
                {versionHistory.map((ver, idx) => {
                  const isCurrent = ver.version === currentPolicy.version;
                  return (
                    <div
                      key={ver.version || idx}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-brand/[0.04] border-brand/40 shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isCurrent ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            v{ver.version} {isCurrent && '(Current Active)'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">• {ver.updatedAt}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {ver.changeSummary || 'Terms and policy revision'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Signee: {ver.updatedBy}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setInspectingVersion(ver)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleRestoreVersion(ver)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brand hover:text-brand text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
