import { useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Info, CheckCircle, AlertTriangle, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "info" | "success" | "warning" | "error" | "class";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = (options: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...options, id, duration: options.duration || 5000 };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 md:p-6 space-y-4 max-w-sm w-full pointer-events-none flex flex-col items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

function ToastCard({ toast, onDismiss }: { key?: string | number; toast: ToastMessage; onDismiss: () => void }) {
  const icons = {
    info: <Info className="w-5 h-5 text-blue-400" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-accent" />,
    warning: <AlertTriangle className="w-5 h-5 text-gold-primary" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    class: <BellRing className="w-5 h-5 text-gold-light" />,
  };

  const bgClasses = {
    info: "border-blue-500/30",
    success: "border-emerald-accent/30",
    warning: "border-gold-primary/30",
    error: "border-red-500/30",
    class: "border-gold-light/30 bg-gradient-to-r from-glass-white to-gold-primary/5",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "glass-panel w-full rounded-lg shadow-lg border p-4 pointer-events-auto flex gap-3 relative overflow-hidden group backdrop-blur-2xl",
        bgClasses[toast.type || "info"]
      )}
    >
      <div className="shrink-0 pt-0.5">{icons[toast.type || "info"]}</div>
      <div className="flex-1 pr-6">
        <h4 className="text-sm font-medium text-parchment leading-tight mb-1">{toast.title}</h4>
        {toast.message && <p className="text-xs text-parchment/60 leading-relaxed">{toast.message}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1.5 rounded-md text-parchment/40 hover:text-parchment hover:bg-glass-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
