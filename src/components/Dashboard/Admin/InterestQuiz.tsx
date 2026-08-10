import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, Plus, Edit2, Trash2, ArrowUp, ArrowDown, 
  Power, PowerOff, List, ChevronRight, Search, 
  Filter, Check, X, AlertTriangle, ArrowLeft, GripVertical, Heart, Zap, Briefcase, BookOpen
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { INITIAL_SECTIONS, INITIAL_CLUSTERS, INITIAL_INDUSTRIES, Section, Question, CareerCluster, NIGERIAN_SUBJECTS } from '../../../data/assessmentData';
import { INITIAL_QUESTIONS } from '../../../data/assessmentQuestions';

const getIcon = (name: string) => {
  switch (name) {
    case 'Heart': return <Heart className="w-5 h-5" />;
    case 'Zap': return <Zap className="w-5 h-5" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5" />;
    default: return <List className="w-5 h-5" />;
  }
};

export default function AdminInterestQuiz() {
  const { showToast } = useToast();
  
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const clusters = INITIAL_CLUSTERS;
  
  const [activeView, setActiveView] = useState<'landing' | 'section'>('landing');
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  
  const [showClustersDrawer, setShowClustersDrawer] = useState(false);
  
  // Section Modal
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionFormData, setSectionFormData] = useState({ name: '', description: '', icon: 'List', isActive: true });
  
  // Delete Section Modal
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [deleteAction, setDeleteAction] = useState<'move' | 'delete'>('move');
  const [moveToSectionId, setMoveToSectionId] = useState<string>('');

  // Question List State
  const [searchQ, setSearchQ] = useState('');
  const [filterUse, setFilterUse] = useState('All');
  const [filterCluster, setFilterCluster] = useState('All');

  // Question Modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qFormData, setQFormData] = useState<Partial<Question>>({});
  
  // Delete Question Modal
  const [showDeleteQModal, setShowDeleteQModal] = useState(false);
  const [qToDelete, setQToDelete] = useState<Question | null>(null);

  const handleExport = () => {
    const csvHeader = 'ID,SectionID,Order,Question,Use,PrimaryCluster,SecondaryCluster,Signal,Subjects,Prompt,Type,Active\n';
    const csvContent = questions.map(q => 
      `"${q.id}","${q.sectionId}",${q.order},"${q.questionText}","${q.use}","${q.primaryCluster}","${q.secondaryCluster}","${q.algorithmSignal}","${q.relatedSubjects.join(', ')}","${q.counsellorPrompt}","${q.responseType}",${q.isActive}`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `oaicc-onboarding-assessment-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export successful', 'success');
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection.id ? { ...s, ...sectionFormData } : s));
      showToast('Section updated successfully', 'success');
    } else {
      const newSection: Section = {
        id: sectionFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...sectionFormData,
        order: sections.length + 1,
        isSystem: false,
        createdAt: new Date().toISOString()
      };
      setSections([...sections, newSection]);
      showToast('Section added successfully', 'success');
    }
    setShowSectionModal(false);
  };

  const handleDeleteSectionConfirm = () => {
    if (!sectionToDelete) return;
    if (deleteAction === 'move' && moveToSectionId) {
      setQuestions(questions.map(q => q.sectionId === sectionToDelete.id ? { ...q, sectionId: moveToSectionId } : q));
    } else if (deleteAction === 'delete') {
      setQuestions(questions.filter(q => q.sectionId !== sectionToDelete.id));
    }
    setSections(sections.filter(s => s.id !== sectionToDelete.id));
    setShowDeleteSectionModal(false);
    showToast('Section deleted successfully', 'success');
  };

  const activeSection = sections.find(s => s.id === currentSectionId);
  const sectionQuestions = useMemo(() => {
    if (!activeSection) return [];
    let qs = questions.filter(q => q.sectionId === activeSection.id);
    if (searchQ) qs = qs.filter(q => q.questionText.toLowerCase().includes(searchQ.toLowerCase()));
    if (filterUse !== 'All') qs = qs.filter(q => q.use === filterUse);
    if (filterCluster !== 'All') qs = qs.filter(q => q.primaryCluster === filterCluster);
    return qs.sort((a, b) => a.order - b.order);
  }, [questions, activeSection, searchQ, filterUse, filterCluster]);

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? { ...editingQuestion, ...qFormData } as Question : q));
      showToast('Question updated', 'success');
    } else {
      const newQuestion: Question = {
        ...qFormData,
        id: `Q${Date.now()}`,
        sectionId: currentSectionId!,
        order: sectionQuestions.length + 1,
        responseType: 'likert_5',
        isActive: true
      } as Question;
      setQuestions([...questions, newQuestion]);
      showToast('Question added', 'success');
    }
    setShowQuestionModal(false);
  };

  const handleDeleteQuestionConfirm = () => {
    if (qToDelete) {
      setQuestions(questions.filter(q => q.id !== qToDelete.id));
      showToast('Question deleted', 'success');
      setShowDeleteQModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {activeView === 'landing' ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Onboarding Assessment</h1>
              <button 
                onClick={handleExport}
                className="mt-2 text-sm text-brand font-medium hover:underline flex items-center gap-1"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowClustersDrawer(true)}
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand transition-colors"
              >
                View Career Clusters
              </button>
              <button 
                onClick={() => { 
                  setEditingSection(null); 
                  setSectionFormData({ name: '', description: '', icon: 'List', isActive: true });
                  setShowSectionModal(true); 
                }}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Section
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {sections.filter(s => s.isActive).map(section => {
              const count = questions.filter(q => q.sectionId === section.id).length;
              return (
                <div key={section.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">TOTAL {section.name.toUpperCase()} QUESTIONS</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{count}</p>
                </div>
              );
            })}
            <div className="bg-brand/5 dark:bg-brand/10 p-4 rounded-xl border border-brand/20 shadow-sm flex flex-col justify-between">
              <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-2">TOTAL QUESTIONS</p>
              <p className="text-2xl font-black text-brand">{questions.length}</p>
            </div>
          </div>

          <div className="space-y-4">
            {[...sections].sort((a, b) => a.order - b.order).map((section, index) => {
              const count = questions.filter(q => q.sectionId === section.id).length;
              return (
                <div 
                  key={section.id}
                  onClick={() => { setCurrentSectionId(section.id); setActiveView('section'); }}
                  className={`relative group bg-white dark:bg-slate-900 border ${section.isActive ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700 opacity-75'} rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-brand/40 hover:shadow-sm transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.isActive ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {getIcon(section.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {section.name}
                        {!section.isActive && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Inactive</span>}
                      </h3>
                      <p className="text-sm text-slate-500">{count} Questions • {section.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditingSection(section); setSectionFormData({ name: section.name, description: section.description, icon: section.icon, isActive: section.isActive }); setShowSectionModal(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-brand" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      const newSections = [...sections];
                      const idx = newSections.findIndex(s => s.id === section.id);
                      if (idx > 0) {
                        const temp = newSections[idx].order;
                        newSections[idx].order = newSections[idx-1].order;
                        newSections[idx-1].order = temp;
                        setSections(newSections);
                        showToast('Section moved up');
                      }
                    }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400" title="Move Up" disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      const newSections = [...sections];
                      const idx = newSections.findIndex(s => s.id === section.id);
                      if (idx < newSections.length - 1) {
                        const temp = newSections[idx].order;
                        newSections[idx].order = newSections[idx+1].order;
                        newSections[idx+1].order = temp;
                        setSections(newSections);
                        showToast('Section moved down');
                      }
                    }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400" title="Move Down" disabled={index === sections.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      setSections(sections.map(s => s.id === section.id ? { ...s, isActive: !s.isActive } : s));
                      showToast(`Section ${section.isActive ? 'deactivated' : 'activated'}`);
                    }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400" title={section.isActive ? "Deactivate" : "Activate"}>
                      {section.isActive ? <PowerOff className="w-4 h-4 text-amber-500" /> : <Power className="w-4 h-4 text-emerald-500" />}
                    </button>
                    <button onClick={() => { setSectionToDelete(section); setDeleteAction('move'); setMoveToSectionId(sections.find(s => s.id !== section.id)?.id || ''); setShowDeleteSectionModal(true); }} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setActiveView('landing')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Sections
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{activeSection?.name}</h2>
              <p className="text-slate-500">{activeSection?.description}</p>
            </div>
            <button onClick={() => { setEditingQuestion(null); setQFormData({ use: 'Core', primaryCluster: '', secondaryCluster: '', relatedSubjects: [] }); setShowQuestionModal(true); }} className="btn-primary">
              <Plus className="w-5 h-5 mr-2" /> Add Question
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search questions..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-xl" />
            </div>
            <select value={filterUse} onChange={(e) => setFilterUse(e.target.value)} className="border rounded-xl px-4 py-2">
              <option value="All">All Uses</option>
              <option value="Core">Core</option>
              <option value="Optional">Optional</option>
            </select>
            <select value={filterCluster} onChange={(e) => setFilterCluster(e.target.value)} className="border rounded-xl px-4 py-2">
              <option value="All">All Clusters</option>
              {clusters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">SN</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">QUESTION</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">USE</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">CAREER CLUSTERS</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionQuestions.map((q, i) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{q.questionText}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${q.use === 'Core' ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-600'}`}>{q.use}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded w-max" title="Primary: full score">{q.primaryCluster}</span>
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded w-max" title="Secondary: half score">{q.secondaryCluster}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingQuestion(q); setQFormData(q); setShowQuestionModal(true); }} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-brand"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { setQToDelete(q); setShowDeleteQModal(true); }} className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-slate-200 rounded text-slate-400 cursor-grab"><GripVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sectionQuestions.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No questions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SECTION MODAL */}
      <AnimatePresence>
        {showSectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSectionModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-bold mb-4">{editingSection ? 'Edit Section' : 'Add Section'}</h3>
              <form onSubmit={handleSaveSection} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                  <input type="text" value={sectionFormData.name} onChange={e => setSectionFormData({...sectionFormData, name: e.target.value})} required className="w-full px-3 py-2 border rounded-xl" maxLength={40} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                  <input type="text" value={sectionFormData.description} onChange={e => setSectionFormData({...sectionFormData, description: e.target.value})} required className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowSectionModal(false)} className="flex-1 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">{editingSection ? 'Update' : 'Add Section'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUESTION MODAL */}
      <AnimatePresence>
        {showQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowQuestionModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
              <h3 className="text-xl font-bold mb-1">{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>
              <p className="text-sm text-slate-500 mb-4">{activeSection?.name}</p>
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Question Text</label>
                  <textarea value={qFormData.questionText || ''} onChange={e => setQFormData({...qFormData, questionText: e.target.value})} required minLength={10} maxLength={200} className="w-full px-3 py-2 border rounded-xl h-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Use</label>
                    <select value={qFormData.use || 'Core'} onChange={e => setQFormData({...qFormData, use: e.target.value as 'Core'|'Optional'})} className="w-full px-3 py-2 border rounded-xl">
                      <option value="Core">Core</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Algorithm Signal</label>
                    <input type="text" value={qFormData.algorithmSignal || ''} onChange={e => setQFormData({...qFormData, algorithmSignal: e.target.value})} maxLength={60} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Primary Cluster</label>
                    <select value={qFormData.primaryCluster || ''} onChange={e => setQFormData({...qFormData, primaryCluster: e.target.value})} required className="w-full px-3 py-2 border rounded-xl">
                      <option value="">Select...</option>
                      {clusters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Secondary Cluster</label>
                    <select value={qFormData.secondaryCluster || ''} onChange={e => setQFormData({...qFormData, secondaryCluster: e.target.value})} required className="w-full px-3 py-2 border rounded-xl">
                      <option value="">Select...</option>
                      {clusters.map(c => <option key={c.id} value={c.name} disabled={c.name === qFormData.primaryCluster}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Counsellor Follow-up Prompt</label>
                  <textarea value={qFormData.counsellorPrompt || ''} onChange={e => setQFormData({...qFormData, counsellorPrompt: e.target.value})} className="w-full px-3 py-2 border rounded-xl h-16" />
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowQuestionModal(false)} className="flex-1 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">{editingQuestion ? 'Update' : 'Add Question'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLUSTERS DRAWER */}
      <AnimatePresence>
        {showClustersDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowClustersDrawer(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold">Career Clusters</h2>
                <button onClick={() => setShowClustersDrawer(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                {clusters.map(cluster => (
                  <div key={cluster.id} className="border rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 mb-2">{cluster.name}</h4>
                    <p className="text-sm text-slate-600 mb-3">{cluster.studentFriendlyMeaning}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {cluster.relatedIndustries.map(ind => <span key={ind} className="px-2 py-0.5 bg-slate-100 text-xs rounded text-slate-600">{ind}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* DELETE MODALS */}
      <AnimatePresence>
        {showDeleteSectionModal && sectionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteSectionModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Delete Section?</h3>
              <p className="text-slate-500 mb-6">What would you like to do with the {questions.filter(q => q.sectionId === sectionToDelete.id).length} questions in this section?</p>
              
              <div className="space-y-3 mb-6 text-left">
                <label className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="deleteAction" value="move" checked={deleteAction === 'move'} onChange={() => setDeleteAction('move')} className="mt-1" />
                  <div>
                    <p className="font-bold text-sm">Move questions to:</p>
                    <select disabled={deleteAction !== 'move'} value={moveToSectionId} onChange={(e) => setMoveToSectionId(e.target.value)} className="w-full mt-2 p-2 border rounded">
                      <option value="">Select section...</option>
                      {sections.filter(s => s.id !== sectionToDelete.id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-red-50 text-red-600">
                  <input type="radio" name="deleteAction" value="delete" checked={deleteAction === 'delete'} onChange={() => setDeleteAction('delete')} />
                  <span className="font-bold text-sm">Delete section and all questions</span>
                </label>
              </div>
              
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteSectionModal(false)} className="flex-1 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button onClick={handleDeleteSectionConfirm} disabled={deleteAction === 'move' && !moveToSectionId} className="flex-1 py-2 font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl disabled:opacity-50">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteQModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteQModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Delete Question?</h3>
              <p className="text-slate-500 mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteQModal(false)} className="flex-1 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button onClick={handleDeleteQuestionConfirm} className="flex-1 py-2 font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
