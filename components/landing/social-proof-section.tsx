export function SocialProofSection() {
  const metrics = [
    { label: "Resumes reviewed", value: "12,000+" },
    { label: "Jobs tracked", value: "85,000+" },
    { label: "Avg. score uplift", value: "+18 pts" },
  ];

  const teams = ["Indie devs", "Students", "Career switchers", "Early startups"];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-zinc-500">Trusted by builders</div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="text-2xl font-semibold text-zinc-900">{item.value}</div>
              <div className="mt-1 text-sm text-zinc-600">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {teams.map((item) => (
            <span
              key={item}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
