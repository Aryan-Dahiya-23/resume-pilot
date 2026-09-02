import Link from "next/link";

export const clerkAppearance = {
  variables: {
    colorPrimary: "#3a302a",
    colorPrimaryForeground: "#fbfaf7",
    colorBackground: "#fdfcf9",
    colorForeground: "#342c27",
    colorMuted: "#f1eee7",
    colorMutedForeground: "#746a62",
    colorInput: "#fdfcf9",
    colorInputForeground: "#342c27",
    colorNeutral: "#3a302a",
    colorDanger: "#b5382d",
    borderRadius: "0.5rem",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full border border-border bg-card shadow-none",
    headerTitle: "text-xl font-semibold tracking-[-0.025em] text-foreground",
    headerSubtitle: "text-sm text-muted-foreground",
    socialButtonsBlockButton: "border-border bg-card text-foreground hover:bg-muted",
    formFieldLabel: "text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase",
    formFieldInput: "border-input bg-card text-foreground focus:border-ring focus:ring-ring/15",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
    footerActionLink: "text-brand hover:text-brand/80",
    identityPreviewText: "text-foreground",
    formResendCodeLink: "text-brand hover:text-brand/80",
  },
};

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl overflow-hidden border border-border bg-card lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="flex flex-col justify-between border-b border-border bg-muted/35 p-6 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
          <Link href="/" className="flex items-end gap-1 self-start">
            <span className="text-xl font-semibold tracking-[-0.04em] text-foreground">
              ResumePilot
            </span>
            <span className="mb-0.5 size-1 rounded-full bg-brand" />
          </Link>
          <div className="mt-14 max-w-sm lg:mt-0">
            <div className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
              Career workspace
            </div>
            <h1 className="mt-4 text-3xl leading-[1.05] font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
              Make the next move count.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Keep your resumes, feedback, and applications in one focused place.
            </p>
          </div>
          <p className="mt-12 text-xs text-muted-foreground lg:mt-0">
            Your data stays with your account.
          </p>
        </aside>
        <main className="flex items-center justify-center p-5 sm:p-8 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
