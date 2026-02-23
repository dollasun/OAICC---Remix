import React, { useState } from 'react';
import { Search, Filter, Download, MoreVertical, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const students = [
  { id: '1', name: 'Favour Aina', email: 'favouraina@oaicc.com', interest: 'Front-end Developer', mentor: 'Mason Biyi' },
  { id: '2', name: 'Rasaq Desmond', email: 'rasaqtheking@oaicc.com', interest: 'Banking', mentor: 'Mason Biyi' },
  { id: '3', name: 'Uzo Chuwuma', email: 'chuwuma@oaicc.com', interest: 'Economics & Accounting', mentor: 'Mason Biyi' },
  { id: '4', name: 'Diane Edeatu', email: 'dianee@oaicc.com', interest: 'Software Enginner', mentor: 'Mason Biyi' },
  { id: '5', name: 'Victoria Godswill', email: 'vgodswill@oaicc.com', interest: 'Product Design', mentor: 'Mason Biyi' },
  { id: '6', name: 'Quadri Fatai', email: 'qf4real@oaicc.com', interest: 'Law', mentor: 'Mason Biyi' },
  { id: '7', name: 'Udon Happiness', label: 'Student Name', email: 'happyudon@oaicc.com', interest: 'Chef & Nutritionist', mentor: 'Mason Biyi' },
  { id: '8', name: 'Favour Queen', email: 'queenfavour@oaicc.com', interest: 'Nurse', mentor: 'Mason Biyi' },
  { id: '9', name: 'Gbenga Aina', email: 'gbengathegreat@oaicc.com', interest: 'Teacher', mentor: 'Mason Biyi' },
  { id: '10', name: 'Fridausi Mohammad', email: 'fridausim@oaicc.com', interest: 'Dentist', mentor: 'Mason Biyi' },
];

export default function StudentList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Mr. Uzo Kelechi</h1>
          <p className="text-slate-500 font-medium">Assigned Teacher for SSS 2A • The Seaside School</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-6">
          <Download className="w-5 h-5" /> Download CSV
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">List Of Student</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
              <Filter className="w-4 h-4" /> Sort by
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Career Interest</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mentor</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  onClick={() => navigate(`/teacher/student/${student.id}`)}
                >
                  <td className="px-8 py-5">
                    <p className={`text-sm font-bold ${student.id === '2' ? 'text-brand' : 'text-slate-900'}`}>{student.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-500 font-medium">{student.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-900 font-bold">{student.interest}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-brand font-bold">{student.mentor}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
