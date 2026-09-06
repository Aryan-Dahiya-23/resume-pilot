import Link from "next/link";
import { ArrowLeft, Check, Sprout } from "lucide-react";
import { Brand } from "@/components/ui/brand";

export function AuthLayout({
  children,
  signUp = false,
}: {
  children: React.ReactNode;
  signUp?: boolean;
}) {
  return (
    <main className="auth-layout">
      <section className="auth-story">
        <Brand light />
        <h1>
          {signUp ? "Big ambitions." : "Welcome to your"}
          <br />
          <span className="editorial">
            {signUp ? "A fresh start." : "next chapter."}
          </span>
        </h1>
        <p className="mb-auto mt-5 max-w-sm pb-8 text-sm leading-7 text-[#a8b99b]">
          A stronger resume. A more organized search. A little more confidence
          in what comes next.
        </p>
        <div className="auth-story-bottom">
          <div className="space-y-4 border-t border-[#3b5134] pt-7 text-xs text-[#c4d4b6]">
            {[
              "Turn your experience into a stronger story",
              "Keep every opportunity in one place",
              "See your progress, one step at a time",
            ].map((item) => (
              <p key={item} className="flex items-center gap-3">
                <Check size={14} className="text-[#cde790]" />
                {item}
              </p>
            ))}
          </div>
          <p className="mt-14 flex items-center gap-2 text-[11px] text-[#839a72]">
            <Sprout size={14} />
            Made for your next move.
          </p>
        </div>
      </section>
      <section
        className="auth-form"
        aria-label={signUp ? "Create your account" : "Sign in to your account"}
      >
        <Link href="/" className="text-link !text-xs">
          <ArrowLeft size={14} />
          Back to ResumePilot
        </Link>
        {children}
        <p className="max-w-xs text-center text-[11px] leading-6 text-zinc-400">
          Your workspace, ready when you are.
          <br />
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <span className="mx-2">·</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </p>
      </section>
    </main>
  );
}
