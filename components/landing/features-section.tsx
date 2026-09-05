import {
  ArrowUpRight,
  Check,
  CheckCheck,
  FileSearch,
  Layers3,
  Route,
  Sparkles,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <>
      <div className="landing-container promise-strip">
        {[
          {
            icon: FileSearch,
            title: "See what recruiters see",
            text: "Clear, role-specific resume feedback.",
          },
          {
            icon: Route,
            title: "Keep your search in sight",
            text: "One home for every opportunity.",
          },
          {
            icon: Layers3,
            title: "Get better with every version",
            text: "Small improvements. Visible progress.",
          },
        ].map((item) => (
          <div key={item.title}>
            <item.icon size={24} strokeWidth={1.4} />
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
      <section className="landing-container landing-section" id="features">
        <div className="section-intro">
          <div>
            <p className="eyebrow mb-3">LESS SECOND-GUESSING. MORE FORWARD.</p>
            <h2>
              Your job search,
              <br />
              <span className="editorial">with a little direction.</span>
            </h2>
          </div>
          <p>
            From the first resume edit to the final interview, bring a little
            order to a big life move.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature-block">
            <div className="feature-illustration">
              <Sparkles
                size={29}
                className="mb-5 text-[#d5ed9a]"
                strokeWidth={1.3}
              />
              <div className="flex flex-wrap justify-center gap-2">
                <span className="keyword">Measurable impact</span>
                <span className="keyword">Clearer language</span>
                <span className="keyword">Relevant keywords</span>
              </div>
            </div>
            <h3>Make your experience count.</h3>
            <p>
              Get specific rewrites, relevant keywords, and a practical
              checklist to help your resume tell a stronger story.
            </p>
          </article>
          <article className="feature-block">
            <div className="feature-illustration">
              <div className="w-full max-w-[210px] rounded-lg border border-[#d9e3cb] bg-white p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7c8c69]">Your next opportunity</span>
                  <ArrowUpRight size={14} />
                </div>
                <div className="mt-3 flex gap-1.5">
                  {["Saved", "Applied", "Interview"].map((item, i) => (
                    <span
                      key={item}
                      className={`flex-1 rounded px-1 py-2 text-center text-[9px] ${i === 2 ? "bg-[#d5ed9a] text-[#354d26]" : "bg-[#edf1e6] text-[#7b896b]"}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-[#93a17f]">
                  <span>One step at a time</span>
                  <Check size={12} />
                </div>
              </div>
            </div>
            <h3>Nothing slips through.</h3>
            <p>
              Keep roles, contacts, interview rounds, and follow-ups together.
              Know exactly where every application stands.
            </p>
          </article>
          <article className="feature-block">
            <div className="feature-illustration">
              <div className="flex h-[90px] items-end gap-4">
                {[42, 62, 86].map((n, i) => (
                  <div className="text-center" key={n}>
                    <span className="text-[11px] text-[#6f8259]">{n}</span>
                    <div
                      style={{
                        height: n * 0.7,
                        background: ["#dfe8d1", "#bbd49b", "#789d55"][i],
                      }}
                      className="mt-1 w-10 rounded-t-sm"
                    />
                    <span className="text-[9px] text-[#95a183]">v0{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3>Watch your story improve.</h3>
            <p>
              Compare resume versions and review history. See what changed and
              keep building on the progress you make.
            </p>
          </article>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
          <CheckCheck size={13} /> Feedback and scores are guidance, not a
          guarantee of interview outcomes.
        </p>
      </section>
    </>
  );
}
