export function SocialProofSection() {
  const principles = [
    ["One clear priority", "Know exactly what to improve in the current version."],
    ["A visible pipeline", "See every opportunity and its next action at a glance."],
    ["Useful history", "Measure whether each revision actually made things better."],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {principles.map(([title, copy]) => (
          <div key={title} className="py-5 md:px-6 md:first:pl-0 md:last:pr-0">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
