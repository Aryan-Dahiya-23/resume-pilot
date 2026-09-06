export function HowItWorksSection() {
  return (
    <section
      className="landing-container landing-section !pt-2"
      id="how-it-works"
    >
      <div className="step-layout">
        <div>
          <p className="eyebrow mb-4">A SIMPLE WAY FORWARD</p>
          <h2>
            From first draft
            <br />
            to <span className="editorial">next chapter.</span>
          </h2>
          <p className="mt-5 max-w-[300px] text-sm leading-7 text-zinc-500">
            No scattered spreadsheets. No guessing what to change. Just a
            workspace that helps you take the next step.
          </p>
        </div>
        <div>
          {[
            {
              title: "Bring your experience.",
              text: "Upload your resume as a PDF or DOCX and tell us the role you’re working toward.",
            },
            {
              title: "Find your strongest story.",
              text: "Review your feedback, sharpen your bullets, and upload an improved version when you’re ready.",
            },
            {
              title: "Keep moving forward.",
              text: "Save opportunities, track applications, and keep your next conversation in view.",
            },
          ].map((step, i) => (
            <article className="step-row" key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
