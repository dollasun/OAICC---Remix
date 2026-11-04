import React, { useState } from 'react';
import Papa from 'papaparse';
import { Search, Download, ChevronRight, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { schoolStorage } from '../../../utils/storage';
import { classesForTeacher, className, fullName, sessionStore, studentsInClass, teachersStore } from '../../../utils/schoolData';

export default function StudentList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id: classId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const session = sessionStore.get();
  const teacher = session?.role === 'teacher' ? teachersStore.get(session.userId) : undefined;
  const myClasses = teacher ? classesForTeacher(teacher.id) : [];
  const selectedClasses = classId ? myClasses.filter(c => c.id === classId) : myClasses;
  const students = selectedClasses.flatMap(c => studentsInClass(c.id));
  const filtered = students.filter(s => `${fullName(s)} ${s.email}`.toLowerCase().includes(searchTerm.trim().toLowerCase()));
  const heading = classId ? (selectedClasses[0]?.name ?? 'Class not found') : myClasses.length ? 'All my classes' : 'No class assigned';

  const downloadCsv = () => {
    const csv = Papa.unparse(students.map(s => ({
      Name: fullName(s), Email: s.email, Class: className(s.classId), Status: s.status, Onboarding: s.onboarded ? 'Complete' : 'Pending',
    })));
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Student list downloaded.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {teacher ? (fullName(teacher) || teacher.email) : 'Teacher'}</h1>
          <p className="text-slate-500 font-medium">Assigned Teacher for {heading}{schoolStorage.get() ? ` • ${schoolStorage.get()!.name}` : ''}</p>
        </div>
        <button onClick={downloadCsv} disabled={students.length === 0} className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50">
          <Download className="w-5 h-5" /> Download CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">List Of Student</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Users className="w-10 h-10 text-slate-200" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{myClasses.length ? 'No students yet' : 'No class assigned yet'}</h3>
            <p className="text-slate-500 max-w-xs">{myClasses.length ? 'Students your school adds to your classes will appear here.' : 'Your school will assign you to a class.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {['Student Name', 'Email Address', 'Class', 'Onboarding'].map(h => (
                    <th key={h} className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-8 py-16 text-center text-sm font-medium text-slate-400">No students match your search.</td></tr>
                )}
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group" onClick={() => navigate(`/teacher/student/${s.id}`)}>
                    <td className="px-8 py-5"><p className="text-sm font-bold text-slate-900">{fullName(s) || 'Awaiting sign-up'}</p></td>
                    <td className="px-8 py-5"><p className="text-sm text-slate-500 font-medium">{s.email}</p></td>
                    <td className="px-8 py-5"><p className="text-sm text-slate-900 font-bold">{className(s.classId)}</p></td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.onboarded ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{s.onboarded ? 'Complete' : 'Pending'}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all"><ChevronRight className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
