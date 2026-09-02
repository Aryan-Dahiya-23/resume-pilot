"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { toast as sonnerToast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

type ToastTone = "success" | "error";

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
  const toast = useCallback((input: ToastInput) => {
    const duration = input.durationMs ?? 2600;
    if (input.tone === "success") {
      sonnerToast.success(input.message, { duration });
      return;
    }
    sonnerToast.error(input.message, { duration });
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster position="top-right" />
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
