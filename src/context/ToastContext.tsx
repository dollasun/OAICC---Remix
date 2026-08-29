import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, action?: { label: string; onClick: () => void }) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearToasts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', action?: { label: string; onClick: () => void }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type, action });

    timeoutRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, action ? 6000 : 4000);
  }, []);

  const contextValue = useMemo(() => ({ showToast, clearToasts }), [showToast, clearToasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none max-w-md w-full sm:w-auto">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto mx-4 sm:mx-0"
            >
              <div className={`
                flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl shadow-lg border min-w-[280px] sm:min-w-[340px] max-w-md backdrop-blur-md
                ${toast.type === 'success' ? 'bg-slate-900/95 text-white border-slate-800' : 
                  toast.type === 'error' ? 'bg-rose-950/95 text-white border-rose-900' : 
                  'bg-slate-900/95 text-white border-slate-800'}
              `}>
                <div className="shrink-0">
                  {toast.type === 'success' && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {toast.type === 'error' && (
                    <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                  {toast.type === 'info' && (
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <p className="flex-1 text-xs sm:text-sm font-semibold leading-snug">{toast.message}</p>
                
                {toast.action && (
                  <button 
                    onClick={() => {
                      toast.action!.onClick();
                      clearToasts();
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                  >
                    {toast.action.label}
                  </button>
                )}

                <button 
                  onClick={clearToasts}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white shrink-0"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
