"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  busy = false,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  busy?: boolean;
  className?: string;
}) {
  const opener = useRef<HTMLElement | null>(null);
  const descriptionId = useId();
  // Forms can autofocus during mount, before Radix's open autofocus callback.
  // Remember focus while closed so controlled dialogs still restore their opener.
  useEffect(() => {
    if (open) return;
    const rememberFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) opener.current = event.target;
    };
    document.addEventListener("focusin", rememberFocus);
    return () => document.removeEventListener("focusin", rememberFocus);
  }, [open]);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose();
      }}
    >
      <DialogContent
        className={cn("app-modal block gap-0 p-0 sm:max-w-none", className)}
        showCloseButton={false}
        aria-describedby={description ? descriptionId : undefined}
        onCloseAutoFocus={(event) => {
          if (opener.current?.isConnected) {
            event.preventDefault();
            opener.current.focus();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (busy) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <div className="modal-header">
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription id={descriptionId}>
                {description}
              </DialogDescription>
            )}
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>
        <div className="modal-content">{open && children}</div>
      </DialogContent>
    </Dialog>
  );
}
