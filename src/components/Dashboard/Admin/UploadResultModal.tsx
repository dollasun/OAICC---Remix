import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  createdCount: number;
  updatedCount: number;
  onFilter: (filter: 'created' | 'updated') => void;
}

export default function UploadResultModal({ isOpen, onClose, createdCount, updatedCount, onFilter }: UploadResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            Upload Complete
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            The system has processed your file. Here are the results:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { onFilter('created'); onClose(); }}
              className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl text-center hover:bg-brand/10 transition-colors"
            >
              <p className="text-3xl font-bold text-brand">{createdCount}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Created</p>
            </button>
            <button 
              onClick={() => { onFilter('updated'); onClose(); }}
              className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl text-center hover:bg-brand/10 transition-colors"
            >
              <p className="text-3xl font-bold text-brand">{updatedCount}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Updated</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
