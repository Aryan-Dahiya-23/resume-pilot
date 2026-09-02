import { Award, TrendingUp, Users } from "lucide-react";

export function SocialProofSection() {
  const metrics = [
    { label: "Resumes Audited with AI", value: "14,000+", icon: Award },
    { label: "Applications Tracked in Pipeline", value: "95,000+", icon: Users },
    { label: "Average ATS Score Improvement", value: "+21 pts", icon: TrendingUp },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-lg mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Validated Results
          </span>
          <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Proven to Boost Interview Invitation Rates
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-3">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5"
              >
                <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Icon className="size-5 sm:size-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {item.value}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
