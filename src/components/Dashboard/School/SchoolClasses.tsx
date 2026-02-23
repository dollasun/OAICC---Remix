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

const initialClasses = [
  { id: 'jss1', name: 'JSS1', students: ['JO', 'ER', 'DA', 'DW', 'ED', 'WO', 'LM'], count: 344, date: 'Jan 6, 2022 4:26 PM' },
  { id: 'jss2', name: 'JSS2', students: ['JO', 'ER', 'DA', 'DW', 'ED', 'WO', 'LM'], count: 344, date: 'Jan 6, 2022 4:26 PM' },
  { id: 'jss3', name: 'JSS3', students: ['JO', 'ER', 'DA', 'DW', 'ED', 'WO', 'LM'], count: 344, date: 'Jan 6, 2022 4:26 PM' },
  { id: 'sss1', name: 'SSS1', students: ['JO', 'ER', 'DA', 'DW', 'ED', 'WO', 'LM'], count: 344, date: 'Jan 6, 2022 4:26 PM' },
  { id: 'sss2', name: 'SSS2', students: ['JO', 'ER', 'DA', 'DW', 'ED', 'WO', 'LM'], count: 344, date: 'Jan 6, 2022 4:26 PM' },
  { id: 'sss3', name: 'SSS3', students: ['JO', 'ER', 'DA', 'DW', 'ED', 'WO', 'LM'], count: 344, date: 'Jan 6, 2022 4:26 PM' },
];

export default function SchoolClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(initialClasses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState({ name: '', teacher: '' });

  const stats = [
    { label: 'Total classes', value: classes.length > 0 ? '6' : '0' },
    { label: 'Total teachers', value: classes.length > 0 ? '12' : '0' },
    { label: 'Total students', value: classes.length > 0 ? '388' : '0' },
  ];

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
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary px-6 py-3">
            Add new class
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-400 mb-4">{stat.label}</p>
            <p className="text-5xl font-bold text-slate-900 font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Class yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs">You haven't added any class yet</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary px-10 py-4"
          >
            Add new class
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CLASS</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">STUDENTS</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">DATE</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {classes.map((cls) => (
                  <tr 
                    key={cls.id} 
                    className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                    onClick={() => navigate(`/school/classes/${cls.id}`)}
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{cls.name}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {cls.students.map((initial, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center">
                              {initial}
                            </div>
                          ))}
                        </div>
                        <span className="ml-2 text-xs font-bold text-slate-400">+{cls.count}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-500 font-medium">{cls.date}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); setCurrentClass({ name: cls.name, teacher: 'Felix John' }); }}
                          className="p-2 text-slate-400 hover:text-brand transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); }}
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
            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3, '...', 8, 9, 10].map((page, idx) => (
                <button 
                  key={idx} 
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === 1 ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-all">
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
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{isAddModalOpen ? 'Add new class' : 'Edit class'}</h3>
              <form className="space-y-6">
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

                {isAddModalOpen && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Teacher</label>
                    <select 
                      className="input-field appearance-none bg-white"
                      required
                      value={currentClass.teacher}
                      onChange={e => setCurrentClass({...currentClass, teacher: e.target.value})}
                    >
                      <option value="">Select teacher</option>
                      <option value="Felix John">Felix John</option>
                      <option value="Sarah Ojo">Sarah Ojo</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
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
