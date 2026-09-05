"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastTone = "success" | "error";
type ToastItem = { id: number; tone: ToastTone; message: string };
type ToastInput = { tone: ToastTone; message: string; durationMs?: number };
const ToastContext = createContext<{
  toast: (input: ToastInput) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const region = useRef<HTMLDivElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const nextId = useRef(0);
  const toast = useCallback((input: ToastInput) => {
    const id = ++nextId.current;
    setToasts((prev) => [
      ...prev,
      { id, tone: input.tone, message: input.message },
    ]);
    const timer = setTimeout(
      () => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
        timers.current.delete(timer);
      },
      input.durationMs ?? (input.tone === "error" ? 6500 : 4500),
    );
    timers.current.add(timer);
  }, []);
  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
    };
  }, []);
  useEffect(() => {
    const element = region.current;
    if (!element) return;
    if (toasts.length && typeof element.showPopover === "function") {
      element.hidePopover();
      element.showPopover();
    } else if (typeof element.hidePopover === "function") element.hidePopover();
  }, [toasts]);
  const value = useMemo(() => ({ toast }), [toast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        ref={region}
        popover="manual"
        className="toast-region"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.tone === "error" ? "alert" : "status"}
            className="toast-item"
          >
            <span
              className={
                item.tone === "success" ? "text-[#70964f]" : "text-rose-600"
              }
            >
              {item.tone === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
            </span>
            <p className="min-w-0 flex-1 text-sm leading-6">{item.message}</p>
            <button
              type="button"
              className="icon-button !h-7 !w-7"
              aria-label="Dismiss notification"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== item.id))
              }
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
