import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export function FinalCtaSection({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="landing-container landing-cta">
      <div>
        <h2>
          Your next chapter
          <br />
          deserves a strong start.
        </h2>
        <p>Bring your ambition. Let’s put it into words.</p>
      </div>
      <Link
        href={isSignedIn ? "/dashboard" : "/sign-up"}
        className={buttonStyles("primary", "button-lg button-lime")}
      >
        {isSignedIn ? "Back to my workspace" : "Let’s get started"}
        <ArrowUpRight size={19} />
      </Link>
    </section>
  );
}
