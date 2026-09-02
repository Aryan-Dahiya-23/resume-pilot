# UI/UX Library Plan

This document records the UI libraries selected for the ResumePilot redesign and their adoption status.

## Current UI stack

- **Next.js 16** and **React 19**
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- Custom components for layouts, forms, dialogs, cards, and dashboard sections

## Selected libraries

### shadcn/ui — component foundation

**Status:** Installed and initialized in Phase 1 with the Radix-based Nova preset, CSS-variable theming, Lucide icons, and Geist typography.

Use shadcn/ui as the reusable component layer while retaining Tailwind styling control. Add components only when a screen needs them.

Recommended first components:

- Button, Input, Textarea, Label, Select, and Form
- Dialog, Sheet, Dropdown Menu, Tooltip, and Popover
- Tabs, Badge, Progress, Skeleton, and Toast/Sonner
- Table and empty-state patterns

Why: it provides accessible UI primitives without imposing a complete visual theme, which suits a custom ResumePilot design system.

Official docs: <https://ui.shadcn.com/docs>

### Motion — interaction and transition polish

**Status:** Planned; not installed yet.

Use Motion sparingly for purposeful feedback:

- Page and section entrance transitions
- Modal and mobile-sheet transitions
- Animated score, progress, and status changes
- Layout transitions for cards and dashboard states

Respect `prefers-reduced-motion` and avoid decorative animation that slows core job-search workflows.

Official docs: <https://motion.dev/docs/react>

### @dnd-kit/react — job pipeline drag and drop

**Status:** Planned for the Kanban phase; not installed yet.

Add only when the job tracker includes a Kanban pipeline. It will support moving an application between stages such as Saved, Applied, Interview, and Offer.

Requirements before adoption:

- Persist the status change immediately
- Provide keyboard-accessible drag-and-drop behavior
- Keep a non-drag alternative, such as a status menu

Official docs: <https://dndkit.com/react/quickstart/>

### @tanstack/react-table — advanced job list table

**Status:** Planned for the job-table phase; not installed yet.

Add when the job list needs richer table features than the current custom implementation, such as sorting, filtering, column visibility, pagination, and row selection.

This complements the existing TanStack Query usage while allowing the UI to remain fully custom-styled with Tailwind.

Official docs: <https://tanstack.com/table/latest/docs/framework/react/quick-start>

## Adoption order

1. Establish shared visual tokens and introduce shadcn/ui primitives.
2. Rebuild the dashboard, resume review, and job tracker with the shared components.
3. Add Motion for key transitions and progress feedback.
4. Add dnd-kit only with the Kanban job pipeline.
5. Add TanStack Table only when advanced job-list controls are implemented.

## Deliberate exclusions

Do not add a full visual framework such as Material UI or Chakra UI. Their theming and component conventions would conflict with a tailored Tailwind-based redesign.
