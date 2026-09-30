import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface DeletableItemSummary {
  id: string | number;
  name?: string;
  title?: string;
  role?: string;
  category?: string;
  email?: string;
  image?: string;
  avatar?: string;
}

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
  itemType: string;
  items?: DeletableItemSummary[];
  isDeleting?: boolean;
}

export default function BulkDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
  itemType,
  items = [],
  isDeleting = false
}: BulkDeleteModalProps) {
  if (!isOpen) return null;

  const isPlural = itemCount !== 1;
  const displayLabel = isPlural ? `${itemType}s` : itemType;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isDeleting) onClose();
          }}
          className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Delete {itemCount} {displayLabel}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                    Confirmation required
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="mt-5 p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-100/80 dark:border-red-900/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-red-900 dark:text-red-300 font-medium">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold underline decoration-red-400">
                  {itemCount} {displayLabel.toLowerCase()}
                </span>
                ? This action cannot be undone and will immediately remove the records.
              </div>
            </div>

            {/* Items Preview */}
            {items.length > 0 && (
              <div className="mt-5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Items to be deleted ({items.length}):
                </p>
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {(item.avatar || item.image) && (
                          <img
                            src={item.avatar || item.image}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        )}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name || item.title || `ID: ${item.id}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {(item.role || item.category) && (
                          <span className="px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-semibold border border-slate-200 dark:border-slate-600">
                            {item.role || item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-sm shadow-red-600/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {isDeleting ? 'Deleting...' : `Yes, Delete ${itemCount} ${itemCount === 1 ? itemType : `${itemType}s`}`}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
