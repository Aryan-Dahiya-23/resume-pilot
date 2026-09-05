"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/components/ui/cn";

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
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={cn("app-modal", className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-header">
        <div>
          <h2 id={titleId}>{title}</h2>
          {description && <p id={descriptionId}>{description}</p>}
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
    </dialog>
  );
}
