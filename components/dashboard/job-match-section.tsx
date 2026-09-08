import type { JobMatch } from "@/lib/ai/job-match";
import { Badge } from "@/components/ui/badge";

const labels = { supported: "Supported", partial: "Partially shown", not_evidenced: "Not shown in resume" };

export function JobMatchSection({ match }: { match: JobMatch }) {
  return (
    <section className="panel min-w-0 p-5 sm:p-6" aria-labelledby="job-match-title">
      <h2 id="job-match-title" className="section-title">How your resume fits this role</h2>
      <p className="mt-2 text-xs leading-6 text-zinc-500">Evidence from the posting and your resume. A gap means the resume does not show the requirement; it does not mean you lack the skill.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(["supported", "partial", "not_evidenced"] as const).map((status) => (
          <Badge key={status} variant={status === "supported" ? "success" : "warning"}>
            {match.requirements.filter((item) => item.status === status).length} {labels[status].toLowerCase()}
          </Badge>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {match.requirements.map((item, index) => (
          <article key={index} className="min-w-0 break-words rounded-xl border border-zinc-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="min-w-0 text-sm font-medium">{item.requirement}</h3>
              <Badge variant={item.status === "supported" ? "success" : "warning"}>{labels[item.status]}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.explanation}</p>
            <details className="mt-3 text-xs leading-6">
              <summary className="cursor-pointer font-medium text-[#526e3c]">Compare source excerpts</summary>
              <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
                <div><p className="font-medium">Job posting</p><blockquote className="mt-1 whitespace-pre-wrap border-l-2 border-zinc-200 pl-3 text-zinc-600">{item.jobEvidence}</blockquote></div>
                <div><p className="font-medium">Your resume</p>{item.resumeEvidence ? <blockquote className="mt-1 whitespace-pre-wrap border-l-2 border-[#b8cba5] pl-3 text-zinc-600">{item.resumeEvidence}</blockquote> : <p className="mt-1 text-zinc-500">No supporting excerpt identified.</p>}</div>
              </div>
            </details>
            <p className="mt-3 text-xs leading-6"><span className="font-medium">Next step: </span>{item.action}</p>
          </article>
        ))}
      </div>
      <details className="mt-5 text-xs leading-6 text-zinc-500">
        <summary className="cursor-pointer">Job description used for this review</summary>
        <p className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words">{match.jobDescription}</p>
      </details>
    </section>
  );
}
