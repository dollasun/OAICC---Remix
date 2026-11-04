import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { schoolClassesStorage, schoolStorage } from '../../../utils/storage';
import { assignTeacher, fullName, studentsInClass, studentsOfSchool, teachersOfSchool, teachersStore } from '../../../utils/schoolData';
import type { SchoolClass } from '../../../types';

const PAGE_SIZE = 10;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function SchoolClasses() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [classes, setClasses] = useState<SchoolClass[]>(() => schoolClassesStorage.get());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentClass, setCurrentClass] = useState({ name: '', teacher: '' });
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(classes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleClasses = classes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = [
    { label: 'Total classes', value: String(classes.length) },
    { label: 'Total teachers', value: String(teachersOfSchool(schoolStorage.get()?.id).length) },
    { label: 'Total students', value: String(studentsOfSchool(schoolStorage.get()?.id).length) },
  ];

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingId(null);
    setCurrentClass({ name: '', teacher: '' });
  };

  const openAdd = () => {
    setCurrentClass({ name: '', teacher: '' });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddModalOpen) {
      const created = schoolClassesStorage.add(currentClass.name);
      if (!created) {
        showToast('A class with that name already exists.', 'error');
        return;
      }
      if (currentClass.teacher) assignTeacher(created.id, currentClass.teacher);
      showToast('Class added successfully!');
    } else if (editingId) {
      const previous = schoolClassesStorage.get().find(c => c.id === editingId);
      if (!schoolClassesStorage.update(editingId, { name: currentClass.name, teacherId: previous?.teacherId })) {
        showToast('A class with that name already exists.', 'error');
        return;
      }
      if ((previous?.teacherId ?? '') !== currentClass.teacher) assignTeacher(editingId, currentClass.teacher || undefined);
      showToast('Class updated successfully!');
    }
    setClasses(schoolClassesStorage.get());
    closeModal();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Classes</h1>
          <button className="flex items-center gap-2 text-slate-500 font-bold mt-2 hover:text-brand transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        {classes.length > 0 && (
          <button onClick={openAdd} className="btn-primary px-6 py-3">
            Add new class
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-400 mb-4">{stat.label}</p>
            <p className="text-5xl font-bold text-slate-900 font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Class yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs">You haven't added any class yet</p>
          <button 
            onClick={openAdd}
            className="btn-primary px-10 py-4"
          >
            Add new class
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CLASS</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">TEACHER</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STUDENTS</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">DATE</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visibleClasses.map((cls) => (
                  <tr 
                    key={cls.id} 
                    className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                    onClick={() => navigate(`/school/classes/${cls.id}`)}
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{cls.name}</p>
                    </td>
                    <td className="px-8 py-6">
                      {(() => {
                        const t = teachersStore.get(cls.teacherId);
                        return <p className="text-sm font-bold text-slate-900">{t ? (fullName(t) || t.email) : <span className="text-slate-400 font-medium">Not assigned</span>}</p>;
                      })()}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-500">{studentsInClass(cls.id).length} students</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-500 font-medium">{formatDate(cls.createdAt)}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingId(cls.id); setIsEditModalOpen(true); setCurrentClass({ name: cls.name, teacher: cls.teacherId ?? '' }); }}
                          className="p-2 text-slate-400 hover:text-brand transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (window.confirm('Are you sure you want to delete this class?')) {
                              schoolClassesStorage.remove(cls.id);
                              setClasses(schoolClassesStorage.get());
                              showToast('Class deleted successfully!');
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-all"
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

          <div className="p-8 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, n) => n + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    n === currentPage ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-sm p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{isAddModalOpen ? 'Add new class' : 'Edit class'}</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Name of class</label>
                  <input 
                    type="text" 
                    placeholder="SS3" 
                    className="input-field"
                    required
                    value={currentClass.name}
                    onChange={e => setCurrentClass({...currentClass, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Teacher <span className="font-medium text-slate-400">(optional)</span></label>
                  <select
                    className="input-field appearance-none bg-white"
                    value={currentClass.teacher}
                    onChange={e => setCurrentClass({...currentClass, teacher: e.target.value})}
                  >
                    <option value="">No teacher assigned</option>
                    {teachersOfSchool(schoolStorage.get()?.id).map(t => (
                      <option key={t.id} value={t.id}>{fullName(t) || t.email}{t.status === 'invited' ? ' (invited)' : ''}</option>
                    ))}
                  </select>
                  {teachersOfSchool(schoolStorage.get()?.id).length === 0 && (
                    <p className="text-xs text-slate-400 font-medium">Invite teachers from the Teachers page to assign them here.</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {isAddModalOpen ? 'Add class' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
