import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { buttonStyles } from "@/components/ui/button";

export function LandingHeader({
  isSignedIn = false,
}: {
  isSignedIn?: boolean;
}) {
  return (
    <header className="landing-container landing-nav">
      <Brand />
      <nav className="landing-nav-links" aria-label="Main navigation">
        <Link href="/#features">The toolkit</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/contact">Get in touch</Link>
      </nav>
      <div className="flex items-center gap-2">
        {!isSignedIn && (
          <Link href="/sign-in" className={buttonStyles("ghost")}>
            Log in
          </Link>
        )}
        <Link
          href={isSignedIn ? "/dashboard" : "/sign-up"}
          className={buttonStyles()}
        >
          {isSignedIn ? "My workspace" : "Get started"}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </header>
  );
}
