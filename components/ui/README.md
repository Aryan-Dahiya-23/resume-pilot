# UI components

The shared Button, Dialog, Input, Label, Select, Tabs, and Textarea components
are adapted from shadcn/ui's New York registry with Radix primitives.
Source: https://ui.shadcn.com/r/styles/new-york-v4/

The forest and lime theme lives in `app/globals.css`. `components.json`
configures the shadcn CLI and `lib/utils.ts` provides the shared class utility.
Additional components can be added with `npx shadcn@latest add <component>`.
Review generated styles before overwriting a customized component.

- `Modal` preserves the app's controlled-dialog API, busy-state dismissal guard,
  focus restoration, and mobile navigation styling.
- `FormSelect` composes Select for labeled fields and collection filters.
  Use `onValueChange` with a string value, and give every SelectItem a nonempty value.
- `Button` supports shadcn's `asChild` composition and keeps the existing
  `primary`, `secondary`, `ghost`, and `danger` variants.
  Native buttons default to `type="button"`; forms must set `type="submit"`.
- Page layouts, cards, and illustrations remain custom components.
