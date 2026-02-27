import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  X, 
  CheckCircle2,
  Briefcase,
  Scale,
  Download,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { interestQuizStorage, strengthQuizStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialInterestQuestions = [
  { id: 1, question: 'Do you enjoy working with numbers, analyzing data, or handling financial information?', industries: ['Accountancy', 'Banking and Finance'] },
  { id: 2, question: 'Are you interested in leading teams, planning strategies, or solving business problems?', industries: ['Business', 'Consulting and Management'] },
  { id: 3, question: 'Do you find satisfaction in helping others through charitable or community work?', industries: ['Charity and Voluntary Work', 'Social Care'] },
  { id: 4, question: 'Do you enjoy expressing yourself through art, design, or other creative projects?', industries: ['Creative Arts and Design'] },
  { id: 5, question: 'Are you interested in energy solutions, sustainability, or large-scale utilities management?', industries: ['Energy and Utilities', 'Environment and Agriculture'] },
  { id: 6, question: 'Do you like building or designing machines, products, or structures?', industries: ['Engineering and Manufacturing', 'Property and Construction'] },
  { id: 7, question: 'Are you passionate about nature, the environment, or agricultural processes?', industries: ['Environment and Agriculture'] },
  { id: 8, question: 'Would you enjoy working in a healthcare setting, helping to improve people\'s well-being?', industries: ['Healthcare', 'Science and Pharmaceuticals'] },
  { id: 9, question: 'Do you enjoy organizing events, planning experiences, or managing hospitality services?', industries: ['Hospitality', 'Events Management'] },
  { id: 10, question: 'Are you interested in technology, coding, or digital problem-solving?', industries: ['Information Technology', 'Media and Internet'] },
];

const initialStrengthQuestions = [
  { id: 1, question: 'I am good at organizing my time and tasks.', category: 'Organization' },
  { id: 2, question: 'I find it easy to explain complex ideas to others.', category: 'Communication' },
  { id: 3, question: 'I enjoy solving difficult puzzles or problems.', category: 'Problem Solving' },
  { id: 4, question: 'I am comfortable taking the lead in group projects.', category: 'Leadership' },
  { id: 5, question: 'I am very attentive to small details in my work.', category: 'Detail Oriented' },
  { id: 6, question: 'I can easily adapt to new situations and changes.', category: 'Adaptability' },
  { id: 7, question: 'I am good at listening to others and showing empathy.', category: 'Empathy' },
  { id: 8, question: 'I enjoy coming up with new and original ideas.', category: 'Creativity' },
  { id: 9, question: 'I am persistent and don\'t give up easily on hard tasks.', category: 'Resilience' },
  { id: 10, question: 'I work well as part of a team to achieve a common goal.', category: 'Teamwork' },
];

export default function AdminInterestQuiz() {
  const { showToast } = useToast();
  const [view, setView] = useState<'dashboard' | 'interests' | 'strengths'>('dashboard');
  const [interestQuestions, setInterestQuestions] = useState<any[]>([]);
  const [strengthQuestions, setStrengthQuestions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [formData, setFormData] = useState({ question: '', industries: '', category: '' });

  useEffect(() => {
    setInterestQuestions(interestQuizStorage.get(initialInterestQuestions));
    setStrengthQuestions(strengthQuizStorage.get(initialStrengthQuestions));
  }, []);

  const handleSaveQuestion = () => {
    if (!formData.question) {
      showToast('Please enter a question');
      return;
    }

    if (view === 'interests') {
      const industries = formData.industries.split(',').map(i => i.trim()).filter(i => i);
      let updated;
      if (editingQuestion) {
        updated = interestQuestions.map(q => q.id === editingQuestion.id ? { ...q, question: formData.question, industries } : q);
      } else {
        updated = [...interestQuestions, { id: Date.now(), question: formData.question, industries }];
      }
      setInterestQuestions(updated);
      interestQuizStorage.save(updated);
    } else {
      let updated;
      if (editingQuestion) {
        updated = strengthQuestions.map(q => q.id === editingQuestion.id ? { ...q, question: formData.question, category: formData.category } : q);
      } else {
        updated = [...strengthQuestions, { id: Date.now(), question: formData.question, category: formData.category }];
      }
      setStrengthQuestions(updated);
      strengthQuizStorage.save(updated);
    }

    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({ question: '', industries: '', category: '' });
    showToast(`Question ${editingQuestion ? 'updated' : 'added'} successfully!`);
  };

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      if (view === 'interests') {
        const updated = interestQuestions.filter(q => q.id !== id);
        setInterestQuestions(updated);
        interestQuizStorage.save(updated);
      } else {
        const updated = strengthQuestions.filter(q => q.id !== id);
        setStrengthQuestions(updated);
        strengthQuizStorage.save(updated);
      }
      showToast('Question deleted successfully!');
    }
  };

  const openEditModal = (q: any) => {
    setEditingQuestion(q);
    setFormData({ 
      question: q.question, 
      industries: q.industries ? q.industries.join(', ') : '', 
      category: q.category || '' 
    });
    setIsModalOpen(true);
  };

  if (view === 'dashboard') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Interest Quiz</h1>
            <button className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1 hover:text-brand transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Strength Questions', value: strengthQuestions.length.toString() },
            { label: 'Total Interest Questions', value: interestQuestions.length.toString() },
            { label: 'Total Questions', value: (strengthQuestions.length + interestQuestions.length).toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <button 
            onClick={() => setView('interests')}
            className="w-full bg-[#00BCD4] p-8 rounded-3xl flex items-center justify-between group hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-6 text-white text-left">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Interests and Industry</h2>
                <p className="text-white/80 font-medium">{interestQuestions.length} Questions</p>
              </div>
            </div>
            <ChevronRight className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={() => setView('strengths')}
            className="w-full bg-[#00BCD4] p-8 rounded-3xl flex items-center justify-between group hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-6 text-white text-left">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Strengths Assessment</h2>
                <p className="text-white/80 font-medium">{strengthQuestions.length} Questions</p>
              </div>
            </div>
            <ChevronRight className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  const currentQuestions = view === 'interests' ? interestQuestions : strengthQuestions;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-brand transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {view === 'interests' ? 'Interests and Industry' : 'Strengths Assessment'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage questions for the onboarding quiz.</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingQuestion(null); setFormData({ question: '', industries: '', category: '' }); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Question
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-16">SN</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Question</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {view === 'interests' ? 'Relevant Industries' : 'Category'}
                </th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentQuestions.map((q, index) => (
                <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-400">{index + 1}</td>
                  <td className="px-8 py-6 font-medium text-slate-700 max-w-md">{q.question}</td>
                  <td className="px-8 py-6">
                    {view === 'interests' ? (
                      <div className="flex flex-wrap gap-2">
                        {q.industries.map((ind: string) => (
                          <span key={ind} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            {ind}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {q.category}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(q)}
                        className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {editingQuestion ? 'Edit Question' : 'Add Question'}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      {view === 'interests' ? 'Interests and Industry' : 'Strengths Assessment'}
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Question Text</label>
                    <textarea 
                      rows={4}
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="Enter the question..." 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none" 
                    />
                  </div>

                  {view === 'interests' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Relevant Industries (comma separated)</label>
                      <input 
                        type="text" 
                        value={formData.industries}
                        onChange={(e) => setFormData({ ...formData, industries: e.target.value })}
                        placeholder="e.g. Accountancy, Finance" 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                      <input 
                        type="text" 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Communication" 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleSaveQuestion} className="flex-1 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      {editingQuestion ? 'Update' : 'Add'} <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
