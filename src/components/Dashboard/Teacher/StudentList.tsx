import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentsStorage } from '../../../utils/storage';

export default function StudentList() {
  const navigate = useNavigate();
  const { id: classId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const allStudents = studentsStorage.get([]);
    // Filter by class if classId is provided
    if (classId) {
      const filtered = allStudents.filter((s: any) => {
        const className = getClassName(classId).toLowerCase();
        return s.class?.toLowerCase() === className || s.class?.toLowerCase() === classId.toLowerCase();
      });
      setStudents(filtered.length > 0 ? filtered : allStudents);
    } else {
      setStudents(allStudents);
    }
  }, [classId]);

  const getClassName = (id?: string) => {
    switch(id) {
      case 'sss2a': return 'SSS 2A';
      case 'sss2b': return 'SSS 2B';
      case 'sss1a': return 'SSS 1A';
      case 'jss3a': return 'JSS 3A';
      default: return 'SSS 2A';
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.career?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Mr. Uzo Kelechi</h1>
          <p className="text-slate-500 font-medium">Assigned Teacher for {getClassName(classId)} • The Seaside School</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-6">
          <Download className="w-5 h-5" /> Download CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">List Of Student</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all">
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
              {filteredStudents.map((student) => (
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
                    <p className="text-sm text-slate-900 font-bold">{student.career || student.interest}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-brand font-bold">{student.mentor || 'Mason Biyi'}</p>
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
