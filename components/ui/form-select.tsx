"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Shared composition for the app's single-value fields and collection filters.
export function FormSelect({
  id,
  className,
  "aria-label": ariaLabel,
  children,
  ...props
}: React.ComponentProps<typeof Select> &
  Pick<
    React.ComponentProps<typeof SelectTrigger>,
    "id" | "className" | "aria-label"
  >) {
  return (
    <Select {...props}>
      <SelectTrigger id={id} className={className} aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
