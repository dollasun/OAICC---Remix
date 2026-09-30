import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, CheckSquare } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount?: number;
  itemLabel?: string;
  onClearSelection: () => void;
  onSelectAll?: () => void;
  onDeleteSelected: () => void;
  isDeleting?: boolean;
}

export default function BulkActionBar({
  selectedCount,
  totalCount,
  itemLabel = 'items',
  onClearSelection,
  onSelectAll,
  onDeleteSelected,
  isDeleting = false
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] sm:max-w-2xl w-full px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/60 dark:border-slate-600/60 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand/20 border border-brand/40 text-brand-300 rounded-lg text-xs font-bold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{selectedCount}</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              {selectedCount} {itemLabel}{selectedCount === 1 ? '' : 's'} selected
            </span>
            {totalCount && selectedCount < totalCount && onSelectAll && (
              <button
                type="button"
                onClick={onSelectAll}
                className="hidden sm:inline-block text-xs font-bold text-brand hover:underline transition-all ml-1"
              >
                Select all {totalCount}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              type="button"
              onClick={onClearSelection}
              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 dark:hover:bg-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deselect</span>
            </button>
            <div className="h-5 w-px bg-slate-700/60 dark:bg-slate-600/60 hidden sm:block" />
            <button
              type="button"
              disabled={isDeleting}
              onClick={onDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-red-900/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedCount})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
