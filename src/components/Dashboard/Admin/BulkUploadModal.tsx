import React, { useState } from 'react';
import { Upload, X, Download, AlertCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, category: string) => void;
}

export default function BulkUploadModal({ isOpen, onClose, onUpload }: BulkUploadModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedCategory || !file) {
      showToast('Please select a category and upload a file');
      return;
    }
    onUpload(file, selectedCategory);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Career Upload</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Career Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none"
            >
              <option value="">Select category...</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload File (CSV/Excel)</label>
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl"
            />
          </div>
          
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8,name,description,skills\nExample Career,Description here,Skill 1;Skill 2\nAnother Career,Description here,Skill 1;Skill 2";
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "career_template.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 text-brand font-medium text-sm"
          >
            <Download className="w-4 h-4" /> Download Template
          </button>
        </div>
        
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium">Cancel</button>
          <button onClick={handleUpload} className="px-4 py-2 bg-brand text-white font-bold rounded-xl">Upload</button>
        </div>
      </div>
    </div>
  );
}
