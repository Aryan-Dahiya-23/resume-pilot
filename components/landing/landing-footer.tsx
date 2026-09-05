import Link from "next/link";
import { Brand } from "@/components/ui/brand";

export function LandingFooter() {
  return (
    <footer className="landing-container landing-footer">
      <div className="footer-row">
        <Brand />
        <p className="text-xs text-zinc-500">
          A little clarity for what comes next.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="mt-7 text-[11px] text-zinc-400">
        © {new Date().getFullYear()} ResumePilot. Made for your next move.
      </div>
    </footer>
  );
}
