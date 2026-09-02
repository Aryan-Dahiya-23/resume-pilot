export function SocialProofSection() {
  const metrics = [
    { label: "Resumes reviewed", value: "12,000+" },
    { label: "Jobs tracked", value: "85,000+" },
    { label: "Avg. score uplift", value: "+18 pts" },
  ];

  const teams = ["Indie devs", "Students", "Career switchers", "Early startups"];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10 sm:p-6">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Trusted by builders
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {metrics.map((item) => (
            <div key={item.label} className="rounded-lg bg-muted/70 p-4">
              <div className="font-heading text-3xl text-foreground">{item.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {teams.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
