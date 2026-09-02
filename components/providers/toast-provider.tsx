"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastTone = "success" | "error";

type ToastItem = {
  id: number;
  tone: ToastTone;
  message: string;
};

type ToastInput = {
  tone: ToastTone;
  message: string;
  durationMs?: number;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const duration = input.durationMs ?? 2600;
    setToasts((prev) => [...prev, { id, tone: input.tone, message: input.message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, duration);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length ? (
        <div className="pointer-events-none fixed right-4 top-4 z-[80] space-y-2">
          {toasts.map((item) => (
            <div
              key={item.id}
              className={`border-l-2 px-4 py-3 text-sm ${
                item.tone === "success"
                  ? "border-l-emerald-600 bg-card text-emerald-800 ring-1 ring-border"
                  : "border-l-destructive bg-card text-destructive ring-1 ring-border"
              }`}
            >
              {item.message}
            </div>
          ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
